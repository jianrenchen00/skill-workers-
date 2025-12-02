import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";

// Initialize Gemini
// Note: Make sure GOOGLE_API_KEY is set in .env.local
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "");

export async function POST(request: Request) {
    try {
        const formData = await request.formData();
        const file = formData.get("resume") as File;
        const userId = formData.get("userId") as string;

        if (!file || !userId) {
            return NextResponse.json({ error: "Missing file or userId" }, { status: 400 });
        }

        // 1. Extract text from PDF using pdf2json
        const buffer = Buffer.from(await file.arrayBuffer());
        let resumeText = "";

        try {
            const pdfParser = new PDFParser(null, 1); // 1 = text content only

            resumeText = await new Promise((resolve, reject) => {
                pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
                    // pdf2json returns URL-encoded text, so we need to decode it
                    // But with option 1 (text only), getRawTextContent() is usually better if available, 
                    // or we parse the JSON structure. 
                    // Actually, pdf2json's getRawTextContent() is the easiest way.
                    resolve(pdfParser.getRawTextContent());
                });

                pdfParser.parseBuffer(buffer);
            }) as string;

        } catch (e) {
            console.error("PDF Parse Error:", e);
            return NextResponse.json({ error: "Failed to parse PDF" }, { status: 500 });
        }

        // Truncate if too long (Gemini 1.5 Flash has huge context, but good practice)
        if (resumeText.length > 30000) {
            resumeText = resumeText.substring(0, 30000);
        }

        // 2. Analyze with Gemini
        const model = genAI.getGenerativeModel({
            model: "gemini-1.5-flash",
            generationConfig: { responseMimeType: "application/json" }
        });

        const prompt = `
      You are an expert career coach for Chinese professionals seeking Visa Sponsorship jobs in Western Europe (UK, Ireland, Netherlands, Germany, etc.).
      Analyze the following resume text and provide a structured JSON response.
      
      Resume Text:
      ${resumeText}

      Output Format (JSON):
      {
        "strengths": ["string", "string", ...],
        "weaknesses": ["string", "string", ...],
        "recommended_roles": ["string", "string", ...],
        "skill_gaps": ["string", "string", ...],
        "interview_tips": ["string", "string", ...]
      }

      Requirements:
      - "strengths": List 3-5 key strengths relevant to tech/skilled jobs.
      - "weaknesses": List 2-3 areas for improvement (be constructive).
      - "recommended_roles": List 3-5 job titles that fit this profile and are likely to offer visa sponsorship.
      - "skill_gaps": List specific skills missing for the recommended roles.
      - "interview_tips": Provide 3 actionable tips for interviewing in Western Europe.
      - Language: Provide the analysis in CHINESE (Simplified) as the user is a Chinese speaker.
    `;

        const result = await model.generateContent(prompt);
        const response = result.response;
        const analysisJson = JSON.parse(response.text());

        // 3. Save to Supabase
        const supabase = await createClient();

        // Check if user already has an analysis (Monetization check could go here, but we do it on frontend for now)

        const { error: dbError } = await supabase
            .from("resume_insights")
            .insert({
                user_id: userId,
                status: "completed",
                analysis_data: analysisJson,
                resume_text_snippet: resumeText.substring(0, 200) + "..."
            });

        if (dbError) {
            console.error("Database Error:", dbError);
            return NextResponse.json({ error: "Failed to save results" }, { status: 500 });
        }

        return NextResponse.json({ success: true, data: analysisJson });

    } catch (error: any) {
        console.error("Analysis Error:", error);
        return NextResponse.json(
            { error: error.message || "Internal Server Error" },
            { status: 500 }
        );
    }
}

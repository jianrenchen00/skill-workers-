import { createClient } from "@/lib/supabase/server";
import { NextResponse } from "next/server";
import { GoogleGenerativeAI } from "@google/generative-ai";
import PDFParser from "pdf2json";

// Initialize Gemini
// Note: Make sure GOOGLE_API_KEY is set in .env.local
const genAI = new GoogleGenerativeAI(process.env.GOOGLE_API_KEY || "dummy_key_for_build");

export async function POST(request: Request) {
    try {
        const { insight_id } = await request.json();

        if (!insight_id) {
            return NextResponse.json({ error: "Missing insight_id" }, { status: 400 });
        }

        const supabase = await createClient();

        // 1. Fetch insight record to get file path
        const { data: insight, error: fetchError } = await supabase
            .from("resume_insights")
            .select("file_path, user_id")
            .eq("id", insight_id)
            .single();

        if (fetchError || !insight) {
            console.error("Fetch Insight Error:", fetchError);
            return NextResponse.json({ error: "Insight not found" }, { status: 404 });
        }

        // 2. Download file from Storage
        const { data: fileData, error: downloadError } = await supabase.storage
            .from("resumes")
            .download(insight.file_path);

        if (downloadError || !fileData) {
            console.error("Download Error:", downloadError);
            return NextResponse.json({ error: "Failed to download resume file" }, { status: 500 });
        }

        // 3. Extract text from PDF using pdf2json
        const buffer = Buffer.from(await fileData.arrayBuffer());
        let resumeText = "";

        try {
            const pdfParser = new PDFParser(null, true); // true = text content only

            resumeText = await new Promise((resolve, reject) => {
                pdfParser.on("pdfParser_dataError", (errData: any) => reject(errData.parserError));
                pdfParser.on("pdfParser_dataReady", (pdfData: any) => {
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

        // 4. Analyze with Gemini
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

        // 5. Save to Supabase
        const { error: dbError } = await supabase
            .from("resume_insights")
            .update({
                status: "completed",
                analysis_data: analysisJson,
                resume_text_snippet: resumeText.substring(0, 200) + "..."
            })
            .eq("id", insight_id);

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

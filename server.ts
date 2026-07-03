import express from "express";
import path from "path";
import { createServer as createViteServer } from "vite";
import { GoogleGenAI } from "@google/genai";
import Tesseract from "tesseract.js";
import { LocalDB } from "./src/db/localDb.ts";
import { ResumeData, ATSReport, JobMatchReport } from "./src/types.ts";
import dotenv from "dotenv";

// Load environment variables
dotenv.config();

const app = express();
const PORT = 3000;

// Set up Gemini AI client
const apiKey = process.env.GEMINI_API_KEY || "dummy_key";
const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      "User-Agent": "aistudio-build",
    },
  },
});

// Robust JSON parsing utility to extract and clean up Gemini's JSON responses
function parseGeminiJson(text: string): any {
  if (!text) return {};
  
  // Try direct parsing first
  try {
    return JSON.parse(text.trim());
  } catch (e) {
    // If it fails, let's fall back to parsing an extracted block
  }

  // Balanced brace matcher to extract the first complete JSON object or array
  const extractJSON = (str: string): string => {
    const startObj = str.indexOf('{');
    const startArr = str.indexOf('[');
    
    let startIdx = -1;
    let isArray = false;
    
    if (startObj !== -1 && startArr !== -1) {
      if (startObj < startArr) {
        startIdx = startObj;
        isArray = false;
      } else {
        startIdx = startArr;
        isArray = true;
      }
    } else if (startObj !== -1) {
      startIdx = startObj;
      isArray = false;
    } else if (startArr !== -1) {
      startIdx = startArr;
      isArray = true;
    }
    
    if (startIdx === -1) return "";
    
    let depth = 0;
    let inString = false;
    let escaped = false;
    const openChar = isArray ? '[' : '{';
    const closeChar = isArray ? ']' : '}';
    
    for (let i = startIdx; i < str.length; i++) {
      const char = str[i];
      
      if (escaped) {
        escaped = false;
        continue;
      }
      
      if (char === '\\') {
        escaped = true;
        continue;
      }
      
      if (char === '"') {
        inString = !inString;
        continue;
      }
      
      if (!inString) {
        if (char === openChar) {
          depth++;
        } else if (char === closeChar) {
          depth--;
          if (depth === 0) {
            return str.substring(startIdx, i + 1);
          }
        }
      }
    }
    return "";
  };

  const extracted = extractJSON(text);
  if (!extracted) {
    throw new Error("No valid JSON structure found in the response.");
  }

  // Clean trailing commas in arrays/objects, potential comments, etc.
  const cleaned = extracted
    .replace(/\/\*[\s\S]*?\*\//g, "") // remove multi-line comments
    .replace(/\/\/.*/g, "") // remove single line comments
    .replace(/,\s*([\]}])/g, '$1'); // remove trailing commas

  try {
    return JSON.parse(cleaned);
  } catch (err: any) {
    console.error("Failed to parse cleaned JSON:", cleaned, err);
    throw new Error("Failed to parse Gemini JSON: " + err.message);
  }
}

// Configure middleware for large JSON inputs (e.g. base64 PDFs, long text)
app.use(express.json({ limit: "15mb" }));
app.use(express.urlencoded({ extended: true, limit: "15mb" }));

// --------------------------------------------------------------------------------
// API ROUTES
// --------------------------------------------------------------------------------

// Health check
app.get("/api/health", (req, res) => {
  res.json({ status: "ok", time: new Date().toISOString() });
});

// GET dashboard stats
app.get("/api/dashboard/stats", (req, res) => {
  try {
    const stats = LocalDB.getDashboardStats();
    res.json(stats);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET all resumes
app.get("/api/resumes", (req, res) => {
  try {
    // We default to a single user in our local storage system
    const resumes = LocalDB.getResumes("user-default");
    res.json(resumes);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET single resume
app.get("/api/resume/:id", (req, res) => {
  try {
    const resume = LocalDB.getResume(req.params.id);
    if (!resume) {
      return res.status(404).json({ error: "Resume not found" });
    }
    res.json(resume);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST create resume
app.post("/api/resume", (req, res) => {
  try {
    const { title, data } = req.body;
    if (!title || !data) {
      return res.status(400).json({ error: "Title and data are required" });
    }
    const resume = LocalDB.createResume("user-default", title, data);
    res.status(201).json(resume);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// PUT update resume (and trigger autosave version history)
app.put("/api/resume/:id", (req, res) => {
  try {
    const { data, title } = req.body;
    if (!data) {
      return res.status(400).json({ error: "Resume data is required" });
    }
    const updated = LocalDB.updateResume(req.params.id, data, title);
    res.json(updated);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// DELETE resume
app.delete("/api/resume/:id", (req, res) => {
  try {
    LocalDB.deleteResume(req.params.id);
    res.json({ success: true, message: "Resume deleted successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// GET resume versions
app.get("/api/resume/:id/versions", (req, res) => {
  try {
    const versions = LocalDB.getVersions(req.params.id);
    res.json(versions);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST restore resume version
app.post("/api/resume/:id/versions/:versionId/restore", (req, res) => {
  try {
    const restored = LocalDB.restoreVersion(req.params.id, req.params.versionId);
    res.json(restored);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST Upload Resume (simulated or text parsing proxy)
app.post("/api/upload", (req, res) => {
  try {
    const { fileName, fileType, fileData, textContent } = req.body;
    
    // Log active download/upload analytic activity
    if (textContent) {
      return res.json({ 
        success: true, 
        message: "Selectable text extracted successfully", 
        text: textContent 
      });
    }

    if (!fileData) {
      return res.status(400).json({ error: "No file data or text content provided" });
    }

    // If it's an image, we can run OCR on it.
    // If it's a PDF and we have fileData (base64), we can run a quick mock OCR/extraction or process it.
    res.json({
      success: true,
      message: "File received. Ready to parse.",
      fileReceived: { fileName, fileType, size: Math.round(fileData.length * 0.75) }
    });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST Run OCR/Text Extraction using Gemini (accepts base64 image or PDF data)
app.post("/api/ocr", async (req, res) => {
  try {
    const { imageData } = req.body;
    if (!imageData) {
      return res.status(400).json({ error: "imageData (base64 string) is required" });
    }

    // Safely parse mimeType and base64 from data URI
    const match = imageData.match(/^data:([^;]+);base64,(.+)$/);
    let mimeType = "image/png"; // Default fallback
    let base64Clean = imageData;

    if (match) {
      mimeType = match[1];
      base64Clean = match[2];
    } else {
      base64Clean = imageData.replace(/^data:image\/\w+;base64,/, "");
    }

    // Call Gemini 3.5 Flash to extract layout-preserved text from the document (image or PDF)
    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: [
        {
          inlineData: {
            mimeType: mimeType,
            data: base64Clean,
          },
        },
        "Extract all readable text, headers, and descriptions from this resume document exactly as written, preserving layout, sections, bullet points, and metadata. Provide only the extracted text.",
      ],
    });

    const extractedText = (response.text || "").trim();
    
    res.json({ 
      success: true, 
      text: extractedText,
      confidence: 100
    });
  } catch (error: any) {
    console.error("OCR operation failed:", error);
    res.status(500).json({ error: "OCR operation failed: " + error.message });
  }
});

// POST Parse Resume text into JSON schema using Gemini 3.5 Flash
app.post("/api/parse", async (req, res) => {
  try {
    const { text } = req.body;
    if (!text || text.trim().length === 0) {
      return res.status(400).json({ error: "Extracted resume text is required" });
    }

    const systemInstruction = `You are a professional ATS resume parser. 
Parse the given resume text into the exact requested JSON structure. Do not invent details; map any details you find accurately. 
If an attribute is not found in the resume, leave it empty (empty string, empty array, or default boolean).
Return ONLY valid raw JSON. Do not wrap in markdown \`\`\`json blocks.

JSON Output Schema:
{
  "personalInformation": {
    "firstName": "string",
    "lastName": "string",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "postalCode": "string",
    "linkedin": "string",
    "github": "string",
    "portfolio": "string",
    "website": "string"
  },
  "professionalSummary": "string",
  "skills": {
    "frontend": ["string"],
    "backend": ["string"],
    "database": ["string"],
    "cloud": ["string"],
    "devops": ["string"],
    "languages": ["string"],
    "frameworks": ["string"],
    "tools": ["string"],
    "others": ["string"]
  },
  "experience": [
    {
      "company": "string",
      "designation": "string",
      "employmentType": "string",
      "location": "string",
      "startDate": "string",
      "endDate": "string",
      "currentlyWorking": false,
      "technologies": ["string"],
      "responsibilities": ["string"],
      "achievements": ["string"]
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"],
      "github": "string",
      "liveDemo": "string",
      "features": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "college": "string",
      "university": "string",
      "year": "string",
      "cgpa": "string"
    }
  ],
  "certifications": ["string"],
  "achievements": ["string"],
  "languagesKnown": ["string"],
  "interests": ["string"],
  "references": ["string"]
}`;

    const prompt = `Please parse this resume text:
--------------------
${text}
--------------------`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const resultJson: ResumeData = parseGeminiJson(response.text || "{}");

    // Log AI action
    LocalDB.logAIUsage("user-default", "resume-new", "parse", "Parsed text block");

    res.json(resultJson);
  } catch (error: any) {
    console.error("Resume parsing API failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// POST Analyze Resume & Return detailed ATS score
app.post("/api/analyze", async (req, res) => {
  try {
    const { resumeData } = req.body;
    if (!resumeData) {
      return res.status(400).json({ error: "Resume data is required" });
    }

    const systemInstruction = `You are an expert resume ATS (Applicant Tracking System) grader.
Analyze the provided resume data and return a JSON report grading the resume with granular metrics.
Return ONLY valid raw JSON. Do not wrap in markdown \`\`\`json blocks.

JSON Response Schema:
{
  "overallScore": number (0 to 100),
  "keywordMatch": number (0 to 100),
  "formattingScore": number (0 to 100),
  "actionVerbsScore": number (0 to 100),
  "readabilityScore": number (0 to 100),
  "suggestions": ["string"],
  "missingKeywords": ["string"]
}`;

    const prompt = `Analyze this resume:
${JSON.stringify(resumeData, null, 2)}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const resultJson: ATSReport = parseGeminiJson(response.text || "{}");
    LocalDB.logAIUsage("user-default", "resume", "ats-score", "Analyzed ATS score");
    res.json(resultJson);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST Improve Summary
app.post("/api/improve-summary", async (req, res) => {
  try {
    const { summary, skills } = req.body;
    if (!summary) {
      return res.status(400).json({ error: "Summary is required" });
    }

    const systemInstruction = `You are an elite career coach. Rewrite the provided professional summary to be highly engaging, metric-focused, ATS-friendly, and professional. Incorporate these core skills if appropriate: ${skills?.join(", ") || ""}.
Return ONLY the improved string paragraph. Do not include quotes or labels.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: summary,
      config: { systemInstruction },
    });

    const improvedSummary = (response.text || "").trim();
    LocalDB.logAIUsage("user-default", "resume", "improve-summary", "Improved Summary");
    res.json({ improved: improvedSummary });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST Improve Experience Bullet Point
app.post("/api/improve-experience", async (req, res) => {
  try {
    const { bullet, designation } = req.body;
    if (!bullet) {
      return res.status(400).json({ error: "Bullet point text is required" });
    }

    const systemInstruction = `You are a professional resume writer specializing in ATS standards.
Convert a weak job description bullet point into an achievement-oriented, high-impact bullet point using action verbs and measurable results (e.g. percentages, dollars, or time saved).
Role designation: ${designation || "Software Engineer"}.
Return ONLY the upgraded single-sentence bullet point. Do not add quotes, list markers like dashes/dots, or introductory comments.`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: bullet,
      config: { systemInstruction },
    });

    const improvedBullet = (response.text || "").trim();
    LocalDB.logAIUsage("user-default", "resume", "improve-experience", "Improved Bullet Point");
    res.json({ improved: improvedBullet });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST Compare Resume with Job Description
app.post("/api/job-match", async (req, res) => {
  try {
    const { resumeData, jobDescription } = req.body;
    if (!resumeData || !jobDescription) {
      return res.status(400).json({ error: "Both resumeData and jobDescription are required." });
    }

    const systemInstruction = `You are an AI recruiter who matches applicant resumes against concrete Job Descriptions (JD).
Compare the resume data with the JD and return a highly detailed JSON report indicating the alignment.
Return ONLY valid raw JSON. Do not wrap in markdown \`\`\`json blocks.

JSON Response Schema:
{
  "matchPercentage": number (0 to 100),
  "missingSkills": ["string"],
  "suggestedKeywords": ["string"],
  "experienceGap": "string summary of the difference",
  "improvedResumeSuggestions": "bullet suggestions on what to add"
}`;

    const prompt = `Resume:
${JSON.stringify(resumeData, null, 2)}

Job Description:
${jobDescription}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const report: JobMatchReport = parseGeminiJson(response.text || "{}");
    LocalDB.logAIUsage("user-default", "resume", "job-match", "JD matching report");
    res.json(report);
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST export tracking analytics
app.post("/api/export/track", (req, res) => {
  try {
    const { resumeId, format } = req.body;
    if (!resumeId || !format) {
      return res.status(400).json({ error: "resumeId and format are required" });
    }
    LocalDB.logDownload(resumeId, format);
    res.json({ success: true, message: "Download logged successfully" });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST Copilot Chat
app.post("/api/chat", async (req, res) => {
  try {
    const { history, message, resumeText } = req.body;
    if (!message) {
      return res.status(400).json({ error: "Message is required" });
    }

    const systemInstruction = `You are an elite, friendly career coach and ATS resume consultant.
You are helping the user optimize their resume. Below is the parsed JSON content of their current resume:
--------------------
${resumeText || "Empty"}
--------------------
Answer any questions they have about their resume, draft new summaries, optimize bullet points with achievements and metrics, suggest missing skills, or formulate answers to typical interview questions based on their profile.
Keep your replies conversational, helpful, brief, and professional.`;

    const contents = [
      ...(history || []).map((msg: any) => ({
        role: msg.role === "assistant" ? "model" : "user",
        parts: [{ text: msg.content }]
      })),
      { role: "user", parts: [{ text: message }] }
    ];

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: contents,
      config: { systemInstruction },
    });

    res.json({ reply: (response.text || "").trim() });
  } catch (error: any) {
    res.status(500).json({ error: error.message });
  }
});

// POST Generate Profile with AI
app.post("/api/generate-profile", async (req, res) => {
  try {
    const { profession } = req.body;
    if (!profession) {
      return res.status(400).json({ error: "Profession is required" });
    }

    const systemInstruction = `You are an elite professional resume writer and career designer.
Generate a fully realistic, highly detailed, professional, and ATS-optimized resume for a person working as a "${profession}".
Create realistic, authentic-sounding content: high-impact achievements, standard industry keywords, realistic locations, dates, and educational credentials.
Do NOT use placeholder texts or generic strings. Deliver rich, high-fidelity experience bullets and descriptions.
Return ONLY valid raw JSON following the specified schema. Do not include markdown \`\`\`json blocks.

JSON Response Schema:
{
  "personalInformation": {
    "firstName": "string",
    "lastName": "string",
    "fullName": "string",
    "email": "string",
    "phone": "string",
    "address": "string",
    "city": "string",
    "state": "string",
    "country": "string",
    "postalCode": "string",
    "linkedin": "string",
    "github": "string",
    "portfolio": "string",
    "website": "string"
  },
  "professionalSummary": "string (a powerful, metrics-driven professional summary)",
  "skills": {
    "frontend": ["string"],
    "backend": ["string"],
    "database": ["string"],
    "cloud": ["string"],
    "devops": ["string"],
    "languages": ["string"],
    "frameworks": ["string"],
    "tools": ["string"],
    "others": ["string"]
  },
  "experience": [
    {
      "company": "string",
      "designation": "string",
      "employmentType": "string",
      "location": "string",
      "startDate": "YYYY-MM",
      "endDate": "YYYY-MM or 'Present'",
      "currentlyWorking": "boolean",
      "technologies": ["string"],
      "responsibilities": ["string (strong, results-oriented bullet points containing metrics/percentages)"],
      "achievements": []
    }
  ],
  "projects": [
    {
      "title": "string",
      "description": "string",
      "technologies": ["string"],
      "github": "string",
      "liveDemo": "string",
      "features": ["string"]
    }
  ],
  "education": [
    {
      "degree": "string",
      "college": "string",
      "university": "string",
      "year": "string",
      "cgpa": "string"
    }
  ],
  "certifications": ["string"],
  "achievements": ["string"],
  "languagesKnown": ["string"],
  "interests": ["string"],
  "references": []
}`;

    const prompt = `Generate a premium resume dataset for a professional working as a: ${profession}`;

    const response = await ai.models.generateContent({
      model: "gemini-3.5-flash",
      contents: prompt,
      config: {
        systemInstruction,
        responseMimeType: "application/json",
      },
    });

    const resultJson: any = parseGeminiJson(response.text || "{}");

    // Set fallback ID fields and clean up types for array elements so React keys work correctly
    if (resultJson.experience && Array.isArray(resultJson.experience)) {
      resultJson.experience = resultJson.experience.map((exp: any, i: number) => ({
        ...exp,
        id: `exp-${Date.now()}-${i}`,
        currentlyWorking: exp.currentlyWorking === true || exp.currentlyWorking === "true",
        responsibilities: exp.responsibilities || [""],
        achievements: exp.achievements || []
      }));
    } else {
      resultJson.experience = [];
    }

    if (resultJson.projects && Array.isArray(resultJson.projects)) {
      resultJson.projects = resultJson.projects.map((proj: any, i: number) => ({
        ...proj,
        id: `proj-${Date.now()}-${i}`,
        technologies: proj.technologies || [],
        features: proj.features || [""]
      }));
    } else {
      resultJson.projects = [];
    }

    if (resultJson.education && Array.isArray(resultJson.education)) {
      resultJson.education = resultJson.education.map((edu: any, i: number) => ({
        ...edu,
        id: `edu-${Date.now()}-${i}`
      }));
    } else {
      resultJson.education = [];
    }

    if (!resultJson.certifications) resultJson.certifications = [];
    if (!resultJson.achievements) resultJson.achievements = [];
    if (!resultJson.languagesKnown) resultJson.languagesKnown = [];
    if (!resultJson.interests) resultJson.interests = [];
    if (!resultJson.references) resultJson.references = [];

    // Log AI action
    LocalDB.logAIUsage("user-default", "resume-new", "generate-profile", "Generated complete resume profile");

    res.json(resultJson);
  } catch (error: any) {
    console.error("AI profile generator failed:", error);
    res.status(500).json({ error: error.message });
  }
});

// --------------------------------------------------------------------------------
// VITE DEV SERVER & PRODUCTION ASSET ROUTING
// --------------------------------------------------------------------------------

async function startServer() {
  if (process.env.NODE_ENV !== "production") {
    console.log("Setting up Vite development server...");
    const vite = await createViteServer({
      server: { middlewareMode: true },
      appType: "spa",
    });
    app.use(vite.middlewares);
  } else {
    console.log("Production build detected. Serving static files...");
    const distPath = path.join(process.cwd(), "dist");
    app.use(express.static(distPath));
    app.get("*", (req, res) => {
      res.sendFile(path.join(distPath, "index.html"));
    });
  }

  app.listen(PORT, "0.0.0.0", () => {
    console.log(`Server successfully booted and listening at http://localhost:${PORT}`);
  });
}

startServer();

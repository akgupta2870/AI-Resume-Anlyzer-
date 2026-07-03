import React, { useState, useRef } from 'react';
import { Upload, FileText, AlertCircle, Sparkles, Loader2, Image as ImageIcon } from 'lucide-react';
import { motion } from 'motion/react';

interface LandingPageProps {
  onParsed: (data: any, originalText: string) => void;
  onSelectDefault: () => void;
}

export default function LandingPage({ onParsed, onSelectDefault }: LandingPageProps) {
  const [isDragging, setIsDragging] = useState(false);
  const [progress, setProgress] = useState<number | null>(null);
  const [statusText, setStatusText] = useState('');
  const [error, setError] = useState<string | null>(null);
  const [ocrNeeded, setOcrNeeded] = useState(false);
  const [pendingFile, setPendingFile] = useState<File | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = () => {
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) handleFile(file);
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) handleFile(file);
  };

  const triggerFileInput = () => {
    fileInputRef.current?.click();
  };

  const handleFile = async (file: File) => {
    setError(null);
    setOcrNeeded(false);
    setPendingFile(null);

    // Validate size (10 MB limit)
    const MAX_SIZE = 10 * 1024 * 1024; // 10MB
    if (file.size > MAX_SIZE) {
      setError("File exceeds the maximum size limit of 10 MB.");
      return;
    }

    // Validate file type
    const isPDF = file.type === 'application/pdf' || file.name.endsWith('.pdf');
    const isImage = file.type.startsWith('image/');
    
    if (!isPDF && !isImage) {
      setError("Unsupported file format. Please upload a PDF resume or an image.");
      return;
    }

    setPendingFile(file);
    setProgress(5);
    setStatusText("Reading file bytes...");

    try {
      if (isPDF) {
        await processPDF(file);
      } else if (isImage) {
        // Direct OCR flow for images
        setOcrNeeded(true);
        setStatusText("Scanned image detected. Click 'Run OCR' to extract text.");
      }
    } catch (err: any) {
      setError(err.message || "Failed to process the uploaded file.");
      setProgress(null);
    }
  };

  const processPDF = async (file: File) => {
    const reader = new FileReader();
    reader.onload = async (event) => {
      try {
        const arrayBuffer = event.target?.result as ArrayBuffer;
        const pdfjsLib = (window as any).pdfjsLib;
        
        if (!pdfjsLib) {
          throw new Error("PDF.js library is not loaded. Please try again.");
        }

        setProgress(20);
        setStatusText("Loading PDF pages...");

        const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
        const numPages = pdf.numPages;
        let extractedText = "";

        setProgress(40);
        setStatusText(`Extracting text from ${numPages} page(s)...`);

        for (let i = 1; i <= numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(" ");
          extractedText += pageText + "\n";
          
          setProgress(Math.round(40 + (i / numPages) * 30));
        }

        const cleanText = extractedText.trim();
        
        // Check if there is selectable text
        if (cleanText.length < 50) {
          // No selectable text -> Scanned PDF
          setOcrNeeded(true);
          setProgress(80);
          setStatusText("Selectable text not found. This looks like a scanned PDF. OCR is required.");
        } else {
          // Selectable text -> Proceed directly to AI parsing
          await runAIParsing(cleanText);
        }
      } catch (err: any) {
        setError("Error parsing PDF characters: " + err.message);
        setProgress(null);
      }
    };

    reader.onerror = () => {
      setError("Failed to read file.");
      setProgress(null);
    };

    reader.readAsArrayBuffer(file);
  };

  const triggerOCR = async () => {
    if (!pendingFile) return;
    setError(null);
    setProgress(5);
    setStatusText("Initializing OCR engine...");

    try {
      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const base64Data = e.target?.result as string;
          setStatusText("Running OCR and extracting content (this may take 10-15s)...");
          setProgress(30);

          // If it is a PDF we need to render it onto a canvas to get an image first, 
          // but for simplicity, we can do a call to our Express OCR endpoint which processes images,
          // or run it directly on the client if it's an image. 
          // Let's call our backend OCR endpoint which handles OCR beautifully!
          const response = await fetch('/api/ocr', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ imageData: base64Data })
          });

          const data = await response.json();
          if (!response.ok) {
            throw new Error(data.error || "OCR request failed");
          }

          setProgress(70);
          setStatusText("Text extracted via OCR! Now processing with Gemini AI...");
          await runAIParsing(data.text);
        } catch (err: any) {
          setError("OCR Processing failed: " + err.message);
          setProgress(null);
        }
      };

      // For scanned PDFs, we'll read as DataURL and let Tesseract do its best, 
      // or for images we read as DataURL directly.
      reader.readAsDataURL(pendingFile);
    } catch (err: any) {
      setError(err.message);
      setProgress(null);
    }
  };

  const runAIParsing = async (text: string) => {
    setProgress(85);
    setStatusText("Gemini AI is analyzing and structuring your resume...");

    try {
      const response = await fetch('/api/parse', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ text })
      });

      const parsedData = await response.json();
      if (!response.ok) {
        throw new Error(parsedData.error || "Failed to parse structured resume data.");
      }

      setProgress(100);
      setStatusText("Complete!");
      
      // Delay briefly so the user sees 100% completion
      setTimeout(() => {
        onParsed(parsedData, text);
      }, 500);

    } catch (err: any) {
      setError("AI Parsing Error: " + err.message);
      setProgress(null);
    }
  };

  return (
    <div id="landing-page-card" className="max-w-4xl mx-auto py-12 px-4">
      {/* Title section */}
      <div className="text-center mb-10">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-slate-900 border border-slate-800 text-xs text-indigo-400 font-mono rounded-full mb-4">
          <Sparkles className="w-3.5 h-3.5" />
          <span>Generative AI-Powered ATS Resume System</span>
        </div>
        <h1 className="font-display text-4xl md:text-5xl font-bold tracking-tight text-white mb-4">
          AI Resume PDF <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400">Analyzer & Editor</span>
        </h1>
        <p className="text-slate-400 text-lg max-w-2xl mx-auto">
          Upload any existing resume PDF or image. Our system extracts every details with Gemini 3.5 Flash, converts it into interactive form controls, and outputs an ATS-optimized professional resume.
        </p>
      </div>

      {/* Main Drag & Drop Zone */}
      <div
        id="drag-drop-zone"
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        onClick={triggerFileInput}
        className={`border-2 border-dashed rounded-2xl p-12 text-center cursor-pointer transition-all ${
          isDragging 
            ? 'border-indigo-400 bg-indigo-950/20 shadow-[0_0_20px_rgba(99,102,241,0.15)]' 
            : 'border-slate-800 hover:border-slate-700 bg-slate-900/40 hover:bg-slate-900/60'
        }`}
      >
        <input
          type="file"
          ref={fileInputRef}
          onChange={handleFileChange}
          accept=".pdf,image/*"
          className="hidden"
        />

        <div className="flex flex-col items-center justify-center">
          <div className="w-16 h-16 bg-slate-950 border border-slate-800 rounded-xl flex items-center justify-center mb-6 shadow-md">
            <Upload className="w-8 h-8 text-indigo-400" />
          </div>
          <h3 className="text-white text-lg font-semibold mb-2">Drag and drop your resume</h3>
          <p className="text-slate-400 text-sm mb-1">Support PDF or any Image format (JPG, PNG)</p>
          <p className="text-slate-500 text-xs">Maximum file size: 10 MB</p>
        </div>
      </div>

      {/* Default / Test Resume option */}
      <div className="mt-6 flex justify-center gap-4">
        <button
          id="btn-use-default"
          onClick={onSelectDefault}
          className="flex items-center gap-2 px-5 py-2.5 bg-slate-900 hover:bg-slate-850 text-slate-300 font-medium text-sm rounded-xl border border-slate-850 hover:border-slate-700 transition"
        >
          <FileText className="w-4 h-4 text-emerald-400" />
          <span>Load Amit's Predefined Tech Resume</span>
        </button>
      </div>

      {/* Progress & Processing States */}
      {progress !== null && (
        <motion.div 
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-8 bg-slate-900 border border-slate-800 rounded-xl p-6 shadow-lg"
        >
          <div className="flex items-center justify-between mb-3">
            <div className="flex items-center gap-3">
              <Loader2 className="w-5 h-5 text-indigo-400 animate-spin" />
              <span className="text-white font-medium text-sm">{statusText}</span>
            </div>
            <span className="text-indigo-400 font-mono text-sm font-semibold">{progress}%</span>
          </div>
          
          {/* Progress Bar Container */}
          <div className="w-full bg-slate-950 h-2 rounded-full overflow-hidden border border-slate-850">
            <div 
              className="bg-gradient-to-r from-indigo-500 to-purple-500 h-full transition-all duration-300"
              style={{ width: `${progress}%` }}
            />
          </div>

          {/* OCR Activation State */}
          {ocrNeeded && (
            <div className="mt-4 pt-4 border-t border-slate-850 flex items-center justify-between gap-4">
              <div className="flex items-start gap-2.5 max-w-md">
                <AlertCircle className="w-5 h-5 text-amber-500 shrink-0 mt-0.5" />
                <div className="text-left">
                  <p className="text-amber-400 text-xs font-semibold">Selectable Text Missing</p>
                  <p className="text-slate-400 text-xs">This file seems to be a scanned copy. Tesseract OCR will analyze and extract text line-by-line.</p>
                </div>
              </div>
              <button
                id="btn-run-ocr"
                onClick={triggerOCR}
                className="px-4 py-2 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white font-medium text-xs rounded-lg shadow-md transition shrink-0"
              >
                Run Server OCR
              </button>
            </div>
          )}
        </motion.div>
      )}

      {/* Error Output */}
      {error && (
        <motion.div 
          initial={{ opacity: 0, y: 5 }}
          animate={{ opacity: 1, y: 0 }}
          className="mt-6 p-4 bg-rose-950/30 border border-rose-900/50 rounded-xl flex items-start gap-3"
        >
          <AlertCircle className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          <div className="text-left">
            <p className="text-rose-400 text-sm font-semibold">Processing Failed</p>
            <p className="text-slate-400 text-xs mt-0.5">{error}</p>
          </div>
        </motion.div>
      )}
    </div>
  );
}

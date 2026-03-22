import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FileUp, Shield, Sparkles, AlertCircle, ChevronDown, Check, Loader2, FileText, SplitSquareHorizontal } from 'lucide-react';
import { analyzeBill, compareBills } from './api/analyze';
import { extractTextFromRawFile } from './utils/pdfParser';

function App() {
  const [mode, setMode] = useState("analyze"); // analyze | compare
  
  const [fileText, setFileText] = useState("");
  const [oldFileText, setOldFileText] = useState("");
  const [newFileText, setNewFileText] = useState("");
  const [question, setQuestion] = useState("");
  const [language, setLanguage] = useState("English");
  const [result, setResult] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);


  const handleFileUpload = async (e, type) => {
    if (e.target.files && e.target.files[0]) {
      try {
          const file = e.target.files[0];
          // Temporary placeholder before parse completes
          if (type === "single") setFileText("Parsing document, please wait...");
          const text = await extractTextFromRawFile(file);
          if (type === "single") setFileText(text);
          else if (type === "old") setOldFileText(text);
          else if (type === "new") setNewFileText(text);
      } catch (err) {
          setError(err);
      }
    }
  };

  const handleExecute = async () => {
    if (mode === "analyze" && (!fileText || !question)) {
      setError("Please upload a document and ask a question.");
      return;
    }
    if (mode === "compare" && (!oldFileText || !newFileText)) {
      setError("Please upload both Old and New versions of the document.");
      return;
    }
    
    setError(null);
    setLoading(true);
    setResult(null);

    let response;
    if (mode === "analyze") {
        response = await analyzeBill(fileText, question, language);
    } else {
        const compQuestion = question || "What changed between the two versions?";
        response = await compareBills(oldFileText, newFileText, compQuestion);
    }
    
    if (response.error) {
       setError(`${response.error} ${response.details ? `(${response.details})` : ""}`);
    } else {
       setResult(response);
    }
    
    setLoading(false);
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    show: { opacity: 1, transition: { staggerChildren: 0.1 } }
  };

  const fadeInUp = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring", stiffness: 300, damping: 24 } }
  };

  return (
    <div className="min-h-screen bg-slate-950 bg-[radial-gradient(ellipse_at_top,_var(--tw-gradient-stops))] from-slate-900 via-slate-950 to-slate-950 p-6 md:p-12 font-sans text-slate-100 overflow-x-hidden">
      <div className="max-w-4xl mx-auto space-y-10">
        <motion.header 
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="text-center space-y-4 pt-10"
        >
          <div className="inline-flex items-center justify-center p-3 bg-indigo-500/10 rounded-2xl mb-4 border border-indigo-500/20 shadow-[0_0_30px_rgba(99,102,241,0.15)]">
            <Shield className="w-10 h-10 text-indigo-400" />
          </div>
          <h1 className="text-4xl md:text-6xl font-extrabold tracking-tight">
            AI Legislative <span className="text-gradient">Analyzer</span>
          </h1>
          <p className="text-slate-400 text-lg md:text-xl font-medium tracking-wide">
            Understand complex laws instantly
          </p>
        </motion.header>

        {/* Mode Toggle */}
        <motion.div initial={{ opacity: 0 }} animate={{ opacity: 1 }} className="flex justify-center">
            <div className="bg-slate-900/80 p-1.5 rounded-2xl border border-slate-800/80 flex items-center shadow-lg">
                <button onClick={() => {setMode("analyze"); setResult(null); setError(null);}} className={`px-6 py-2.5 rounded-xl font-semibold transition-all ${mode === 'analyze' ? 'bg-indigo-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>Analyze Single Bill</button>
                <button onClick={() => {setMode("compare"); setResult(null); setError(null);}} className={`px-6 py-2.5 rounded-xl font-semibold transition-all flex items-center gap-2 ${mode === 'compare' ? 'bg-purple-500 text-white shadow-md' : 'text-slate-400 hover:text-slate-200'}`}>
                    <SplitSquareHorizontal className="w-4 h-4" /> Compare Versions
                </button>
            </div>
        </motion.div>

        <motion.div variants={staggerContainer} initial="hidden" animate="show" className="grid gap-6">
          {mode === "analyze" ? (
             <motion.div variants={fadeInUp} className="relative group">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-purple-500 rounded-3xl blur opacity-20 group-hover:opacity-40 transition duration-500"></div>
                <div className="relative glass-card rounded-3xl p-8 flex flex-col items-center text-center border-dashed border-2 hover:border-indigo-400/50 transition-colors">
                  <input type="file" id="file-upload" accept=".pdf,.txt" className="hidden" onChange={(e) => handleFileUpload(e, "single")} />
                  <label htmlFor="file-upload" className="cursor-pointer flex flex-col items-center justify-center w-full space-y-4">
                    <div className="p-4 bg-slate-800/50 rounded-full group-hover:bg-indigo-500/20 transition-colors">
                      {fileText ? <FileText className="w-8 h-8 text-indigo-400" /> : <FileUp className="w-8 h-8 text-slate-400" />}
                    </div>
                    <div>
                      <h3 className="text-lg font-semibold text-slate-200">
                        {fileText ? "Document Loaded Successfully" : "Drag & drop your legislative document"}
                      </h3>
                      <p className="text-slate-500 mt-1 text-sm">
                        {fileText ? "Ready for Analysis" : "or click to upload PDFs / TXTs"}
                      </p>
                    </div>
                  </label>
                </div>
              </motion.div>
          ) : (
            <motion.div variants={fadeInUp} className="grid md:grid-cols-2 gap-4">
                <div className="glass-card rounded-3xl p-6 flex flex-col items-center border-dashed border-2 hover:border-indigo-400/50 transition-colors w-full text-center group shadow-md bg-slate-900/40">
                    <input type="file" id="file-old" accept=".pdf,.txt" className="hidden" onChange={(e) => handleFileUpload(e, "old")} />
                    <label htmlFor="file-old" className="cursor-pointer w-full flex flex-col items-center gap-3">
                        <div className="p-3 bg-slate-800/50 rounded-full group-hover:bg-indigo-500/20 transition-colors">
                            {oldFileText ? <Check className="w-6 h-6 text-emerald-400" /> : <FileUp className="w-6 h-6 text-slate-400" />}
                        </div>
                        <h3 className="text-md font-semibold text-slate-200">Old Version</h3>
                        <p className="text-slate-500 text-xs">{oldFileText ? "Loaded Successfully" : "Upload previous draft"}</p>
                    </label>
                </div>
                <div className="glass-card rounded-3xl p-6 flex flex-col items-center border-dashed border-2 hover:border-purple-400/50 transition-colors w-full text-center group shadow-md bg-slate-900/40">
                    <input type="file" id="file-new" accept=".pdf,.txt" className="hidden" onChange={(e) => handleFileUpload(e, "new")} />
                    <label htmlFor="file-new" className="cursor-pointer w-full flex flex-col items-center gap-3">
                        <div className="p-3 bg-slate-800/50 rounded-full group-hover:bg-purple-500/20 transition-colors">
                            {newFileText ? <Check className="w-6 h-6 text-emerald-400" /> : <FileUp className="w-6 h-6 text-slate-400" />}
                        </div>
                        <h3 className="text-md font-semibold text-slate-200">New Version</h3>
                        <p className="text-slate-500 text-xs">{newFileText ? "Loaded Successfully" : "Upload revised draft"}</p>
                    </label>
                </div>
            </motion.div>
          )}

          {error && (
            <motion.div initial={{ opacity: 0, height: 0 }} animate={{ opacity: 1, height: 'auto' }} className="bg-red-500/10 border border-red-500/20 text-red-400 px-6 py-4 rounded-2xl flex items-center gap-3">
              <AlertCircle className="w-5 h-5 shrink-0" />
              <p>{error}</p>
            </motion.div>
          )}

          <motion.div variants={fadeInUp} className="grid md:grid-cols-[1fr_auto] gap-4">
            <input 
              type="text" 
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder={mode === "analyze" ? "Ask about this bill... (e.g. What are the penalties under Section 2?)" : "Focus on specific context... (Leave blank for generic diff)"} 
              className="w-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-6 py-5 text-lg placeholder:text-slate-500 focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all shadow-inner"
            />
            {mode === "analyze" && (
                <div className="relative min-w-[200px]">
                  <select 
                    value={language}
                    onChange={(e) => setLanguage(e.target.value)}
                    className="w-full h-full bg-slate-900/50 border border-slate-700/50 rounded-2xl px-6 py-5 text-lg appearance-none focus:outline-none focus:ring-2 focus:ring-indigo-500/50 transition-all cursor-pointer"
                  >
                    <option value="English">English</option>
                    <option value="Hindi">Hindi</option>
                    <option value="Tamil">Tamil</option>
                  </select>
                  <ChevronDown className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 w-5 h-5 pointer-events-none" />
                </div>
            )}
          </motion.div>

          <motion.div variants={fadeInUp} className="flex flex-col md:flex-row justify-center items-center gap-4 pt-4">
            <button 
              onClick={handleExecute} disabled={loading}
              className="group relative rounded-2xl p-[2px] w-full md:w-auto min-w-[240px] hover:scale-105 transition-transform"
            >
              <span className={`absolute inset-0 rounded-2xl ${mode === 'analyze' ? 'bg-gradient-to-r from-blue-500 via-indigo-500 to-purple-500' : 'bg-gradient-to-r from-purple-500 via-pink-500 to-rose-500'}`}></span>
              <div className="relative bg-slate-950 rounded-2xl px-8 py-4 flex items-center justify-center gap-3 transition-colors group-hover:bg-slate-950/80">
                {loading ? (
                  <Loader2 className="w-5 h-5 animate-spin text-white" />
                ) : (
                  <Sparkles className="w-5 h-5 text-indigo-300 group-hover:text-white transition-colors" />
                )}
                <span className="font-semibold text-lg text-white">
                  {loading ? (mode === "analyze" ? "Analyzing..." : "Diffing...") : (mode === "analyze" ? "Analyze Bill" : "Compare Versions")}
                </span>
              </div>
            </button>
          </motion.div>
        </motion.div>

        {/* Results */}
        <AnimatePresence mode="wait">
          {loading ? (
            <motion.div key="skeleton" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -20 }} className="mt-12 glass-card rounded-[2rem] p-8 md:p-10 space-y-6">
              <div className="h-8 bg-slate-800/50 rounded-xl w-1/3 animate-pulse"></div>
              <div className="space-y-4"><div className="h-4 bg-slate-800/50 rounded w-full animate-pulse"></div><div className="h-4 bg-slate-800/50 rounded w-5/6 animate-pulse"></div></div>
              <div className="pt-6 grid gap-3"><div className="h-16 bg-slate-900/60 rounded-xl w-full animate-pulse"></div></div>
            </motion.div>
          ) : result && (
            <motion.div key="result" initial={{ opacity: 0, y: 40 }} animate={{ opacity: 1, y: 0 }} transition={{ type: "spring", stiffness: 200, damping: 20 }} className="mt-12 glass-card rounded-[2rem] p-8 md:p-10 relative overflow-hidden shadow-2xl">
              <div className="relative z-10 space-y-8">
                <div className="flex items-center justify-between border-b border-slate-800 pb-6">
                  <h2 className="text-2xl font-bold text-slate-200">
                    {mode === "analyze" ? "AI Synthesis" : "Delta Comparison"}
                  </h2>
                  <div className={`px-4 py-1.5 rounded-full flex gap-2 text-sm font-semibold border ${result.confidence === 'High' ? 'bg-emerald-500/10 border-emerald-500/20 text-emerald-400' : result.confidence === 'Medium' ? 'bg-amber-500/10 border-amber-500/20 text-amber-400' : 'bg-slate-500/10 border-slate-500/20 text-slate-400'}`}>
                    <Check className="w-4 h-4" />{result.confidence} Confidence
                  </div>
                </div>
                
                <p className="text-xl md:text-2xl leading-relaxed text-slate-300 font-medium whitespace-pre-wrap">
                  {mode === "analyze" ? result.answer : result.changes}
                </p>
                
                {mode === "analyze" && result.clauses && result.clauses.length > 0 && (
                  <div className="pt-6 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-500 uppercase tracking-wider">Extracted Citations</h3>
                    <ul className="grid gap-3 list-none p-0">
                      {result.clauses.map((clause, idx) => (
                        <li key={idx} className="bg-slate-900/60 border border-slate-800 rounded-xl p-5 flex items-start gap-3 hover:border-indigo-500/30 transition-colors">
                          <div className="w-2 h-2 mt-2 rounded-full bg-indigo-500 shrink-0"></div>
                          <p className="text-slate-400 font-mono text-sm leading-relaxed m-0">{clause}</p>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

export default App;

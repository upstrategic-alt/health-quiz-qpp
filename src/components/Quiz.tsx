"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowRight, ChevronRight, CheckCircle2, Loader2 } from "lucide-react";
import { questions } from "@/data/quiz";
import { supabase } from "@/lib/supabase";

export default function Quiz() {
  const [currentStep, setCurrentStep] = useState(0);
  const [answers, setAnswers] = useState<Record<number, "A" | "B">>({});
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [result, setResult] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [errorMsg, setErrorMsg] = useState<string | null>(null);

  const totalQuestions = questions.length;
  // Step 0 - 7: Questions
  // Step 8: Capture Form
  // Step 9: Result screen (local simulation)
  const isCaptureStep = currentStep === totalQuestions;
  const isResultStep = currentStep > totalQuestions;

  // Calculate progress: up to capture step (9 steps total from 0 to 8)
  const progressPercentage = Math.min(((currentStep) / (totalQuestions + 1)) * 100, 100);

  const handleSelect = (optionId: "A" | "B") => {
    setAnswers((prev) => ({ ...prev, [currentStep]: optionId }));
    
    // Slight delay for UI feedback
    setTimeout(() => {
      setCurrentStep((prev) => prev + 1);
    }, 400);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    setErrorMsg(null);
    
    // Calculate Math based on Section 3
    let countA = 0;
    let countB = 0;
    
    Object.values(answers).forEach((ans) => {
      if (ans === "A") countA++;
      else if (ans === "B") countB++;
    });

    // 5 or more 'A's -> Expert-Guided
    // Tie (4/4) or majority 'B's -> Independent Mastery
    const calculatedResult = countA >= 5 ? "Expert-Guided" : "Independent Mastery";
    const redirectUrl = countA >= 5 ? "https://go.fnnlx.com/portfolio" : "https://go.fnnlx.com/launch";
    
    try {
      const { error } = await supabase
        .from('quiz_leads')
        .insert([{
          lead_name: name,
          lead_email: email,
          answer_q1: answers[0] || '',
          answer_q2: answers[1] || '',
          answer_q3: answers[2] || '',
          answer_q4: answers[3] || '',
          answer_q5: answers[4] || '',
          answer_q6: answers[5] || '',
          answer_q7: answers[6] || '',
          answer_q8: answers[7] || '',
          count_a: countA,
          count_b: countB,
          result_type: calculatedResult,
          redirect_url: redirectUrl
        }]);

      if (error) throw error;

      // Move to result screen momentarily while the browser redirects
      setResult(calculatedResult);
      setCurrentStep((prev) => prev + 1); 
      
      // Perform redirect
      window.location.href = redirectUrl;
    } catch (err: any) {
      console.error(err);
      setErrorMsg(err.message || "Failed to save results. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen bg-black text-white selection:bg-[#D4AF37] selection:text-black font-sans relative overflow-hidden flex flex-col justify-center items-center p-4">
      
      {/* Background Gradient Effect */}
      <div className="absolute top-0 left-0 w-full h-full overflow-hidden pointer-events-none">
        <div className="absolute top-[-20%] left-[-10%] w-[50%] h-[50%] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full" />
        <div className="absolute bottom-[-20%] right-[-10%] w-[50%] h-[50%] bg-[#D4AF37] opacity-[0.05] blur-[120px] rounded-full" />
      </div>

      {/* Progress Bar (Hidden on result screen) */}
      {!isResultStep && (
        <div className="fixed top-0 left-0 w-full h-1.5 bg-zinc-900 overflow-hidden z-50">
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: `${progressPercentage}%` }}
            transition={{ duration: 0.5, ease: "easeInOut" }}
            className="h-full bg-gradient-to-r from-[#D4AF37]/50 to-[#D4AF37]"
          />
        </div>
      )}

      {/* Main Content Area */}
      <div className="w-full max-w-2xl relative z-10">
        <AnimatePresence mode="wait">
          
          {/* QUESTION STEP */}
          {!isCaptureStep && !isResultStep && (
            <motion.div
              key={`question-${currentStep}`}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.4 }}
              className="w-full"
            >
              <div className="mb-8">
                <span className="text-[#D4AF37] text-sm font-semibold tracking-wider uppercase mb-2 block">
                  Question {currentStep + 1} of {totalQuestions}
                </span>
                <h2 className="text-3xl md:text-4xl font-light leading-relaxed">
                  {questions[currentStep].title}
                </h2>
              </div>

              <div className="space-y-4">
                {questions[currentStep].options.map((opt) => {
                  const isSelected = answers[currentStep] === opt.id;
                  
                  return (
                    <motion.button
                      key={opt.id}
                      onClick={() => handleSelect(opt.id)}
                      whileHover={{ scale: 1.01 }}
                      whileTap={{ scale: 0.98 }}
                      className={`w-full text-left p-6 md:p-8 rounded-2xl border transition-all duration-300 group flex items-start justify-between
                        ${isSelected 
                          ? "bg-zinc-900 border-[#D4AF37] shadow-[0_0_30px_rgba(212,175,55,0.15)]" 
                          : "bg-zinc-950/50 border-zinc-800 hover:border-zinc-700 hover:bg-zinc-900/80"
                        }`}
                    >
                      <span className="text-lg md:text-xl text-zinc-300 font-light pr-6 leading-relaxed">
                        {opt.text}
                      </span>
                      <div className={`mt-1 flex-shrink-0 w-6 h-6 rounded-full border flex items-center justify-center transition-colors
                        ${isSelected ? "border-[#D4AF37] bg-[#D4AF37]/10 text-[#D4AF37]" : "border-zinc-700 bg-transparent text-transparent"}
                      `}>
                        {isSelected && <div className="w-2.5 h-2.5 bg-[#D4AF37] rounded-full" />}
                      </div>
                    </motion.button>
                  );
                })}
              </div>
            </motion.div>
          )}

          {/* CAPTURE FORM STEP */}
          {isCaptureStep && (
            <motion.div
              key="capture"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.5 }}
              className="w-full bg-zinc-950/80 border border-zinc-800 p-8 md:p-12 rounded-3xl backdrop-blur-sm"
            >
              <div className="text-center mb-10">
                <h2 className="text-3xl md:text-4xl font-light mb-4">Almost there.</h2>
                <p className="text-zinc-400 text-lg">Where should we send your custom protocol results?</p>
              </div>

              <form onSubmit={handleSubmit} className="space-y-6">
                <div>
                  <label htmlFor="name" className="block text-sm text-zinc-500 mb-2 uppercase tracking-wide">First Name</label>
                  <input
                    id="name"
                    type="text"
                    required
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    placeholder="Enter your name"
                  />
                </div>
                
                <div>
                  <label htmlFor="email" className="block text-sm text-zinc-500 mb-2 uppercase tracking-wide">Email Address</label>
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full bg-zinc-900 border border-zinc-800 rounded-xl px-4 py-4 text-white focus:outline-none focus:border-[#D4AF37] focus:ring-1 focus:ring-[#D4AF37] transition-all"
                    placeholder="Enter your email"
                  />
                </div>

                <div className="pt-4">
                  {errorMsg && (
                    <div className="mb-4 text-red-400 text-sm border border-red-500/20 bg-red-500/10 p-3 rounded-lg text-center">
                      {errorMsg}
                    </div>
                  )}
                  <motion.button
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    type="submit"
                    disabled={isSubmitting}
                    className="w-full bg-[#D4AF37] text-black font-semibold text-lg py-4 rounded-xl flex items-center justify-center group hover:bg-[#ebd074] transition-colors disabled:opacity-70 disabled:cursor-not-allowed"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="mr-2 w-5 h-5 animate-spin" />
                        Analyzing...
                      </>
                    ) : (
                      <>
                        Reveal My Results
                        <ArrowRight className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </motion.button>
                </div>
              </form>
            </motion.div>
          )}

          {/* RESULT SIMULATION STEP */}
          {isResultStep && (
            <motion.div
              key="result"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.6, ease: "easeOut" }}
              className="text-center w-full bg-gradient-to-br from-zinc-900/50 to-zinc-950/80 border border-[#D4AF37]/30 p-10 md:p-14 rounded-3xl backdrop-blur-md"
            >
              <motion.div 
                initial={{ scale: 0 }} 
                animate={{ scale: 1 }} 
                transition={{ delay: 0.3, type: "spring" }}
                className="w-20 h-20 bg-[#D4AF37]/10 rounded-full flex items-center justify-center mx-auto mb-8"
              >
                <CheckCircle2 className="w-10 h-10 text-[#D4AF37]" />
              </motion.div>
              
              <h2 className="text-3xl md:text-5xl font-light mb-6 text-white">
                Hi {name || "there"}
              </h2>
              <p className="text-zinc-400 text-xl font-light mb-4">
                Based on your answers, you are the:
              </p>
              <div className="inline-block px-8 py-4 bg-[#D4AF37]/10 border border-[#D4AF37]/50 rounded-2xl mb-8">
                <span className="text-[#D4AF37] text-2xl md:text-3xl font-semibold tracking-wide">
                  {result}
                </span>
              </div>
              
              <p className="text-zinc-500 max-w-md mx-auto text-sm">
                Your results have been securely saved to our database. In the final version, this screen will redirect you directly to your custom protocol.
              </p>
            </motion.div>
          )}

        </AnimatePresence>
      </div>
    </div>
  );
}

"use client";

import React from "react";
import { BookOpen, Sparkles, Volume2, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/Button";

interface LessonIntroModalProps {
  title: string;
  explanation?: string;
  vocabNotes?: string;
  onStartQuiz: () => void;
}

export const LessonIntroModal: React.FC<LessonIntroModalProps> = ({
  title,
  explanation = "In Hindi, 'Namaste' (नमस्ते) is the traditional greeting used respectfully to say Hello and Goodbye.",
  vocabNotes = "• नमस्ते (Namaste) = Hello\n• धन्यवाद (Dhanyavaad) = Thank you\n• हाँ (Haan) = Yes",
  onStartQuiz,
}) => {
  return (
    <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
      <div className="bg-white dark:bg-slate-900 border-2 border-duo-green rounded-3xl p-6 sm:p-8 max-w-lg w-full shadow-2xl relative overflow-hidden">
        {/* Header Tag */}
        <div className="flex items-center gap-2 mb-3">
          <span className="px-3 py-1 bg-emerald-100 text-emerald-700 font-extrabold text-xs rounded-full uppercase tracking-wider">
            CLASSROOM LESSON INTRO
          </span>
        </div>

        <h2 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-4">
          {title}
        </h2>

        {/* Lesson Explanation Section */}
        <div className="p-4 bg-sky-50 dark:bg-slate-800 rounded-2xl border border-duo-blue mb-4">
          <h4 className="font-extrabold text-sm text-duo-blue uppercase mb-1 flex items-center gap-2">
            <BookOpen className="w-4 h-4" /> Grammar & Pronunciation Concept
          </h4>
          <p className="text-sm font-semibold text-gray-700 dark:text-slate-200 leading-relaxed">
            {explanation}
          </p>
        </div>

        {/* Vocab Notes Section */}
        <div className="p-4 bg-amber-50 dark:bg-slate-800 rounded-2xl border border-amber-300 dark:border-amber-700 mb-6">
          <h4 className="font-extrabold text-sm text-amber-600 uppercase mb-2 flex items-center gap-2">
            <Sparkles className="w-4 h-4" /> Key Vocabulary
          </h4>
          <pre className="text-sm font-bold text-gray-800 dark:text-slate-200 font-sans whitespace-pre-wrap leading-relaxed">
            {vocabNotes}
          </pre>
        </div>

        {/* Start Practice Quiz Button */}
        <Button variant="green" size="full" onClick={onStartQuiz}>
          START PRACTICE QUIZ <ArrowRight className="w-5 h-5 ml-2 inline" />
        </Button>
      </div>
    </div>
  );
};

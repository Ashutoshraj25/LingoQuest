"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { ExerciseHeader } from "@/features/lesson-player/ExerciseHeader";
import { MultipleChoice } from "@/features/lesson-player/MultipleChoice";
import { WordBank } from "@/features/lesson-player/WordBank";
import { MatchPairs } from "@/features/lesson-player/MatchPairs";
import { FillBlank } from "@/features/lesson-player/FillBlank";
import { TypeAnswer } from "@/features/lesson-player/TypeAnswer";
import { ListeningExercise } from "@/features/lesson-player/ListeningExercise";
import { SpeakingExercise } from "@/features/lesson-player/SpeakingExercise";
import { FeedbackBar } from "@/features/lesson-player/FeedbackBar";
import { LessonIntroModal } from "@/features/lesson-player/LessonIntroModal";
import { LessonCompleteView } from "@/features/lesson-complete/LessonCompleteView";
import { api } from "@/lib/api";
import { useAuth } from "@/context/AuthContext";
import { AuthPromptModal } from "@/components/auth/AuthPromptModal";

export default function LessonPlayerPage() {
  const params = useParams();
  const router = useRouter();
  const { user, isGuest, updateUserSession } = useAuth();
  const lessonId = Number(params?.id) || 1;

  const [lesson, setLesson] = useState<any>(null);
  const [showIntro, setShowIntro] = useState(true);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [hearts, setHearts] = useState(user.hearts || 5);

  const [userAnswer, setUserAnswer] = useState<any>(null);
  const [selectedWordBank, setSelectedWordBank] = useState<string[]>([]);
  const [feedbackStatus, setFeedbackStatus] = useState<"idle" | "correct" | "incorrect">("idle");
  const [correctAnswer, setCorrectAnswer] = useState<string>("");
  const [explanation, setExplanation] = useState<string>("");
  const [isFinished, setIsFinished] = useState(false);
  const [showAuthModal, setShowAuthModal] = useState(false);

  useEffect(() => {
    api.getLesson(lessonId)
      .then((data) => setLesson(data))
      .catch(() => {
        setLesson({
          id: lessonId,
          title: "Namaste Essentials",
          intro_explanation: "In Hindi, 'Namaste' (नमस्ते) is the traditional greeting used respectfully to say Hello and Goodbye.",
          vocabulary_notes: "• नमस्ते (Namaste) = Hello\n• धन्यवाद (Dhanyavaad) = Thank you\n• हाँ (Haan) = Yes",
          xp_reward: 25,
          exercises: [
            {
              id: 1,
              type: "word_bank",
              prompt: "Translate this sentence into English",
              question_text: "नमस्ते, आप कैसे हैं ?",
              explanation: "In Hindi, 'Namaste' means 'Hello' and 'Aap kaise hain?' means 'How are you?'",
              options: [
                { id: 1, text: "Hello," },
                { id: 2, text: "how" },
                { id: 3, text: "are" },
                { id: 4, text: "you?" },
                { id: 5, text: "Good" },
              ],
            },
            {
              id: 2,
              type: "multiple_choice",
              prompt: "Select the correct translation for 'Thank you'",
              question_text: "Thank you",
              explanation: "'धन्यवाद' (Dhanyavaad) means Thank you in Hindi.",
              options: [
                { id: 1, text: "धन्यवाद (Dhanyavaad)", translation: "Thank you" },
                { id: 2, text: "नमस्ते (Namaste)", translation: "Hello" },
              ],
            },
            {
              id: 3,
              type: "listening",
              prompt: "Listen and select the spoken Hindi word",
              question_text: "🔊 Audio Clip",
              explanation: "The clip says Namaste.",
              options: [
                { id: 1, text: "Namaste (नमस्ते)" },
                { id: 2, text: "Dhanyavaad (धन्यवाद)" },
              ],
            },
          ],
        });
      });
  }, [lessonId]);

  if (!lesson || !lesson.exercises || lesson.exercises.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center font-bold text-gray-500">
        Loading lesson...
      </div>
    );
  }

  const currentExercise = lesson.exercises[currentIndex];
  const totalExercises = lesson.exercises.length;

  const handleWordBankAdd = (word: string) => {
    const updated = [...selectedWordBank, word];
    setSelectedWordBank(updated);
    setUserAnswer(updated);
  };

  const handleWordBankRemove = (idx: number) => {
    const updated = selectedWordBank.filter((_, i) => i !== idx);
    setSelectedWordBank(updated);
    setUserAnswer(updated.length > 0 ? updated : null);
  };

  const handleCheck = () => {
    api.checkAnswer(currentExercise.id, userAnswer)
      .then((res) => {
        setExplanation(res.explanation || currentExercise.explanation || "");
        if (res.is_correct) {
          setFeedbackStatus("correct");
        } else {
          setFeedbackStatus("incorrect");
          setCorrectAnswer(res.correct_answer);
          const newHearts = Math.max(0, res.hearts_remaining);
          setHearts(newHearts);
          updateUserSession({ hearts: newHearts });
        }
      })
      .catch(() => {
        setFeedbackStatus("correct");
      });
  };

  const handleContinue = () => {
    setFeedbackStatus("idle");
    setUserAnswer(null);
    setSelectedWordBank([]);

    if (currentIndex + 1 < totalExercises) {
      setCurrentIndex(currentIndex + 1);
    } else {
      const earnedXP = lesson.xp_reward || 25;
      updateUserSession({
        xp: (user.xp || 2350) + earnedXP,
        completed_lessons: (user.completed_lessons || 42) + 1,
      });

      if (!isGuest) {
        api.completeLesson({
          lesson_id: lessonId,
          accuracy: 98.0,
          combo_max: 8,
          time_taken_seconds: 120,
        }).catch(() => {});
      }
      setIsFinished(true);
    }
  };

  const handleFinishContinue = () => {
    if (isGuest) {
      setShowAuthModal(true);
    } else {
      router.push("/");
    }
  };

  if (isFinished) {
    return (
      <>
        <AuthPromptModal
          isOpen={showAuthModal}
          onClose={() => router.push("/")}
          title="Create a free account to save your progress forever"
          actionText="save your XP and streak forever"
          returnUrl="/"
        />
        <LessonCompleteView
          xpEarned={lesson.xp_reward || 25}
          accuracy={98}
          comboMax={8}
          onContinue={handleFinishContinue}
        />
      </>
    );
  }

  const canCheck = userAnswer !== null && userAnswer !== "" && (Array.isArray(userAnswer) ? userAnswer.length > 0 : true);

  return (
    <div className="min-h-screen bg-white dark:bg-slate-900 flex flex-col justify-between pb-32">
      {/* Classroom Teaching Intro Modal */}
      {showIntro && (lesson.intro_explanation || lesson.vocabulary_notes) && (
        <LessonIntroModal
          title={lesson.title}
          explanation={lesson.intro_explanation}
          vocabNotes={lesson.vocabulary_notes}
          onStartQuiz={() => setShowIntro(false)}
        />
      )}

      <ExerciseHeader
        currentStep={currentIndex + 1}
        totalSteps={totalExercises}
        hearts={hearts}
        onExit={() => router.push("/")}
      />

      <main className="max-w-2xl mx-auto w-full px-4 text-center my-auto">
        <h2 className="text-2xl sm:text-3xl font-extrabold font-['Fredoka'] text-gray-800 dark:text-slate-100 mb-2">
          {currentExercise.prompt}
        </h2>

        {currentExercise.type === "multiple_choice" && (
          <MultipleChoice
            options={currentExercise.options}
            selectedOption={userAnswer}
            onSelect={setUserAnswer}
            disabled={feedbackStatus !== "idle"}
          />
        )}

        {currentExercise.type === "word_bank" && (
          <WordBank
            availableWords={currentExercise.options.map((o: any) => o.text)}
            selectedWords={selectedWordBank}
            onAddWord={handleWordBankAdd}
            onRemoveWord={handleWordBankRemove}
            disabled={feedbackStatus !== "idle"}
          />
        )}

        {currentExercise.type === "listening" && (
          <ListeningExercise
            options={currentExercise.options}
            selectedOption={userAnswer}
            onSelect={setUserAnswer}
            disabled={feedbackStatus !== "idle"}
          />
        )}

        {currentExercise.type === "speaking" && (
          <SpeakingExercise
            targetPhrase={currentExercise.question_text}
            onComplete={() => {
              setUserAnswer("speaking_passed");
              setFeedbackStatus("correct");
            }}
            disabled={feedbackStatus !== "idle"}
          />
        )}

        {currentExercise.type === "match_pairs" && (
          <MatchPairs
            pairs={{
              "नमस्ते (Namaste)": "Hello",
              "धन्यवाद (Dhanyavaad)": "Thank you",
              "हाँ (Haan)": "Yes",
            }}
            onComplete={(pair) => {
              setUserAnswer(pair);
              setFeedbackStatus("correct");
            }}
            disabled={feedbackStatus !== "idle"}
          />
        )}

        {currentExercise.type === "fill_blank" && (
          <FillBlank
            options={currentExercise.options}
            selectedWord={userAnswer}
            onSelectWord={setUserAnswer}
            disabled={feedbackStatus !== "idle"}
          />
        )}

        {currentExercise.type === "type_answer" && (
          <TypeAnswer
            value={userAnswer || ""}
            onChange={setUserAnswer}
            disabled={feedbackStatus !== "idle"}
          />
        )}
      </main>

      <FeedbackBar
        status={feedbackStatus}
        correctAnswer={correctAnswer}
        explanation={explanation}
        onCheck={handleCheck}
        onContinue={handleContinue}
        canCheck={canCheck}
      />
    </div>
  );
}

"use client"

import { useState } from "react"
import { Button } from "@/components/ui/button"
import { CheckCircle, XCircle } from "lucide-react"

export interface QuizQuestion {
  question: string
  options: string[]
  correct: number
  explanation: string
}

interface InteractiveQuizProps {
  questions: QuizQuestion[]
  onComplete?: (score: number) => void
}

export function InteractiveQuiz({ questions, onComplete }: InteractiveQuizProps) {
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [score, setScore] = useState(0)
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null)
  const [showResult, setShowResult] = useState(false)
  const [completed, setCompleted] = useState(false)

  const question = questions[currentQuestion]
  const isCorrect = selectedAnswer === question.correct

  const handleAnswer = (index: number) => {
    setSelectedAnswer(index)
    setShowResult(true)

    if (index === question.correct) {
      setScore(score + 1)
    }
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1)
      setSelectedAnswer(null)
      setShowResult(false)
    } else {
      setCompleted(true)
      onComplete?.(score + (isCorrect ? 1 : 0))
    }
  }

  if (completed) {
    const finalScore = score + (showResult && isCorrect ? 1 : 0)
    const percentage = (finalScore / questions.length) * 100

    return (
      <div
        className="glass p-8 rounded-2xl text-center"
        style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-color)" }}
      >
        <h3 className="text-2xl font-bold mb-4">Quiz Complete!</h3>
        <div className="text-5xl font-bold text-accent-primary mb-4">
          {finalScore}/{questions.length}
        </div>
        <p className="text-lg text-foreground-secondary mb-6">You scored {percentage.toFixed(1)}%</p>
        <Button
          onClick={() => {
            setCurrentQuestion(0)
            setScore(0)
            setSelectedAnswer(null)
            setShowResult(false)
            setCompleted(false)
          }}
          className="bg-accent-primary hover:bg-accent-tertiary text-white rounded-xl"
        >
          Retake Quiz
        </Button>
      </div>
    )
  }

  return (
    <div
      className="glass p-8 rounded-2xl space-y-6"
      style={{ backgroundColor: "var(--surface)", borderColor: "var(--border-color)" }}
    >
      <div>
        <h3 className="text-lg font-semibold mb-2">
          Question {currentQuestion + 1} of {questions.length}
        </h3>
        <div className="w-full rounded-full h-2" style={{ backgroundColor: "var(--surface)" }}>
          <div
            className="h-full bg-gradient-to-r from-accent-primary to-accent-secondary rounded-full"
            style={{ width: `${((currentQuestion + 1) / questions.length) * 100}%` }}
          />
        </div>
      </div>

      <div>
        <h4 className="text-xl font-semibold mb-4">{question.question}</h4>
        <div className="space-y-3">
          {question.options.map((option, index) => (
            <button
              key={index}
              onClick={() => !showResult && handleAnswer(index)}
              disabled={showResult}
              className={`w-full p-4 rounded-xl text-left font-medium transition-all ${
                selectedAnswer === index
                  ? isCorrect
                    ? "bg-green-500/20 border-2 border-green-500 text-green-300"
                    : "bg-red-500/20 border-2 border-red-500 text-red-300"
                  : "glass border-2 hover:border-accent-primary"
              }`}
              style={
                selectedAnswer !== index
                  ? {
                      backgroundColor: "var(--surface)",
                      borderColor: "var(--border-color)",
                    }
                  : {}
              }
            >
              <div className="flex items-center justify-between">
                <span>{option}</span>
                {showResult &&
                  selectedAnswer === index &&
                  (isCorrect ? <CheckCircle className="w-5 h-5" /> : <XCircle className="w-5 h-5" />)}
              </div>
            </button>
          ))}
        </div>
      </div>

      {showResult && (
        <div
          className={`p-4 rounded-xl ${isCorrect ? "bg-green-500/20 text-green-300" : "bg-red-500/20 text-red-300"}`}
        >
          <p className="font-semibold mb-2">{isCorrect ? "Correct!" : "Incorrect"}</p>
          <p className="text-sm">{question.explanation}</p>
        </div>
      )}

      {showResult && (
        <Button
          onClick={handleNext}
          className="w-full bg-accent-primary hover:bg-accent-tertiary text-white rounded-xl"
        >
          {currentQuestion === questions.length - 1 ? "Finish Quiz" : "Next Question"}
        </Button>
      )}
    </div>
  )
}

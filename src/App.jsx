import React, { useEffect, useState } from "react";
import QuestionCard from "./components/QuestionCard";
import { questions } from "./data/questions";
import Confetti from "react-confetti";
const App = () => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [score, setScore] = useState(0);
  const [isFinished, setIsFinshed] = useState(false);
  const [showFeedback, setShowFeedback] = useState(false);

  const handleAnswer = (option) => {
    if (showFeedback) return;
    setSelectedAnswer(option);
    setShowFeedback(true);
    if (option === questions[currentQuestion].answer) {
      setScore(score + 1);
    }
  };

  const goToNext = () => {
    if (currentQuestion + 1 < questions.length) {
      setCurrentQuestion(currentQuestion + 1);
      setSelectedAnswer(null);
      setShowFeedback(false);
    } else {
      setIsFinshed(true);
    }
  };

  const restartQuiz = () => {
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowFeedback(false);
    setIsFinshed(false);
  };

  const calculateProgress = () => {
    if (isFinished) return 100;
    const baseProgress = (currentQuestion / questions.length) * 100;
    const questionProgress = selectedAnswer ? (1 / questions.length) * 100 : 0;
    return baseProgress + questionProgress;
  }

  const percentage = (score / questions.length) * 100;
  const showConfetti = isFinished && percentage > 50;

  const [windowSize, setWindowSize] = useState({
    width: window.innerWidth,
    height: window.innerHeight,
  });

  useEffect(() => {
    const handleResize = () =>
      setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);


  return (
    <div className="min-h-screen bg-gray-900 text-white flex flex-col items-center justify-center p-4">
      {showConfetti && (
        <Confetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={400}
        />
      )}

      <div className="text-center mb-8">
        <h1 className="text-4xl font-bold text-purple-600 mb-2">React Quiz</h1>

        <p className="text-gray-400">Test your knowledge</p>
      </div>
      <div className="w-full max-w-xl mb-6">
        <div className="bg-gray-700 h-3 rounded-full overflow-hidden">
          <div className="h-full bg-gradient-to-r from-indigo-500 to-purple-600 duration-500 ease-out transition-all" style={{ width: `${calculateProgress()}%` }}>

          </div>
        </div>
      </div>
      {!isFinished ? (
        <>
          <QuestionCard
            showFeedback={showFeedback}
            onAnswer={handleAnswer}
            data={questions[currentQuestion]}
            current={currentQuestion}
            total={questions.length}
            selected={selectedAnswer}
          />
          <div className="mt-6 min-h-[60px]">
            {showFeedback && (
              <button
                onClick={goToNext}
                className="bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-6 rounded-lg font-medium shadow-lg cursor-pointer"
              >
                {currentQuestion + 1 < questions.length
                  ? "Continue"
                  : "See Results"}
              </button>
            )}
          </div>
        </>
      ) : (
        <div className="text-center">
          <h2 className="text-3xl font-bold mb-4">Quiz Completed!</h2>
          <p className="text-xl">
            You scored <span>{score}</span> out of{" "}
            <span className="font-bold">{questions.length}</span> and it is{" "}
            {Math.round((score / questions.length) * 100)}%{" "}
          </p>
          <button className="bg-gradient-to-r from-indigo-600 to-purple-600 py-3 px-6 rounded-lg font-medium shadow-lg cursor-pointer mt-4" onClick={restartQuiz}>Restart Quiz</button>
        </div>
      )}
    </div>
  );
};

export default App;

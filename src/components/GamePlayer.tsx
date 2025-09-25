import React, { useState, useEffect } from 'react';
import { Trophy, RotateCcw, X } from 'lucide-react';

interface GamePlayerProps {
  game: {
    id: string;
    title: string;
    subject: string;
    difficulty: string;
    icon: string;
    questions: Array<{
      question: string;
      options: string[];
      correct: number;
      explanation: string;
    }>;
  };
  onComplete: (gameId: string, subject: string, score: number, timeSpent: number) => void;
  onClose: () => void;
}

const GamePlayer: React.FC<GamePlayerProps> = ({ game, onComplete, onClose }) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState<number | null>(null);
  const [score, setScore] = useState(0);
  const [showResult, setShowResult] = useState(false);
  const [showExplanation, setShowExplanation] = useState(false);
  const [isCorrect, setIsCorrect] = useState(false);
  const [timeSpent, setTimeSpent] = useState(0);
  const [gameCompleted, setGameCompleted] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(prev => prev + 1);
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const handleAnswerSelect = (answerIndex: number) => {
    if (showResult) return;
    
    setSelectedAnswer(answerIndex);
    const correct = answerIndex === game.questions[currentQuestion].correct;
    setIsCorrect(correct);
    setShowResult(true);
    setShowExplanation(true);

    if (correct) {
      setScore(prev => prev + 1);
      setShowConfetti(true);
      setTimeout(() => setShowConfetti(false), 2000);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < game.questions.length - 1) {
      setCurrentQuestion(prev => prev + 1);
      setSelectedAnswer(null);
      setShowResult(false);
      setShowExplanation(false);
    } else {
      // Game completed
      setGameCompleted(true);
      onComplete(game.id, game.subject, score, timeSpent);
    }
  };

  const restartGame = () => {
    setCurrentQuestion(0);
    setSelectedAnswer(null);
    setScore(0);
    setShowResult(false);
    setShowExplanation(false);
    setTimeSpent(0);
    setGameCompleted(false);
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  const getScoreColor = () => {
    const percentage = (score / game.questions.length) * 100;
    if (percentage >= 80) return 'text-green-600';
    if (percentage >= 60) return 'text-yellow-600';
    return 'text-red-600';
  };

  if (gameCompleted) {
    return (
      <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white rounded-2xl shadow-2xl w-full max-w-2xl p-8 text-center">
          <div className="text-6xl mb-4">🎉</div>
          <h2 className="text-3xl font-bold mb-4">Game Complete!</h2>
          <div className="bg-gradient-to-r from-indigo-100 to-purple-100 rounded-xl p-6 mb-6">
            <div className="grid grid-cols-3 gap-4">
              <div>
                <div className="text-2xl font-bold text-indigo-600">{score}</div>
                <div className="text-sm text-gray-600">Correct Answers</div>
              </div>
              <div>
                <div className={`text-2xl font-bold ${getScoreColor()}`}>
                  {Math.round((score / game.questions.length) * 100)}%
                </div>
                <div className="text-sm text-gray-600">Score</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-purple-600">{formatTime(timeSpent)}</div>
                <div className="text-sm text-gray-600">Time Spent</div>
              </div>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-2 mb-6 text-green-600 font-medium">
            <Trophy className="w-5 h-5" />
            <span>+20 XP Earned!</span>
          </div>

          <div className="flex gap-4 justify-center">
            <button
              onClick={restartGame}
              className="flex items-center gap-2 px-6 py-3 bg-gray-100 hover:bg-gray-200 rounded-lg transition-colors"
            >
              <RotateCcw className="w-4 h-4" />
              Play Again
            </button>
            <button
              onClick={onClose}
              className="px-6 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all"
            >
              Continue Learning
            </button>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 bg-black/90 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      {/* Confetti Effect */}
      {showConfetti && (
        <div className="fixed inset-0 pointer-events-none z-60">
          {[...Array(50)].map((_, i) => (
            <div
              key={i}
              className="absolute animate-bounce"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 2}s`,
                fontSize: `${Math.random() * 20 + 10}px`,
              }}
            >
              🎉
            </div>
          ))}
        </div>
      )}

      <div className="bg-white rounded-2xl shadow-2xl w-full max-w-3xl max-h-[90vh] overflow-hidden">
        {/* Header */}
        <div className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white p-4">
          <div className="flex justify-between items-center">
            <div>
              <h2 className="text-xl font-bold">{game.title}</h2>
              <p className="text-white/80 text-sm">
                Question {currentQuestion + 1} of {game.questions.length} • Score: {score}/{game.questions.length}
              </p>
            </div>
            <div className="flex items-center gap-4">
              <div className="text-sm">⏱️ {formatTime(timeSpent)}</div>
              <button 
                onClick={onClose}
                className="p-2 hover:bg-white/20 rounded-full transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Progress Bar */}
        <div className="bg-gray-200 h-2">
          <div 
            className="bg-gradient-to-r from-indigo-500 to-purple-500 h-2 transition-all duration-300"
            style={{ width: `${((currentQuestion + 1) / game.questions.length) * 100}%` }}
          ></div>
        </div>

        {/* Game Content */}
        <div className="p-8">
          <div className="text-center mb-8">
            <div className="text-6xl mb-4">{game.icon}</div>
            <h3 className="text-2xl font-bold mb-4">{game.questions[currentQuestion].question}</h3>
          </div>

          {/* Answer Options */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            {game.questions[currentQuestion].options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswerSelect(index)}
                disabled={showResult}
                className={`p-4 rounded-xl border-2 transition-all duration-200 text-left ${
                  showResult
                    ? index === game.questions[currentQuestion].correct
                      ? 'border-green-500 bg-green-50 text-green-800'
                      : index === selectedAnswer
                      ? 'border-red-500 bg-red-50 text-red-800'
                      : 'border-gray-200 bg-gray-50 text-gray-500'
                    : selectedAnswer === index
                    ? 'border-indigo-500 bg-indigo-50'
                    : 'border-gray-200 hover:border-indigo-300 hover:bg-gray-50'
                }`}
              >
                <div className="flex items-center gap-3">
                  <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                    showResult
                      ? index === game.questions[currentQuestion].correct
                        ? 'bg-green-500 text-white'
                        : index === selectedAnswer
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-300 text-gray-600'
                      : 'bg-indigo-100 text-indigo-600'
                  }`}>
                    {String.fromCharCode(65 + index)}
                  </div>
                  <span className="font-medium">{option}</span>
                </div>
              </button>
            ))}
          </div>

          {/* Result Feedback */}
          {showResult && (
            <div className={`p-4 rounded-xl mb-6 ${
              isCorrect ? 'bg-green-50 border border-green-200' : 'bg-red-50 border border-red-200'
            }`}>
              <div className="flex items-center gap-3 mb-2">
                <div className="text-2xl">
                  {isCorrect ? '🎉' : '😔'}
                </div>
                <div className={`font-bold ${isCorrect ? 'text-green-800' : 'text-red-800'}`}>
                  {isCorrect ? 'Correct! Well done!' : 'Incorrect. Try again next time!'}
                </div>
              </div>
              {showExplanation && (
                <p className={`text-sm ${isCorrect ? 'text-green-700' : 'text-red-700'}`}>
                  {game.questions[currentQuestion].explanation}
                </p>
              )}
            </div>
          )}

          {/* Next Button */}
          {showResult && (
            <div className="text-center">
              <button
                onClick={nextQuestion}
                className="px-8 py-3 bg-gradient-to-r from-indigo-600 to-purple-600 text-white rounded-lg hover:from-indigo-700 hover:to-purple-700 transition-all font-medium"
              >
                {currentQuestion < game.questions.length - 1 ? 'Next Question' : 'Finish Game'}
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default GamePlayer;
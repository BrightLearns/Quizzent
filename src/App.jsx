import React, { useState, useEffect } from 'react';
import { Clock, Trophy, Zap, Brain, Rocket } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState('menu'); // menu, playing, results
  const [difficulty, setDifficulty] = useState('');
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [answered, setAnswered] = useState(false);

  // Current affairs questions for 2025-2026
  const questions = {
    easy: [
      {
        q: "Who is the current President of the United States (inaugurated January 2025)?",
        options: ["Joe Biden", "Donald Trump", "Kamala Harris", "Ron DeSantis"],
        correct: 1
      },
      {
        q: "Which social media platform was acquired by Elon Musk in 2022 and rebranded?",
        options: ["Facebook", "Instagram", "Twitter/X", "TikTok"],
        correct: 2
      },
      {
        q: "What major global sporting event is scheduled for 2026?",
        options: ["FIFA World Cup", "Summer Olympics", "Winter Olympics", "Rugby World Cup"],
        correct: 0
      },
      {
        q: "Which country recently became the world's most populous?",
        options: ["China", "United States", "India", "Indonesia"],
        correct: 2
      },
      {
        q: "What is the name of OpenAI's popular AI chatbot launched in late 2022?",
        options: ["ChatGPT", "Bard", "Claude", "Copilot"],
        correct: 0
      },
      {
        q: "Which streaming service introduced a password-sharing crackdown in 2023?",
        options: ["Disney+", "Netflix", "Hulu", "Amazon Prime"],
        correct: 1
      },
      {
        q: "What cryptocurrency experienced a major crash in 2022?",
        options: ["Dogecoin", "Ethereum", "Bitcoin", "All of the above"],
        correct: 3
      },
      {
        q: "Which company's CEO is Satya Nadella?",
        options: ["Apple", "Google", "Microsoft", "Amazon"],
        correct: 2
      }
    ],
    medium: [
      {
        q: "Which AI model family was released by Anthropic in 2024-2025?",
        options: ["GPT-5", "Claude 4", "Gemini Ultra", "LLaMA 3"],
        correct: 1
      },
      {
        q: "What major conflict escalated significantly in October 2023?",
        options: ["Ukraine-Russia", "Israel-Gaza", "Armenia-Azerbaijan", "Sudan Civil War"],
        correct: 1
      },
      {
        q: "Which country hosted COP28 climate summit in 2023?",
        options: ["Egypt", "UAE", "Brazil", "Kenya"],
        correct: 1
      },
      {
        q: "What was the name of the submersible that imploded during a Titanic expedition in 2023?",
        options: ["Titan", "Triton", "Atlantis", "DeepSea"],
        correct: 0
      },
      {
        q: "Which African nation experienced a coup in July 2023?",
        options: ["Mali", "Niger", "Burkina Faso", "Guinea"],
        correct: 1
      },
      {
        q: "What historic deal did Hollywood actors reach in 2023 after a strike?",
        options: ["AI protections in contracts", "Higher streaming residuals", "Both A and B", "Shorter work hours"],
        correct: 2
      },
      {
        q: "Which tech company laid off the most employees in 2023?",
        options: ["Meta", "Amazon", "Google", "Microsoft"],
        correct: 1
      },
      {
        q: "What year did Queen Elizabeth II pass away?",
        options: ["2021", "2022", "2023", "2024"],
        correct: 1
      }
    ],
    hard: [
      {
        q: "Who won the 2024 Nobel Peace Prize?",
        options: ["Narges Mohammadi", "Nihon Hidankyo", "Maria Ressa", "Ales Bialiatski"],
        correct: 1
      },
      {
        q: "What percentage did global inflation peak at in major economies during 2022?",
        options: ["5-6%", "7-8%", "9-10%", "11-12%"],
        correct: 2
      },
      {
        q: "Which spacecraft successfully landed on the Moon's south pole in 2023?",
        options: ["Artemis I", "Chandrayaan-3", "Luna 25", "Peregrine"],
        correct: 1
      },
      {
        q: "What was the codename for the Fed's 2023 banking crisis response?",
        options: ["Bank Term Funding Program", "Emergency Liquidity Facility", "Crisis Resolution Fund", "Systemic Support Program"],
        correct: 0
      },
      {
        q: "Which country won the 2023 ICC Cricket World Cup?",
        options: ["India", "Australia", "England", "New Zealand"],
        correct: 1
      },
      {
        q: "What is the name of the EU's landmark AI regulation passed in 2024?",
        options: ["AI Safety Act", "EU AI Act", "Digital AI Regulation", "Algorithmic Accountability Act"],
        correct: 1
      },
      {
        q: "Which semiconductor company reached a $3 trillion market cap in 2024?",
        options: ["Intel", "AMD", "TSMC", "NVIDIA"],
        correct: 3
      },
      {
        q: "What was the inflation reduction target set by the ECB for 2025?",
        options: ["1%", "2%", "3%", "4%"],
        correct: 1
      }
    ]
  };

  const timePerQuestion = {
    easy: 30,
    medium: 45,
    hard: 60
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !answered) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing' && !answered) {
      handleTimeout();
    }
  }, [timeLeft, gameState, answered]);

  const startGame = (diff) => {
    setDifficulty(diff);
    setGameState('playing');
    setCurrentQuestion(0);
    setScore(0);
    setTimeLeft(timePerQuestion[diff]);
    setSelectedAnswer(null);
    setShowCorrect(false);
    setAnswered(false);
  };

  const handleTimeout = () => {
    setAnswered(true);
    setShowCorrect(true);
    setTimeout(() => nextQuestion(), 2500);
  };

  const handleAnswer = (index) => {
    if (answered) return;
    
    setSelectedAnswer(index);
    setAnswered(true);
    const isCorrect = index === questions[difficulty][currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
      setTimeout(() => nextQuestion(), 1000);
    } else {
      setShowCorrect(true);
      setTimeout(() => nextQuestion(), 2500);
    }
  };

  const nextQuestion = () => {
    if (currentQuestion < questions[difficulty].length - 1) {
      setCurrentQuestion(currentQuestion + 1);
      setTimeLeft(timePerQuestion[difficulty]);
      setSelectedAnswer(null);
      setShowCorrect(false);
      setAnswered(false);
    } else {
      setGameState('results');
    }
  };

  const resetGame = () => {
    setGameState('menu');
    setDifficulty('');
    setCurrentQuestion(0);
    setScore(0);
    setSelectedAnswer(null);
    setShowCorrect(false);
    setAnswered(false);
  };

  const getButtonStyle = (index) => {
    if (!answered) return 'bg-yellow-400 hover:bg-yellow-500 hover:scale-105';
    
    const isCorrect = index === questions[difficulty][currentQuestion].correct;
    const isSelected = index === selectedAnswer;
    
    if (isCorrect && showCorrect) return 'bg-green-500 scale-105 animate-pulse';
    if (isSelected && !isCorrect) return 'bg-red-500 shake';
    if (isCorrect) return 'bg-green-500';
    return 'bg-gray-400';
  };

  // Menu Screen
  if (gameState === 'menu') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center">
          <h1 className="text-8xl font-black text-yellow-400 mb-4 animate-bounce" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif', textShadow: '4px 4px 0px rgba(0,0,0,0.3)'}}>
            QUIZZENT! 🧠
          </h1>
          <p className="text-2xl text-yellow-300 mb-12" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
            Test Your Current Affairs Knowledge!
          </p>
          
          <div className="space-y-6">
            <button
              onClick={() => startGame('easy')}
              className="group w-80 bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-black py-6 px-8 rounded-3xl text-3xl transform hover:scale-110 transition-all duration-200 shadow-2xl hover:shadow-yellow-400/50"
              style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
            >
              <div className="flex items-center justify-center gap-3">
                <Zap className="w-8 h-8" />
                EASY MODE
                <span className="text-lg">(30s per Q)</span>
              </div>
            </button>
            
            <button
              onClick={() => startGame('medium')}
              className="group w-80 bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-black py-6 px-8 rounded-3xl text-3xl transform hover:scale-110 transition-all duration-200 shadow-2xl hover:shadow-yellow-400/50"
              style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
            >
              <div className="flex items-center justify-center gap-3">
                <Brain className="w-8 h-8" />
                MEDIUM MODE
                <span className="text-lg">(45s per Q)</span>
              </div>
            </button>
            
            <button
              onClick={() => startGame('hard')}
              className="group w-80 bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-black py-6 px-8 rounded-3xl text-3xl transform hover:scale-110 transition-all duration-200 shadow-2xl hover:shadow-yellow-400/50"
              style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
            >
              <div className="flex items-center justify-center gap-3">
                <Rocket className="w-8 h-8" />
                HARD MODE
                <span className="text-lg">(60s per Q)</span>
              </div>
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  if (gameState === 'playing') {
    const current = questions[difficulty][currentQuestion];
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-yellow-400 rounded-3xl p-6 mb-8 shadow-2xl">
            <div className="flex justify-between items-center">
              <div className="text-purple-900 font-black text-2xl" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
                Question {currentQuestion + 1}/{questions[difficulty].length}
              </div>
              <div className="text-purple-900 font-black text-2xl" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
                Score: {score} 🏆
              </div>
              <div className={`flex items-center gap-2 text-purple-900 font-black text-3xl ${timeLeft <= 10 ? 'animate-pulse text-red-600' : ''}`} style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
                <Clock className="w-8 h-8" />
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-3xl p-8 mb-8 shadow-2xl transform hover:scale-105 transition-transform">
            <h2 className="text-3xl font-black text-purple-900 text-center" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
              {current.q}
            </h2>
          </div>

          {/* Answers */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {current.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={`${getButtonStyle(index)} text-purple-900 font-black py-6 px-8 rounded-3xl text-2xl transform transition-all duration-200 shadow-2xl disabled:cursor-not-allowed`}
                style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
              >
                {option}
                {showCorrect && index === current.correct && ' ✅'}
                {answered && index === selectedAnswer && index !== current.correct && ' ❌'}
              </button>
            ))}
          </div>
        </div>
      </div>
    );
  }

  // Results Screen
  if (gameState === 'results') {
    const percentage = Math.round((score / questions[difficulty].length) * 100);
    const getMessage = () => {
      if (percentage === 100) return "PERFECT SCORE! You're a GENIUS! 🧠✨";
      if (percentage >= 80) return "AMAZING! You're super smart! 🌟";
      if (percentage >= 60) return "GREAT JOB! Keep it up! 🎉";
      if (percentage >= 40) return "NOT BAD! Practice makes perfect! 💪";
      return "Keep learning! You got this! 📚";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center">
          <Trophy className="w-32 h-32 text-yellow-400 mx-auto mb-8 animate-bounce" />
          <h1 className="text-7xl font-black text-yellow-400 mb-4" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif', textShadow: '4px 4px 0px rgba(0,0,0,0.3)'}}>
            QUIZ COMPLETE!
          </h1>
          
          <div className="bg-white rounded-3xl p-12 mb-8 shadow-2xl">
            <div className="text-6xl font-black text-purple-900 mb-4" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
              {score}/{questions[difficulty].length}
            </div>
            <div className="text-4xl font-black text-purple-700 mb-4" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
              {percentage}% 🎯
            </div>
            <div className="text-2xl font-bold text-purple-600" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
              {getMessage()}
            </div>
          </div>

          <button
            onClick={resetGame}
            className="w-80 bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-black py-6 px-8 rounded-3xl text-3xl transform hover:scale-110 transition-all duration-200 shadow-2xl hover:shadow-yellow-400/50"
            style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
          >
            PLAY AGAIN! 🔄
          </button>
        </div>
      </div>
    );
  }
}

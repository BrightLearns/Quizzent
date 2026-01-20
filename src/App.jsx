import React, { useState, useEffect, useRef } from 'react';
import { Clock, Trophy, Zap, Brain, Rocket, Volume2, VolumeX, List } from 'lucide-react';

export default function App() {
  const [gameState, setGameState] = useState('menu'); // menu, settings, playing, results
  const [difficulty, setDifficulty] = useState('');
  const [questionCount, setQuestionCount] = useState(8);
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(0);
  const [selectedAnswer, setSelectedAnswer] = useState(null);
  const [showCorrect, setShowCorrect] = useState(false);
  const [answered, setAnswered] = useState(false);
  const [soundEnabled, setSoundEnabled] = useState(true);
  
  // Sound refs
  const correctSound = useRef(null);
  const wrongSound = useRef(null);
  const tickSound = useRef(null);
  const clickSound = useRef(null);
  
  useEffect(() => {
    // Create simple sound effects using Web Audio API
    const createSound = (frequency, duration, type = 'sine') => {
      return () => {
        if (!soundEnabled) return;
        try {
          const audioContext = new (window.AudioContext || window.webkitAudioContext)();
          const oscillator = audioContext.createOscillator();
          const gainNode = audioContext.createGain();
          
          oscillator.connect(gainNode);
          gainNode.connect(audioContext.destination);
          
          oscillator.frequency.value = frequency;
          oscillator.type = type;
          
          gainNode.gain.setValueAtTime(0.3, audioContext.currentTime);
          gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + duration);
          
          oscillator.start(audioContext.currentTime);
          oscillator.stop(audioContext.currentTime + duration);
        } catch (e) {
          console.log('Audio not supported');
        }
      };
    };
    
    correctSound.current = createSound(800, 0.2, 'sine');
    wrongSound.current = createSound(200, 0.3, 'sawtooth');
    tickSound.current = createSound(600, 0.1, 'square');
    clickSound.current = createSound(400, 0.05, 'sine');
  }, [soundEnabled]);

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
      },
      {
        q: "Which electric vehicle company is run by Elon Musk?",
        options: ["Rivian", "Lucid", "Tesla", "Nio"],
        correct: 2
      },
      {
        q: "What popular video conferencing app saw massive growth during the pandemic?",
        options: ["Zoom", "Teams", "Meet", "Skype"],
        correct: 0
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
      },
      {
        q: "Which country left the European Union in 2020?",
        options: ["Norway", "Switzerland", "United Kingdom", "Iceland"],
        correct: 2
      },
      {
        q: "What major social media platform was banned in several countries in 2023?",
        options: ["Facebook", "TikTok", "Instagram", "Twitter"],
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
      },
      {
        q: "Which country assumed the G20 presidency in 2023?",
        options: ["Brazil", "India", "South Africa", "Indonesia"],
        correct: 1
      },
      {
        q: "What was the name of the AI chatbot released by Google in 2023?",
        options: ["Gemini", "Bard", "LaMDA", "PaLM"],
        correct: 1
      }
    ]
  };

  const timePerQuestion = {
    easy: 30,
    medium: 45,
    hard: 60
  };

  const playSound = (soundFunc) => {
    if (soundEnabled && soundFunc && soundFunc.current) {
      soundFunc.current();
    }
  };

  useEffect(() => {
    if (gameState === 'playing' && timeLeft > 0 && !answered) {
      if (timeLeft === 10) {
        playSound(tickSound);
      }
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else if (timeLeft === 0 && gameState === 'playing' && !answered) {
      handleTimeout();
    }
  }, [timeLeft, gameState, answered]);

  const startGame = (diff) => {
    playSound(clickSound);
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
    playSound(wrongSound);
    setTimeout(() => nextQuestion(), 2500);
  };

  const handleAnswer = (index) => {
    if (answered) return;
    
    playSound(clickSound);
    setSelectedAnswer(index);
    setAnswered(true);
    const isCorrect = index === questions[difficulty][currentQuestion].correct;
    
    if (isCorrect) {
      setScore(score + 1);
      playSound(correctSound);
      setTimeout(() => nextQuestion(), 1000);
    } else {
      setShowCorrect(true);
      playSound(wrongSound);
      setTimeout(() => nextQuestion(), 2500);
    }
  };

  const nextQuestion = () => {
    const totalQuestions = Math.min(questionCount, questions[difficulty].length);
    if (currentQuestion < totalQuestions - 1) {
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
        <div className="text-center max-w-2xl w-full">
          <h1 className="text-7xl sm:text-8xl md:text-9xl font-black text-yellow-400 mb-6 animate-bounce leading-tight" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif', textShadow: '4px 4px 0px rgba(0,0,0,0.3)'}}>
            QUIZZENT! 🧠
          </h1>
          <p className="text-2xl sm:text-3xl md:text-4xl text-yellow-300 mb-12 px-4" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
            Test Your Current Affairs Knowledge!
          </p>
          
          <div className="space-y-6 px-4">
            <button
              onClick={() => {
                playSound(clickSound);
                setGameState('settings');
              }}
              className="group w-full max-w-md mx-auto bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-black py-8 px-8 rounded-3xl text-3xl sm:text-4xl transform hover:scale-105 transition-all duration-200 shadow-2xl hover:shadow-yellow-400/50 flex items-center justify-center gap-3"
              style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
            >
              <Zap className="w-10 h-10" />
              START QUIZ! 🚀
            </button>

            <button
              onClick={() => {
                playSound(clickSound);
                setSoundEnabled(!soundEnabled);
              }}
              className="group w-full max-w-md mx-auto bg-purple-500 hover:bg-purple-600 text-yellow-300 font-black py-6 px-8 rounded-3xl text-2xl sm:text-3xl transform hover:scale-105 transition-all duration-200 shadow-2xl flex items-center justify-center gap-3"
              style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
            >
              {soundEnabled ? <Volume2 className="w-8 h-8" /> : <VolumeX className="w-8 h-8" />}
              Sound: {soundEnabled ? 'ON' : 'OFF'}
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Settings Screen
  if (gameState === 'settings') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full">
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-yellow-400 mb-8" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif', textShadow: '4px 4px 0px rgba(0,0,0,0.3)'}}>
            CHOOSE YOUR CHALLENGE! 💪
          </h1>

          {/* Question Count Selection */}
          <div className="mb-12 bg-white/10 backdrop-blur-sm rounded-3xl p-6">
            <h2 className="text-3xl sm:text-4xl font-black text-yellow-300 mb-6" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
              <List className="inline w-10 h-10 mb-1" /> Number of Questions
            </h2>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
              {[5, 8, 10, 15].map(count => (
                <button
                  key={count}
                  onClick={() => {
                    playSound(clickSound);
                    setQuestionCount(count);
                  }}
                  className={`${questionCount === count ? 'bg-yellow-400 scale-110' : 'bg-yellow-400/50'} hover:bg-yellow-400 text-purple-900 font-black py-6 px-6 rounded-2xl text-4xl sm:text-5xl transform hover:scale-110 transition-all duration-200 shadow-xl`}
                  style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
                >
                  {count}
                </button>
              ))}
            </div>
          </div>

          {/* Difficulty Selection */}
          <h2 className="text-3xl sm:text-4xl font-black text-yellow-300 mb-6" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
            <Brain className="inline w-10 h-10 mb-1" /> Select Difficulty
          </h2>
          <div className="space-y-6 px-4">
            <button
              onClick={() => startGame('easy')}
              className="group w-full max-w-md mx-auto bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-black py-8 px-8 rounded-3xl text-3xl sm:text-4xl transform hover:scale-110 transition-all duration-200 shadow-2xl hover:shadow-yellow-400/50"
              style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
            >
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Zap className="w-8 h-8 sm:w-10 sm:h-10" />
                EASY MODE
                <span className="text-xl sm:text-2xl">(30s per Q)</span>
              </div>
            </button>
            
            <button
              onClick={() => startGame('medium')}
              className="group w-full max-w-md mx-auto bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-black py-8 px-8 rounded-3xl text-3xl sm:text-4xl transform hover:scale-110 transition-all duration-200 shadow-2xl hover:shadow-yellow-400/50"
              style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
            >
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Brain className="w-8 h-8 sm:w-10 sm:h-10" />
                MEDIUM MODE
                <span className="text-xl sm:text-2xl">(45s per Q)</span>
              </div>
            </button>
            
            <button
              onClick={() => startGame('hard')}
              className="group w-full max-w-md mx-auto bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-black py-8 px-8 rounded-3xl text-3xl sm:text-4xl transform hover:scale-110 transition-all duration-200 shadow-2xl hover:shadow-yellow-400/50"
              style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
            >
              <div className="flex items-center justify-center gap-3 flex-wrap">
                <Rocket className="w-8 h-8 sm:w-10 sm:h-10" />
                HARD MODE
                <span className="text-xl sm:text-2xl">(60s per Q)</span>
              </div>
            </button>

            <button
              onClick={() => {
                playSound(clickSound);
                setGameState('menu');
              }}
              className="group w-full max-w-md mx-auto bg-purple-500 hover:bg-purple-600 text-yellow-300 font-black py-6 px-8 rounded-3xl text-2xl sm:text-3xl transform hover:scale-105 transition-all duration-200 shadow-2xl"
              style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
            >
              ← BACK
            </button>
          </div>
        </div>
      </div>
    );
  }

  // Game Screen
  if (gameState === 'playing') {
    const current = questions[difficulty][currentQuestion];
    const totalQuestions = Math.min(questionCount, questions[difficulty].length);
    
    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 p-3 sm:p-8">
        <div className="max-w-4xl mx-auto">
          {/* Header */}
          <div className="bg-yellow-400 rounded-3xl p-4 sm:p-6 mb-4 sm:mb-8 shadow-2xl">
            <div className="flex justify-between items-center flex-wrap gap-3">
              <div className="text-purple-900 font-black text-2xl sm:text-3xl" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
                Q {currentQuestion + 1}/{totalQuestions}
              </div>
              <div className="text-purple-900 font-black text-2xl sm:text-3xl" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
                Score: {score} 🏆
              </div>
              <div className={`flex items-center gap-2 text-purple-900 font-black text-3xl sm:text-4xl ${timeLeft <= 10 ? 'animate-pulse text-red-600' : ''}`} style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
                <Clock className="w-8 h-8 sm:w-10 sm:h-10" />
                {timeLeft}s
              </div>
            </div>
          </div>

          {/* Question */}
          <div className="bg-white rounded-3xl p-6 sm:p-8 mb-4 sm:mb-8 shadow-2xl transform hover:scale-105 transition-transform">
            <h2 className="text-2xl sm:text-3xl md:text-4xl font-black text-purple-900 text-center leading-tight" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
              {current.q}
            </h2>
          </div>

          {/* Answers */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
            {current.options.map((option, index) => (
              <button
                key={index}
                onClick={() => handleAnswer(index)}
                disabled={answered}
                className={`${getButtonStyle(index)} text-purple-900 font-black py-6 sm:py-8 px-4 sm:px-8 rounded-3xl text-2xl sm:text-3xl transform transition-all duration-200 shadow-2xl disabled:cursor-not-allowed break-words`}
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
    const totalQuestions = Math.min(questionCount, questions[difficulty].length);
    const percentage = Math.round((score / totalQuestions) * 100);
    const getMessage = () => {
      if (percentage === 100) return "PERFECT SCORE! You're a GENIUS! 🧠✨";
      if (percentage >= 80) return "AMAZING! You're super smart! 🌟";
      if (percentage >= 60) return "GREAT JOB! Keep it up! 🎉";
      if (percentage >= 40) return "NOT BAD! Practice makes perfect! 💪";
      return "Keep learning! You got this! 📚";
    };

    return (
      <div className="min-h-screen bg-gradient-to-br from-purple-600 via-purple-700 to-purple-900 flex items-center justify-center p-4">
        <div className="text-center max-w-2xl w-full">
          <Trophy className="w-28 h-28 sm:w-32 sm:h-32 text-yellow-400 mx-auto mb-8 animate-bounce" />
          <h1 className="text-6xl sm:text-7xl md:text-8xl font-black text-yellow-400 mb-6 leading-tight" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif', textShadow: '4px 4px 0px rgba(0,0,0,0.3)'}}>
            QUIZ COMPLETE!
          </h1>
          
          <div className="bg-white rounded-3xl p-10 sm:p-12 mb-8 shadow-2xl">
            <div className="text-6xl sm:text-7xl font-black text-purple-900 mb-4" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
              {score}/{totalQuestions}
            </div>
            <div className="text-4xl sm:text-5xl font-black text-purple-700 mb-4" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
              {percentage}% 🎯
            </div>
            <div className="text-2xl sm:text-3xl font-bold text-purple-600 px-4" style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}>
              {getMessage()}
            </div>
          </div>

          <button
            onClick={() => {
              playSound(clickSound);
              resetGame();
            }}
            className="w-full max-w-md mx-auto bg-yellow-400 hover:bg-yellow-500 text-purple-900 font-black py-8 px-8 rounded-3xl text-3xl sm:text-4xl transform hover:scale-110 transition-all duration-200 shadow-2xl hover:shadow-yellow-400/50"
            style={{fontFamily: 'Comic Sans MS, cursive, sans-serif'}}
          >
            PLAY AGAIN! 🔄
          </button>
        </div>
      </div>
    );
  }
}

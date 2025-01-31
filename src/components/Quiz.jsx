import { useState, useEffect } from 'react'
import './css/quiz.css'
import quizData from '../quiz.json'
// import correctSound from '../assets/correct.mp3'
// import wrongSound from '../assets/wrong.mp3'

function Quiz() {
    const [currentQuestion, setCurrentQuestion] = useState(0)
    const [questions, setQuestions] = useState([])
    const [score, setScore] = useState(0)
    const [timer, setTimer] = useState(30)
    const [showResults, setShowResults] = useState(false)
    const [showStart, setShowStart] = useState(true)
    const [streak, setStreak] = useState(0)
    const [highScore, setHighScore] = useState(localStorage.getItem('highScore') || 0)
    const [difficulty, setDifficulty] = useState('normal')
    const [achievements, setAchievements] = useState([])
    const [combo, setCombo] = useState(0)

    useEffect(() => {
        const formattedQuestions = quizData.questions.map(q => ({
            question: q.description,
            answerChoices: q.options,
            correctAnswer: q.options.filter(option => option.is_correct)[0].description
        }))
        setQuestions(formattedQuestions)
    }, [])
       
    useEffect(() => {
        const interval = setInterval(() => {
            setTimer((prev) => prev - 1)
        }, 1000)

        if (timer === 0) {
            handleNextQuestion()
        }

        return () => clearInterval(interval)
    }, [timer])

    const handleNextQuestion = () => {
        const nextQuestion = currentQuestion + 1
        if (nextQuestion < questions.length) {
            setCurrentQuestion(nextQuestion)
            setTimer(30)
        } else {
            setShowResults(true)
        }
    }

    const handleAnswerClick = (answer) => {
        const correct = answer === questions[currentQuestion].correctAnswer
        // const audio = new Audio(correct ? correctSound : wrongSound)
        // audio.play()

        if (correct) {
            // Calculate points based on time and difficulty
            let points = timer > 20 ? 3 : timer > 10 ? 2 : 1
            points *= difficulty === 'hard' ? 2 : 1
            
            // Add combo bonus
            setCombo(prev => prev + 1)
            if (combo >= 3) points *= 2

            setScore(prev => prev + points)
            setStreak(prev => prev + 1)

            // Check achievements
            if (streak === 4) {
                setAchievements(prev => [...prev, 'Hot Streak!'])
            }
        } else {
            setCombo(0)
            setStreak(0)
        }

        // Update high score
        if (score > highScore) {
            setHighScore(score)
            localStorage.setItem('highScore', score)
        }

        handleNextQuestion()
    }

    if (showStart) {
        return (
            <div className="start-screen">
                <h1>Quiz Challenge</h1>
                <p>Test your knowledge with our interactive quiz! You'll have 30 seconds per question.</p>
                <button className="start-button" onClick={() => setShowStart(false)}>
                    Start Quiz
                </button>
            </div>
        )
    }

    if (showResults) {
        return (
            <div className="quiz-container results">
                <h2>Quiz Complete!</h2>
                <p>Your Score: {score}</p>
                <button onClick={() => window.location.reload()}>Restart Quiz</button>
            </div>
        )
    }

    return (
        <div className="quiz-container">
            <div className="game-header">
                <div className="stats">
                    <div className="high-score">High Score: {highScore}</div>
                    <div className="streak">Streak: {streak} 🔥</div>
                    <div className="combo">Combo: x{combo}</div>
                </div>
                <div className="difficulty-selector">
                    <button 
                        className={`diff-btn ${difficulty === 'normal' ? 'active' : ''}`}
                        onClick={() => setDifficulty('normal')}
                    >
                        Normal
                    </button>
                    <button 
                        className={`diff-btn ${difficulty === 'hard' ? 'active' : ''}`}
                        onClick={() => setDifficulty('hard')}
                    >
                        Hard
                    </button>
                </div>
            </div>
            <div className="quiz-header">
                <div className="timer-container">
                    <div className="timer-bar" style={{width: `${(timer/30) * 100}%`}}></div>
                    <span>Time: {timer}s</span>
                </div>
                <div className="score">Score: {score}</div>
            </div>
            
            <div className="question-card">
                <div className="question-number">
                    Question {currentQuestion + 1}/{questions.length}
                </div>
                <h3>{questions[currentQuestion]?.question}</h3>
                <div className="answer-grid">
                    {questions[currentQuestion]?.answerChoices.map((answer, index) => (
                        <button 
                            key={index}
                            className="answer-button"
                            onClick={() => handleAnswerClick(answer.description)}
                        >
                            {answer.description}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    )
}

export default Quiz
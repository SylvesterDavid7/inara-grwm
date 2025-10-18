import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useUserDataContext } from '../../contexts/UserDataContext';
import Icon from '../../components/AppIcon';
import Button from '../../components/ui/Button';

const QUIZ_ID = 'skincare-basics';

const questions = [
    {
        question: "What is the most important step in a morning skincare routine?",
        options: ["Cleansing", "Toning", "Applying sunscreen", "Moisturizing"],
        answer: 2,
        points: 10
    },
    {
        question: "What does 'non-comedogenic' mean?",
        options: ["All-natural ingredients", "Won't clog pores", "Fragrance-free", "Contains antioxidants"],
        answer: 1,
        points: 10
    },
    {
        question: "How often should you typically exfoliate your skin?",
        options: ["Every day", "1-3 times a week", "Once a month", "Only in the winter"],
        answer: 1,
        points: 10
    }
];

const SkincareBasicsQuiz = () => {
    const { userData, updateUserData } = useUserDataContext();
    const navigate = useNavigate();
    const [currentQuestionIndex, setCurrentQuestionIndex] = useState(0);
    const [selectedOption, setSelectedOption] = useState(null);
    const [isAnswered, setIsAnswered] = useState(false);
    const [quizCompleted, setQuizCompleted] = useState(false);
    
    const [localScore, setLocalScore] = useState(0);
    const [localCorrectAnswers, setLocalCorrectAnswers] = useState(0);

    const handleFinishQuiz = async () => {
        const isPerfectScore = localCorrectAnswers === questions.length;

        await updateUserData({
            points: (userData.points || 0) + localScore,
            completedQuizzes: [...(userData.completedQuizzes || []), QUIZ_ID],
            stats: {
                ...userData.stats,
                highestScore: Math.max(userData.stats?.highestScore || 0, localScore),
                quizzesTaken: (userData.stats?.quizzesTaken || 0) + 1,
                correctAnswers: (userData.stats?.correctAnswers || 0) + localCorrectAnswers,
                winStreak: isPerfectScore ? (userData.stats?.winStreak || 0) + 1 : userData.stats?.winStreak || 0,
            }
        });
        setQuizCompleted(true);
    };

    const handleAnswer = (optionIndex) => {
        if (isAnswered) return;

        setSelectedOption(optionIndex);
        setIsAnswered(true);

        const isCorrect = optionIndex === questions[currentQuestionIndex].answer;
        if (isCorrect) {
            setLocalScore(s => s + questions[currentQuestionIndex].points);
            setLocalCorrectAnswers(c => c + 1);
        }

        setTimeout(() => {
            if (currentQuestionIndex < questions.length - 1) {
                setCurrentQuestionIndex(prev => prev + 1);
                setSelectedOption(null);
                setIsAnswered(false);
            } else {
                handleFinishQuiz();
            }
        }, 1500);
    };
    
    if (!userData) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
                 <h1 className="text-2xl font-bold text-foreground">Loading...</h1>
                 <p className="text-muted-foreground">Please wait while we load the quiz.</p>
            </div>
        );
    }

    if (userData.completedQuizzes?.includes(QUIZ_ID)) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
                <Icon name="CheckCircle" size={64} className="text-green-500 mb-4" />
                <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Already Taken</h1>
                <p className="text-xl text-muted-foreground mb-6">
                    You have already completed this quiz.
                </p>
                <Button onClick={() => navigate('/profile')}>
                    Back to Profile
                </Button>
            </div>
        );
    }

    if (quizCompleted) {
        return (
            <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4 text-center">
                <Icon name="PartyPopper" size={64} className="text-primary mb-4" />
                <h1 className="text-3xl font-bold text-foreground mb-2">Quiz Completed!</h1>
                <p className="text-xl text-muted-foreground mb-6">
                    You scored {localScore} out of {questions.reduce((acc, q) => acc + q.points, 0)} points!
                </p>
                <Button onClick={() => navigate('/profile')}>
                    Back to Profile
                </Button>
            </div>
        );
    }
    
    const currentQuestion = questions[currentQuestionIndex];

    return (
        <div className="flex flex-col items-center justify-center min-h-screen bg-background p-4">
            <div className="w-full max-w-2xl bg-card p-8 rounded-2xl shadow-lg">
                <p className="text-sm font-semibold text-primary mb-2">
                    Question {currentQuestionIndex + 1} of {questions.length}
                </p>
                <h2 className="text-2xl font-bold text-foreground mb-6">{currentQuestion.question}</h2>

                <div className="space-y-4">
                    {currentQuestion.options.map((option, index) => {
                        let buttonClass = "w-full p-4 text-left font-medium rounded-lg border transition-all duration-300";
                        if (isAnswered) {
                            if (index === currentQuestion.answer) {
                                buttonClass += " bg-green-500 border-green-500 text-white";
                            } else if (index === selectedOption) {
                                buttonClass += " bg-red-500 border-red-500 text-white";
                            } else {
                                buttonClass += " border-border";
                            }
                        } else {
                            buttonClass += " border-border hover:bg-muted";
                        }
                        
                        return (
                            <button 
                                key={index} 
                                onClick={() => handleAnswer(index)}
                                disabled={isAnswered}
                                className={buttonClass}
                            >
                                {option}
                            </button>
                        );
                    })}
                </div>
            </div>
        </div>
    );
};

export default SkincareBasicsQuiz;

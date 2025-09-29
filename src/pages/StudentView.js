import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import styles from './StudentView.module.css';
import Chat from '../components/Chat';

const StudentView = () => {
    const [poll, setPoll] = useState(null);
    const [results, setResults] = useState(null);
    const [submitted, setSubmitted] = useState(false);
    const [selectedAnswer, setSelectedAnswer] = useState(null); // track student's chosen answer
    const [timer, setTimer] = useState(0);
    const location = useLocation();
    const navigate = useNavigate();
    const name = location.state?.name;

    useEffect(() => {
        if (!name) {
            navigate('/join');
        }
        socket.emit('get_participants');


        socket.on('poll_started', (currentPoll) => {
            setResults(null);
            setPoll(currentPoll);
            setSubmitted(false);
            setSelectedAnswer(null);
            setTimer(currentPoll.timeLimit);
        });

        socket.on('timer_update', (timeLeft) => {
            setTimer(timeLeft);
        });

        socket.on('poll_ended', (finalResults) => {
            setPoll(null);
            setResults(finalResults); // includes correct answers
        });
        
        socket.on('kicked', () => {
            alert('You have been removed from the session by the teacher.');
            navigate('/');
        });

        return () => {
            socket.off('poll_started');
            socket.off('timer_update');
            socket.off('poll_ended');
            socket.off('kicked');
        };
    }, [name, navigate]);

    const handleAnswerSubmit = (answer) => {
        socket.emit('submit_answer', answer.text);
        setSubmitted(true);
        setSelectedAnswer(answer.text);
    };

    const renderPoll = () => (
        <div className={styles.pollContainer}>
            <div className={styles.pollHeader}>
                <h2>Question 1</h2>
                <div className={styles.timer}>⏳ {timer}s</div>
            </div>
            <h3>{poll.question}</h3>
            <div className={styles.options}>
                {poll.options.map((option, index) => (
                    <button
                        key={index}
                        className={styles.optionButton}
                        onClick={() => handleAnswerSubmit(option)}
                        disabled={submitted} // prevent multiple clicks
                    >
                        {option.text}
                    </button>
                ))}
            </div>
        </div>
    );
    
    const renderResults = () => (
        <div className={styles.pollContainer}>
            <h2>Question 1</h2>
            <h3>{results.question}</h3>
            <div className={styles.options}>
                {results.options.map((option, index) => {
                    // ✅ apply colors based on student's choice and correctness
                    let extraClass = '';
                    if (option.text === selectedAnswer) {
                        extraClass = option.correct ? styles.correctAnswer : styles.wrongAnswer;
                    } else if (option.correct) {
                        extraClass = styles.correctAnswer; // show correct one for everyone
                    }

                    return (
                        <div
                            key={index}
                            className={`${styles.resultBarContainer} ${extraClass}`}
                        >
                            <span>{option.text}</span>
                            <div className={styles.resultBar}>
                                <div
                                    className={styles.resultFill}
                                    style={{ width: `${results.results[option.text]}%` }}
                                ></div>
                            </div>
                            <span>{results.results[option.text]}%</span>
                        </div>
                    );
                })}
            </div>
            <p className={styles.waitText}>Wait for the teacher to ask a new question..</p>
        </div>
    );

    const renderWaiting = () => (
        <div className={styles.waitingContainer}>
            <div className={styles.brand}>✨ Intervue Poll</div>
            <div className={styles.loader}></div>
            <h2>Wait for the teacher to ask questions..</h2>
        </div>
    );

    return (
        <div className={styles.container}>
            {submitted && !results && <p className={styles.waitText}>You've submitted! Waiting for results...</p>}
            {!poll && !results && renderWaiting()}
            {poll && !submitted && renderPoll()}
            {results && renderResults()}
            <Chat name={name} />
        </div>
    );
};

export default StudentView;

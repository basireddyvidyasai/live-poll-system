import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import styles from './PollHistory.module.css';

const PollHistory = () => {
    const [history, setHistory] = useState([]);
    const navigate = useNavigate();

    useEffect(() => {
        socket.emit('get_poll_history');

        socket.on('poll_history', (pollHistory) => {
            // ✅ Merge new polls with existing, avoiding duplicates
            setHistory((prev) => {
                const combined = [...prev, ...pollHistory];

                // remove duplicates if same question appears again
                const unique = combined.filter(
                    (poll, index, self) =>
                        index === self.findIndex((p) => p.question === poll.question)
                );

                // sort so latest appears first (assuming poll has `timestamp`)
                return unique.sort((a, b) => (b.timestamp || 0) - (a.timestamp || 0));
            });
        });

        return () => {
            socket.off('poll_history');
        };
    }, []);

    return (
        <div className={styles.container}>
            <button
                onClick={() => navigate('/teacher')}
                className={styles.backButton}
            >
                &larr; Back to Dashboard
            </button>

            <h1>Poll History</h1>

            {history.length === 0 ? (
                <p>No poll history found.</p>
            ) : (
                history.map((poll, pollIndex) => (
                    <div key={pollIndex} className={styles.pollContainer}>
                        <h2>Question {history.length - pollIndex}</h2>
                        <h3>{poll.question}</h3>
                        <div className={styles.options}>
                            {poll.options.map((option, index) => (
                                <div key={index} className={styles.resultBarContainer}>
                                    <span>{option.text}</span>
                                    <div className={styles.resultBar}>
                                        <div
                                            className={styles.resultFill}
                                            style={{
                                                width: `${poll.results[option.text] || 0}%`,
                                            }}
                                        ></div>
                                    </div>
                                    <span>{poll.results[option.text] || 0}%</span>
                                </div>
                            ))}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};

export default PollHistory;

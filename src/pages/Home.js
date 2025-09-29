import React from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import styles from './Home.module.css';

const Home = () => {
    const navigate = useNavigate();

    const selectRole = (role) => {
        socket.emit('select_role', role);
        socket.on('role_confirmed', (confirmedRole) => {
            if (confirmedRole === 'teacher') {
                navigate('/teacher');
            } else {
                navigate('/join');
            }
        });
        socket.on('teacher_exists', () => {
            alert('A teacher is already in the session. Please join as a student.');
        });
    };

    return (
        <div className={styles.container}>
            <div className={styles.brand}>✨ Intervue Poll</div>
            <h1>Welcome to the Live Polling System</h1>
            <p>Please select the role that best describes you to begin.</p>
            <div className={styles.roleContainer}>
                <div className={styles.roleCard} onClick={() => selectRole('student')}>
                    <h2>I'm a Student</h2>
                    <p>Submit answers, participate in live polls, and see how your responses compare.</p>
                </div>
                <div className={styles.roleCard} onClick={() => selectRole('teacher')}>
                    <h2>I'm a Teacher</h2>
                    <p>Submit answers and view live poll results in real-time.</p>
                </div>
            </div>
        </div>
    );
};

export default Home;
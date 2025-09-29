import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { socket } from '../socket';
import styles from './StudentJoin.module.css';

const StudentJoin = () => {
    const [name, setName] = useState('');
    const navigate = useNavigate();

    const handleSubmit = (e) => {
        e.preventDefault();
        if (name.trim()) {
            socket.emit('join_student', name.trim());
            navigate('/student', { state: { name: name.trim() } });
        }
    };

    return (
        <div className={styles.container}>
            <div className={styles.brand}>✨ Intervue Poll</div>
            <div className={styles.formContainer}>
                <h2>Let's Get Started</h2>
                <p>If you're a student, you'll be able to submit your answers and participate in live polls.</p>
                <form onSubmit={handleSubmit}>
                    <label>Enter your Name</label>
                    <input
                        type="text"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="Enter your Name"
                        required
                    />
                    <button type="submit">Continue</button>
                </form>
            </div>
        </div>
    );
};

export default StudentJoin;
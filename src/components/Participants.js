// client/components/Participants.js

import React, { useState, useEffect } from 'react';
import { socket } from '../socket';
import styles from './Participants.module.css';

const Participants = () => {
    const [participants, setParticipants] = useState([]);

   useEffect(() => {
    // Ask server for current participants when component mounts
    socket.emit('get_participants');

    // Listen for updates
    socket.on('update_participants', (users) => {
        console.log('Received updated participants list:', users);
        setParticipants(users);
    });

    return () => {
        socket.off('update_participants');
    };
}, []);


    const kickStudent = (name) => {
        if (window.confirm(`Are you sure you want to kick ${name}?`)) {
            socket.emit('kick_student', name);
        }
    };

    return (
        <div className={styles.panel}>
            <div className={styles.tabs}>
                 <button className={styles.active}>
                    Participants ({participants.filter(p => p.role === 'student').length})
                </button>
            </div>
            <div className={styles.content}>
                {/* It filters out the teacher and maps over the students to display names */}
                {participants
                    .filter(p => p.role === 'student')
                    .map((p, i) => (
                        <div key={i} className={styles.participant}>
                            <span>{p.name}</span>
                            <button onClick={() => kickStudent(p.name)} className={styles.kickButton}>
                                Kick out
                            </button>
                        </div>
                ))}
            </div>
        </div>
    );
};

export default Participants;
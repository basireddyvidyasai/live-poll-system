import React, { useState, useEffect, useRef } from 'react';
import { socket } from '../socket';
import styles from './Chat.module.css';

const Chat = ({ name }) => {
    const [isOpen, setIsOpen] = useState(false);
    const [messages, setMessages] = useState([]);
    const [currentMessage, setCurrentMessage] = useState('');
    const messagesEndRef = useRef(null);

    const scrollToBottom = () => {
        messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
    };

    useEffect(scrollToBottom, [messages]);

    useEffect(() => {
        socket.on('receive_message', (data) => {
            setMessages((list) => [...list, data]);
        });
        return () => socket.off('receive_message');
    }, []);

    const sendMessage = (e) => {
        e.preventDefault();
        if (currentMessage.trim() !== '') {
            const messageData = {
                author: name,
                message: currentMessage,
            };
            socket.emit('send_message', messageData);
            setCurrentMessage('');
        }
    };

    return (
        <>
            <button className={styles.chatToggleButton} onClick={() => setIsOpen(!isOpen)}>💬</button>
            {isOpen && (
                <div className={styles.chatWindow}>
                    <div className={styles.chatHeader}>Chat</div>
                    <div className={styles.chatBody}>
                        {messages.map((msg, index) => (
                            <div key={index} className={`${styles.message} ${name === msg.author ? styles.ownMessage : ''}`}>
                                <strong>{msg.author}:</strong> {msg.message}
                            </div>
                        ))}
                        <div ref={messagesEndRef} />
                    </div>
                    <form className={styles.chatFooter} onSubmit={sendMessage}>
                        <input
                            type="text"
                            value={currentMessage}
                            onChange={(e) => setCurrentMessage(e.target.value)}
                            placeholder="Hey there..."
                        />
                        <button type="submit">Send</button>
                    </form>
                </div>
            )}
        </>
    );
};

export default Chat;
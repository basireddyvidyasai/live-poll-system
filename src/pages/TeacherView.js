import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { socket } from '../socket';
import styles from './TeacherView.module.css';
import Chat from '../components/Chat';
import Participants from '../components/Participants';

const TeacherView = () => {
  const [question, setQuestion] = useState('');
  const [options, setOptions] = useState([{ text: '', correct: false }, { text: '', correct: false }]);
  const [timeLimit, setTimeLimit] = useState(60);
  const [pollResults, setPollResults] = useState(null);

  useEffect(() => {
    socket.on('update_results', (results) => {
      setPollResults(results);
    });

    socket.on('poll_ended', (finalResults) => {
      setPollResults(finalResults);
    });

    return () => {
      socket.off('update_results');
      socket.off('poll_ended');
    };
  }, []);

  const handleOptionChange = (index, value) => {
    const newOptions = [...options];
    newOptions[index].text = value;
    setOptions(newOptions);
  };

  const toggleCorrectAnswer = (index) => {
    const newOptions = options.map((opt, i) =>
      i === index ? { ...opt, correct: !opt.correct } : opt
    );
    setOptions(newOptions);
  };

  const addOption = () => {
    setOptions([...options, { text: '', correct: false }]);
  };

  const askQuestion = (e) => {
    e.preventDefault();
    const pollData = {
      question,
      options: options.filter(opt => opt.text.trim() !== ''),
      timeLimit,
    };
    socket.emit('ask_question', pollData);
    setPollResults({ ...pollData, results: {} });
  };

  const askNewQuestion = () => {
    setPollResults(null);
    setQuestion('');
    setOptions([{ text: '', correct: false }, { text: '', correct: false }]);
  };

  return (
    <div className={styles.container}>
      <Link to="/teacher/history" className={styles.historyButton}>View Poll History</Link>

      {pollResults ? (
        <div className={styles.pollContainer}>
          <h3>{pollResults.question}</h3>
          <div className={styles.options}>
            {pollResults.options.map((option, index) => (
              <div
                key={index}
                className={`${styles.resultBarContainer} ${option.correct ? styles.correctAnswer : ''}`}
              >
                <span>{index + 1}. {option.text}</span>
                <div className={styles.resultBar}>
                  <div
                    className={styles.resultFill}
                    style={{ width: `${pollResults.results[option.text] || 0}%` }}
                  ></div>
                </div>
                <span>{pollResults.results[option.text] || 0}%</span>
              </div>
            ))}
          </div>
          <button onClick={askNewQuestion} className={styles.newQuestionBtn}>
            + Ask a new question
          </button>
        </div>
      ) : (
        <form className={styles.form} onSubmit={askQuestion}>
          <h2>Let's Get Started</h2>
          <div className={styles.questionSection}>
            <label>Enter your question</label>
            <div className={styles.timeSelect}>
              <select value={timeLimit} onChange={(e) => setTimeLimit(Number(e.target.value))}>
                <option value={15}>15 seconds</option>
                <option value={30}>30 seconds</option>
                <option value={60}>60 seconds</option>
                <option value={120}>120 seconds</option>
              </select>
            </div>
            <textarea
              value={question}
              onChange={(e) => setQuestion(e.target.value)}
              placeholder="e.g., Ask The Question?"
              required
            />
          </div>

          <div className={styles.optionsSection}>
            <label>Edit Options</label>
            {options.map((option, index) => (
              <div key={index} className={styles.optionInput}>
                <input
                  type="text"
                  value={option.text}
                  onChange={(e) => handleOptionChange(index, e.target.value)}
                  placeholder={`Option ${index + 1}`}
                  required
                />
                <input
                  type="checkbox"
                  checked={option.correct}
                  onChange={() => toggleCorrectAnswer(index)}
                  className={styles.correctCheckbox}
                />
              </div>
            ))}
            <button type="button" onClick={addOption} className={styles.addOptionBtn}>
              + Add More option
            </button>
          </div>
          <button type="submit" className={styles.askButton}>Ask Question</button>
        </form>
      )}

      {/* ✅ Always visible side panels */}
      <div className={styles.sidePanels}>
        <Chat name="Teacher" />
        <Participants />
      </div>
    </div>
  );
};

export default TeacherView;

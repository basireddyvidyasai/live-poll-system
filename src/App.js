import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import Home from './pages/Home';
import StudentJoin from './pages/StudentJoin';
import StudentView from './pages/StudentView';
import TeacherView from './pages/TeacherView';
import PollHistory from './pages/PollHistory';

function App() {
  return (
    
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/join" element={<StudentJoin />} />
        <Route path="/student" element={<StudentView />} />
        <Route path="/teacher" element={<TeacherView />} />
        <Route path="/teacher/history" element={<PollHistory />} />
      </Routes>
    
  );
}

export default App;
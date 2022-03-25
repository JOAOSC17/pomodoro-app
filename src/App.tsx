import React from 'react';
import './App.css';
import { PomodoroTimer } from './components/pomodoro-timer';

function App() : JSX.Element  {
  return (
    <div className="App">
      <PomodoroTimer 
      pomodoroTime={1500}
      shortRestTime={300}
      longRestTime={600}
      cycles={4}
      />
    </div>
  );
}
export default App;

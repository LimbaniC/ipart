import logo from './logo.svg';
import './App.css';
import Task from './components/Task/Task';
import TaskList from './components/Task/TaskList';

function App() {
  return (
    <div className="App">
      <div className="app-container">
        <Task/>
        <TaskList/>
      </div>
    </div>
  );
}

export default App;

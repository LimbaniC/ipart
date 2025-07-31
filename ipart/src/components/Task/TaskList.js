import React, { useState, useEffect } from 'react';
import './task-form.css';

function TaskList() {
  const [tasks, setTasks] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchTasks = async () => {
    try {
      setLoading(true);
      setError('');
      
      console.log('Fetching tasks from: http://localhost:3001/task');
      const response = await fetch('http://localhost:3001/task');

      console.log('Response status:', response.status);
      console.log('Response ok:', response.ok);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log('Fetched tasks:', data);
      setTasks(data);
    } catch (err) {
      console.error('Error fetching tasks:', err);
      console.error('Error details:', {
        message: err.message,
        stack: err.stack
      });
      setError(`Failed to load tasks: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const toggleCompleted = async (taskId, currentCompleted) => {
    try {
      const task = tasks.find(t => t.id === taskId);
      if (!task) return;

      const response = await fetch('http://localhost:3001/task', {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...task,
          completed: !currentCompleted
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the task list to reflect the changes
      await fetchTasks();
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task. Please try again.');
    }
  };

  const toggleTimer = async (taskId, action) => {
    try {
      const response = await fetch(`http://localhost:3001/task/${taskId}/timer`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ action })
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      // Refresh the task list to reflect the changes
      await fetchTasks();
    } catch (err) {
      console.error('Error toggling timer:', err);
      setError('Failed to toggle timer. Please try again.');
    }
  };

  useEffect(() => {
    console.log('TaskList component mounted, fetching tasks...');
    fetchTasks();
  }, []);

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString();
  };

  const formatTimeSpent = (hours) => {
    if (hours === 0) return '0h';
    const wholeHours = Math.floor(hours);
    const minutes = Math.round((hours - wholeHours) * 60);
    return minutes > 0 ? `${wholeHours}h ${minutes}m` : `${wholeHours}h`;
  };

  // Filter out completed and archived tasks - only show pending, non-archived tasks
  const pendingTasks = tasks.filter(task => !task.completed && !task.archived);

  if (loading) {
    return (
      <div className="task-container">
        <h2>Task List</h2>
        <div className="loading-message">Loading tasks...</div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="task-container">
        <h2>Task List</h2>
        <div className="error-message">{error}</div>
        <button onClick={fetchTasks} className="retry-button">Retry</button>
      </div>
    );
  }

  return (
    <div className="task-container">
      <h2>Task List</h2>
      
      {pendingTasks.length === 0 ? (
        <div className="no-tasks-message">
          No pending tasks found. Create your first task above!
        </div>
      ) : (
        <div className="tasks-grid">
          {pendingTasks.map((task) => (
            <div key={task.id} className="task-card">
              <div className="task-header">
                <div className="task-header-left">
                  <span className="task-id">#{task.id}</span>
                  <span className="completion-status pending">
                    ○ Pending
                  </span>
                </div>
                <span className="task-date">{formatDate(task.date)}</span>
              </div>
              
              <div className="task-content">
                <div className="task-field">
                  <strong>Identity:</strong> {task.identity}
                </div>
                <div className="task-field">
                  <strong>Problem:</strong> {task.problem}
                </div>
                <div className="task-field">
                  <strong>Action:</strong> {task.action}
                </div>
                <div className="task-field">
                  <strong>Result:</strong> {task.result}
                </div>
                <div className="task-field">
                  <strong>Time Spent:</strong> {formatTimeSpent(task.timeSpent)}
                </div>
              </div>

              <div className="task-actions">
                <button 
                  onClick={() => toggleCompleted(task.id, task.completed)}
                  className="toggle-completed-btn pending"
                >
                  Mark as Completed
                </button>
                <button 
                  onClick={() => toggleTimer(task.id, task.started ? 'stop' : 'start')}
                  className={`timer-btn ${task.started ? 'stop' : 'start'}`}
                >
                  {task.started ? 'Stop Timer' : 'Start Timer'}
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
      
      <button onClick={fetchTasks} className="refresh-button">
        Refresh Tasks
      </button>
    </div>
  );
}

export default TaskList; 
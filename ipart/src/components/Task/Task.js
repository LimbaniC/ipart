import React, { useState } from 'react';
import './task-form.css';

function Task() {
  const [form, setForm] = useState({
    identity: '',
    problem: '',
    action: '',
    result: '',
    date: new Date().toISOString().slice(0, 10), // Default to current date (YYYY-MM-DD)
    timeSpent: 0,
    started: false,
    completed: false,
    archived: false
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setForm({ 
      ...form, 
      [name]: type === 'checkbox' ? checked : value 
    });
    // Clear any previous messages when user starts typing
    setError('');
    setSuccess('');
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    setSuccess('');

    try {
      const response = await fetch('http://localhost:3001/task', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          ...form,
          date: new Date(form.date).toISOString() // Convert to ISO string for backend
        }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const result = await response.json();
      console.log('Task created successfully:', result);
      
      setSuccess('Task created successfully!');
      
      // Clear form after successful submission
      setForm({
        identity: '',
        problem: '',
        action: '',
        result: '',
        date: new Date().toISOString().slice(0, 10),
        timeSpent: 0,
        started: false,
        completed: false,
        archived: false
      });

    } catch (err) {
      console.error('Error creating task:', err);
      setError('Failed to create task. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="task-container">
      <h2>Create New Task</h2>
      
      {error && (
        <div className="error-message">
          {error}
        </div>
      )}
      
      {success && (
        <div className="success-message">
          {success}
        </div>
      )}

      <form className="task-form" onSubmit={handleSubmit}>
        <label>
          Identity:
          <input
            type="text"
            name="identity"
            value={form.identity}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="Who you are being in this task"
          />
        </label>
        
        <label>
          Problem:
          <input
            type="text"
            name="problem"
            value={form.problem}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="What challenge you're addressing"
          />
        </label>
        
        <label>
          Action:
          <input
            type="text"
            name="action"
            value={form.action}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="What you're doing to solve it"
          />
        </label>
        
        <label>
          Result:
          <input
            type="text"
            name="result"
            value={form.result}
            onChange={handleChange}
            required
            disabled={loading}
            placeholder="What outcome you achieved"
          />
        </label>
        
        <label>
          Date:
          <input
            type="date"
            name="date"
            value={form.date}
            onChange={handleChange}
            required
            disabled={loading}
          />
        </label>

        
        <button type="submit" disabled={loading}>
          {loading ? 'Creating Task...' : 'Submit Task'}
        </button>
      </form>
    </div>
  );
}

export default Task;

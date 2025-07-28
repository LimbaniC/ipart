import React, { useState } from 'react';
import './task-form.css';

function Task({ onSubmit }) {
  const [form, setForm] = useState({
    identity: '',
    problem: '',
    action: '',
    result: '',
    time: ''
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (onSubmit) onSubmit(form);
    // Optionally clear form after submit:
    setForm({
      identity: '',
      problem: '',
      action: '',
      result: '',
      time: ''
    });
  };

  return (
    <form className="task-form" onSubmit={handleSubmit}>
      <label>
        Identity:
        <input
          type="text"
          name="identity"
          value={form.identity}
          onChange={handleChange}
          required
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
        />
      </label>
      <label>
        Time:
        <input
          type="text"
          name="time"
          value={form.time}
          onChange={handleChange}
          required
        />
      </label>
      <button type="submit">Submit Task</button>
    </form>
  );
}

export default Task;

// src/components/TaskForm.jsx
import React, { useState } from 'react';
import axios from 'axios';

const TaskForm = ({ token, onTaskCreated }) => {
  const [title, setTitle] = useState('');
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        'http://localhost:3000/api/tasks/',
        { title },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      setTitle('');
      onTaskCreated(); // Notify parent to refresh task list
    } catch (err) {
      console.error(err);
      setError('Failed to create task');
    }
  };

  return (
    <div>
      <h3>Add New Task</h3>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Task title"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          required
        />
        <button type="submit">Create Task</button>
      </form>
    </div>
  );
};

export default TaskForm;

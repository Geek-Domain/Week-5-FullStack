import React, { useEffect, useState } from 'react';
import axios from 'axios';

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(true);

  const fetchTasks = () => {
    axios
      .get('http://localhost:3000/api/tasks', {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        setTasks(res.data);
        setLoading(false);
      })
      .catch((err) => {
        setError('Failed to fetch tasks');
        setLoading(false);
        console.error(err);
      });
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const toggleTask = async (id, currentStatus) => {
    try {
      await axios.put(
        `http://localhost:3000/api/tasks/${id}`,
        { completed: !currentStatus },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );
      fetchTasks(); // Refresh list
    } catch (err) {
      console.error('Error updating task:', err);
      setError('Failed to update task');
    }
  };

  if (loading) return <p>Loading tasks...</p>;

  return (
    <div>
      <h2>Your Tasks</h2>
      {error && <p style={{ color: 'red' }}>{error}</p>}
      {tasks.length === 0 ? (
        <p>No tasks yet.</p>
      ) : (
        <ul>
          {tasks.map((task) => (
            <li
              key={task.id}
              style={{ cursor: 'pointer', color: task.completed ? 'green' : 'black' }}
              onClick={() => toggleTask(task.id, task.completed)}
            >
              {task.completed ? '✅' : '⬜'} {task.title}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default TaskList;

// src/components/TaskList.jsx
import React, { useEffect, useState } from "react";
import axios from "axios";

const API_URL = "http://localhost:3000/api/tasks";

const TaskList = ({ token }) => {
  const [tasks, setTasks] = useState([]);
  const [filter, setFilter] = useState("all"); // all | active | completed
  const [newTitle, setNewTitle] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editingTitle, setEditingTitle] = useState("");
  const [error, setError] = useState("");

  const authHeader = () => ({ headers: { Authorization: `Bearer ${token}` } });

  const fetchTasks = async () => {
    try {
      const res = await axios.get(API_URL, authHeader());
      setTasks(res.data);
    } catch (err) {
      console.error(err);
      setError("Failed to fetch tasks");
    }
  };

  useEffect(() => {
    fetchTasks();
  }, [token]);

  const createTask = async (e) => {
    e.preventDefault();
    if (!newTitle.trim()) return;
    try {
      await axios.post(API_URL, { title: newTitle }, authHeader());
      setNewTitle("");
      fetchTasks();
    } catch {
      setError("Failed to create task");
    }
  };

  const toggleTask = async (task) => {
    try {
      await axios.put(
        `${API_URL}/${task.id}`,
        { completed: !task.completed },
        authHeader()
      );
      setTasks((prev) =>
        prev.map((t) =>
          t.id === task.id ? { ...t, completed: !t.completed } : t
        )
      );
    } catch {
      setError("Failed to toggle task");
    }
  };

  const startEdit = (task) => {
    setEditingId(task.id);
    setEditingTitle(task.title);
  };

  const saveEdit = async (id) => {
    if (!editingTitle.trim()) return;
    try {
      await axios.put(`${API_URL}/${id}`, { title: editingTitle }, authHeader());
      setEditingId(null);
      setTasks((prev) =>
        prev.map((t) => (t.id === id ? { ...t, title: editingTitle } : t))
      );
    } catch {
      setError("Failed to edit task");
    }
  };

  const cancelEdit = () => {
    setEditingId(null);
    setEditingTitle("");
  };

  const deleteTask = async (id) => {
    try {
      await axios.delete(`${API_URL}/${id}`, authHeader());
      setTasks((prev) => prev.filter((t) => t.id !== id));
    } catch {
      setError("Failed to delete task");
    }
  };

  // Apply filter
  const filteredTasks = tasks.filter((t) => {
    if (filter === "active") return !t.completed;
    if (filter === "completed") return t.completed;
    return true;
  });

  return (
    <div>
      <h2>Your Tasks</h2>
      {error && <p style={{ color: "red" }}>{error}</p>}

      {/* Create Form */}
      <form onSubmit={createTask} style={{ marginBottom: "1rem" }}>
        <input
          type="text"
          placeholder="New task title"
          value={newTitle}
          onChange={(e) => setNewTitle(e.target.value)}
          required
        />
        <button type="submit">Add</button>
      </form>

      {/* Filter Controls */}
      <div style={{ marginBottom: "1rem" }}>
        {["all", "active", "completed"].map((f) => (
          <button
            key={f}
            onClick={() => setFilter(f)}
            style={{
              marginRight: "0.5rem",
              fontWeight: filter === f ? "bold" : "normal",
            }}
          >
            {f.charAt(0).toUpperCase() + f.slice(1)}
          </button>
        ))}
      </div>

      {/* Task List */}
      <ul style={{ listStyle: "none", padding: 0 }}>
        {filteredTasks.map((task) => (
          <li
            key={task.id}
            style={{
              display: "flex",
              alignItems: "center",
              marginBottom: "0.5rem",
            }}
          >
            <input
              type="checkbox"
              checked={task.completed}
              onChange={() => toggleTask(task)}
            />

            {editingId === task.id ? (
              <input
                type="text"
                value={editingTitle}
                onChange={(e) => setEditingTitle(e.target.value)}
                style={{ flexGrow: 1, margin: "0 0.5rem" }}
              />
            ) : (
              <span
                onDoubleClick={() => startEdit(task)}
                style={{
                  flexGrow: 1,
                  margin: "0 0.5rem",
                  textDecoration: task.completed ? "line-through" : "none",
                  cursor: "pointer",
                }}
              >
                {task.title}
              </span>
            )}

            {editingId === task.id ? (
              <>
                <button onClick={() => saveEdit(task.id)}>Save</button>
                <button onClick={cancelEdit}>Cancel</button>
              </>
            ) : (
              <button onClick={() => startEdit(task)}>Edit</button>
            )}

            <button
              onClick={() => deleteTask(task.id)}
              style={{
                marginLeft: "0.5rem",
                background: "crimson",
                color: "white",
              }}
            >
              Delete
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default TaskList;

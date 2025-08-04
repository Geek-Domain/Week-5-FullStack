import React, { useContext, useState } from "react";
import LoginForm from "./components/LoginForm";
import TaskList from "./components/TaskList";
import TaskForm from "./components/TaskForm";
import { AuthProvider, AuthContext } from "./context/AuthContext";
import { ThemeProvider, ThemeContext } from "./context/ThemeContext";

function AppContent() {
  const { auth, logout } = useContext(AuthContext);
  const { theme, toggleTheme } = useContext(ThemeContext);
  const [refresh, setRefresh] = useState(false);

  const handleTaskCreated = () => {
    setRefresh((prev) => !prev); // trigger refresh
  };

  return (
    <div className={`App ${theme}`}>
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
        <h1>Uptick Task Manager</h1>
        <div>
          <button onClick={toggleTheme} style={{ marginRight: "10px" }}>
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
          {auth && (
            <button onClick={logout}>
              Logout
            </button>
          )}
        </div>
      </div>
      {auth ? (
        <>
          <TaskForm token={auth.token} onTaskCreated={handleTaskCreated} />
          <TaskList token={auth.token} key={refresh} />
        </>
      ) : (
        <LoginForm />
      )}
    </div>
  );
}

function App() {
  return (
    <AuthProvider>
      <ThemeProvider>
        <AppContent />
      </ThemeProvider>
    </AuthProvider>
  );
}

export default App;

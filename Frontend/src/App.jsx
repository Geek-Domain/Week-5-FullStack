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
    <div className="min-h-screen bg-white text-gray-900 dark:bg-gray-900 dark:text-white p-4">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Uptick Task Manager</h1>
        <div className="flex gap-2">
          <button
            onClick={toggleTheme}
            className="px-4 py-2 bg-gray-200 text-gray-800 dark:bg-gray-700 dark:text-white rounded"
          >
            Switch to {theme === "light" ? "Dark" : "Light"} Mode
          </button>
          {auth && (
            <button
              onClick={logout}
              className="px-4 py-2 bg-red-500 text-white rounded"
            >
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

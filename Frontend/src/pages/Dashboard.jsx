import { useContext } from "react"
import { AuthContext } from "../context/AuthContext"

export default function Dashboard() {
  const { user, logout } = useContext(AuthContext)

  return (
    <div style={{ padding: "20px" }}>
      <h2>Welcome, {user?.name || "User"}!</h2>
      <p>Email: {user?.email}</p>
      <button onClick={logout}>Logout</button>
    </div>
  )
}

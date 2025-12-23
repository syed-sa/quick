import React from "react"
import ReactDOM from "react-dom/client"
import { BrowserRouter } from "react-router-dom" // <-- Import this
import "./index.css"
import App from "./App"
import { AuthProvider } from "./context/AuthContext" // <-- Import AuthProvider

const root = ReactDOM.createRoot(document.getElementById("root"))
root.render(
  <React.StrictMode>
    <BrowserRouter> {/* <-- Wrap App with this */}
       <AuthProvider><App /></AuthProvider>
    </BrowserRouter>
  </React.StrictMode>
)

import React, { useState } from "react"
import "./styles/Login.css";
import { Link } from "react-router-dom";

function Login() {
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    return (
        <div className="login-container">
            <form className="login-form">
                <h2>Sign in</h2>
                <label>Email </label>
                <input type="email" placeholder="Enter email" value={email} onChange={(e)=> setEmail(e.target.value)}/><br/>
                <label>Password </label>
                <input type="password" placeholder="Enter password" value={password} onChange={(e)=> setPassword(e.target.value)}/><br/>
                <button type="submit">Login</button>
                <p className="signup-text">No account? <Link to="/SignUp">Create new one
                </Link></p>
            </form>
        </div>
    )
}

export default Login;
import React, { useState } from "react"
import { Link } from "react-router-dom";
import "./styles/Signup.css";

function Signup() {
    const [name,setName]=useState("")
    const [email,setEmail]=useState("")
    const [password,setPassword]=useState("")

    return (
        <div className="signup-container">
            <form className="signup-form">
                <h2>Sign up</h2>
                <label>Name</label>
                <input type="text" placeholder="Enter name" value={name} onChange={(e)=> setName(e.target.value)}/><br/>
                <label>Email </label>
                <input type="email" placeholder="Enter email" value={email} onChange={(e)=> setEmail(e.target.value)}/><br/>
                <label>Password </label>
                <input type="password" placeholder="Enter password" value={password} onChange={(e)=> setPassword(e.target.value)}/><br/>
                <button type="submit">Sign Up</button>
                <p className="signin-text"> ← Back to <Link to="/">Login
                </Link></p>
            </form>
        </div>
    )
}

export default Signup;
import React, { useState } from "react"
import "./styles/Login.css";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";

const API_URL='http://127.0.0.1:5000';
function Login() {
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [message,setMessage]=useState("");
    const navigate=useNavigate();

    const handleSubmit=async(e) =>{
        e.preventDefault();
        if(!email || !password){
            setMessage('Email and Password are required!');
            return;
        }
        try{
            const res=await fetch(`${API_URL}/login`,{
                method: 'POST',
                headers: {'Content-Type': 'application/json'},
                body: JSON.stringify({email,password})
            });
            const data=await res.json();
            if(res.ok){
                localStorage.setItem("token",data.token);
                console.log("Token:",data.token);
                setMessage("Login Successful");
                setEmail('');
                setPassword('');
                navigate("/contact")  
            }
            else{
                setMessage(data.error || data.message || "Login Failed");
            }
        }
        catch(error){
            setMessage('Failed to connect server');
        }
    }

    return (
        <div className="login-container">
            <form className="login-form" onSubmit={handleSubmit}>
                <h2>Sign in</h2>
                <label>Email </label>
                <input type="email" placeholder="Enter email" value={email} onChange={(e)=> setEmail(e.target.value)}/><br/>
                <label>Password </label>
                <input type="password" placeholder="Enter password" value={password} onChange={(e)=> setPassword(e.target.value)}/><br/>
                <button type="submit">Login</button>
                <p className="signup-text">No account? <Link to="/SignUp">Create new one
                </Link></p>
            </form>
            {message && <p className="message">{message}</p>}
        </div>
    )
}

export default Login;
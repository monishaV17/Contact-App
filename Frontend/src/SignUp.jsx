import React, { useState } from "react"
import { Link } from "react-router-dom";
import "./styles/Signup.css";

const API_URL='http://127.0.0.1:5000';

function Signup() {
    const [name,setName]=useState("");
    const [email,setEmail]=useState("");
    const [password,setPassword]=useState("");
    const [message,setMessage]=useState("");

    const handleSubmit=async (e)=>{
        e.preventDefault();
        if(!name || !email || !password){
            setMessage('All Fields are required!');
            return;
        }
        try{
            const res=await fetch(`${API_URL}/signup`,{
                method: 'POST',
                headers: {'Content-Type':'application/json'},
                body: JSON.stringify({name,email,password})
            });
            const data=await res.json();
            if(res.ok){
                setMessage(data.mesaage ||"Sign up successful");
                setName('');
                setEmail('');
                setPassword('');
            }
            else{
                setMessage(data.error || data.message || "Signup failed");
            }
        }
        catch(error){
            console.error("Signup fetch error:", error);
            setMessage('Failed to connect server');
        }
    }

    return (
        <div className="signup-container">
            <form className="signup-form" onSubmit={handleSubmit}>
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
            {message && <p className="message">{message}</p>}
        </div>
    )
}

export default Signup;
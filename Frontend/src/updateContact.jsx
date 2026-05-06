import React, { useState } from "react";
import "./styles/contact.css";
import { useNavigate } from "react-router-dom";

const API_URL="http://127.0.0.1:5000";
function UpdateContacts(){
  const [name,setName]=useState("");
  const [phone_no,setPhone_number]=useState("");
  const [email,setEmail]=useState("");
  const [location,setLocation]=useState("");
  const [message,setMessage]=useState("");
  const navigate=useNavigate();

  const handleSubmit=async (e)=>{
    e.preventDeafault();
    if(!name || !phone_no || !email || !location){
      setMessage('All fields are required');
      return;
    }
    try{
      const res=await fetch(`${API_URL}/updateContact`,{
        method: 'POST',
        headers: {'Content-Type': 'application/json'},
        body: JSON.stringify({name,phone_no,email,location})
      });
      const data=await res.json();
      if(res.ok){
        setMessage('contact updated');
        setName('');
        setPhone_number('');
        setEmail('');
        setLocation('')
      }
      else{
        setMessage(data.error || data.message || "update failed");
      }
    }
    catch(error){
      setMessage('Failed to connect server');
    }
  };

  return (
    <div className="contact-container">
      <form className="contactDetail-form" onSubmit={handleSubmit}>
        <h2>Edit</h2>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="name">Name:</label>
            <input id="name" type="text" placeholder="Enter name" value={name} onChange={(e) => setName(e.target.value)}/>
          </div>
            <div className="form-group">
            <label htmlFor="phone">Phone Number:</label>
             <input id="phone" type="tel" placeholder="Enter phone number" value={phone_no} onChange={(e) => setPhone_number(e.target.value)}/>
          </div>
        </div>
        <div className="form-row">
          <div className="form-group">
            <label htmlFor="email">Email:</label>
            <input id="email" type="email" placeholder="Enter email" value={email} onChange={(e) => setEmail(e.target.value)}/>
          </div>
        <div className="form-group">
            <label htmlFor="location">Location:</label>
            <input id="location" type="text" placeholder="Enter location" value={location} onChange={(e) => setLocation(e.target.value)}/>
          </div>
        </div>
        <div className="btn-row">
          <button className="create-btn" type="submit">Save</button>
           <button type="button" onClick={() => navigate("/Contact")} className="back-btn">Back to Contacts</button>
        </div>
      </form>
      {message && <p className="message">{message}</p>}
    </div>
  );
}

export default UpdateContacts;
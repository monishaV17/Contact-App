import "./styles/ContactDetail.css";
import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

const API_URL="http://127.0.0.1:5000";

function ContactShow(){
    const [search,setSearch]=useState("");
    const [contacts,setContacts]=useState("");
    const [message,setMessage]=useState("");
    const navigate=useNavigate();

    useEffect(()=>{fetchContacts();},[]);

    const fetchContacts= async () =>{
        const token=localStorage.getItem("token");
    try{
        const res=await fetch(`${API_URL}/getContact`,{
            headers: {Authorization: `Bearer ${token}`}
    });
        const data=await res.json();
        if(res.ok){
            setContacts(data.contacts || []);
        }
        else{
            setMessage(data?.message || "Failed to fetch contacts");
        }
    }
    catch(error){
        setMessage("Failed to connect server");
    }
    }
    const displayContacts=search.trim() ? 
        contacts.filter((contact)=>
            contact.name.toLowerCase().includes(search.toLowerCase())):contacts;
    return (
            <div className="container">
                <div className="top-bar">
                    <h2>All Contacts ({contacts.length})</h2>
                    <button className="logout-btn" type="button" onClick={() => navigate("/")}>⏻</button>
                </div>
                <div className="contact-search-wrapper">
                    <button className="add-btn" type="button" onClick={() => navigate("/contacts")}>+</button>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                        <input className="contact-search" type="text" placeholder="🔍 Search..." value={search} onChange={(e) => setSearch(e.target.value)}/>
                        <button className="search-btn" type="submit">Search</button>
                    </form>
                </div>
                {message && <p className="message">{message}</p>}
                <div className="table">
                    <table>
                        <thead>
                            <tr>
                                <th>Name</th>
                                <th>Mobile Number</th>
                                <th>Email</th>
                                <th>Location</th>
                                <th>Created at</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>
                            {displayContacts.length>0 ? (displayContacts.map((contact)=>(
                            <tr key={contact.id}>
                                <td>{contact.name}</td>
                                <td>{contact.phone_no}</td>
                                <td>{contact.email}</td>
                                <td>{contact.location}</td>
                                <td>{contact.created_at}</td>
                                <td className="action">
                                <button className="edit-btn" type="button" onClick={() => navigate("/update")}>✎</button>
                                <button className="delete-btn" type="button">🗑</button>
                                </td>
                            </tr>
                            ))):
                            (
                                <tr>
                                 <td colSpan="6">No contacts found</td>
                                </tr>
                            )
                        }
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

export default ContactShow;
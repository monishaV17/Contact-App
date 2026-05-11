import "./styles/ContactDetail.css";
import React, { useEffect, useState, useCallback} from "react";
import { useNavigate} from "react-router-dom";

const API_URL="http://127.0.0.1:5000";

function ContactShow(){
    const [search,setSearch]=useState("");
    const [contacts,setContacts]=useState("");
    const [message,setMessage]=useState("");
    const navigate=useNavigate();

    const showMessage=(text) => {
            setMessage(text);
            setTimeout(() => {
            setMessage("");
    }, 1000);
};

    const fetchContacts=useCallback(async() =>{
        const token=localStorage.getItem("token");
        console.log(token);
    try{
        const res=await fetch(`${API_URL}/getContact`,{
            headers: {Authorization: `Bearer ${token}`}
    });
        const data=await res.json();
        if(res.ok){
            setContacts(data.contacts || []);
        }
        else{
            showMessage(data.message || "Failed to fetch contacts");
        }
    }
    catch(error){
        showMessage("Failed to connect server");
    }
    },[]);
useEffect(()=>{
    fetchContacts();
},[fetchContacts]);

    async function handleDelete(contactId){
        const token=localStorage.getItem("token");
        try {
            const res=await fetch(`${API_URL}/deleteContact/${contactId}`, {
                method: 'DELETE',
                headers: { Authorization: `Bearer ${token}` }
            });
            const data=await res.json();
            if (res.ok) {
                showMessage("Contact deleted successfully");
                setContacts((prev) => prev.filter((contact) => contact.id !== contactId));
            }
            else {
                showMessage(data.error || "Can't be delete");
            }
        }
        catch (error) {
            showMessage("Failed to connect server");
        }
    }
    const displayContacts=search.trim() ? 
        contacts.filter((contact)=>
            contact.name.toLowerCase().includes(search.toLowerCase())):contacts;
    async function handleLogout(){
        const token=localStorage.getItem("token");
        try{
            await fetch(`${API_URL}/logout`,{
                method: 'POST',
                headers: {Authorization: `Bearer ${token}`}
            });
        }
        catch(error){
            console.log(error);
        }
        finally{
            localStorage.removeItem("token");
            navigate("/");
            showMessage("Successfully logged out");
            console.log("logged out");
        }
    }
    return (
            <div className="container">
                <div className="top-bar">
                    <h2>All Contacts ({contacts.length})</h2>
                    <button className="logout-btn" type="button" onClick={() => handleLogout()}>⏻</button>
                </div>
                <div className="contact-search-wrapper">
                    <button className="add-btn" type="button" onClick={() => navigate("/contacts")}>+</button>
                    <form onSubmit={(e) => {
                        e.preventDefault();
                    }}>
                        <input className="contact-search" type="text" placeholder="🔍 Search..." value={search} onChange={(e) => setSearch(e.target.value)}/>
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
                                <td>{contact.email || "-"}</td>
                                <td>{contact.location || "-"}</td>
                                <td>{contact.created_at}</td>
                                <td className="action">
                                <button className="edit-btn" type="button" onClick={() => navigate(`/update/${contact.id}`)}>✎</button>
                                <button className="delete-btn" type="button" onClick={()=>handleDelete(contact.id)}>🗑</button>
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
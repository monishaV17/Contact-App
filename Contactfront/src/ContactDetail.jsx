import "./styles/ContactDetail.css";
import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
function ContactShow(){
    const [search,setSearch]=useState("");
    const navigate=useNavigate();
    return (
            <div className="container">
                <div className="top-bar">
                    <h2>Contacts</h2>
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
                            <tr>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td></td>
                                <td className="action">
                                <button className="edit-btn" type="button" onClick={() => navigate("/update")}>✎</button>
                                <button className="delete-btn" type="button">🗑</button>
                                </td>
                            </tr>
                        </tbody>
                    </table>
                </div>
            </div>
        );
    }

export default ContactShow;
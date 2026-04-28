import './App.css';
import { Routes, Route } from 'react-router-dom';
import Login from './Login';
import SignUp from './SignUp';
import Contacts from './Contacts';
import ContactDetail from './ContactDetail';
import UpdateContacts from './updateContact';

function App() {
  return (
    <Routes>
      <Route path="/" element={<Login/>} />
      <Route path="/signup" element={<SignUp/>} />
      <Route path="/contacts" element={<Contacts/>} />
      <Route path="/Contact" element={<ContactDetail/>}/>
      <Route path="/update" element={<UpdateContacts/>}/>
    </Routes>
  );
}

export default App;
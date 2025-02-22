import "./App.css";
import Client from "./components/Client";
import Connexion from "./components/Connexion";
import Layout from "./components/Layout";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Virement from "./components/Virement";
import Dashboard from "./components/Dashboard";
import Profile from "./components/Profile";

function App() {

  const user = {
    name: 'John Doe',
    role: 'admin', // 'admin' ou 'gestionnaire'
    email: 'johndoe@example.com',
    profileImage: 'https://via.placeholder.com/150',
  };

  return (
    <Router>
      <Routes>
        <Route path="/connexion" element={<Connexion />} />
      <Route path="/" element={<Layout />} >
      <Route index element={<Dashboard />} /> 
      <Route path="dashboard" element={<Dashboard />} />
      <Route path="client" element={<Client />} />
      <Route path="virement" element={<Virement />} />
      <Route path="profile" element={<Profile user={user} />} />
      </Route>
      </Routes>
    </Router>
  );
}

export default App;

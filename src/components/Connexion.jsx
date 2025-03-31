import { useState } from "react";
import { Button, Input, Card, Typography, Alert } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";

export default function Connexion() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    
    try {
      const response = await fetch('http://localhost:3000/api/login', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ username, password }),
      });
      
      const data = await response.json();
      
      if (!response.ok) {
        throw new Error(data.message || 'Erreur de connexion');
      }
      
      // Store the token and user info in localStorage
      localStorage.setItem('token', data.token);
      localStorage.setItem('user', JSON.stringify(data.user));
      
      // Redirect based on user role
      if (data.user.role === 'admin') {
        navigate('/');
      } else {
        navigate('/');
      }
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Login Form */}
      <div className="w-1/2 flex items-center justify-center">
        <Card className="w-96 p-8">
          <Typography variant="h1" className="text-center mb-8">
            Bienvenue
          </Typography>
          
          {error && (
            <Alert color="red" className="mb-4">
              {error}
            </Alert>
          )}
          
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              type="text"
              label="Nom d'utilisateur"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button 
              type="submit" 
              className="mt-4" 
              fullWidth 
              disabled={loading}
            >
              {loading ? "Connexion en cours..." : "Connexion"}
            </Button>
          </form>
        </Card>
      </div>

      {/* Right side - Image */}
      <div className="w-1/2">
        <img
          src="https://images.unsplash.com/photo-1620714223084-8fcacc6dfd8d"
          alt="Login background"
          className="h-full object-cover"
        />
      </div>
    </div>
  );
}

import { useState } from "react";
import { Button, Input, Card, Typography } from "@material-tailwind/react";
import { useNavigate } from "react-router-dom";
export default function Connexion() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Email:", email, "Password:", password);
  };
  const navigate = useNavigate();
  const logout = () => {
    navigate("/");
  };

  return (
    <div className="flex h-screen">
      {/* Left side - Login Form */}
      <div className="w-1/2 flex items-center justify-center">
        <Card className="w-96 p-8">
          <Typography variant="h1" className="text-center mb-8">
            Bienvenue
          </Typography>
          <form onSubmit={handleSubmit} className="flex flex-col gap-6">
            <Input
              type="email"
              label="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
            <Input
              type="password"
              label="Mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <Button type="submit" className="mt-4" fullWidth onClick={logout}>
              Connexion
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

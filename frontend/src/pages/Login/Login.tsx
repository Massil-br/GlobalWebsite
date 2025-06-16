import React, { useState , useEffect} from "react";
import axios from "axios";
import { LoginRequest, LoginResponse, DecodedJwt, User } from "../types/api";
import styles from './Login.module.scss';
import  { jwtDecode } from "jwt-decode";
import { useNavigate } from "react-router-dom";

interface LoginProps {
  apiUrl: string;
  onLogin: (username: string) => void;
}

const Login: React.FC<LoginProps> = ({ apiUrl, onLogin }) => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage]= useState<string| null>(null)

  const navigate = useNavigate();

  useEffect(() => {
      if (success && message) {
        // Après 3 secondes, redirige vers /login
        const timer = setTimeout(() => {
          navigate("/");
        }, 3000);
  
        // Nettoyage du timer si le composant est démonté avant
        return () => clearTimeout(timer);
      }
    }, [success, message, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    setMessage(null);

    try {
      const loginRequest: LoginRequest = { email, password };
      const response = await axios.post<LoginResponse>(apiUrl, loginRequest, {
        headers: { "Content-Type": "application/json" },
      });

      const data = response.data;

      // Stocker le token brut
      localStorage.setItem("jwt_token", data.token);

      // Décoder le token pour obtenir les infos utilisateur
      const decoded: DecodedJwt = jwtDecode(data.token)

      const user: User = {
        user_id: decoded.user_id,
        username: decoded.username,
        email: decoded.email,
        role: decoded.role,
        created_at: decoded.created_at,
        updated_at: decoded.updated_at,
      };

      // Stocker l'objet user dans localStorage
      localStorage.setItem("user", JSON.stringify(user));

      setSuccess(true);
      setMessage("welcome " + user.username)

      // Appel du callback avec le nom d'utilisateur
      onLogin(user.username);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Invalid credentials");
      } else {
        setError("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.loginWrapper}>
      <form onSubmit={handleSubmit} className={styles.loginForm}>
        <h2>Login</h2>

        {error && <div className={styles.error}>{error}</div>}
        {success && message && <div className={styles.success}>{message}</div>}

        <label>Email</label>
        <input
          type="email"
          value={email}
          onChange={e => setEmail(e.target.value)}
          required
        />

        <label>Password</label>
        <input
          type="password"
          value={password}
          onChange={e => setPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Logging in..." : "Login"}
        </button>
      </form>
    </div>
  );
};

export default Login;

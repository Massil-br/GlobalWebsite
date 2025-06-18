import React, { useState, useEffect } from "react";
import axios  from 'axios';
import { useNavigate } from "react-router-dom";
import styles from './Register.module.scss';
import type { OkResponse, RegisterRequest } from "../utils/types";
import { GlobalVars } from "../utils/types";






const Register: React.FC = () => {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  const navigate = useNavigate();

  useEffect(() => {
    if (success && message) {
      // Après 3 secondes, redirige vers /login
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);

      // Nettoyage du timer si le composant est démonté avant
      return () => clearTimeout(timer);
    }
  }, [success, message, navigate]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setMessage(null);

    if (password !== confirmPassword) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);

    try {
      const registerData: RegisterRequest = { username, email, password, confirmPassword };
      const url = GlobalVars.apiUrl + '/register'
      const response = await axios.post<OkResponse>(url, registerData, {
        headers: { "Content-Type": "application/json" },
      });

      setSuccess(true);
      setMessage(response.data.message);
      setUsername("");
      setEmail("");
      setPassword("");
      setConfirmPassword("");
    } catch (err: unknown) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Something went wrong");
      } else {
        setError("Network error");
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.registerWrapper}>
      <form onSubmit={handleSubmit} className={styles.registerForm}>
        <h2>Register</h2>

        {error && <div className={styles.error}>{error}</div>}
        {success && message && <div className={styles.success}>{message}</div>}

        <label>Username</label>
        <input
          type="text"
          value={username}
          onChange={e => setUsername(e.target.value)}
          required
        />

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

        <label>Confirm Password</label>
        <input
          type="password"
          value={confirmPassword}
          onChange={e => setConfirmPassword(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>
      </form>
    </div>
  );
};

export default Register;

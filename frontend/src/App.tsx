import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import styles from './App.module.scss';
import Login from './pages/Login/Login';

function App() {
  const [user, setUser] = React.useState<string | null>(null);
  const navigate = useNavigate();
  const apiUrl = "http://localhost:8081/api";

  React.useEffect(() => {
    const token = localStorage.getItem('jwt_token');
    if (token) {
      setUser("MonUser"); // Tu pourras ici décoder ou requêter un vrai username
    }
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('jwt_token');
    setUser(null);
    navigate('/');
  };

  return (
    <div className={styles.appContainer}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <Link to="/" className={styles.navLink}>Home</Link>
        </div>

        <div className={styles.navRight}>
          {user ? (
            <>
              <span className={styles.userInfo}>Bienvenue {user}</span>
              <button onClick={handleLogout} className={styles.logoutButton}>Logout</button>
            </>
          ) : (
            <>
              <Link to="/login" className={styles.navLink}>Login</Link>
              <Link to="/register" className={styles.navLink}>Register</Link>
            </>
          )}
        </div>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/register" element={<Register apiUrl={`${apiUrl}/register`} />} />
        <Route path="/login" element={<Login apiUrl={`${apiUrl}/login`} onLogin={(username) => setUser(username)}/>}/>
      </Routes>
    </div>
  );
}

export default App;

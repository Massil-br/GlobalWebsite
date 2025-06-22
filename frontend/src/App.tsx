import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import styles from './App.module.scss';
import Login from './pages/Login/Login';
import Clicker from './pages/Clicker/Clicker'
import type { User } from './pages/utils/types';
import  getUserFromJwt  from './pages/utils/utilsfunc';




function App() {
  const [user, setUser] = React.useState<string | null>(null);
  const navigate = useNavigate();
  

  React.useEffect(() => {
  const savedUser = sessionStorage.getItem("user");
  if (savedUser) {
    const userObj: User = JSON.parse(savedUser);
    setUser(userObj.username);
  } else {
    const user: User | null = getUserFromJwt();
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
      setUser(user.username);
    }
  }
}, []);

  const handleLogout = () => {
    sessionStorage.removeItem('jwt_token');
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
              <span className={styles.userInfo}>{user}</span>
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
        <Route path="/register" element={<Register  />} />
        <Route path="/login" element={<Login  onLogin={(username) => setUser(username)}/>}/>
        <Route path="/clicker" element={<Clicker/>}></Route>
      </Routes>
    </div>
  );
}

export default App;

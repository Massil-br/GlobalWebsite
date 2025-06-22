import { Routes, Route, Link, useNavigate } from 'react-router-dom';
import React from 'react';
import Home from './pages/Home/Home';
import Register from './pages/Register/Register';
import styles from './App.module.scss';
import Login from './pages/Login/Login';
import Clicker from './pages/Clicker/Clicker'
import type { User } from './pages/utils/types';
import  getUserFromJwt  from './pages/utils/utilsfunc';
import CreateMonster from './pages/admin/CreateMonster/CreateMonster';
import MonsterModelsList from './pages/admin/MonsterModelsList/MonsterModelsList';




function App() {
  const [user, setUser] = React.useState<string | null>(null);
  const [userObj, setUserObj] = React.useState<User | null>(null);
  const navigate = useNavigate();
  const [isClickerDropdownOpen, setIsClickerDropdownOpen] = React.useState<boolean>(false);

  

 React.useEffect(() => {
  const savedUser = sessionStorage.getItem("user");
  if (savedUser) {
    const parsedUser: User = JSON.parse(savedUser);
    setUser(parsedUser.username);
    setUserObj(parsedUser);
  } else {
    const jwtUser: User | null = getUserFromJwt();
    if (jwtUser) {
      sessionStorage.setItem("user", JSON.stringify(jwtUser));
      setUser(jwtUser.username);
      setUserObj(jwtUser); // ✅ ici tu mettais setUserObj(userObj), ce qui est une erreur
    }
  }
}, []);

  const handleLogout = () => {
    sessionStorage.removeItem('jwt_token');
    setUser(null);
    setUserObj(null);
    navigate('/');
  };

  return (
    <div className={styles.appContainer}>
      <nav className={styles.navbar}>
        <div className={styles.navLeft}>
          <Link to="/" className={styles.navLink}>Home</Link>
        </div>

        {userObj?.role === "admin" && (
        <div className={styles.navMid}>
          <div
            className={styles.dropdown}
            onMouseEnter={() => setIsClickerDropdownOpen(true)}
            onMouseLeave={() => setIsClickerDropdownOpen(false)}
          >
            <button className={styles.dropdownToggle}>
              Clicker
            </button>
            {isClickerDropdownOpen && (
              <div className={styles.dropdownMenu}>
                <Link to="/admin/clicker/createMonster">Create Monster</Link>
                <Link to="/admin/clicker/getMonsterModels">Monster Models List</Link>
              </div>
            )}
          </div>
        </div>
      )}
        

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
        <Route path="/admin/clicker/createMonster" element={<CreateMonster/>}></Route>
        <Route path="/admin/clicker/getMonsterModels" element={<MonsterModelsList/>}></Route>
        
      </Routes>
    </div>
  );
}

export default App;

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
import RequireAdmin from './pages/utils/RequireAdmin';
import CreateClickerAlly from './pages/admin/CreateAllyModel/CreateAlly';
import ClickerAllyModelList from './pages/admin/AllyModelList/ClickerAllyModelList';




function App() {
  const [user, setUser] = React.useState<User | null>(null);
  
  const navigate = useNavigate();
  const [isClickerDropdownOpen, setIsClickerDropdownOpen] = React.useState<boolean>(false);

  

 React.useEffect(() => {
  const savedUser = sessionStorage.getItem("user");
  if (savedUser) {
    const parsedUser: User = JSON.parse(savedUser);
    setUser(parsedUser);
  } else {
    const jwtUser: User | null = getUserFromJwt();
    if (jwtUser) {
      sessionStorage.setItem("user", JSON.stringify(jwtUser));
      setUser(jwtUser);
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

        {user?.role === "admin" && (
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
                <Link to="/admin/clicker/createMonster">Create Monster Model</Link>
                <Link to="/admin/clicker/getMonsterModels">Monster Models List</Link>
                <Link to="/admin/clicker/createAllyModel">Create Ally Model</Link>
                <Link to="/admin/clicker/getClickerAllyModels">Allies Models List</Link>
              </div>
            )}
          </div>
        </div>
      )}
        

        <div className={styles.navRight}>
          {user ? (
            <>
              <span className={styles.userInfo}>{user.username}</span>
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
        <Route path="/login" element={<Login  onLogin={(user) => setUser(user)}/>}/>
        <Route path="/clicker" element={<Clicker/>}></Route>

        <Route path="/admin/clicker/createMonster" element={
          <RequireAdmin user={user}>
            <CreateMonster/>
          </RequireAdmin> 
          }></Route>

        <Route path="/admin/clicker/getMonsterModels" element={
          <RequireAdmin user={user}>
            <MonsterModelsList/>
          </RequireAdmin>
          }></Route>

        <Route path="/admin/clicker/getClickerAllyModels" element={
          <RequireAdmin user={user}>
            <ClickerAllyModelList/>
          </RequireAdmin>
          }></Route>

          <Route path="/admin/clicker/createAllyModel" element={
          <RequireAdmin user={user}>
            <CreateClickerAlly/>
          </RequireAdmin>
          }></Route>

        
      </Routes>
    </div>
  );
}

export default App;

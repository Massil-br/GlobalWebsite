import axios, { AxiosError } from "axios";
import { useEffect, useState, useCallback } from "react";
import type { ClickerGameSave, ClickerGameStats, Monster, User } from "../utils/types";
import { GlobalVars } from "../utils/types";
import styles from './Clicker.module.scss';
import { getUserFromJwt } from "../utils/utilsfunc";
import { enemiesList, playerSprites } from "../utils/ressourceLoader";
import { useNavigate } from "react-router-dom";


function Clicker() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clickerGameSave, setClickerGameSave] = useState<ClickerGameSave | null>(null);
  const [clickerGameStats, setClickerGameStats] = useState<ClickerGameStats | null>(null);
  const [monsterHp, setMonsterHp]= useState<number>(0);
  const url = GlobalVars.apiUrl;
  const navigate = useNavigate();
  
  const redirectToLogin = useCallback((res:AxiosError) =>{
  if (res.response?.status ===401 ) {
    const timer = setTimeout(() => {
      
      navigate("/login");
    }, 3000);
    return () => clearTimeout(timer);
  }
},[navigate]);


  //récupérationd de save
  const fetchSave = useCallback(async () => {
    try {
      const saveResponse = await axios.get(url + '/clicker/getClickerSave', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      });
      setClickerGameSave(saveResponse.data);

      const statsResponse = await axios.get(url + '/clicker/getClickerStats', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      });
      setClickerGameStats(statsResponse.data);

    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Erreur API");
        redirectToLogin(err);
      } else {
        setError("Network error");
      }
    }
  }, [url,redirectToLogin]); 

  //envoit comme quoi on a clické au backend
  const click = async () => {
    try {
      await axios.put(
        url + '/clicker/click',
        {},
        {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
          },
        }
      );

      await fetchSave();

    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Invalid credentials");
        redirectToLogin(err);
      } else {
        setError("Network error");
      }
    }

    getMonster();
  };


  const getMonster =useCallback(async () =>{
    try{
      const res = await axios.get<Monster>(url + '/clicker/getMonster',{
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
      },});

      setMonsterHp(Math.floor(res.data.hp))

    }catch(err : any){
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.message || "Invalid credentials");
      }else{
        setError("Network error");
      }
    }
  },[url])




  //récupère les données initiales
  useEffect(() => {
    const storedUser = getUserFromJwt();
    setUser(storedUser);
    getMonster();
    fetchSave();
  }, [fetchSave, getMonster]);

 

  return (
    <div className={styles.clickerPage}>
      <div className={styles.error}>{error ? error : " "}</div>
      <div className={styles.gameLayout}>
        <div className={styles.playerInfo}>
          <div>
            <h2>Infos joueur</h2>
            <ul>
              <li>Username : {user?.username}</li>
              <li>Golds : {clickerGameSave ? Math.floor(clickerGameSave.golds) : "not found"}</li>
              <li>Level : {clickerGameSave?.level}</li>
              <li>Step : {clickerGameSave?.step}</li>
              <li>Click Level : {clickerGameSave?.clickLevel}</li>
              <li>Click Damage : {clickerGameSave?.clickDamage}</li>
              <li>Grok Level : {clickerGameSave?.autoHuntGrokLevel}</li>
              <li>Grok DPS : {clickerGameSave?.autoHuntGrokDps}</li>
            </ul>
          </div>
          <div>
            <h2>Stats</h2>
            <ul>
              <li>Total Golds Earned : {clickerGameStats ? Math.floor(clickerGameStats?.totalGoldsEarned) : "not found"}</li>
              <li>Total Clicks : {clickerGameStats?.totalClicks}</li>
              <li>Total Played Time: {clickerGameStats?.totalPlayedTime}</li>
            </ul>
          </div>
        </div>
        <div className={styles.gameArea}>
          <h2>Jeu</h2>
          <button className={styles.clicker} onClick={click}> {/* <- ici tu avais oublié d'appeler la fonction */}
            <img className={styles.enemy} src={enemiesList?.[0]?.sprites?.[0]} alt={enemiesList?.[0]?.name || "enemy"} />
            <img className={styles.player} src={playerSprites?.sprites?.[0]} alt="player" />
            <p>HP : {monsterHp}</p>
          </button>
        </div>
        <div className={styles.shop}>Shop</div>
      </div>
    </div>
  );
}

export default Clicker;

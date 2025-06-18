import axios from "axios";
import { useEffect, useState } from "react";
import type { ClickerGameSave, ClickerGameStats, User } from "../utils/types";
import { GlobalVars } from "../utils/types";
import styles from './Clicker.module.scss';
import { getUserFromJwt } from "../utils/utilsfunc";
import { enemiesList, playerSprites} from "../utils/ressourceLoader";

function Clicker() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clickerGameSave, setClickerGameSave] = useState<ClickerGameSave | null>(null);
  const [clickerGameStats, setClickerGameStats] = useState<ClickerGameStats | null>(null);
  const [clicks, setClicks] = useState<number>(0);

  useEffect(() => {
    const storedUser = getUserFromJwt();
    setUser(storedUser);

    const fetchSave = async () => {
      try {
        const url = GlobalVars.apiUrl;
        const saveResponse = await axios.get(url + '/getClickerSave', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });
        setClickerGameSave(saveResponse.data);

        const statsResponse = await axios.get(url + '/getClickerStats', {
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
          },
        });
        setClickerGameStats(statsResponse.data);

      } catch (err: any) {
        if (axios.isAxiosError(err)) {
          setError(err.response?.data.message || "Erreur API");
        } else {
          setError("Network error");
        }
      }
    };

    fetchSave();

    


  }, []);

  return (
    <div className={styles.clickerPage}>
      <div className={styles.error}>{error ? error : " "}</div>
      <div className={styles.gameLayout}>
        <div className={styles.playerInfo}>
          <div>
            <h2>Infos joueur</h2>
            <ul>
              <li>Username : {user?.username}</li>
              <li>Golds : {clickerGameSave?.golds}</li>
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
              <li>Total Golds Earned : {clickerGameStats?.totalGoldsEarned}</li>
              <li>Total Clicks : {clickerGameStats?.totalClicks}</li>
              <li>Total Played Time: {clickerGameStats?.totalPlayedTime}</li>
            </ul>
          </div>
        </div>
        <div className={styles.gameArea}>
          <h2>Jeu</h2>
          <button className={styles.clicker} onClick={() => setClicks(clicks + 1)}>
          <img className={styles.enemy} src={enemiesList?.[0]?.sprites?.[0]} alt={enemiesList?.[0]?.name || "enemy"} />
          <img className={styles.player} src={playerSprites?.sprites?.[0]} alt="player"></img>
          </button>
        </div>
        <div className={styles.shop}>Shop</div>
      </div>
    </div>
  );
}

export default Clicker;

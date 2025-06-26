import axios, { AxiosError } from "axios";
import { useEffect, useState, useCallback } from "react";
import type { ClickerGameSave, ClickerGameStats, Monster, Shop, UpgradeReq, User } from "../utils/types";
import { GlobalVars } from "../utils/types";
import styles from './Clicker.module.scss';
import { formatDuration, getUserFromJwt } from "../utils/utilsfunc";
import { enemiesList, playerSprites } from "../utils/ressourceLoader";
import { useNavigate } from "react-router-dom";
import { useClearErrorEvery3s } from "../utils/RequireAdmin";

function Clicker() {
  const [user, setUser] = useState<User | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [clickerGameSave, setClickerGameSave] = useState<ClickerGameSave | null>(null);
  const [clickerGameStats, setClickerGameStats] = useState<ClickerGameStats | null>(null);
  const [monsterHp, setMonsterHp] = useState<number>(0);
  const [shops, setShops] = useState<Shop[] | null>(null);
  const [quantity, setShopQuantity] = useState<number>(1);

  const url = GlobalVars.apiUrl;
  const navigate = useNavigate();

  const redirectToLogin = useCallback((res: AxiosError) => {
    if (res.response?.status === 401) {
      const timer = setTimeout(() => {
        navigate("/login");
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [navigate]);

  const fetchClickerGameStats = useCallback(async () => {
    try {
      const statsResponse = await axios.get(url + '/clicker/getClickerStats', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      });
      setClickerGameStats(statsResponse.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Erreur API");
        redirectToLogin(err);
      } else {
        setError("Network error");
      }
    }
  }, [url, redirectToLogin]);

  const fetchClickerGameSave = useCallback(async () => {
    try {
      const saveResponse = await axios.get(url + '/clicker/getClickerSave', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      });
      setClickerGameSave(saveResponse.data);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Erreur API");
        redirectToLogin(err);
      } else {
        setError("Network error");
      }
    }
  }, [url, redirectToLogin]);

  const fetchShops = useCallback(async () => {
    try {
      const shopResponse = await axios.get<Shop[]>(url + '/clicker/getShops', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      });
      const sortedShops = [...shopResponse.data].sort((a, b) => {
        if (a.target === "clicker") return -1;
        if (b.target === "clicker") return 1;
        return new Date(a.created_at).getTime() - new Date(b.created_at).getTime();
      });
      setShops(sortedShops);
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Erreur API");
        redirectToLogin(err);
      } else {
        setError("Network error");
      }
    }
  }, [url, redirectToLogin]);

  const getMonster = useCallback(async () => {
    try {
      const res = await axios.get<Monster>(url + '/clicker/getMonster', {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      });
      setMonsterHp(Math.floor(res.data.hp));
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Invalid credentials");
      } else {
        setError("Network error");
      }
    }
  }, [url]);

  const autoHuntTick = useCallback(async () => {
    try {
      await axios.put(url + '/clicker/autoHunt', {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      });
      await fetchClickerGameStats();
      await fetchClickerGameSave();
      await getMonster();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Invalid credentials");
        redirectToLogin(err);
      } else {
        setError("Network error");
      }
    }
  }, [fetchClickerGameStats, fetchClickerGameSave, getMonster, redirectToLogin, url]);

  const click = async () => {
    try {
      await axios.put(url + '/clicker/click', {}, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      });
      await fetchClickerGameStats();
      await fetchClickerGameSave();
      await getMonster();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Invalid credentials");
        redirectToLogin(err);
      } else {
        setError("Network error");
      }
    }
  };

  const Upgrade = useCallback(async (targetId: number) => {
    try {
      const upgradeReq: UpgradeReq = {
        quantity,
        targetShopId: targetId,
      };
      await axios.post(url + "/clicker/upgrade", upgradeReq, {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
        },
      });
      await fetchClickerGameStats();
      await fetchClickerGameSave();
      await fetchShops();
    } catch (err: any) {
      if (axios.isAxiosError(err)) {
        setError(err.response?.data.error || "Invalid credentials");
        redirectToLogin(err);
      } else {
        setError("Network error");
      }
    }
  }, [quantity, fetchClickerGameStats, fetchClickerGameSave, fetchShops, redirectToLogin, url]);

  useClearErrorEvery3s(setError);

  useEffect(() => {
    const storedUser = getUserFromJwt();
    setUser(storedUser);
    fetchClickerGameStats();
    fetchClickerGameSave();
    fetchShops();
    getMonster();
    setShopQuantity(1);
  }, [fetchClickerGameStats, fetchClickerGameSave, fetchShops, getMonster]);

  useEffect(() => {
    const interval = setInterval(() => {
      autoHuntTick();
      fetchClickerGameStats();
    }, 1000);
    return () => clearInterval(interval);
  }, [autoHuntTick, fetchClickerGameStats]);

  return (
    <div className={styles.clickerPage}>
      <div className={styles.error}>{error ?? " "}</div>
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
              <li>Click Damage : {clickerGameSave ? Math.floor(clickerGameSave.clickDamage) : "..."}</li>
              {clickerGameSave?.clickerPassiveAllies.map((ally, i) => (
                <ul key={i}>
                  <li>Name : {ally.name}</li>
                  <li>Level : {ally.level}</li>
                  <li>DPS : {Math.floor(ally.dps)}</li>
                  <li>Description : {ally.description}</li>
                </ul>
              ))}
            </ul>
          </div>
          <div>
            <h2>Stats</h2>
            <ul>
              <li>Total Golds Earned : {clickerGameStats ? Math.floor(clickerGameStats.totalGoldsEarned) : "not found"}</li>
              <li>Total Clicks : {clickerGameStats?.totalClicks}</li>
              <li>Total Played Time: {clickerGameStats ? formatDuration(clickerGameStats.totalPlayedTime) : "..."}</li>
            </ul>
          </div>
        </div>
        <div className={styles.gameArea}>
          <h2>Jeu</h2>
          <button className={styles.clicker} onClick={click}>
            <img className={styles.enemy} src={enemiesList?.[0]?.sprites?.[0]} alt={enemiesList?.[0]?.name || "enemy"} />
            <img className={styles.player} src={playerSprites?.sprites?.[0]} alt="player" />
            <p className={styles.monsterHp}>HP : {monsterHp}</p>
          </button>
        </div>
        <div className={styles.shop}>
          <h2>Shop</h2>
          {shops?.map((shop) => (
            <div key={shop.id}>
              <ul>
                <li>{shop?.name}</li>
                <li>Level : {shop?.level}</li>
                <li>Description : {shop.description}</li>
                <li>Price/U : {Math.floor(shop.price)}</li>
                <button onClick={() => Upgrade(shop.id)}>
                  <h2>{Math.floor(shop.price * quantity)} Golds</h2>
                </button>
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default Clicker;

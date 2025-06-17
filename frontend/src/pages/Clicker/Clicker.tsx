import axios from "axios";
import { useEffect, useState } from "react";
import { ClickerGameSave, User } from "../utils/api";
import { GlobalVars } from "../../App";
import styles from './Clicker.module.scss';
import getUserFromLocalStorage from "../utils/utilsfunc";

function Clicker() {
    const [user, setUser] = useState<User | null>(null);
    const [error, setError] = useState<string | null>(null);
    const [clickerGameSave, setClickerGameSave] = useState<ClickerGameSave | null>(null);

    useEffect(() => {
        const storedUser = getUserFromLocalStorage();
        setUser(storedUser);

        const fetchSave = async () => {
            try {
            const url = GlobalVars.apiUrl + '/getClickerSave';
            const response = await axios.get(url, {
                headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${localStorage.getItem("jwt_token")}`,
                },
            });

            setClickerGameSave(response.data.save);
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
        <div>
        <div className={styles.error}>{error ? error : " "}</div>
        <div className={styles.gameLayout}>
            <div className={styles.playerInfo}>
            Infos joueur
            <ul>
                <li>Username : {user?.username}</li>
                <li>Golds : {clickerGameSave?.golds}</li>
                <li>Level : {clickerGameSave?.level}</li>
                <li>Step : {clickerGameSave?.step}</li>
                <li>Click Level : {clickerGameSave?.clickLevel}</li>
                <li>Click Damage : {clickerGameSave?.clickDamage}</li>
                <li>Grok Level : {clickerGameSave?.AutoHuntGrokLevel ? clickerGameSave?.AutoHuntGrokLevel : 0}</li>
                <li>Grok DPS : {clickerGameSave?.AutoHuntGrokDps ? clickerGameSave?.AutoHuntGrokDps : 0 }</li>
            </ul>
            </div>
            <div className={styles.gameArea}>Jeu</div>
            <div className={styles.shop}>Shop</div>
        </div>
        </div>
    );
}

export default Clicker;

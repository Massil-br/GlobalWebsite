
import React, { useState } from "react";
import axios from "axios";
import type {    CreateMonsterRequest } from "../../utils/types";
import styles from './CreateMonster.module.scss';


import { GlobalVars } from "../../utils/types";



const CreateMonster = () => {
  const [name, setName] = useState("");
  const [goldMinDrop, setGoldMinDrop] = useState<number>(0);
  const [goldMaxDrop, setGoldMaxDrop] = useState<number>(0);
  const [minHp, setMinHp] = useState<number>(0);
  const [maxHp, setMaxHp] = useState<number>(0);
  const [level, setLevel] = useState<number>(0);



  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [message, setMessage]= useState<string| null>(null)

 

 

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);
    setSuccess(false);
    setLoading(true);
    setMessage(null);

    try {
      const createMonsterRequest: CreateMonsterRequest = {
         name, 
         goldMinDrop,
         goldMaxDrop,
         minHp,
         maxHp,
         level 
        };
      const url = GlobalVars.apiUrl + '/clicker/createMonster';
      const response = await axios.post(url, createMonsterRequest, {
        headers: { "Content-Type": "application/json",
            Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
         },
        
      });

      const data = response.data;

      setSuccess(true);
      setMessage(data.message)
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
        <h2>Create Monster</h2>

        {error && <div className={styles.error}>{error}</div>}
        {success && message && <div className={styles.success}>{message}</div>}

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label>Gold minimum drop</label>
        <input
          type="number"
          value={goldMinDrop}
          onChange={e => setGoldMinDrop(Number(e.target.value))}
          required
        />

        <label>Gold maximum drop</label>
        <input
          type="number"
          value={goldMaxDrop}
          onChange={e => setGoldMaxDrop(Number(e.target.value))}
          required
        />

        <label>Minimum Health Points</label>
        <input
          type="number"
          value={minHp}
          onChange={e => setMinHp(Number(e.target.value))}
          required
        />

        <label>Maximum Health Points</label>
        <input
          type="number"
          value={maxHp}
          onChange={e => setMaxHp(Number(e.target.value))}
          required
        />

        <label>Level</label>
        <input
          type="number"
          value={level}
          onChange={e => setLevel(Number(e.target.value))}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Monster ..." : "Create Monster"}
        </button>
      </form>
    </div>
  );
};

export default CreateMonster;

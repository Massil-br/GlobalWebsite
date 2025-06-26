
import React, { useState } from "react";
import axios from "axios";
import type {    CreateClickerAllyModelReq } from "../../utils/types";
import styles from './CreateAlly.module.scss';


import { GlobalVars } from "../../utils/types";



const CreateClickerAlly = () => {
  const [name, setName] = useState("");
  const [baseDps, setBaseDps] = useState<number>(0);
  const [basePrice, setBasePrice] = useState<number>(0);
  const [description, setDescription] = useState("");
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
      const createClickerAllyModel: CreateClickerAllyModelReq = {
         name, 
         baseDps,
         basePrice,
         description
        };
      const url = GlobalVars.apiUrl + '/clicker/createAllyModel';
      const response = await axios.post(url, createClickerAllyModel, {
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
        <h2>Create Ally Model</h2>

        {error && <div className={styles.error}>{error}</div>}
        {success && message && <div className={styles.success}>{message}</div>}

        <label>Name</label>
        <input
          type="text"
          value={name}
          onChange={e => setName(e.target.value)}
          required
        />

        <label>Base DPS</label>
        <input
          type="number"
          value={baseDps}
          onChange={e => setBaseDps(Number(e.target.value))}
          required
        />
        <label>Base Price</label>
        <input
          type="number"
          value={basePrice}
          onChange={e => setBasePrice(Number(e.target.value))}
          required
        />

        <label>Description</label>
        <input
          type="text"
          value={description}
          onChange={e => setDescription(e.target.value)}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Creating Monster ..." : "Create Monster"}
        </button>
      </form>
    </div>
  );
};

export default CreateClickerAlly;

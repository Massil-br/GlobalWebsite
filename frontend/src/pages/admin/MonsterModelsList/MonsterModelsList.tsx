import { useEffect, useState } from 'react';
import styles from './MonsterModelsList.module.scss'
import axios  from 'axios';
import { GlobalVars, MonsterModel } from '../../utils/types';



export default function MonsterModelsList(){
    const [monsterModels, setMonsterModels] = useState<MonsterModel[] | null>(null)
    const [error, setError] = useState<string | null>(null);
    const url = GlobalVars.apiUrl
    useEffect( ()=>{

        const getMonsterModels = async () =>{
            try{
                const res  = await axios.get<MonsterModel[]>(url +'/clicker/getMonsterModels',{
                headers: { "Content-Type": "application/json",
                  Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
                 },
                })
                setMonsterModels(res.data)
            }catch(err:any){
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data.message || "Invalid credentials");
                } else {
                    setError("Network error");
                }
            }
        
        }

        getMonsterModels();
    },[url])

    if (error) return <p>Erreur : {error}</p>;
    if (!monsterModels) return <p>Chargement...</p>;
        
       
    

    return (
    <div className={styles.modulesGrid}>
      {monsterModels.map((monster, i) => (
        <div key={monster.id} className={styles.moduleContainer}>
          <h2>ID : {monster.id}</h2>
          <h2>Created at : {monster.created_at}</h2>
          <h2>Updated : {monster.updated_at}</h2>
          <h2>Name : {monster.name}</h2>
          <h2>Golds minimum drop : {monster.goldMinDrop}</h2>
          <h2>Golds maximum drop : {monster.goldMaxDrop}</h2>
          <h2>Minimum Health Points : {monster.minHp}</h2>
          <h2>Maximum Health Points  : {monster.maxHp}</h2>
          <h2>Level : {monster.level}</h2>
        </div>
      ))}
    </div>
  );
} 
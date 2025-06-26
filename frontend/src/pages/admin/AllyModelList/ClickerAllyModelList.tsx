import { useEffect, useState } from 'react';
import styles from './ClickerAllyModelList.module.scss'
import axios  from 'axios';
import { ClickerPassiveAllyModel, GlobalVars } from '../../utils/types';



export default function ClickerAllyModelList(){
    const [allyModels, setAllyModels] = useState<ClickerPassiveAllyModel[] | null>(null)
    const [error, setError] = useState<string | null>(null);
    const url = GlobalVars.apiUrl
    useEffect( ()=>{

        const getAllyModels = async () =>{
            try{
                const res  = await axios.get<ClickerPassiveAllyModel[]>(url +'/clicker/getAllyModels',{
                headers: { "Content-Type": "application/json",
                  Authorization: `Bearer ${sessionStorage.getItem("jwt_token")}`,
                 },
                });
                setAllyModels(res.data);
            }catch(err:any){
                if (axios.isAxiosError(err)) {
                    setError(err.response?.data.message || "Invalid credentials");
                } else {
                    setError("Network error" );
                }
            }
        
        }

        getAllyModels();
    },[url])

    if (error) return <p>Erreur : {error}</p>;
    if (!allyModels) return <p>Chargement...</p>;
        
       
    

    return (
    <div className={styles.modulesGrid}>
      {allyModels.map((ally, i) => (
        <div key={ally.id} className={styles.moduleContainer}>
          <h2>ID : {ally.id}</h2>
          <h2>Created at : {ally.created_at}</h2>
          <h2>Updated : {ally.updated_at}</h2>
          <h2>Name : {ally.name}</h2>
          <h2>Description: {ally.description}</h2>
          <h2>BaseDps: {ally.baseDps}</h2>
          <h2>BasePrice: {ally.basePrice}</h2>
        </div>
      ))}
    </div>
  );
} 
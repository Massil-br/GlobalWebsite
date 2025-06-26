import { jwtDecode } from "jwt-decode";
import { DecodedJwt, User } from "./types";





const getUserFromLocalStorage = (): User | null => {
  const storedUser = localStorage.getItem("jwt_token");
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser) as User;
    return parsedUser;
  } catch (err) {
    console.error("Erreur de parsing du user localStorage :", err);
    return null;
  }
};


export  const getUserFromJwt = (): User| null =>{
  const token = localStorage.getItem("jwt_token");
  if (token){
    const decoded :DecodedJwt = jwtDecode(token)
    const user: User = {
          user_id: decoded.user_id,
          username: decoded.username,
          email: decoded.email,
          role: decoded.role,
          created_at: decoded.created_at,
          updated_at: decoded.updated_at,
        };
    return user;
  }
  return null;
  
}





export function formatDuration(nanoseconds: number): string {
  const totalSeconds = Math.floor(nanoseconds / 1_000_000_000);
  const hours = Math.floor(totalSeconds / 3600);
  const minutes = Math.floor((totalSeconds % 3600) / 60);
  const seconds = totalSeconds % 60;

  return `${hours}h ${minutes}m ${seconds}s`;
}





export default getUserFromLocalStorage;
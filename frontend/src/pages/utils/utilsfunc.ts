import { User } from "./api";



const getUserFromLocalStorage = (): User | null => {
  const storedUser = localStorage.getItem("user");
  if (!storedUser) return null;

  try {
    const parsedUser = JSON.parse(storedUser) as User;
    return parsedUser;
  } catch (err) {
    console.error("Erreur de parsing du user localStorage :", err);
    return null;
  }
};

export default getUserFromLocalStorage;
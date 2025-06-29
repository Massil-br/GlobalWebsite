
export interface RegisterRequest{
    username: string;
    email : string;
    password: string;
    confirmPassword: string;
}
export interface RegisterResponse {
  message: string;
  error?: string;
}

export interface LoginRequest{
    email : string;
    password: string;
}

export interface LoginResponse{
    message: string;
    token:string;
}

export interface DecodedJwt{
    user_id : number;
    created_at : string;
    updated_at: string;
    username: string;
    email : string;
    role: string;
    exp: number;
}

export interface User{
    user_id : number;
    created_at : string;
    updated_at: string;
    username: string;
    email : string;
    role: string;
}

export interface OkResponse{
    message: string;
}


export interface ClickerGameSave{
    id: number;
    created_at : string;
    updated_at: string;
    user_id: number;
    golds: number;
    level: number;
    step: number;
    clickLevel: number;
    clickDamage: number;
    clickerPassiveAllies: ClickerPassiveAlly[];

}

export interface ClickerPassiveAlly{
    id:number;
    created_at: string;
    updated_at: string;
    modelId:number;
    clickerGameSaveId:number;
    name:string;
    dps:number;
    level: number;
    description:string;
}


export interface ClickerGameStats {
    Id: number;
    created_at : string;
    updated_at: string;
    user_id : number;
    totalGoldsEarned: number;
    totalClicks: number;
    totalPlayedTime: number;
}



export interface Monster{
    userId: number;
    name: string;
    goldDrop: number;
    maxHp: number;
    hp: number;
    level: number;
}

export interface CreateMonsterRequest{
    name: string;
    goldMinDrop: number;
    goldMaxDrop: number;
    minHp: number;
    maxHp: number;
    level: number;
}

export interface MonsterModel{
    id : number;
    created_at: string;
    updated_at: string;
    name: string;
    goldMinDrop: number;
    goldMaxDrop: number;
    minHp: number;
    maxHp: number;
    level: number
}

export interface CreateClickerAllyModelReq {
    name: string;
    baseDps: number;
    basePrice:number;
    description: string;
}

export interface ClickerPassiveAllyModel{
    id:number;
    created_at: string;
    updated_at: string;
    name:string;
    baseDps:number;
    basePrice:number;
    description:number;
}

export interface Shop{
    id:number;
    created_at:string;
    updated_at:string;
    clickerGameSaveId:number;
    name:string;
    description:string;
    price:number;
    level:number;
    target:string;
}


export interface UpgradeReq{
    quantity: number;
    targetShopId:number;
}





export interface EnemyImg {
  name: string;
  sprites: string[];
}

export const GlobalVars = {
  apiUrl : 'http://192.168.1.44:8081/api'
}

export interface PlayerImg{
    sprites: string[];
}

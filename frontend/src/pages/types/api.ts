
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
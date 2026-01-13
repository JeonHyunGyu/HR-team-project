import { createContext, useContext } from "react";

// AuthContext 생성
export const AuthContext = createContext(null);

// 편리하게 useContext를 쓸 수 있는 hook
export const useAuth = () => useContext(AuthContext);

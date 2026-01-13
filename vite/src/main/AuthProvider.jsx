import { useState, useEffect } from "react";
import axios from "axios";
import { AuthContext } from "./AuthContext.jsx";

const AuthProvider = ({ children }) => {
    const [user, setUser] = useState(null);

    // 초기 렌더링 시 로그인 상태 확인
    useEffect(() => {
        const fetchUser = async () => {
            try {
                const res = await axios.get("/back/signup/me", { withCredentials: true });
                if (res.data.authenticated) {
                    setUser(res.data);
                } else {
                    setUser(null);
                }
            } catch (err) {
                console.error(err);
                setUser(null);
            }
        };
        fetchUser();
    }, []);

    // 로그인 함수
    const login = async (email, password) => {
        try {
            const params = new URLSearchParams();
            params.append("email", email);
            params.append("password", password);

            // 스프링 시큐리티가 이해하는 형식으로 로그인 요청
            await axios.post("/back/login", params, {
                withCredentials: true,
                headers: { "Content-Type": "application/x-www-form-urlencoded" }
            });

            // 로그인 성공 후 사용자 정보 가져오기
            const res = await axios.get("/back/signup/me", { withCredentials: true });
            setUser(res.data);
        } catch (err) {
            console.error(err);
            throw err; // 로그인 실패는 호출 쪽에서 처리
        }
    };

    // 로그아웃 함수
    const logout = async () => {
        try {
            await axios.post("/back/logout", {}, { withCredentials: true });
            setUser(null);
            alert("로그아웃 성공!")
        } catch (err) {
            console.error(err);
        }
    };

    return (
        <AuthContext.Provider value={{ user, setUser, login, logout }}>
            {children}
        </AuthContext.Provider>
    );
};

export default AuthProvider;

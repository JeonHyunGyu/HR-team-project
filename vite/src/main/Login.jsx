import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";
import { useAuth } from "./AuthContext.jsx";

const Login = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const { login } = useAuth();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            await login(email, password);
            navigate("/main");
        } catch (err) {
            console.error(err);
            alert("로그인에 실패했습니다. 이메일과 비밀번호를 확인해주세요.");
        }
    };

    return (
        <div className="login-page">
            {/* 왼쪽 브랜딩 영역 */}
            <div className="login-branding">
                <div className="branding-content">
                    <div className="brand-logo">
                        <span className="logo-icon">H</span>
                        <span className="logo-text">WorkFlow</span>
                    </div>
                    <h1 className="branding-title">
                        스마트한 인사관리의 시작
                    </h1>
                    <p className="branding-desc">
                        인사, 급여, 근태, 평가까지<br />
                        하나의 플랫폼에서 효율적으로 관리하세요.
                    </p>
                    <div className="branding-features">
                        <div className="feature-item">
                            <span className="feature-icon">&#10003;</span>
                            <span>통합 인사정보 관리</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">&#10003;</span>
                            <span>자동화된 급여 계산</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">&#10003;</span>
                            <span>실시간 근태 현황</span>
                        </div>
                        <div className="feature-item">
                            <span className="feature-icon">&#10003;</span>
                            <span>체계적인 성과 평가</span>
                        </div>
                    </div>
                </div>
            </div>

            {/* 오른쪽 로그인 폼 영역 */}
            <div className="login-form-area">
                <div className="login-form-container">
                    {/* 탭 네비게이션 */}
                    <div className="login-tabs">
                        <button
                            className="tab-btn active"
                            onClick={() => navigate("/")}
                        >
                            로그인
                        </button>
                        <button
                            className="tab-btn"
                            onClick={() => navigate("/sign")}
                        >
                            관리자 가입
                        </button>
                        <button
                            className="tab-btn"
                            onClick={() => navigate("/empsign")}
                        >
                            사원 가입
                        </button>
                    </div>

                    {/* 로그인 폼 */}
                    <div className="login-form-content">
                        <h2 className="form-title">로그인</h2>
                        <p className="form-subtitle">계정 정보를 입력하여 로그인하세요</p>

                        <form onSubmit={handleLogin}>
                            <div className="form-group">
                                <label className="form-label">이메일</label>
                                <input
                                    type="email"
                                    className="form-input"
                                    placeholder="name@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                            </div>

                            <div className="form-group">
                                <label className="form-label">비밀번호</label>
                                <input
                                    type="password"
                                    className="form-input"
                                    placeholder="비밀번호를 입력하세요"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                            </div>

                            <button type="submit" className="login-submit-btn">
                                로그인
                            </button>
                        </form>
                    </div>

                    {/* 푸터 */}
                    <div className="login-footer">
                        <p>&copy; 2025 WorkFlow. All rights reserved.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Login;

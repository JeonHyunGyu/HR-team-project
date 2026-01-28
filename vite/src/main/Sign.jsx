import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./styles/login.css";

const Sign = () => {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [emailError, setEmailError] = useState("");
    const [passwordError, setPasswordError] = useState("");

    const emailRegex = /^[A-Za-z0-9._%+-]+@[A-Za-z0-9.-]+\.[A-Za-z]{2,}$/;

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("이메일과 비밀번호를 입력하세요");
            return;
        }

        let valid = true;

        if (!emailRegex.test(email)) {
            setEmailError("올바른 이메일 형식이 아닙니다.");
            valid = false;
        } else {
            setEmailError("");
        }

        if (password.length < 8) {
            setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (!valid) return;

        try {
            const res = await fetch("/back/signup/admin", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) throw new Error("회원가입 실패");

            alert("관리자 회원가입 성공");
            navigate("/");
        } catch (e) {
            alert(e.message);
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

            {/* 오른쪽 폼 영역 */}
            <div className="login-form-area">
                <div className="login-form-container">
                    {/* 탭 네비게이션 */}
                    <div className="login-tabs">
                        <button
                            className="tab-btn"
                            onClick={() => navigate("/")}
                        >
                            로그인
                        </button>
                        <button
                            className="tab-btn active"
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

                    {/* 가입 폼 */}
                    <div className="login-form-content">
                        <h2 className="form-title">관리자 회원가입</h2>
                        <p className="form-subtitle">관리자 계정을 생성하여 시스템을 관리하세요</p>

                        <form onSubmit={handleSignUp}>
                            <div className="form-group">
                                <label className="form-label">이메일</label>
                                <input
                                    type="email"
                                    className={`form-input ${emailError ? 'input-error' : ''}`}
                                    placeholder="admin@company.com"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                    required
                                />
                                {emailError && <span className="error-message">{emailError}</span>}
                            </div>

                            <div className="form-group">
                                <label className="form-label">비밀번호</label>
                                <input
                                    type="password"
                                    className={`form-input ${passwordError ? 'input-error' : ''}`}
                                    placeholder="8자 이상 입력하세요"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                    required
                                />
                                {passwordError && <span className="error-message">{passwordError}</span>}
                            </div>

                            <button type="submit" className="login-submit-btn">
                                관리자 계정 생성
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

export default Sign;
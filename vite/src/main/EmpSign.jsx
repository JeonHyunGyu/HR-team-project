import { useEffect, useState } from "react";
import { useNavigate, useSearchParams } from "react-router-dom";
import "./styles/login.css";

const EmpSign = () => {
    const navigate = useNavigate();
    const [searchParams] = useSearchParams();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [passwordError, setPasswordError] = useState("");

    useEffect(() => {
        const emailParam = searchParams.get("email");
        if (emailParam) {
            setEmail(emailParam);
        }
    }, [searchParams]);

    const handleSignUp = async (e) => {
        e.preventDefault();

        if (!email || !password) {
            alert("이메일과 비밀번호를 입력하세요");
            return;
        }

        let valid = true;

        if (password.length < 8) {
            setPasswordError("비밀번호는 최소 8자 이상이어야 합니다.");
            valid = false;
        } else {
            setPasswordError("");
        }

        if (!valid) return;

        try {
            const res = await fetch("/back/signup/emp", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, password })
            });

            if (!res.ok) throw new Error("회원가입 실패");

            alert("사원 회원가입 성공");
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
                            className="tab-btn"
                            onClick={() => navigate("/sign")}
                        >
                            관리자 가입
                        </button>
                        <button
                            className="tab-btn active"
                            onClick={() => navigate("/empsign")}
                        >
                            사원 가입
                        </button>
                    </div>

                    {/* 가입 폼 */}
                    <div className="login-form-content">
                        <h2 className="form-title">사원 회원가입</h2>
                        <p className="form-subtitle">초대받은 이메일로 계정을 생성하세요</p>

                        <form onSubmit={handleSignUp}>
                            <div className="form-group">
                                <label className="form-label">이메일</label>
                                <input
                                    type="email"
                                    className="form-input form-input-disabled"
                                    value={email}
                                    placeholder={email ? "" : "초대된 이메일을 통해 접근해 주세요"}
                                    disabled
                                    readOnly
                                />
                                {!email && (
                                    <span className="info-message">
                                        관리자로부터 초대 링크를 받아 접속해주세요
                                    </span>
                                )}
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

                            <button
                                type="submit"
                                className="login-submit-btn"
                                disabled={!email}
                            >
                                사원 계정 생성
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

export default EmpSign;
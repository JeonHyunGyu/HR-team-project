import { useState } from "react";
import OutsourcingAssignmentManager from "../components/outsourcing/assignment/OutsourcingAssignmentManager.jsx";
import OutsourcingCompanyManager from "../components/outsourcing/company/OutsourcingCompanyManager.jsx";
const Outsourcing = () => {
    const [subTab, setSubTab] = useState("company"); // company 또는 assignment

    return (
        <div style={{ padding: "20px" }}>
            <h2>파견 및 외주 관리</h2>
            <div style={{ marginBottom: "20px", display: "flex", gap: "10px" }}>
                <button
                    onClick={() => setSubTab("company")}
                    style={{ padding: "10px 20px", backgroundColor: subTab === "company" ? "#007bff" : "#eee", color: subTab === "company" ? "white" : "black", border: "none", borderRadius: "4px", cursor: "pointer",fontWeight: "bold" }}
                >
                    파견 업체 관리
                </button>
                <button
                    onClick={() => setSubTab("assignment")}
                    style={{ padding: "10px 20px", backgroundColor: subTab === "assignment" ? "#007bff" : "#eee", color: subTab === "assignment" ? "white" : "black", border: "none", borderRadius: "4px", cursor: "pointer", fontWeight: "bold"}}
                >
                    사원 배치 현황
                </button>
            </div>

            <hr />

            {/* 서브 탭에 따른 컴포넌트 출력 */}
            {subTab === "company" ? <OutsourcingCompanyManager/>: <OutsourcingAssignmentManager />}
        </div>
    );
}
export default Outsourcing;
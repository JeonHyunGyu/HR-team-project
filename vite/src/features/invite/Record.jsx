import { useEffect, useState } from "react";
import axios from "axios";
import "./styles/record.css";

const Record = () => {
    const [invite, setInvite] = useState([]);

    useEffect(() => {
        const fetchInvite = async () => {
            try {
                const res = await axios.get("/back/invite");
                setInvite(res.data);
            } catch (e) {
                console.error(e);
            }
        };
        fetchInvite();
    }, []);

    const deleteInvite = async (id) => {
        try {
            await axios.delete("/back/invite/" + id, { withCredentials: true });
            alert(id + "삭제 성공");
        } catch (e) {
            alert("삭제 실패" + e);
        }
    };

    const pendingInvites = invite.filter(i => i.status === "PENDING");
    const completedInvites = invite.filter(i => i.status === "COMPLETED");

    return (
        <div className="page-wrapper">

            {/* ===== 제목 영역 ===== */}
            <div className="content-wrapper">
                <h2>초대 기록</h2>
            </div>

            <div className="section-gap" />

            {/* ===== 미완료 초대 ===== */}
            <div className="content-wrapper">
                <h4 className="content-subtitle">미완료 초대 기록</h4>

                <table className="record-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>사원ID</th>
                        <th>이메일</th>
                        <th>상태</th>
                        <th>생성일</th>
                        <th>완료일</th>
                    </tr>
                    </thead>
                    <tbody>
                    {pendingInvites.map(i => (
                        <tr key={i.id}>
                            <td>{i.id}</td>
                            <td>{i.empId}</td>
                            <td>{i.email}</td>
                            <td>{i.status}</td>
                            <td>{i.createdAt}</td>
                            <td>{i.completedAt ?? "-"}</td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

            <div className="section-gap" />

            {/* ===== 완료 초대 ===== */}
            <div className="content-wrapper">
                <h4 className="content-subtitle">완료된 초대 기록</h4>

                <table className="record-table">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>사원ID</th>
                        <th>이메일</th>
                        <th>상태</th>
                        <th>생성일</th>
                        <th>완료일</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {completedInvites.map(i => (
                        <tr key={i.id}>
                            <td>{i.id}</td>
                            <td>{i.empId}</td>
                            <td>{i.email}</td>
                            <td>{i.status}</td>
                            <td>{i.createdAt}</td>
                            <td>{i.completedAt ?? "-"}</td>
                            <td>
                                <button
                                    className="fc-like-btn btn-sm"
                                    onClick={() => deleteInvite(i.id)}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            </div>

        </div>
    );
};

export default Record;

import { useEffect, useState } from "react";
import axios from "axios";

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
    const deleteInvite =async (id)=>{
        try{
            await axios.delete("/back/invite/"+id,{withCredentials:true});
            console.log(id+"삭제 성공");
        }catch(e){
            console.log("삭제 실패"+e);
        }
    }

    // 상태별로 필터링
    const pendingInvites = invite.filter(i => i.status === "PENDING");
    const completedInvites = invite.filter(i => i.status === "COMPLETED");

    return (
        <>
            <h1>초대 기록</h1>

            {/* 미완료 초대 */}
            <h2>미완료 초대 기록</h2>
            <table border="1">
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

            {/* 완료 초대 */}
            <h2>완료된 초대 기록</h2>
            <table border="1">
                <thead>
                <tr>
                    <th>ID</th>
                    <th>사원ID</th>
                    <th>이메일</th>
                    <th>상태</th>
                    <th>생성일</th>
                    <th>완료일</th>
                    <th>내역 삭제</th>
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
                        <td><button onClick={()=>deleteInvite(i.id)}>삭제</button></td>
                    </tr>
                ))}
                </tbody>
            </table>
        </>
    );
};

export default Record;

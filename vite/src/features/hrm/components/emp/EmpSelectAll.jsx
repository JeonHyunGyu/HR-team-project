import {useEffect, useState} from "react";
import axios from "axios";

const EmpSelectAll = () => {
    const [empList, setEmpList] = useState([]);

    useEffect(() => {
        handleClick();
    }, []);


    const handleClick = async () => {
        try {
            const res = await axios.get("/back/hyun/emp/selectAll",{
                withCredentials: true,
            });
            setEmpList(res.data);
            console.log("조회 결과 : ", res.data);
        } catch (e) {
            console.log("조회 실패 : ", e);
        }
    };
    const handleInvite = async (emp) => {
        try {
            const res = await axios.post(
                "/back/invite/create",
                {
                    empId: emp.empId,
                    email: emp.email,
                },
                { withCredentials: true }
            );

            alert("초대 완료! inviteId = " + res.data);
        } catch (e) {
            console.log("초대 실패", e);
            alert("이미 초대된 사원일 수 있습니다.");
        }
    };

    return (
        <div>
            <h2>사원 목록</h2>
            {empList && (
                <div>
                    <table border="1">
                        <thead>
                        <tr>
                            <th>사원 번호</th>
                            <th>부서 번호</th>
                            <th>사원 이름</th>
                            <th>이메일</th>
                            <th>직급</th>
                            <th>생성일시</th>
                            <th>수정일시</th>
                        </tr>
                        </thead>

                        <tbody>
                        {empList.map((emp) => (
                            // key값과 필드명들을 DTO 이름과 동일하게 수정
                            <tr key={emp.id}>
                                <td>{emp.empId}</td>
                                <td>{emp.deptNo}</td>
                                <td>{emp.empName}</td>
                                <td>{emp.email} <button
                                    type="button"
                                    onClick={() => handleInvite(emp)}
                                    style={{ marginLeft: "8px" }}>초대</button></td>
                                <td>{emp.empRole}</td>
                                <td>{emp.role}</td>
                                <td>{emp.createdAt}</td>
                                <td>{emp.updatedAt}</td>
                            </tr>
                        ))}
                        </tbody>
                    </table>
                </div>
            )}
            <button onClick={handleClick}>사원 전체 조회</button>
        </div>
    );
};

export default EmpSelectAll;
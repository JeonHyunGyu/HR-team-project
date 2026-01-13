import { useState } from "react";
import DeptSelectAll from "../components/dept/DeptSelectAll.jsx";
import DeptInsert from "../components/dept/DeptInsert.jsx";
import DeptUpdate from "../components/dept/DeptUpdate.jsx";
import DeptDelete from "../components/dept/DeptDelete.jsx";

const Dept = () => {
    // 1. 처음 들어왔을 때 부서 조회가 바로 보이도록 초기값 설정
    const [page, setPage] = useState("deptSelectAll");

    return (
        <>
            {/* 컴포넌트 출력 영역 */}
            {page === "deptSelectAll" && <DeptSelectAll />}
            {page === "deptInsert" && <DeptInsert />}
            {page === "deptUpdate" && <DeptUpdate />}
            {page === "deptDelete" && <DeptDelete />}

            {/* 버튼 메뉴 영역: 현재 페이지(page)가 아닌 것만 렌더링 */}
            <div style={{ marginTop: "20px" }}>
                {page !== "deptSelectAll" && (
                    <button onClick={() => setPage("deptSelectAll")}>부서 조회</button>
                )}

                {page !== "deptInsert" && (
                    <button onClick={() => setPage("deptInsert")}>부서 등록</button>
                )}

                {page !== "deptUpdate" && (
                    <button onClick={() => setPage("deptUpdate")}>부서 수정</button>
                )}

                {page !== "deptDelete" && (
                    <button onClick={() => setPage("deptDelete")}>부서 삭제</button>
                )}
            </div>
        </>
    );
};

export default Dept;
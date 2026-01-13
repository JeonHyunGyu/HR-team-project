import EmpSelectAll from "../components/emp/EmpSelectAll.jsx";
import {useState} from "react";
import EmpInsert from "../components/emp/EmpInsert.jsx";
import EmpUpdate from "../components/emp/EmpUpdate.jsx";
import EmpDelete from "../components/emp/EmpDelete.jsx";

const Emp = () => {
    // 처음에 사원 전체 조회를 바로 보여줌
    const [page, setPage] = useState("empSelectAll");

    return (
        <>
            {/* 상단: 현재 선택된 페이지 컴포넌트 */}
            {page === "empSelectAll" && <EmpSelectAll/>}
            {page === "empInsert" && <EmpInsert/>}
            {page === "empUpdate" && <EmpUpdate/>}
            {page === "empDelete" && <EmpDelete/>}

            {/* 하단: 메뉴 버튼 (현재 페이지가 아닐 때만 노출) */}
            <div style={{ marginTop: "20px" }}>
                {page !== "empSelectAll" && (
                    <button onClick={() => setPage("empSelectAll")}>사원 전체 조회</button>
                )}

                {page !== "empInsert" && (
                    <button onClick={() => setPage("empInsert")}>사원 등록</button>
                )}

                {page !== "empUpdate" && (
                    <button onClick={() => setPage("empUpdate")}>사원 수정</button>
                )}

                {page !== "empDelete" && (
                    <button onClick={() => setPage("empDelete")}>사원 삭제</button>
                )}
            </div>
        </>
    );
}

export default Emp;
import {useState} from "react";
import DeptSelectAll from "../components/dept/DeptSelectAll.jsx";
import DeptInsert from "../components/dept/DeptInsert.jsx";
import DeptUpdate from "../components/dept/DeptUpdate.jsx";
import DeptDelete from "../components/dept/DeptDelete.jsx";

const Dept = () => {
    const [page, setPage] = useState("deptSelectAll");
    return(
        <>
            {page === "deptSelectAll" && <DeptSelectAll/>}
            {page === "deptInsert" && <DeptInsert/>}
            {page === "deptUpdate" && <DeptUpdate/>}
            {page === "deptDelete" && <DeptDelete/>}
            <div>
                <button onClick={()=>{
                    setPage("deptSelectAll");
                }}>부서 조회</button>
                <button onClick={()=>{
                    setPage("deptInsert");
                }}>부서 등록</button>
                <button onClick={()=>{
                    setPage("deptUpdate");
                }}>부서 수정</button>
                <button onClick={()=>{
                    setPage("deptDelete");
                }}>부서 삭제</button>
            </div>
        </>
    )
}
export default Dept;
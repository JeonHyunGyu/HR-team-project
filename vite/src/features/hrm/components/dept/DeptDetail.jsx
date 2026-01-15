import { useEffect, useState } from "react";
import axios from "axios";

const DeptDetail = ({ selectedDept, onSuccess }) => {
    const [activeTab, setActiveTab] = useState("info");
    const [deptEmployees, setDeptEmployees] = useState([]);
    const [history, setHistory] = useState([]);
    const [allDepts, setAllDepts] = useState([]);

    const [form, setForm] = useState({
        deptNo: "",
        deptName: "",
        deptLoc: "",
        parentDeptNo: "",
        treeLevel: 0,
        siblingOrder: 1
    });

    useEffect(() => {
        // 모든 부서 목록 로드 (상위 부서 선택 Select Box용)
        axios.get("/back/hyun/dept/selectAll", { withCredentials: true })
            .then(res => setAllDepts(res.data))
            .catch(err => console.error("부서 목록 로딩 실패", err));

        if (selectedDept) {
            if (selectedDept.isNew) {
                setActiveTab("edit");
                setForm({
                    deptNo: "",
                    deptName: "",
                    deptLoc: "",
                    parentDeptNo: "",
                    treeLevel: 0,
                    siblingOrder: 1
                });
                setDeptEmployees([]);
                setHistory([]);
            } else {
                setActiveTab("info");
                setForm({
                    ...selectedDept,
                    parentDeptNo: selectedDept.parentDeptNo || ""
                });

                // 사원 목록 조회
                axios.get(`/back/hyun/emp/selectEmpByDeptNo?deptno=${selectedDept.deptNo}`)
                    .then(res => setDeptEmployees(res.data));

                // 변경 이력 조회 (수정된 엔드포인트: selectHistory)
                axios.get(`/back/hyun/dept/selectHistory?deptNo=${selectedDept.deptNo}`)
                    .then(res => setHistory(res.data));
            }
        }
    }, [selectedDept]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleSave = async () => {
        const url = selectedDept.isNew ? "/back/hyun/dept/insert" : "/back/hyun/dept/update";

        // 정수형 변환 처리
        const submitData = {
            ...form,
            deptNo: parseInt(form.deptNo),
            parentDeptNo: form.parentDeptNo === "" ? null : parseInt(form.parentDeptNo),
            siblingOrder: parseInt(form.siblingOrder || 1)
        };

        try {
            await axios({
                method: selectedDept.isNew ? "post" : "put",
                url,
                data: submitData,
                withCredentials: true
            });
            alert("저장되었습니다.");
            onSuccess();
        } catch (err) {
            // 백엔드에서 보낸 에러 메시지가 있다면 해당 메시지를 출력
            const errorMsg = err.response?.data?.message || "저장에 실패했습니다.";
            alert(errorMsg);
            console.error(err);
        }
    };

    // ★ 에러 방지를 위한 추가 (return 문 바로 위에 배치)
    if (!selectedDept) {
        return (
            <div className="card shadow-sm border-0 d-flex align-items-center justify-content-center" style={{ minHeight: "400px" }}>
                <div className="text-center text-muted">
                    <p>부서를 선택하거나 새로운 부서를 등록해 주세요.</p>
                </div>
            </div>
        );
    }

    return (
        <div className="card shadow-sm border-0">
            {/* 탭 네비게이션 */}
            <div className="card-header bg-white pt-3">
                <ul className="nav nav-tabs border-0">
                    <li className="nav-item">
                        <button className={`nav-link border-0 ${activeTab === 'info' ? 'active fw-bold border-bottom border-primary border-3' : ''}`}
                                onClick={() => setActiveTab("info")} disabled={selectedDept?.isNew}>부서 정보 및 인원</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link border-0 ${activeTab === 'edit' ? 'active fw-bold border-bottom border-primary border-3' : ''}`}
                                onClick={() => setActiveTab("edit")}>{selectedDept?.isNew ? "부서 등록" : "정보 수정"}</button>
                    </li>
                    <li className="nav-item">
                        <button className={`nav-link border-0 ${activeTab === 'history' ? 'active fw-bold border-bottom border-primary border-3' : ''}`}
                                onClick={() => setActiveTab("history")} disabled={selectedDept?.isNew}>변경 이력</button>
                    </li>
                </ul>
            </div>

            <div className="card-body p-4">
                {/* 탭 1: 정보 및 인원 */}
                {activeTab === "info" && (
                    <div>
                        <div className="p-3 bg-light rounded border mb-4">
                            <div className="row">
                                <div className="col-4"><strong>부서명:</strong> {form.deptName}</div>
                                <div className="col-4"><strong>위치:</strong> {form.deptLoc}</div>
                                <div className="col-4"><strong>레벨:</strong> {form.treeLevel}</div>
                            </div>
                        </div>
                        <h6 className="text-secondary mb-3">소속 사원 명단 <span className="badge bg-primary">{deptEmployees.length}명</span></h6>
                        <table className="table border" style={{ fontSize: "14px" }}>
                            <thead className="table-light">
                            <tr><th>사번</th><th>이름</th><th>직급</th><th>입사일</th></tr>
                            </thead>
                            <tbody>
                            {deptEmployees.map(emp => (
                                <tr key={emp.empId}>
                                    <td>{emp.empId}</td><td>{emp.empName}</td><td>{emp.empRole}</td><td>{emp.hireDate}</td>
                                </tr>
                            ))}
                            </tbody>
                        </table>
                    </div>
                )}

                {/* 탭 2: 정보 수정 (트리 구조 입력 포함) */}
                {activeTab === "edit" && (
                    <div className="row g-3">
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">부서 번호</label>
                            <input name="deptNo" type="number" className="form-control" value={form.deptNo} onChange={handleChange} disabled={!selectedDept.isNew} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">부서명</label>
                            <input name="deptName" className="form-control" value={form.deptName} onChange={handleChange} />
                        </div>
                        <div className="col-md-12">
                            <label className="form-label small fw-bold">부서 위치</label>
                            <input name="deptLoc" className="form-control" value={form.deptLoc} onChange={handleChange} />
                        </div>
                        <div className="col-md-6">
                            <label className="form-label small fw-bold">상위 부서</label>
                            <select name="parentDeptNo" className="form-select" value={form.parentDeptNo} onChange={handleChange}>
                                <option value="">최상위 부서 (없음)</option>
                                {allDepts.filter(d => d.deptNo !== parseInt(form.deptNo)).map(d => (
                                    <option key={d.deptNo} value={d.deptNo}>
                                        {"--".repeat(d.treeLevel)} {d.deptName}
                                    </option>
                                ))}
                            </select>
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">정렬 순서</label>
                            <input name="siblingOrder" type="number" className="form-control" value={form.siblingOrder} onChange={handleChange} />
                        </div>
                        <div className="col-md-3">
                            <label className="form-label small fw-bold">트리 레벨 (자동)</label>
                            <input className="form-control bg-light" value={form.treeLevel} readOnly />
                        </div>
                        <div className="mt-4">
                            <button onClick={handleSave} className="btn btn-primary px-4">저장하기</button>
                        </div>
                    </div>
                )}

                {/* 탭 3: 변경 이력 */}
                {activeTab === "history" && (
                    <div className="table-responsive border rounded">
                        <table className="table table-hover mb-0" style={{ fontSize: "13px" }}>
                            <thead className="table-light">
                            <tr><th>변경일시</th><th>항목</th><th>상세 내용</th><th>담당자</th></tr>
                            </thead>
                            <tbody>
                            {history.map(h => (
                                <tr key={h.deptHistoryId}>
                                    <td style={{ whiteSpace: 'nowrap' }}>{h.createdAt || "일시없음"}</td>
                                    <td className="fw-bold text-secondary">{h.fieldName}</td>
                                    <td>
                                        <span className="text-muted text-decoration-line-through me-2">{h.beforeValue || "없음"}</span>
                                        <span className="text-primary fw-bold">→ {h.afterValue}</span>
                                    </td>
                                    <td>{h.changerId}</td>
                                </tr>
                            ))}
                            {history.length === 0 && <tr><td colSpan="4" className="text-center py-5">기록된 이력이 없습니다.</td></tr>}
                            </tbody>
                        </table>
                    </div>
                )}
            </div>
        </div>
    );
};

export default DeptDetail;
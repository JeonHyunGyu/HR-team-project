import { useEffect, useState } from "react";
import axios from "axios";

const Project = () => {
    const [projects, setProjects] = useState([]);
    const [currentView, setCurrentView] = useState("list");
    const [editId, setEditId] = useState(null);

    const [form, setForm] = useState({
        name: "",
        description: "",
        methodology: "",
        startDate: "",
        endDate: "",
        status: "" // UI에서는 입력 안 받음
    });

    // 최초 조회
    useEffect(() => {
        axios.get("/back/project")
            .then(res => setProjects(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    // 생성
    const handleCreate = async () => {
        try {
            const res = await axios.post("/back/project", form);
            setProjects(prev => [...prev, res.data]);

            setForm({
                name: "",
                description: "",
                methodology: "",
                startDate: "",
                endDate: "",
                status: ""
            });

            setCurrentView("list");
        } catch (e) {
            console.error(e);
            alert("생성 실패");
        }
    };

    // 수정 버튼
    const handleEdit = (p) => {
        setEditId(p.id);
        setForm({
            name: p.name,
            description: p.description,
            methodology: p.methodology,
            startDate: p.startDate ?? "",
            endDate: p.endDate ?? "",
            status: p.status
        });
        setCurrentView("update");
    };

    // 수정 저장
    const handleUpdate = async () => {
        try {
            const updatedProject = { ...form };

            await axios.put(`/back/project/${editId}`, updatedProject);

            setProjects(prev =>
                prev.map(p =>
                    p.id === editId ? { ...p, ...updatedProject } : p
                )
            );

            setEditId(null);
            setCurrentView("list");
        } catch (e) {
            console.error(e);
            alert("수정 실패");
        }
    };

    // 삭제
    const handleDelete = async (id) => {
        if (!window.confirm("삭제하시겠습니까?")) return;
        try {
            await axios.delete(`/back/project/${id}`);
            setProjects(prev => prev.filter(p => p.id !== id));
        } catch (e) {
            console.error(e);
            alert("삭제 실패");
        }
    };

    return (
        <>
            <h1>Project</h1>

            {/* 상단 버튼 */}
            <div style={{ marginBottom: "20px" }}>
                <button
                    onClick={() => setCurrentView("list")}
                    style={{ marginLeft: "10px" }}
                >
                    목록
                </button>
                <button
                    onClick={() => {
                        setCurrentView("create");
                        setEditId(null);
                    }}
                >
                    생성
                </button>
            </div>

            {/* 생성 / 수정 폼 */}
            {(currentView === "create" || currentView === "update") && (
                <div style={{ maxWidth: "600px" }}>
                    <div style={{ marginBottom: "10px" }}>
                        <label>이름</label><br />
                        <input
                            name="name"
                            value={form.name}
                            onChange={handleChange}
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>설명</label><br />
                        <textarea
                            name="description"
                            value={form.description}
                            onChange={handleChange}
                            rows={3}
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>방법론</label><br />
                        <input
                            name="methodology"
                            value={form.methodology}
                            onChange={handleChange}
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div style={{ marginBottom: "10px" }}>
                        <label>시작일</label><br />
                        <input
                            type="datetime-local"
                            name="startDate"
                            value={form.startDate}
                            onChange={handleChange}
                            style={{ width: "100%" }}
                        />
                    </div>

                    <div style={{ marginBottom: "20px" }}>
                        <label>종료일</label><br />
                        <input
                            type="datetime-local"
                            name="endDate"
                            value={form.endDate}
                            onChange={handleChange}
                            style={{ width: "100%" }}
                        />
                    </div>

                    {currentView === "create" ? (
                        <button onClick={handleCreate}>생성</button>
                    ) : (
                        <button onClick={handleUpdate}>수정</button>
                    )}
                </div>
            )}

            {/* 목록 */}
            {currentView === "list" && (
                <table
                    border="1"
                    style={{ width: "100%", marginTop: "20px" }}
                >
                    <thead>
                    <tr>
                        <th>이름</th>
                        <th>방법론</th>
                        <th>설명</th>
                        <th>상태</th>
                        <th>관리</th>
                    </tr>
                    </thead>
                    <tbody>
                    {projects.map(p => (
                        <tr key={p.id}>
                            <td>{p.name}</td>
                            <td>{p.methodology}</td>
                            <td>{p.description}</td>
                            <td>{p.status}</td>
                            <td>
                                <button onClick={() => handleEdit(p)}>수정</button>
                                <button
                                    onClick={() => handleDelete(p.id)}
                                    style={{ marginLeft: "5px" }}
                                >
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}
        </>
    );
};

export default Project;

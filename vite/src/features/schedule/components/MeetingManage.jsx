import { useState, useEffect } from "react";
import axios from "axios";

const MeetingManage = () => {
    const [room, setRoom] = useState([]);
    const [currentView, setCurrentView] = useState("list");
    const [form, setForm] = useState({
        meetingRoomId: "",
        name: "",
        location: "",
        capacity: "",
    });

    useEffect(() => {
        axios.get("/back/room", { withCredentials: true })
            .then(res => setRoom(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value,
        });
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            const newRoom = {
                ...form,
                capacity: parseInt(form.capacity),
            };

            await axios.post("/back/room", newRoom);

            setRoom(prev => [...prev, newRoom]);
            setForm({ meetingRoomId: "", name: "", location: "", capacity: "" });
            setCurrentView("list");
            alert("회의실 생성 완료");
        } catch (e) {
            console.error(e);
            alert("회의실 생성 실패");
        }
    };

    const handleEdit = (r) => {
        setForm({
            meetingRoomId: r.meetingRoomId,
            name: r.name,
            location: r.location,
            capacity: r.capacity,
        });
        setCurrentView("update");
    };

    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            const updatedRoom = {
                meetingRoomId: form.meetingRoomId,
                name: form.name,
                location: form.location,
                capacity: parseInt(form.capacity),
            };

            await axios.put(`/back/room/${form.meetingRoomId}`, updatedRoom);

            setRoom(prev =>
                prev.map(r =>
                    r.meetingRoomId === form.meetingRoomId ? updatedRoom : r
                )
            );

            setCurrentView("list");
            alert("회의실 수정 완료");
        } catch (e) {
            console.error(e);
            alert("회의실 수정 실패");
        }
    };

    const handleDelete = async (id) => {
        if (!window.confirm("삭제하시겠습니까?")) return;
        try {
            await axios.delete(`/back/room/${id}`);
            setRoom(prev => prev.filter(r => r.meetingRoomId !== id));
            alert("회의실 삭제 완료");
        } catch (e) {
            console.error(e);
            alert("회의실 삭제 실패");
        }
    };

    return (
        <>
            <h2>회의실 관리 (ADMIN)</h2>

            <div style={{ marginBottom: "10px" }}>
                <button onClick={() => setCurrentView("list")}>회의실 조회</button>
                <button onClick={() => setCurrentView("create")}>회의실 생성</button>
            </div>

            {currentView === "list" && (
                <table border="1">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>이름</th>
                        <th>위치</th>
                        <th>수용 인원</th>
                        <th>수정</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {room.map(r => (
                        <tr key={r.meetingRoomId}>
                            <td>{r.meetingRoomId}</td>
                            <td>{r.name}</td>
                            <td>{r.location}</td>
                            <td>{r.capacity}</td>
                            <td>
                                <button onClick={() => handleEdit(r)}>수정</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(r.meetingRoomId)}>
                                    삭제
                                </button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {currentView === "create" && (
                <form onSubmit={handleSubmit}>
                    ID <input name="meetingRoomId" value={form.meetingRoomId} onChange={handleChange} /><br/>
                    이름 <input name="name" value={form.name} onChange={handleChange} /><br/>
                    위치 <input name="location" value={form.location} onChange={handleChange} /><br/>
                    인원 <input name="capacity" value={form.capacity} onChange={handleChange} /><br/>
                    <button type="submit">생성</button>
                </form>
            )}

            {currentView === "update" && (
                <form onSubmit={handleUpdate}>
                    ID <input value={form.meetingRoomId} readOnly /><br/>
                    이름 <input name="name" value={form.name} onChange={handleChange} /><br/>
                    위치 <input name="location" value={form.location} onChange={handleChange} /><br/>
                    인원 <input name="capacity" value={form.capacity} onChange={handleChange} /><br/>
                    <button type="submit">수정</button>
                </form>
            )}
        </>
    );
};

export default MeetingManage;

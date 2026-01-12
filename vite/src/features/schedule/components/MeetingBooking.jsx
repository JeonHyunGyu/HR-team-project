import { useState, useEffect } from "react";
import axios from "axios";

const MeetingBooking = () => {
    const [booking, setBooking] = useState([]);
    const [currentView, setCurrentView] = useState("list");
    const [form, setForm] = useState({
        id: "",
        meetingRoomId: "",
        empId: "",
        startTime: "",
        endTime: "",
        description: ""
    });

    // R - 전체 조회
    useEffect(() => {
        axios.get("/back/booking", { withCredentials: true })
            .then(res => setBooking(res.data))
            .catch(err => console.error(err));
    }, []);

    const handleChange = (e) => {
        setForm({
            ...form,
            [e.target.name]: e.target.value
        });
    };

    // C - 생성
    const handleSubmit = async (e) => {
        e.preventDefault();
        try {
            await axios.post("/back/booking", {
                meetingRoomId: form.meetingRoomId,
                empId: form.empId,
                startTime: form.startTime,
                endTime: form.endTime,
                description: form.description
            });

            // 재조회
            const res = await axios.get("/back/booking");
            setBooking(res.data);

            setForm({
                id: "",
                meetingRoomId: "",
                empId: "",
                startTime: "",
                endTime: "",
                description: ""
            });

            setCurrentView("list");
            alert("예약 생성 완료");
        } catch (e) {
            console.error(e);
            alert("예약 생성 실패");
        }
    };

    // 수정 화면 전환
    const handleEdit = (b) => {
        setForm({
            id: b.id,
            meetingRoomId: b.meetingRoomId,
            empId: b.empId,
            startTime: b.startTime,
            endTime: b.endTime,
            description: b.description || ""
        });
        setCurrentView("update");
    };

    // U - 수정
    const handleUpdate = async (e) => {
        e.preventDefault();
        try {
            await axios.put(`/back/booking/${form.id}`, {
                meetingRoomId: form.meetingRoomId,
                empId: form.empId,
                startTime: form.startTime,
                endTime: form.endTime,
                description: form.description
            });

            const res = await axios.get("/back/booking");
            setBooking(res.data);

            setCurrentView("list");
            alert("예약 수정 완료");
        } catch (e) {
            console.error(e);
            alert("예약 수정 실패");
        }
    };

    // D - 삭제
    const handleDelete = async (id) => {
        if (!window.confirm("예약을 삭제하시겠습니까?")) return;
        try {
            await axios.delete(`/back/booking/${id}`);

            setBooking(prev => prev.filter(b => b.id !== id));
            alert("예약 삭제 완료");
        } catch (e) {
            console.error(e);
            alert("예약 삭제 실패");
        }
    };

    return (
        <>
            <h1>회의실 예약</h1>

            <div style={{ marginBottom: "10px" }}>
                <button onClick={() => setCurrentView("list")}>예약 조회</button>
                <button onClick={() => setCurrentView("create")}>예약 생성</button>
            </div>

            {/* 목록 */}
            {currentView === "list" && (
                <table border="1">
                    <thead>
                    <tr>
                        <th>ID</th>
                        <th>회의실</th>
                        <th>사원</th>
                        <th>시작</th>
                        <th>종료</th>
                        <th>설명</th>
                        <th>수정</th>
                        <th>삭제</th>
                    </tr>
                    </thead>
                    <tbody>
                    {booking.map(b => (
                        <tr key={b.id}>
                            <td>{b.id}</td>
                            <td>{b.meetingRoomId}</td>
                            <td>{b.empId}</td>
                            <td>{b.startTime}</td>
                            <td>{b.endTime}</td>
                            <td>{b.description}</td>
                            <td>
                                <button onClick={() => handleEdit(b)}>수정</button>
                            </td>
                            <td>
                                <button onClick={() => handleDelete(b.id)}>삭제</button>
                            </td>
                        </tr>
                    ))}
                    </tbody>
                </table>
            )}

            {/* 생성 */}
            {currentView === "create" && (
                <form onSubmit={handleSubmit}>
                    회의실 ID
                    <input name="meetingRoomId" value={form.meetingRoomId} onChange={handleChange} /><br/>

                    사원 ID
                    <input name="empId" value={form.empId} onChange={handleChange} /><br/>

                    시작 시간
                    <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} /><br/>

                    종료 시간
                    <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} /><br/>

                    설명
                    <input name="description" value={form.description} onChange={handleChange} /><br/>

                    <button type="submit">예약 생성</button>
                </form>
            )}

            {/* 수정 */}
            {currentView === "update" && (
                <form onSubmit={handleUpdate}>
                    ID
                    <input value={form.id} readOnly /><br/>

                    회의실 ID
                    <input name="meetingRoomId" value={form.meetingRoomId} onChange={handleChange} /><br/>

                    사원 ID
                    <input name="empId" value={form.empId} onChange={handleChange} /><br/>

                    시작 시간
                    <input type="datetime-local" name="startTime" value={form.startTime} onChange={handleChange} /><br/>

                    종료 시간
                    <input type="datetime-local" name="endTime" value={form.endTime} onChange={handleChange} /><br/>

                    설명
                    <input name="description" value={form.description} onChange={handleChange} /><br/>

                    <button type="submit">예약 수정</button>
                </form>
            )}
        </>
    );
};

export default MeetingBooking;

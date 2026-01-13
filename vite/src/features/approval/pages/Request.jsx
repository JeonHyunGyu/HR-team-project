import React, { useState } from "react";
import { Form, Button, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Request = () => {
    const navigate = useNavigate();

    // 임시 데이터 (나중에 API로 교체 가능)
    const approvalTypes = [
        { id: 1, name: "휴가 신청" },
        { id: 2, name: "출장 신청" }
    ];

    const employees = [
        { id: "2001", name: "팀장 A" },
        { id: "2002", name: "부장 B" },
        { id: "2003", name: "이사 C" }
    ];

    const [form, setForm] = useState({
        typeId: "",
        title: "",
        content: "",
        firstApproverId: "",
        secondApproverId: "",
        thirdApproverId: "",
        files: []
    });

    /* -------------------------------
       입력 핸들러
    -------------------------------- */
    const handleChange = (e) => {
        const { name, value } = e.target;
        setForm(prev => ({ ...prev, [name]: value }));
    };

    const handleFileChange = (e) => {
        const files = Array.from(e.target.files).map(file => ({
            fileName: file.name,
            fileSize: file.size,
            filePath: "/temp"
        }));

        setForm(prev => ({ ...prev, files }));
    };

    /* -------------------------------
       Submit
    -------------------------------- */
    const handleSubmit = async (e) => {
        e.preventDefault();

        //테스트용 제약 해제
        /*if (!form.title || !form.firstApproverId) {
            alert("제목과 1차 결재자는 필수입니다.");
            return;
        }*/

        const payload = {
            empId: "1234", // 테스트용 로그인 사용자
            typeId: form.typeId || 1, // 선택 안하면 기본 1번
            title: form.title || "테스트 문서",
            content: form.content || "",
            firstApproverId: form.firstApproverId || "1234",
            secondApproverId: form.secondApproverId || "1234",
            thirdApproverId: form.thirdApproverId || "1234",
            files: form.files
        };


        const res = await fetch("/back/ho/approvals", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify(payload)
        });

        if (res.ok) {
            const data = await res.json();
            alert("결재 신청했습니다.");
            navigate(`/main/approval/detail/${data.approvalId}`);
        } else {
            alert("결재 신청에 실패했습니다.");
        }
    };

    /* -------------------------------
       Render
    -------------------------------- */
    return (
        <Card>
            <Card.Header>결재 신청</Card.Header>
            <Card.Body>
                <Form onSubmit={handleSubmit}>

                    {/* 결재 유형 */}
                    <Form.Group className="mb-3">
                        <Form.Label>결재 유형</Form.Label>
                        <Form.Select
                            name="typeId"
                            value={form.typeId}
                            onChange={handleChange}
                        >
                            <option value="">선택</option>
                            {approvalTypes.map(type => (
                                <option key={type.id} value={type.id}>
                                    {type.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* 제목 */}
                    <Form.Group className="mb-3">
                        <Form.Label>제목</Form.Label>
                        <Form.Control
                            name="title"
                            value={form.title}
                            onChange={handleChange}
                            placeholder="제목을 입력하세요"
                        />
                    </Form.Group>

                    {/* 내용 */}
                    <Form.Group className="mb-3">
                        <Form.Label>내용</Form.Label>
                        <Form.Control
                            as="textarea"
                            rows={6}
                            name="content"
                            value={form.content}
                            onChange={handleChange}
                        />
                    </Form.Group>

                    {/* 결재자 선택 */}
                    <Form.Group className="mb-3">
                        <Form.Label>1차 결재자</Form.Label>
                        <Form.Select
                            name="firstApproverId"
                            value={form.firstApproverId}
                            onChange={handleChange}
                        >
                            <option value="">선택</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>2차 결재자</Form.Label>
                        <Form.Select
                            name="secondApproverId"
                            value={form.secondApproverId}
                            onChange={handleChange}
                        >
                            <option value="">선택</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    <Form.Group className="mb-3">
                        <Form.Label>3차 결재자</Form.Label>
                        <Form.Select
                            name="thirdApproverId"
                            value={form.thirdApproverId}
                            onChange={handleChange}
                        >
                            <option value="">선택</option>
                            {employees.map(emp => (
                                <option key={emp.id} value={emp.id}>
                                    {emp.name}
                                </option>
                            ))}
                        </Form.Select>
                    </Form.Group>

                    {/* 첨부 파일 */}
                    <Form.Group className="mb-3">
                        <Form.Label>첨부 파일</Form.Label>
                        <Form.Control
                            type="file"
                            multiple
                            onChange={handleFileChange}
                        />
                    </Form.Group>

                    <Button type="submit">결재 신청</Button>
                </Form>
            </Card.Body>
        </Card>
    );
};

export default Request;

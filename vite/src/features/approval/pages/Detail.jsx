import React, { useEffect, useState } from "react";
import { Card, Badge, Button, ListGroup } from "react-bootstrap";
import { useParams, useNavigate } from "react-router-dom";

const Detail = () => {
    const { approvalId } = useParams();
    const navigate = useNavigate();
    const [detail, setDetail] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch(`/back/ho/approvals/${approvalId}`, { credentials: "include" })
            .then(res => res.json())
            .then(data => {
                setDetail(data);
                setLoading(false);
            });
    }, [approvalId]);

    const renderStatus = (status) => {
        switch (status) {
            case "WAIT": return <Badge bg="warning">대기</Badge>;
            case "APPROVED": return <Badge bg="success">승인</Badge>;
            case "REJECTED": return <Badge bg="danger">반려</Badge>;
            case "CANCELLED": return <Badge bg="secondary">취소</Badge>;
            default: return <Badge bg="secondary">{status}</Badge>;
        }
    };

    const handleApprove = async () => {
        // 현재 결재자 empId 가져오기
        const currentEmpId = detail.lines.find(line => line.current)?.empId || "test"; // 없으면 임의값
        const res = await fetch(`/back/ho/approvals/${approvalId}/approve`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ empId: currentEmpId, comment: "테스트 승인" })
        });

        if (res.ok) {
            alert("승인되었습니다.");
            navigate("/main/approval/pending");
        } else {
            const text = await res.text();
            alert("승인 실패: " + text);
        }
    };

    /*
    const handleApprove = async () => {
        const res = await fetch(`/back/ho/approvals/${approvalId}/approve`, {
            method: "POST",
            credentials: "include"
        });

        if (res.ok) {
            alert("승인되었습니다.");
            navigate("/main/approval/pending");
        } else {
            alert("승인 실패: 권한이 없거나 이미 처리된 문서입니다.");
        }
    };

     */

    const handleReject = async () => {
        const comment = prompt("반려 사유를 입력하세요");
        if (!comment) return;

        const res = await fetch(`/back/ho/approvals/${approvalId}/reject`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            credentials: "include",
            body: JSON.stringify({ comment })
        });

        if (res.ok) {
            alert("반려되었습니다.");
            navigate("/main/approval/pending");
        } else {
            alert("반려 실패: 권한이 없거나 이미 처리된 문서입니다.");
        }
    };

    if (loading) return <div>로딩중...</div>;
    if (!detail) return <div>문서를 찾을 수 없습니다.</div>;

    return (
        <Card>
            <Card.Header>
                <strong>{detail.title}</strong> {renderStatus(detail.status)}
            </Card.Header>

            <Card.Body>
                <p>{detail.content}</p>

                <h6>결재선</h6>
                <ListGroup className="mb-3">
                    {detail.lines.map(line => (
                        <ListGroup.Item key={line.lineId}>
                            {line.stepOrder}차 결재자 : {line.empId}
                            {line.current && " (현재 결재자)"}
                        </ListGroup.Item>
                    ))}
                </ListGroup>

                {detail.status === "WAIT" && (
                    <div>
                        <Button variant="success" className="me-2" onClick={handleApprove}>
                            승인
                        </Button>
                        <Button variant="danger" onClick={handleReject}>
                            반려
                        </Button>
                    </div>
                )}
            </Card.Body>
        </Card>
    );
};

export default Detail;

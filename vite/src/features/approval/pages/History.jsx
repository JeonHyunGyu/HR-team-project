import React, { useEffect, useState } from "react";
import { Table, Card, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const History = () => {
    const navigate = useNavigate();
    const [list, setList] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const empId = "1234";

        fetch(`/back/ho/approvals/history?empId=${empId}`, {
            credentials: "include"
        })
            .then(res => res.json())
            .then(data => {
                setList(Array.isArray(data) ? data : []);
                setLoading(false);
            })
            .catch(() => {
                setList([]);
                setLoading(false);
            });
    }, []);

    const renderStatus = (status) => {
        switch (status) {
            case "APPROVED":
                return <Badge bg="success">승인</Badge>;
            case "REJECTED":
                return <Badge bg="danger">반려</Badge>;
            case "CANCELLED":
                return <Badge bg="secondary">취소</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    return (
        <Card>
            <Card.Header>결재 이력</Card.Header>
            <Card.Body>
                {loading ? (
                    <div>로딩중...</div>
                ) : (
                    <Table hover>
                        <thead>
                        <tr>
                            <th>문서번호</th>
                            <th>제목</th>
                            <th>상태</th>
                            <th>신청일</th>
                        </tr>
                        </thead>
                        <tbody>
                        {list.length === 0 ? (
                            <tr>
                                <td colSpan="4" className="text-center">
                                    결재 이력이 없습니다.
                                </td>
                            </tr>
                        ) : (
                            list.map(item => (
                                <tr
                                    key={item.approvalId}
                                    style={{ cursor: "pointer" }}
                                    onClick={() =>
                                        navigate(`/main/approval/detail/${item.approvalId}`)
                                    }
                                >
                                    <td>{item.approvalId}</td>
                                    <td>{item.title}</td>
                                    <td>{renderStatus(item.status)}</td>
                                    <td>{item.createdAt}</td>
                                </tr>
                            ))
                        )}
                        </tbody>
                    </Table>
                )}
            </Card.Body>
        </Card>
    );
};

export default History;

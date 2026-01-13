import React, { useEffect, useState } from "react";
import { Card, Table, Tabs, Tab, Badge } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Pending = () => {
    const navigate = useNavigate();

    const [activeTab, setActiveTab] = useState("approver");
    const [approverList, setApproverList] = useState([]);
    const [requesterList, setRequesterList] = useState([]);
    const [loading, setLoading] = useState(true);

    /* ---------------------------
       데이터 로딩
    ---------------------------- */
    useEffect(() => {
        const empId = "1234";

        Promise.all([
            fetch(`/back/ho/approvals/pending/approve?empId=${empId}`, {
                credentials: "include"
            }).then(res => res.json()),

            fetch(`/back/ho/approvals/pending/request?empId=${empId}`, {
                credentials: "include"
            }).then(res => res.json())
        ])
            .then(([approveData, requestData]) => {
                setApproverList(Array.isArray(approveData) ? approveData : []);
                setRequesterList(Array.isArray(requestData) ? requestData : []);
                setLoading(false);
            })
            .catch(() => {
                setApproverList([]);
                setRequesterList([]);
                setLoading(false);
            });
    }, []);

    /* ---------------------------
       상태 뱃지
    ---------------------------- */
    const renderStatus = (status) => {
        switch (status) {
            case "WAIT":
                return <Badge bg="warning">대기</Badge>;
            case "APPROVED":
                return <Badge bg="success">승인</Badge>;
            case "REJECTED":
                return <Badge bg="danger">반려</Badge>;
            default:
                return <Badge bg="secondary">{status}</Badge>;
        }
    };

    /* ---------------------------
       테이블
    ---------------------------- */
    const renderTable = (list) => (
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
                        문서가 없습니다.
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
    );

    return (
        <Card>
            <Card.Header>결재 대기</Card.Header>
            <Card.Body>
                {loading ? (
                    <div>로딩중...</div>
                ) : (
                    <Tabs
                        activeKey={activeTab}
                        onSelect={(k) => setActiveTab(k)}
                        className="mb-3"
                    >
                        <Tab eventKey="approver" title="내가 결재해야 할 문서">
                            {renderTable(approverList)}
                        </Tab>
                        <Tab eventKey="requester" title="내가 결재 대기중인 문서">
                            {renderTable(requesterList)}
                        </Tab>
                    </Tabs>
                )}
            </Card.Body>
        </Card>
    );
};

export default Pending;

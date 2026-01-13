// src/features/approval/components/ApprovalLayout.jsx
import { Outlet } from "react-router-dom";

const ApprovalLayout = () => {
    return <Outlet />; // 자식 Route가 여기서 렌더링됨
};

export default ApprovalLayout;

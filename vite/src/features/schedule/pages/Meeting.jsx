import MeetingManage from "../components/MeetingManage.jsx";
import MeetingBooking from "../components/MeetingBooking.jsx"
import {useAuth} from "../../../main/AuthContext.jsx";

const Meeting = () => {
    const { user } = useAuth();
    if (!user) return <div>로그인 필요</div>;

    return (
        <>
            <h1>회의실</h1>
            {user.role === "ADMIN" ? (
                <>
                    <MeetingManage />
                    <MeetingBooking />
                </>
            ) : (
                <MeetingBooking />
            )}
        </>
    );
};


export default Meeting;

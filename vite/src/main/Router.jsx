import { Routes, Route } from 'react-router-dom';
import Login from './Login.jsx';
import Sign from './Sign.jsx';
import Home from './Home.jsx';
import Calender from "../features/일정/pages/Calender.jsx";
import EmpMain from './EmpMain.jsx'
function Router() {
    return (
        <Routes>
            <Route path="/" element={<Login />} />
            <Route path="/sign" element={<Sign />} />
            <Route path="/main" element={<Home />}>
                <Route index  element={<EmpMain />}/>   {/* /main */}
                <Route path="schedule/calendar"   element={<Calender />}/>
                <Route path="schedule/my" />
                <Route path="schedule/team" />
            </Route>
        </Routes>
    );
}

export default Router;

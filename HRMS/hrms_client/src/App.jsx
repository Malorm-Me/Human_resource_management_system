import { Routes, Route, Navigate } from "react-router-dom";
import LoginPage from "./components/LoginPage";
import EmployeeDashboard from "./employee/Dashboard";
import EmployeeAttendance from "./employee/Attendance";
import EmployeeSubmitLeave from "./employee/SubmitLeave";
import EmployeePayslip from "./employee/Payslip";
import EmployeeTasks from "./employee/Tasks";
import Profile from "./pages/Profile";
import PassReset from "./pages/password-reset";
import Notifications from "./pages/Notifications";
import ManagerDashboard from "./manager/Dashboard";
import ManagerApproveLeave from "./manager/ApproveLeave";
import ManagerAssignTasks from "./manager/AssignTasks";
import ManagerViewAssignedTasks from "./manager/ViewAssignedTasks";
import ManagerAttendanceView from "./manager/AttendanceView";
import AdminDashboard from "./admin/Dashboard";
import AdminManageUsers from "./admin/ManageUsers";
import AdminDepartments from "./admin/Departments";

function App() {
  return (
    <div className="min-h-screen bg-gray-50">
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<LoginPage />} />
        <Route path="/employee-dashboard" element={<EmployeeDashboard />} />
        <Route path="/employee/attendance" element={<EmployeeAttendance />} />
        <Route
          path="/employee/submit-leave"
          element={<EmployeeSubmitLeave />}
        />
        <Route path="/employee/payslip" element={<EmployeePayslip />} />
        <Route path="/employee/tasks" element={<EmployeeTasks />} />
        <Route path="/pages/profile" element={<Profile />} />
        <Route path="/pages/password-reset" element={<PassReset />} />
        <Route path="/pages/notifications" element={<Notifications />} />
        <Route path="/manager-dashboard" element={<ManagerDashboard />} />
        <Route
          path="/manager/approve-leave"
          element={<ManagerApproveLeave />}
        />
        <Route path="/manager/assign-tasks" element={<ManagerAssignTasks />} />
        <Route
          path="/manager/view-assigned-tasks"
          element={<ManagerViewAssignedTasks />}
        />
        <Route
          path="/manager/attendance-view"
          element={<ManagerAttendanceView />}
        />
        <Route path="/admin-dashboard" element={<AdminDashboard />} />
        <Route path="/admin/manage-users" element={<AdminManageUsers />} />
        <Route path="/admin/departments" element={<AdminDepartments />} />
      </Routes>
    </div>
  );
}

export default App;

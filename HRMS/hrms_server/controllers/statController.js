import db from "../db.js";

export const stat = async (req, res) => {
  try {
    const managerId = req.query.managerId;
    if (!managerId) {
      return res.status(400).json({ message: "managerId query param is required" });
    }

    // Get manager's department id
    const [managerRows] = await db.query(
      "SELECT department_id FROM users WHERE id = ?", 
      [managerId]
    );

    if (managerRows.length === 0) {
      return res.status(404).json({ message: "Manager not found" });
    }

    const departmentId = managerRows[0].department_id;

    // Count pending leave requests for users in this department
    const [pendingLeaveRows] = await db.query(
      `SELECT COUNT(*) AS count
       FROM leave_requests lr
       JOIN users u ON lr.user_id = u.id
       WHERE lr.status = 'Pending' AND u.department_id = ?`,
      [departmentId]
    );

    // Count total employees in this department 
    const [totalEmployeesRows] = await db.query(
      `SELECT COUNT(*) AS count
       FROM users
       WHERE department_id = ? AND role = 'Employee'`,
      [departmentId]
    );

    // Count open tasks assigned to users in this department
    const [openTasksRows] = await db.query(
      `SELECT COUNT(*) AS count
       FROM tasks t
       JOIN users u ON t.assignee_id = u.id
       WHERE t.task_stat = 'In Progress' AND u.department_id = ?`,
      [departmentId]
    );

    res.json({
      pendingLeaveRequests: pendingLeaveRows[0].count,
      totalEmployees: totalEmployeesRows[0].count,
      openTasks: openTasksRows[0].count,
    });
  } catch (err) {
    console.error('Error fetching dashboard stats:', err);
    res.status(500).json({ message: 'Internal server error' });
  }
};

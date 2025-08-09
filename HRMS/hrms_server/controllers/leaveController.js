import db from "../db.js";

// Submit a leave request
export const submitLeaveRequest = async (req, res) => {
  const { userId, type, startDate, endDate, reason } = req.body;

  const sql = `
    INSERT INTO leave_requests (user_id, start_date, end_date, reason, status, created_at, type)
    VALUES (?, ?, ?, ?, 'pending', NOW(), ?)
  `;

  try {
    await db.query(sql, [userId, startDate, endDate, reason, type]);
    res.status(201).json({ message: "Leave request submitted successfully" });
  } catch (err) {
    console.error("Error inserting leave request:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Fetch past leave requests for a specific user
export const getLeaveRequests = async (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT id, type, start_date AS startDate, end_date AS endDate, reason, status
    FROM leave_requests
    WHERE user_id = ?
    ORDER BY id DESC
  `;

  try {
    const [results] = await db.query(sql, [userId]);
    res.json(results);
  } catch (err) {
    console.error("Error fetching leave requests:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get all leave requests 
export const getAllLeaveRequests = async (req, res) => {
  const sql = `
    SELECT lr.id, lr.type, lr.start_date AS startDate, lr.end_date AS endDate, lr.reason, lr.status, u.name AS employee
    FROM leave_requests lr
    JOIN users u ON lr.user_id = u.id
    ORDER BY lr.created_at DESC
  `;

  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("Error fetching all leave requests:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Update leave request status 
export const updateLeaveStatus = async (req, res) => {
  const id = req.params.id;
  const { status } = req.body;

  if (!["approved", "rejected"].includes(status.toLowerCase())) {
    return res.status(400).json({ message: "Invalid status value" });
  }

  const sql = `
    UPDATE leave_requests SET status = ? WHERE id = ?
  `;

  try {
    const [result] = await db.query(sql, [status.toLowerCase(), id]);
    if (result.affectedRows === 0) {
      return res.status(404).json({ message: "Leave request not found" });
    }
    res.json({ message: `Leave request ${id} updated to ${status}` });
  } catch (err) {
    console.error("Error updating leave status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

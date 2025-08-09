import db from "../db.js";

// GET all departments
export const getDepartments = async (req, res) => {
  try {
    const [results] = await db.query("SELECT * FROM departments");
    res.json(results);
  } catch (err) {
    console.error("Database query error:", err);
    res.status(500).json({ error: "Database query failed" });
  }
};

// CREATE department
export const createDepartment = async (req, res) => {
  const { name } = req.body;

  if (!name) {
    return res.status(400).json({ error: "Department name is required" });
  }

  const query = `
    INSERT INTO departments (name, num_employees, created_at)
    VALUES (?, 0, NOW())
  `;

  try {
    const [result] = await db.query(query, [name]);
    res.status(201).json({
      id: result.insertId,
      name,
      num_employees: 0,
    });
  } catch (err) {
    console.error("Error adding department:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// UPDATE department and assign manager
export const updateDepartment = async (req, res) => {
  const { id } = req.params;
  const { name, manager_id, num_employees } = req.body;

  const updateDeptQuery = `
    UPDATE departments 
    SET name = ?, manager_id = ?, num_employees = ?
    WHERE id = ?
  `;

  try {
    await db.query(updateDeptQuery, [name, manager_id, num_employees, id]);
    const updateUserRoleQuery = `UPDATE users SET role = 'Manager' WHERE id = ?`;
    await db.query(updateUserRoleQuery, [manager_id]);
    res.status(200).json({ id, name, manager_id, num_employees });
  } catch (err) {
    console.error("Error updating department or user role:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// DELETE department
export const deleteDepartment = async (req, res) => {
  const { id } = req.params;
  const query = "DELETE FROM departments WHERE id = ?";

  try {
    await db.query(query, [id]);
    res.status(200).json({ message: "Department deleted successfully" });
  } catch (err) {
    console.error("Error deleting department:", err);
    res.status(500).json({ error: "Database error" });
  }
};

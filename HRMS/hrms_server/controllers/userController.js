import db from "../db.js";
import bcrypt from "bcrypt";

// GET all users with department
export const getAllUsers = async (req, res) => {
  const query = `
    SELECT users.*, departments.name AS department
    FROM users
    LEFT JOIN departments ON users.department_id = departments.id
  `;
  try {
    const [result] = await db.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET all users 
export const getUsersList = async (req, res) => {
  const query = `SELECT id, name FROM users`;
  try {
    const [result] = await db.query(query);
    res.json(result);
  } catch (err) {
    res.status(500).json(err);
  }
};

// GET department members for a manager
export const getDepartmentMembers = async (req, res) => {
  const { managerId } = req.params;

  try {
    const [managerResults] = await db.query(
      "SELECT department_id FROM users WHERE id = ? AND role = 'Manager'",
      [managerId]
    );

    if (managerResults.length === 0) {
      return res.status(404).json({ message: "Manager not found or has no department" });
    }

    const departmentId = managerResults[0].department_id;

    const [userResults] = await db.query(
      "SELECT id, name FROM users WHERE department_id = ? AND id != ?",
      [departmentId, managerId]
    );

    res.json(userResults);
  } catch (err) {
    res.status(500).json({ message: "Internal server error" });
  }
};

// ADD new user
export const addUser = async (req, res) => {
  const { name, email, role, department_id } = req.body;
  const plainPassword = "123456";

  try {
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    const insertUserQuery = `
      INSERT INTO users (name, email, password, role, department_id, created_at)
      VALUES (?, ?, ?, ?, ?, NOW())
    `;
    const [result] = await db.query(insertUserQuery, [
      name,
      email,
      hashedPassword,
      role,
      department_id,
    ]);

    await db.query(
      `UPDATE departments SET num_employees = num_employees + 1 WHERE id = ?`,
      [department_id]
    );

    res.status(201).json({ id: result.insertId, name, email, role, department_id });
  } catch (err) {
    if (err.message.includes("password")) {
      res.status(500).json({ error: "Password hashing failed" });
    } else {
      res.status(500).json({ error: "Database error" });
    }
  }
};

// UPDATE user
export const updateUser = async (req, res) => {
  const { id } = req.params;
  const { name, email, role, department_id: newDeptId } = req.body;

  try {
    const [result] = await db.query("SELECT department_id, role FROM users WHERE id = ?", [id]);
    if (result.length === 0) {
      return res.status(500).json({ error: "Failed to fetch user" });
    }

    const oldDeptId = result[0].department_id;
    const oldRole = result[0].role;

    await db.query(
      `UPDATE users SET name = ?, email = ?, role = ?, department_id = ? WHERE id = ?`,
      [name, email, role, newDeptId, id]
    );

    const tasks = [];

    if (oldDeptId !== newDeptId) {
      tasks.push(
        db.query(`UPDATE departments SET num_employees = num_employees - 1 WHERE id = ?`, [oldDeptId])
      );
      tasks.push(
        db.query(`UPDATE departments SET num_employees = num_employees + 1 WHERE id = ?`, [newDeptId])
      );
    }

    if (oldRole === "Manager" && role !== "Manager") {
      tasks.push(
        db.query(`UPDATE departments SET manager_id = NULL WHERE manager_id = ?`, [id])
      );
    }

    await Promise.all(tasks);

    res.status(200).json({ id, name, email, role, department_id: newDeptId });
  } catch {
    res.status(500).json({ error: "Failed to update related department info" });
  }
};

// DELETE user
export const deleteUser = async (req, res) => {
  const { id } = req.params;

  try {
    const [result] = await db.query("SELECT department_id FROM users WHERE id = ?", [id]);

    if (result.length === 0) {
      return res.status(500).json({ error: "Error fetching user before delete" });
    }

    const userDeptId = result[0].department_id;

    await db.query("DELETE FROM users WHERE id = ?", [id]);

    await db.query(
      `UPDATE departments SET num_employees = num_employees - 1 WHERE id = ?`,
      [userDeptId]
    );

    res.status(200).json({ message: "User deleted and department count updated" });
  } catch {
    res.status(500).json({ error: "Database error during delete or update" });
  }
};

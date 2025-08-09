import db from "../db.js";

// Get tasks assigned to a specific user
export const getTasksAssignedToUser = async (req, res) => {
  const userId = req.params.userId;

  const sql = `
    SELECT 
      tasks.id,
      tasks.title,
      tasks.description,
      tasks.due_date AS dueDate,
      tasks.task_stat AS status
    FROM tasks
    WHERE tasks.assignee_id = ?
  `;

  try {
    const [results] = await db.query(sql, [userId]);

    const formattedResults = results.map((task) => ({
      ...task,
      dueDate: task.dueDate?.toISOString().split("T")[0], 
    }));

    res.json(formattedResults);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Get tasks assigned by a specific manager
export const getTasksAssignedByManager = async (req, res) => {
  const managerId = req.params.managerId;

  const sql = `
    SELECT 
      tasks.id,
      tasks.title,
      tasks.description,
      tasks.due_date AS dueDate,
      tasks.task_stat AS status,
      users.name AS assignee
    FROM tasks
    JOIN users ON tasks.assignee_id = users.id
    WHERE tasks.assigned_by = ?
  `;

  try {
    const [results] = await db.query(sql, [managerId]);
    res.json(results);
  } catch (err) {
    console.error("Error fetching tasks:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

// Create a new task
export const createTask = async (req, res) => {
  const { title, description, dueDate, assignee, managerId } = req.body;

  const sql = `
    INSERT INTO tasks (title, description, due_date, assignee_id, created_at, task_stat, assigned_by)
    VALUES (?, ?, ?, ?, NOW(), ?, ?)
  `;

  try {
    await db.query(sql, [title, description, dueDate, assignee, 'Pending', managerId]);
    res.status(201).json({ message: "Task assigned successfully" });
  } catch (err) {
    console.error("Error assigning task:", err);
    res.status(500).json({ error: "Internal server error" });
  }
};

// Update task status
export const updateTaskStatus = async (req, res) => {
  const { taskId } = req.params;
  const { status } = req.body;

  const sql = `UPDATE tasks SET task_stat = ? WHERE id = ?`;

  try {
    await db.query(sql, [status, taskId]);
    res.json({ message: "Task status updated successfully" });
  } catch (err) {
    console.error("Error updating task status:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

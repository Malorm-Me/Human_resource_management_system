import db from "../db.js";
import path from "path";
import fs from "fs";

const uploadDir = path.join(process.cwd(), "uploads");

if (!fs.existsSync(uploadDir)) {
  fs.mkdirSync(uploadDir);
}

function getCurrentTime() {
  const now = new Date();
  return [
    now.getHours().toString().padStart(2, "0"),
    now.getMinutes().toString().padStart(2, "0"),
    now.getSeconds().toString().padStart(2, "0"),
  ].join(":");
}

// Clock-in function
export const clockIn = async (req, res) => {
  const { user_id, date, captured_image, status } = req.body;

  if (!user_id || !date || !captured_image) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const clock_in = getCurrentTime();

  try {
    const [rows] = await db.query("SELECT id FROM users WHERE id = ?", [user_id]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid user_id: user not found" });
    }

    const base64Data = captured_image.replace(/^data:image\/\w+;base64,/, "");
    const buffer = Buffer.from(base64Data, "base64");
    const filename = `selfie-${user_id}-${Date.now()}.png`;
    const filepath = path.join(uploadDir, filename);

    fs.writeFileSync(filepath, buffer);

    const [existing] = await db.query(
      "SELECT * FROM attendance WHERE user_id = ? AND date = ?",
      [user_id, date]
    );

    if (existing.length > 0) {
      await db.query(
        "UPDATE attendance SET clock_in = ?, captured_image = ?, status = ? WHERE user_id = ? AND date = ?",
        [clock_in, filename, status || "Clocked In", user_id, date]
      );
      return res.json({ message: "Clock-in updated successfully", clock_in });
    } else {
      await db.query(
        "INSERT INTO attendance (user_id, date, clock_in, captured_image, status) VALUES (?, ?, ?, ?, ?)",
        [user_id, date, clock_in, filename, status || "Clocked In"]
      );
      return res.json({ message: "Clock-in recorded successfully", clock_in });
    }
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Clock-out function
export const clockOut = async (req, res) => {
  const { user_id, date } = req.body;

  if (!user_id || !date) {
    return res.status(400).json({ message: "Missing required fields" });
  }

  const clock_out = getCurrentTime();

  try {
    const [rows] = await db.query("SELECT id FROM users WHERE id = ?", [user_id]);
    if (rows.length === 0) {
      return res.status(400).json({ message: "Invalid user_id: user not found" });
    }

    await db.query(
      "UPDATE attendance SET clock_out = ?, status = ? WHERE user_id = ? AND date = ?",
      [clock_out, "Clocked Out", user_id, date]
    );
    res.json({ message: "Clock-out recorded successfully", clock_out });
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get attendance history for a user
export const getAttendanceHistory = async (req, res) => {
  const { user_id } = req.params;

  try {
    const [rows] = await db.query("SELECT * FROM attendance WHERE user_id = ? ORDER BY date DESC", [user_id]);
    res.json(rows);
  } catch (err) {
    console.error("Server error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// Get today's clock-in status for a user
export const getTodayStatus = async (req, res) => {
  const { user_id } = req.params;
  const today = new Date().toISOString().split("T")[0];

  const sql = "SELECT clock_in, clock_out FROM attendance WHERE user_id = ? AND date = ? LIMIT 1";

  try {
    const [results] = await db.query(sql, [user_id, today]);

    if (results.length === 0) {
      return res.json({ status: "Not Clocked In" });
    }

    const { clock_in, clock_out } = results[0];

    if (clock_in && !clock_out) {
      return res.json({ status: "Clocked In" });
    } else if (clock_in && clock_out) {
      return res.json({ status: "Clocked Out" });
    } else {
      return res.json({ status: "Not Clocked In" });
    }
  } catch (err) {
    console.error("Database error:", err);
    res.status(500).json({ error: "Database error" });
  }
};

// Get all attendance records
export const getAllAttendance = async (req, res) => {
  const sql = `
    SELECT 
      a.id, 
      a.user_id, 
      u.name AS employee,
      DATE_FORMAT(a.date, '%Y-%m-%d') AS date,
      TIME_FORMAT(a.clock_in, '%h:%i %p') AS timeIn,
      TIME_FORMAT(a.clock_out, '%h:%i %p') AS timeOut,
      a.status,
      a.captured_image AS photo
    FROM attendance a
    LEFT JOIN users u ON a.user_id = u.id
    ORDER BY a.date DESC, u.name
  `;

  try {
    const [results] = await db.query(sql);
    res.json(results);
  } catch (err) {
    console.error("Failed to fetch attendance:", err);
    res.status(500).json({ message: "Internal server error" });
  }
};

import bcrypt from "bcrypt";
import db from "../db.js";

export const resetPassword = async (req, res) => {
  const { userId, newPassword } = req.body;

  if (!userId || !newPassword) {
    return res.status(400).json({ success: false, message: "Missing required fields" });
  }

  try {
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    const query = "UPDATE users SET password = ?, mustChangePassword = 0 WHERE id = ?";
    const [result] = await db.query(query, [hashedPassword, userId]);

    res.json({ success: true, message: "Password updated successfully" });
  } catch (error) {
    console.error("Error resetting password:", error);
    res.status(500).json({ success: false, message: "Something went wrong" });
  }
};

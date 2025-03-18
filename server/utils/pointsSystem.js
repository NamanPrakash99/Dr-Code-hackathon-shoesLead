import User from "../models/User.js";

// Function to add points to a user
export const assignPoints = async (userId, points) => {
  try {
    const user = await User.findById(userId);
    if (!user) return null;

    user.points += points;
    await user.save();
    console.log(`✅ Assigned ${points} points to ${user.email}`);
    return user;
  } catch (error) {
    console.error("❌ Error assigning points:", error);
  }
};

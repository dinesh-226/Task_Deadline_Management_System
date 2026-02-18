const User = require("../models/User");

const getInterns = async (req, res) => {
  try {
    const interns = await User.find({ role: "intern" }).select("-password");
    res.status(200).json(interns);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
const logoutUser = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (user) {
      user.isOnline = false;
      await user.save();
    }

    res.json({ message: "Logged out successfully" });

  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};


module.exports = { getInterns, logoutUser };

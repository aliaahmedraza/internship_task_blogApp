import userModel from "../models/userModel.js";
import bcrypt from "bcrypt";
import dotenv from "dotenv";

export const getUsers = async (req, res) => {
  try {
    const users = await userModel.find({}, { password: 0 });
    return res.status(200).json({
      success: true,
      data: users ?? [],
    });
  } catch (error) {
    console.error("Error in getUsers:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching users",
      error: error?.message || "Internal Server Error",
    });
  }
};

export const getUserById = async (req, res) => {
  try {
    const { id } = req.params ?? {};
    if (!id) {
      return res.status(400).json({
        success: false,
        message: "User ID is required",
      });
    }
    const user = await userModel.findById(id, { password: 0 });
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found",
      });
    }
    return res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error) {
    console.error("Error in getUserById:", error);
    return res.status(500).json({
      success: false,
      message: "Error fetching user",
      error: error?.message || "Internal Server Error",
    });
  }
};

export const createUser = async (req, res) => {
  dotenv.config();
  try {
    const { name, email, password, role, profileImage, bio, socialLinks } =
      req.body ?? {};

    if (!name || !email || !password) {
      return res
        .status(400)
        .json({ message: "Name, email, and password are required" });
    }

    const foundUser = await userModel.findOne({ email });
    if (foundUser) {
      return res.status(400).json({
        message: "A user with this email has already been registered",
      });
    }
    const saltRounds = parseInt(process.env.SALT_ROUND, 10) || 10;
    const hashedPassword = await bcrypt.hash(password, saltRounds);

    const user = await userModel.create({
      name,
      email,
      password: hashedPassword,
      role: role || "user",
      profileImage: profileImage || "",
      bio: bio || "",
      socialLinks: socialLinks || {},
    });

    return res.status(201).json({
      message: "User created successfully",
      user: {
        id: user?._id,
        name: user?.name,
        email: user?.email,
        role: user?.role,
      },
    });
  } catch (error) {
    console.error("Error in createUser:", error);
    return res
      .status(500)
      .json({ error: error?.message || "Internal Server Error" });
  }
};

export const updateUser = async (req, res) => {
  try {
    const { id } = req.params ?? {};
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }
    const { name, email, password, role, profileImage, bio, socialLinks } =
      req.body ?? {};

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    if (email && email !== user.email) {
      const existingUser = await userModel.findOne({ _id: { $ne: id }, email });
      if (existingUser) {
        return res.status(400).json({
          message: "Email is already taken",
        });
      }
    }

    const updateData = {
      name: name ?? user.name,
      email: email ?? user.email,
      role: role ?? user.role,
      profileImage: profileImage ?? user.profileImage,
      bio: bio ?? user.bio,
      socialLinks: socialLinks ?? user.socialLinks,
    };

    if (password) {
      updateData.password = await bcrypt.hash(password, 10);
    }

    const updatedUser = await userModel.findByIdAndUpdate(id, updateData, {
      new: true,
      select: "-password",
    });

    return res.status(200).json({
      message: "User updated successfully",
      user: {
        id: updatedUser?._id,
        name: updatedUser?.name,
        email: updatedUser?.email,
        role: updatedUser?.role,
      },
    });
  } catch (error) {
    console.error("Error in updateUser:", error);
    return res
      .status(500)
      .json({ error: error?.message || "Internal Server Error" });
  }
};

export const deleteUser = async (req, res) => {
  try {
    const { id } = req.params ?? {};
    if (!id) {
      return res.status(400).json({ message: "User ID is required" });
    }

    const user = await userModel.findById(id);
    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    await userModel.findByIdAndDelete(id);

    return res.status(200).json({
      message: "User deleted successfully",
    });
  } catch (error) {
    console.error("Error in deleteUser:", error);
    return res
      .status(500)
      .json({ error: error?.message || "Internal Server Error" });
  }
};

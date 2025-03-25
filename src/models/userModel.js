import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
    {
        name: { type: String, required: true },
        email: { type: String, required: true, unique: true },
        password: { type: String, required: true },
        profileImage: { type: String, default: "" },
        bio: { type: String, maxlength: 300, default: "" },
        role: {
            type: String,
            required: true,
            enum: ["user", "admin"],
            default: "user",
        },
        isVerified: { type: Boolean, default: false },
        socialLinks: { type: Map, of: String, default: {} },
        resetPasswordToken: { type: String, default: null },
        resetPasswordExpires: { type: Date, default: null },
    },
    { timestamps: true }
);

const userModel = mongoose.model("User", userSchema);
export default userModel;

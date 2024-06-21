import bcrypt from "bcryptjs";
import mongoose from "mongoose";
import validator from "validator";

const adminSchema = new mongoose.Schema({
  userName: {
    type: String,
    required: [true, "Please tell us your username!"],
  },
  email: {
    type: String,
    required: [true, "Please provide your email"],
    unique: [true, "The email address is already in use"],
    lowercase: true,
    validate: [validator.isEmail, "Please provide a valid email"],
  },
  password: {
    type: String,
    required: [true, "Please provide a password"],
    minlength: [4, "Password must be above 3 characters"],
  },
  role: {
    type: String,
    enum: ["admin", "superAdmin"],
    default: "admin",
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
});

//! Encrypt Password
adminSchema.pre("save", async function (next) {
  // only run this function if password was Modified or Create
  if (!this.isModified("password")) return next();

  // Hash the password
  this.password = await bcrypt.hash(this.password, 12);
});

//! Check Password
adminSchema.methods.checkPassword = async function (
  candidatePassword,
  userPassword
) {
  return await bcrypt.compare(candidatePassword, userPassword);
};

const Admin = mongoose.model("Admin", adminSchema);
export default Admin;

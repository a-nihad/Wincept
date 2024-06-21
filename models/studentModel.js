import mongoose from "mongoose";

const studentSchema = new mongoose.Schema({
  fullName: {
    type: String,
    required: [true, "fullName is required!"],
  },
  rollNumber: {
    type: Number,
    required: [true, "rollNumber is required"],
  },
  homePhone: {
    type: Number,
    required: [true, "homePhone is required"],
  },
  gender: {
    type: String,
    required: [true, "gender is required"],
    enum: ["male", "female"],
  },
  adminId: {
    type: mongoose.Schema.ObjectId,
    ref: "Admin",
    required: [true, "Student must belong to a admin"],
  },
});

studentSchema.pre(/^find/, function (next) {
    this.populate({
      path: "adminId",
      select: "userName ",
    });
  
    next();
  });

const Student = mongoose.model("Student", studentSchema);
export default Student;

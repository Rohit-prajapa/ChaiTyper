import mongoose from "mongoose";

const sessionSchema = new mongoose.Schema(
  {
    // The logged-in user who completed this typing session
    user: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
    },

    language: {
      type: String,
      required: true,
      enum: ["javascript", "python", "cpp"],
      lowercase: true,
    },

    lessonId: {
      type: String,
      required: true,
      trim: true,
    },

    lessonTitle: {
      type: String,
      required: true,
      trim: true,
    },

    wpm: {
      type: Number,
      required: true,
      min: 0,
    },

    cpm: {
      type: Number,
      required: true,
      min: 0,
    },

    accuracy: {
      type: Number,
      required: true,
      min: 0,
      max: 100,
    },

    errorCount: {
      type: Number,
      required: true,
      min: 0,
      validate: {
        validator: Number.isInteger,
        message: "Errors must be a whole number",
      },
    },

    // Actual time spent typing, in seconds
    duration: {
      type: Number,
      required: true,
      min: 1,
      max: 120,
    },

    // Whether the complete lesson was typed
    completed: {
      type: Boolean,
      default: false,
    },
  },
  {
    timestamps: true,
    versionKey: false,
  },
);

// Efficiently retrieve a user's latest typing sessions
sessionSchema.index({ user: 1, createdAt: -1 });

const Session = mongoose.model("Session", sessionSchema);

export default Session;

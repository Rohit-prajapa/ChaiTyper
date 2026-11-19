import Session from "../models/session.model.js";

// Save a completed typing session
export const saveSession = async (req, res) => {
  try {
    const {
      language,
      lessonId,
      lessonTitle,
      wpm,
      cpm,
      accuracy,
      errors,
      duration,
      completed,
    } = req.body;

    // Validate required fields
    if (
      !language ||
      !lessonId ||
      !lessonTitle ||
      wpm === undefined ||
      cpm === undefined ||
      accuracy === undefined ||
      errors === undefined ||
      duration === undefined
    ) {
      return res.status(400).json({
        success: false,
        message: "All session fields are required",
      });
    }

    // Validate numeric values
    const numericFields = { wpm, cpm, accuracy, errors, duration };

    for (const [field, value] of Object.entries(numericFields)) {
      if (typeof value !== "number" || !Number.isFinite(value)) {
        return res.status(400).json({
          success: false,
          message: `${field} must be a valid number`,
        });
      }
    }

    // Validate language
    const normalizedLanguage = language.toLowerCase();

    if (!["javascript", "python", "cpp"].includes(normalizedLanguage)) {
      return res.status(400).json({
        success: false,
        message: "Unsupported programming language",
      });
    }

    // Validate lesson details
    if (
      typeof lessonId !== "string" ||
      typeof lessonTitle !== "string" ||
      !lessonId.trim() ||
      !lessonTitle.trim()
    ) {
      return res.status(400).json({
        success: false,
        message: "Valid lesson ID and title are required",
      });
    }

    // Validate ranges
    if (
      wpm < 0 ||
      cpm < 0 ||
      accuracy < 0 ||
      accuracy > 100 ||
      errors < 0 ||
      !Number.isInteger(errors) ||
      duration < 1 ||
      duration > 120
    ) {
      return res.status(400).json({
        success: false,
        message: "One or more session values are outside the allowed range",
      });
    }

    if (completed !== undefined && typeof completed !== "boolean") {
      return res.status(400).json({
        success: false,
        message: "Completed must be a boolean",
      });
    }

    // Save session in MongoDB
    const session = await Session.create({
      user: req.user._id,
      language: normalizedLanguage,
      lessonId: lessonId.trim(),
      lessonTitle: lessonTitle.trim(),
      wpm,
      cpm,
      accuracy,
      errorCount: errors,
      duration,
      completed: completed ?? false,
    });

    return res.status(201).json({
      success: true,
      message: "Typing session saved successfully",
      session,
    });
  } catch (error) {
    console.error("Save session error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to save typing session",
    });
  }
};

// Get the logged-in user's typing history
export const getSessions = async (req, res) => {
  try {
    const sessions = await Session.find({
      user: req.user._id,
    })
      .sort({ createdAt: -1 })
      .limit(200)
      .lean();

    return res.status(200).json({
      success: true,
      message: "Typing sessions fetched successfully",
      count: sessions.length,
      sessions,
    });
  } catch (error) {
    console.error("Get sessions error:", error);

    return res.status(500).json({
      success: false,
      message: "Unable to fetch typing sessions",
    });
  }
};

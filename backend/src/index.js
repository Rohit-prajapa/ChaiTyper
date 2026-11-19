import "dotenv/config";
import dns from "node:dns";

// Configure Google DNS before loading Mongoose
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const { default: connectDB } = await import("./config/db.js");
const { default: app } = await import("./app.js");

const PORT = process.env.PORT || 8000;

const startServer = async () => {
  try {
    await connectDB();

    app.listen(PORT, () => {
      console.log(`ChaiTyper Server running on port ${PORT}`);
      console.log(`Local URL: http://localhost:${PORT}`);
    });
  } catch (error) {
    console.error("Server startup failed:", error.message);
    process.exit(1);
  }
};

startServer();

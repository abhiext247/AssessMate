import dotenv from "dotenv";
import app from "./app.js";  //  Only import app, don't duplicate routes

dotenv.config();

app.get("/", (req, res) => {
  res.send("AssessMate API is running...");
});

const PORT = process.env.PORT || 5000;

//  Ensure the server doesn't run during tests
if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

}

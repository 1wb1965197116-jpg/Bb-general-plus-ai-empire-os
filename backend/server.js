const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors());
app.use(express.json());

app.use("/api/ai", require("./routes/ai"));

app.get("/", (req, res) => {
  res.send("AI Demo Running 🚀");
});

app.listen(process.env.PORT || 3000, () => {
  console.log("Server running");
});

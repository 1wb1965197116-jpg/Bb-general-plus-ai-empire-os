const router = require("express").Router();

// simple test route
router.get("/", (req, res) => {
  res.json({ message: "Auth route working ✅" });
});

module.exports = router;

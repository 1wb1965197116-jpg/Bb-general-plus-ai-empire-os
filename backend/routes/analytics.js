const router = require("express").Router();

const events = [];

router.post("/track", (req, res) => {
  const { event } = req.body;

  events.push({ event, time: Date.now() });

  res.json({ status: "tracked" });
});

router.get("/", (req, res) => {
  res.json(events);
});

module.exports = router;

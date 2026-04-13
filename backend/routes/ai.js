const router = require("express").Router();

router.get("/", (req, res) => {
  res.json({ message: "AI Route OK ✅" });
});

router.post("/generate", async (req, res) => {
  const { idea } = req.body;
  const apiKey = process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return res.json({
      files: [
        {
          path: "index.html",
          content: "<h1>Missing API Key</h1>"
        }
      ]
    });
  }

  try {
    const response = await fetch("https://api.openai.com/v1/chat/completions", {
      method: "POST",
      headers: {
        Authorization: "Bearer " + apiKey,
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: "Return ONLY valid JSON. No emojis. No formatting."
          },
          {
            role: "user",
            content: `Return JSON ONLY:
[
 { "path": "index.html", "content": "<h1>${idea}</h1>" }
]`
          }
        ]
      })
    });

    const data = await response.json();

    let raw = data?.choices?.[0]?.message?.content || "";

    console.log("RAW AI:", raw);

    let files;

    try {
      files = JSON.parse(raw);
    } catch (e) {
      files = [
        {
          path: "index.html",
          content: raw || "<h1>AI Fallback</h1>"
        }
      ];
    }

    // 🚨 IMPORTANT: FORCE STRING SAFETY (NO BUFFER)
    files = files.map(f => ({
      path: String(f.path || "index.html"),
      content: String(f.content || "")
    }));

    return res.json({ files });

  } catch (err) {
    return res.json({
      files: [
        {
          path: "index.html",
          content: "ERROR: " + String(err.message)
        }
      ]
    });
  }
});

module.exports = router;

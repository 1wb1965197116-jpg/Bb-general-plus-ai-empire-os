const router = require("express").Router();

// =====================
// 🧪 TEST ROUTE
// =====================
router.get("/", (req, res) => {
  res.json({ message: "AI Demo Route Working ✅" });
});

// =====================
// 🤖 AI GENERATE (FULL FIXED)
// =====================
router.post("/generate", async (req, res) => {
  const { idea } = req.body;

  const apiKey = process.env.OPENAI_API_KEY;

  // ❌ NO KEY
  if (!apiKey) {
    return res.json({
      files: [
        {
          path: "index.html",
          content: "<h1>❌ Missing OpenAI API Key</h1>"
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
        model: "gpt-4o",
        messages: [
          {
            role: "system",
            content:
              "Return ONLY valid JSON. No explanation. No emojis. No special characters."
          },
          {
            role: "user",
            content: `Create a simple working web app.

Return ONLY JSON array:
[
  { "path": "index.html", "content": "<h1>${idea}</h1>" }
]`
          }
        ]
      })
    });

    const data = await response.json();

    console.log("OPENAI RAW RESPONSE:", data);

    let raw = data?.choices?.[0]?.message?.content || "";

    // =====================
    // 🔥 UNICODE FIX
    // =====================
    raw = raw
      .replace(/[^\x00-\x7F]/g, "") // remove non-ASCII
      .replace(/[\u2018\u2019]/g, "'")
      .replace(/[\u201C\u201D]/g, '"');

    console.log("CLEANED AI OUTPUT:", raw);

    let files;

    try {
      files = JSON.parse(raw);
    } catch (err) {
      console.log("JSON PARSE FAILED");

      // ✅ FALLBACK (never empty)
      files = [
        {
          path: "index.html",
          content: raw || "<h1>AI Fallback Output</h1>"
        }
      ];
    }

    // ✅ FINAL SAFETY CHECK
    if (!Array.isArray(files) || files.length === 0) {
      files = [
        {
          path: "index.html",
          content: "<h1>AI Returned Empty</h1>"
        }
      ];
    }

    res.json({ files });

  } catch (error) {
    console.log("AI ERROR:", error);

    res.json({
      files: [
        {
          path: "index.html",
          content: "ERROR: " + error.message
        }
      ]
    });
  }
});

module.exports = router;

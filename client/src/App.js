import React, { useState } from "react";

export default function App() {
  const [input, setInput] = useState("");
  const [output, setOutput] = useState("");

  const API = "http://localhost:3000";

  const generateApp = async () => {
    const res = await fetch(API + "/api/ai/generate", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ idea: input })
    });

    const data = await res.json();

    setOutput(JSON.stringify(data.files, null, 2));
  };

  const deploy = async () => {
    const res = await fetch(API + "/api/deploy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ project: output })
    });

    const data = await res.json();
    alert(data.url);
  };

  return (
    <div style={{ padding: 20 }}>
      <h1>AI Empire OS</h1>

      <textarea
        onChange={(e) => setInput(e.target.value)}
        placeholder="Enter SaaS idea"
      />

      <br />

      <button onClick={generateApp}>Generate</button>
      <button onClick={deploy}>Deploy</button>

      <pre>{output}</pre>
    </div>
  );
}

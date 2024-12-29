const express = require("express");
const cors = require("cors");
const OpenAI = require("openai");
const app = express();

// Add this line to debug
console.log("API Key:", process.env.OPENAI_API_KEY);

app.use(cors());
app.use(express.json());

const openai = new OpenAI({
  apiKey: process.env.OPENAI_API_KEY,
});

const chatHistory = [];

app.post("/api/chat", async (req, res) => {
  try {
    console.log("1. Request received");
    console.log("Message:", req.body.message);

    if (!req.body.message) {
      console.log("Error: No message provided");
      return res.status(400).json({ error: "请输入内容" });
    }

    try {
      console.log("2. Calling OpenAI API with gpt-4o-mini model");
      const completion = await openai.chat.completions.create({
        model: "gpt-4o-mini",
        messages: [
          {
            role: "system",
            content: `你是一个专业的小说创作助手.请注意: 1. 使用简洁易读的格式输出 2. 避免使用 ### 或 #### 等标记 3. 使用空行分隔段落 4. 使用' 第X章 '作为章 节标题 5. 保持自然的叙事流程 6. 确保对话使用引号并另起一行 7. 请给出用户要求字数的3倍以上字数并确定满足字数要求 8. 保持人物名称的准确性以及持续性`,
          },
          {
            role: "user",
            content: req.body.message,
          },
        ],
        max_tokens: 10000,
        temperature: 0.7,
      });

      const response = completion.choices[0].message.content;
      chatHistory.push({ user: req.body.message, bot: response });
      res.json({ message: response });
    } catch (error) {
      console.error("OpenAI API Error:", error);
      res.status(500).json({ error: "生成过程中出现错误，请重试" });
    }
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ error: "服务器错误，请重试" });
  }
});

const PORT = 3001;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

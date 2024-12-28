document.addEventListener("DOMContentLoaded", () => {
  const landingPage = document.getElementById("landing-page");
  const chatContainer = document.getElementById("chat-container");
  const chatHistory = document.getElementById("chatHistory");
  const userInput = document.getElementById("userInput");
  const sendButton = document.getElementById("sendButton");
  const startButton = document.getElementById("startButton");

  // Add console.log to debug
  console.log("Start button:", startButton);

  const BACKEND_URL = "http://localhost:3000"; // Change this to your backend URL

  // List of Chinese characters for random selection
  const characters = [
    "风",
    "云",
    "天",
    "地",
    "山",
    "水",
    "月",
    "日",
    "星",
    "空",
    "龙",
    "凤",
    "虎",
    "鹤",
    "鸟",
    "花",
    "草",
    "木",
    "林",
    "森",
    "江",
    "河",
    "湖",
    "海",
    "波",
    "浪",
    "雨",
    "雪",
    "霜",
    "冰",
    "剑",
    "刀",
    "枪",
    "戟",
    "箭",
    "弓",
    "刃",
    "锋",
    "芒",
    "光",
    "侠",
    "客",
    "豪",
    "杰",
    "士",
    "人",
    "侣",
    "伴",
    "友",
    "朋",
    "道",
    "法",
    "术",
    "功",
    "力",
    "气",
    "神",
    "魂",
    "魄",
    "心",
    "情",
    "意",
    "志",
    "念",
    "思",
    "想",
    "梦",
    "幻",
    "真",
    "实",
    "善",
    "恶",
    "是",
    "非",
    "对",
    "错",
    "正",
    "邪",
    "阴",
    "阳",
    "春",
    "夏",
    "秋",
    "冬",
    "晨",
    "昼",
    "夕",
    "夜",
    "旦",
    "暮",
    "血",
    "汗",
    "泪",
    "笑",
    "哭",
    "怒",
    "喜",
    "忧",
    "愁",
    "乐",
  ];

  const floatingContainer = document.querySelector(".floating-characters");

  // Function to create a single floating character
  function createFloatingChar() {
    const span = document.createElement("span");
    span.textContent =
      characters[Math.floor(Math.random() * characters.length)];

    // Set random horizontal position
    span.style.left = `${Math.random() * 100}%`;

    // Set animation duration and other properties
    span.style.animationDuration = `${15 + Math.random() * 10}s`;
    span.style.fontSize = `${20 + Math.random() * 8}px`;

    floatingContainer.appendChild(span);

    // Remove the element after animation completes
    span.addEventListener("animationend", () => {
      span.remove();
    });
  }

  // Create initial batch of characters
  for (let i = 0; i < 50; i++) {
    setTimeout(createFloatingChar, Math.random() * 2000);
  }

  // Continuously create new characters
  setInterval(() => {
    if (floatingContainer.childNodes.length < 200) {
      // Limit maximum characters
      createFloatingChar();
    }
  }, 200); // Create new character every 200ms

  // Page transition
  const introPage = document.getElementById("intro-page");
  const chatPage = document.getElementById("chat-page");

  startButton.addEventListener("click", () => {
    introPage.classList.remove("active");
    chatPage.classList.add("active");
  });

  function createGeneratingIndicator() {
    const generating = document.createElement("div");
    generating.className = "generating";
    generating.innerHTML = `
            <span></span>
            <span></span>
            <span></span>
        `;
    return generating;
  }

  function appendMessage(message, type, isLoading = false) {
    const messageDiv = document.createElement("div");
    messageDiv.className = `message ${type}-message${
      isLoading ? " loading" : ""
    }`;
    messageDiv.textContent = message;

    // Debug log
    console.log("Appending message:", { message, type, isLoading });

    // Make sure chatHistory exists
    if (!chatHistory) {
      console.error("Chat history element not found!");
      return messageDiv;
    }

    chatHistory.appendChild(messageDiv);
    chatHistory.scrollTop = chatHistory.scrollHeight;
    return messageDiv;
  }

  function updateMessage(messageId, content, isLoading) {
    const messageElement = document.getElementById(messageId);
    if (messageElement) {
      messageElement.textContent = content;
      messageElement.classList.toggle("loading", isLoading);
    }
  }

  async function handleSubmit() {
    const inputElement = document.getElementById("user-input");
    if (!inputElement) return;

    const userInput = inputElement.value;
    if (!userInput.trim()) return;

    // Clear input
    inputElement.value = "";

    // Append user message
    appendMessage({
      message: userInput,
      type: "user",
      isLoading: false,
    });

    // Add loading message and get its ID
    const loadingMessage = {
      message: "正在思考...",
      type: "bot",
      isLoading: true,
    };
    const loadingMessageId = appendMessage(loadingMessage);

    try {
      const response = await fetch("http://174.138.119.118/api/chat", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify({ message: userInput }),
      });

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      console.log("Response received:", data);

      // Update the loading message with the actual response
      const messageElement = document.querySelector(
        `[data-message-id="${loadingMessageId}"]`
      );
      if (messageElement) {
        messageElement.textContent = data.message;
        messageElement.classList.remove("loading");
      }
    } catch (error) {
      console.error("Error:", error);
      // Handle the error appropriately
      const messageElement = document.querySelector(
        `[data-message-id="${loadingMessageId}"]`
      );
      if (messageElement) {
        messageElement.textContent = "Error: Could not get response";
        messageElement.classList.remove("loading");
      }
    }
  }

  sendButton.addEventListener("click", handleSubmit);
  userInput.addEventListener("keypress", (e) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  });
});

document.addEventListener("DOMContentLoaded", () => {
  console.log("DOM Content Loaded - Start");

  // Get all DOM elements
  const introPage = document.getElementById("intro-page");
  const chatPage = document.getElementById("chat-page");
  const startButton = document.getElementById("startButton");
  const userInput = document.getElementById("userInput");
  const sendButton = document.getElementById("sendButton");
  const chatHistory = document.getElementById("chatHistory");
  const floatingContainer = document.querySelector(".floating-characters");

  // Debug log
  console.log("Elements found:", {
    introPage: !!introPage,
    chatPage: !!chatPage,
    startButton: !!startButton,
    userInput: !!userInput,
    sendButton: !!sendButton,
    chatHistory: !!chatHistory,
  });

  // Start button handler
  if (startButton) {
    startButton.addEventListener("click", () => {
      console.log("Start button clicked");
      if (introPage && chatPage) {
        introPage.classList.remove("active");
        chatPage.classList.add("active");
        if (userInput) userInput.focus();
      }
    });
  }

  // Chat handlers
  if (sendButton) {
    sendButton.addEventListener("click", handleSubmit);
  }

  if (userInput) {
    userInput.addEventListener("keypress", (e) => {
      if (e.key === "Enter" && !e.shiftKey) {
        handleSubmit(e);
      }
    });
  }

  // Floating characters functionality
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

  function createFloatingChar() {
    const span = document.createElement("span");
    span.textContent =
      characters[Math.floor(Math.random() * characters.length)];
    span.style.left = `${Math.random() * 100}%`;
    span.style.animationDuration = `${15 + Math.random() * 10}s`;
    span.style.fontSize = `${20 + Math.random() * 8}px`;

    floatingContainer.appendChild(span);
    span.addEventListener("animationend", () => span.remove());
  }

  // Create initial batch of characters
  for (let i = 0; i < 50; i++) {
    setTimeout(createFloatingChar, Math.random() * 2000);
  }

  // Continuously create new characters
  setInterval(() => {
    if (floatingContainer.childNodes.length < 200) {
      createFloatingChar();
    }
  }, 200);
});

let messageCounter = 0;

function appendMessage({ message, type, isLoading }) {
  console.log("Appending message:", { message, type, isLoading });
  const messagesDiv = document.getElementById("chatHistory");
  if (!messagesDiv) {
    console.error("chatHistory div not found");
    return;
  }

  const messageDiv = document.createElement("div");
  const messageId = `message-${messageCounter++}`;

  messageDiv.id = messageId;
  messageDiv.className = `message ${type}-message`;
  messageDiv.textContent = message;

  if (isLoading) {
    messageDiv.classList.add("loading");
  }

  messagesDiv.appendChild(messageDiv);
  messagesDiv.scrollTop = messagesDiv.scrollHeight;

  return messageId;
}

async function handleSubmit(event) {
  if (event) {
    event.preventDefault();
  }

  const inputElement = document.getElementById("userInput");
  if (!inputElement) return;

  const userInput = inputElement.value.trim();
  if (!userInput) return;

  // Clear input
  inputElement.value = "";

  // Append user message
  appendMessage({
    message: userInput,
    type: "user",
    isLoading: false,
  });

  // Add loading message
  const loadingMessageId = appendMessage({
    message: "正在思考...",
    type: "bot",
    isLoading: true,
  });

  try {
    const response = await fetch("http://174.138.119.118:3001/api/chat", {
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

    // Update loading message with response
    const messageElement = document.getElementById(loadingMessageId);
    if (messageElement) {
      messageElement.textContent = data.message;
      messageElement.classList.remove("loading");
    }
  } catch (error) {
    console.error("Error:", error);
    const messageElement = document.getElementById(loadingMessageId);
    if (messageElement) {
      messageElement.textContent = "Error: Could not get response";
      messageElement.classList.remove("loading");
    }
  }
}

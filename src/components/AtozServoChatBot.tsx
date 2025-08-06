import { useEffect } from "react";

const AtozServoChatBot = () => {
  useEffect(() => {
    const script = document.createElement("script");
    script.type = "module";
    script.innerHTML = `
      import Chatbot from "https://cdn.jsdelivr.net/npm/flowise-embed/dist/web.js";
      Chatbot.init({
        chatflowid: "534fd4b6-4230-4866-92a7-63b08efa33e3",
        apiHost: "http://localhost:3000",
        theme: {
         button: {
            backgroundColor: "#A0AEC0", 
            right: 25,
            bottom: 65,
            size: 40, // increased size
            dragAndDrop: true,
            iconColor: "#ffffff", // icon color white
            customIconSrc: "https://cdn-icons-png.flaticon.com/512/726/726623.png", // professional chat icon
            autoWindowOpen: {
              autoOpen: false,
              openDelay: 3,
              autoOpenOnMobile: false
            }
          },
          chatWindow: {
            showTitle: true,
            title: "AtozServo Support",
            titleAvatarSrc: "https://ik.imagekit.io/pimx50ija/WhatsApp%20Image%202025-07-29%20at%2011.55.02_14a164c8.jpg?updatedAt=1753770842278",
            welcomeMessage: "Hi 👋 How can I assist you today?",
            errorMessage: "Oops! Something went wrong. Please try again.",
            backgroundColor: "rgba(18,20,27,0.85)",
            height: 460,
            width: 300,
            fontSize: 15,
            clearChatOnReload: false,
            renderHTML: true,
            customCSS: \`
              * {
                user-select: none !important;
                -webkit-user-drag: none !important;
              }
              .flowise-footer a {
                display: none !important;
              }
              .flowise-footer::after {
                content: "Powered by AtozServo";
                display: block;
                text-align: center;
                padding-top: 10px;
                color: #A0AEC0;
                font-size: 12px;
                font-family: 'Inter', sans-serif;
              }
              .flowise-chatbot-container {
                margin-top: 50px;
                box-shadow: 0 16px 48px rgba(0,0,0,0.6);
                border-radius: 32px !important;
                backdrop-filter: blur(10px);
                overflow: hidden;
                font-family: 'Inter', sans-serif;
                border: 1px solid rgba(255,255,255,0.1);
                animation: slideUp 0.4s ease-in-out;
              }
              .flowise-chat-send-button {
                background-color: #0A84FF !important;
                border-radius: 12px !important;
              }
              .flowise-chat-input-box {
                border-radius: 12px !important;
              }
              .flowise-chatbot-button {
                transition: transform 0.3s ease;
              }
              .flowise-chatbot-button:hover {
                transform: scale(1.08);
              }
              .flowise-messages-container::-webkit-scrollbar {
                width: 8px;
              }
              .flowise-messages-container::-webkit-scrollbar-track {
                background: #1A202C;
              }
              .flowise-messages-container::-webkit-scrollbar-thumb {
                background: #4C51BF;
                border-radius: 4px;
              }
              @media (max-width: 640px) {
                .flowise-chatbot-container {
                  width: 92vw !important;
                  height: 78vh !important;
                  border-radius: 24px !important;
                }
              }
              @keyframes slideUp {
                from {
                  opacity: 0;
                  transform: translateY(50px);
                }
                to {
                  opacity: 1;
                  transform: translateY(0);
                }
              }
            \`,
            botMessage: {
              backgroundColor: "#2D3748",
              textColor: "#E5E7EB",
              showAvatar: true,
              avatarSrc: "https://ik.imagekit.io/pimx50ija/GENKUB%20-%20Greeting%20robot@1-1366x633.jpg?updatedAt=1754282259385"
            },
            userMessage: {
              backgroundColor: "#0A84FF",
              textColor: "#ffffff",
              showAvatar: true,
              avatarSrc: "https://raw.githubusercontent.com/zahidkhawaja/langchain-chat-nextjs/main/public/usericon.png"
            },
            animation: {
              entry: "fade",
              speed: 0.4,
              easing: "ease-in-out"
            },
            textInput: {
              placeholder: "Type your question...",
              backgroundColor: "#111827",
              textColor: "#E5E7EB",
              sendButtonColor: "#0A84FF",
              maxChars: 200,
              autoFocus: true,
              sendMessageSound: true,
              receiveMessageSound: true
            },
            feedback: {
              color: "#81E6D9"
            },
            dateTimeToggle: {
              date: false,
              time: true
            },
            starterPrompts: [
              "💡 How to get started?",
              "🛠️ What services can I offer?",
              "❓ Help with my service setup."
            ],
            starterPromptFontSize: 14
          }
        }
      });
    `;
    document.body.appendChild(script);

    const timer = setTimeout(() => {
      const hint = document.createElement("div");
      hint.innerHTML = `
        <div style="display: flex; align-items: center;">
          <svg style="width: 20px; height: 20px; margin-right: 8px; fill: currentColor;" viewBox="0 0 24 24">
            <path d="M12 2C6.47 2 2 6.47 2 12s4.47 10 10 10 10-4.47 10-10S17.53 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm-1-13h2v6h-2zm0 8h2v2h-2z"/>
          </svg>
          <span>Need any help?</span>
        </div>
      `;
      Object.assign(hint.style, {
        position: "fixed",
        right: "95px",
        bottom: "78px",
        padding: "10px 18px",
        backgroundColor: "#0A84FF",
        color: "white",
        borderRadius: "25px",
        fontSize: "14px",
        fontFamily: "'Inter', sans-serif",
        fontWeight: "500",
        boxShadow: "0 4px 12px rgba(0,0,0,0.2)",
        animation: "fadeInPulse 3s ease-in-out infinite",
        zIndex: "9998"
      });
      document.body.appendChild(hint);
      setTimeout(() => {
        document.body.removeChild(hint);
      }, 10000);
    }, 10 * 60 * 1000);

    const style = document.createElement("style");
    style.innerHTML = `
      @import url('https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600&display=swap');
      @keyframes fadeInPulse {
        0% { opacity: 0.7; transform: translateY(5px); }
        50% { opacity: 1; transform: translateY(0); }
        100% { opacity: 0.7; transform: translateY(5px); }
      }
    `;
    document.head.appendChild(style);

    return () => {
      document.body.removeChild(script);
      document.head.removeChild(style);
      clearTimeout(timer);
    };
  }, []);

  return null;
};

export default AtozServoChatBot;

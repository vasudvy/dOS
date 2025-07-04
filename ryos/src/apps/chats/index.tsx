import { BaseApp } from "../base/types";
import { ChatsAppComponent } from "./components/ChatsAppComponent";

export const helpItems = [
  {
    icon: "💬",
    title: "Chat with AI Assistant",
    description:
      "Type your message to chat with the AI assistant, generate code, or help with AiOS.",
  },
  {
    icon: "#️⃣",
    title: "Join Chat Rooms",
    description:
      "Connect with netizens in public chat rooms.",
  },
  {
    icon: "🎤",
    title: "Push to Talk",
    description:
      "Hold Space or tap the microphone button to record and send voice messages.",
  },
  {
    icon: "📝",
    title: "Control TextEdit",
    description:
      "Ask the AI to read, insert, replace, or delete lines in your open TextEdit document.",
  },
  {
    icon: "🚀",
    title: "Control Apps",
    description:
      "Ask the AI to launch or close other applications like Internet Explorer or Video Player.",
  },
  {
    icon: "💾",
    title: "Save Transcript",
    description:
      "Save your current chat conversation with the AI as a Markdown file.",
  },
];

export const appMetadata = {
  name: "Chats",
  version: "1.0",
  creator: {
    name: "AI Desktop Team",
    url: "https://aios.example.com",
  },
  github: "https://github.com/ai-desktop/aios",
  icon: "/icons/question.png",
};

export const ChatsApp: BaseApp = {
  id: "chats",
  name: "Chats",
  icon: { type: "image", src: appMetadata.icon },
  description: "Chat with your personal AI assistant",
  component: ChatsAppComponent,
  helpItems,
  metadata: appMetadata,
};

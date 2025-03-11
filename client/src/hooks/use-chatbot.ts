import { useLocalStorage } from './use-local-storage';

interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: number;
}

const PREDEFINED_RESPONSES = {
  help: "How can I help you today? You can ask about challenges, points, or badges!",
  challenges: "Complete challenges to earn points and level up! New challenges unlock as you progress.",
  points: "Points are earned by completing challenges. Every 1000 points levels you up!",
  badges: "Earn badges by achieving special milestones. Keep an eye on the badges page!",
};

export function useChatbot() {
  const [messages, setMessages] = useLocalStorage<ChatMessage[]>('chat-history', []);

  const addMessage = (text: string, isUser: boolean) => {
    const newMessage: ChatMessage = {
      id: Math.random().toString(36).substring(7),
      text,
      isUser,
      timestamp: Date.now(),
    };

    setMessages((prev) => [...prev, newMessage]);

    if (isUser) {
      const response = getBotResponse(text.toLowerCase());
      addMessage(response, false);
    }
  };

  const getBotResponse = (text: string): string => {
    if (text.includes('help')) return PREDEFINED_RESPONSES.help;
    if (text.includes('challenge')) return PREDEFINED_RESPONSES.challenges;
    if (text.includes('point')) return PREDEFINED_RESPONSES.points;
    if (text.includes('badge')) return PREDEFINED_RESPONSES.badges;
    return "I'm not sure about that. Try asking about challenges, points, or badges!";
  };

  return {
    messages,
    addMessage,
  };
}

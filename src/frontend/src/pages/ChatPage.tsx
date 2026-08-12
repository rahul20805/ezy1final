import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ScrollArea } from "@/components/ui/scroll-area";
import {
  Bot,
  Heart,
  MessageSquare,
  Package,
  Send,
  Sparkles,
  Truck,
  User,
  UtensilsCrossed,
} from "lucide-react";
import { AnimatePresence, motion } from "motion/react";
import { useEffect, useRef, useState } from "react";
import UserLayout from "../components/UserLayout";

interface Message {
  id: number;
  role: "user" | "bot";
  text: string;
  timestamp: Date;
}

const BOT_NAME = "Ezy Assistant";

const quickActions = [
  {
    label: "Browse Healthcare",
    icon: Heart,
    query: "Show me healthcare options",
  },
  { label: "Book Transport", icon: Truck, query: "Book a ride or bus ticket" },
  { label: "Order Food", icon: UtensilsCrossed, query: "Order food near me" },
  { label: "Track Order", icon: Package, query: "Track my order status" },
];

const mockResponses: Record<string, string> = {
  healthcare:
    "🏥 I found 3 top doctors available today!\n\n• **Dr. Priya Sharma** — General Physician, ₹300, slot at 10:30 AM\n• **Dr. Anita Nair** — Pediatrician, ₹400, slot at 2:00 PM\n• **Dr. Vikram Singh** — Orthopedic, ₹700, slot at 4:00 PM\n\nWould you like me to book an appointment?",
  transport:
    "🚌 Here are your transport options:\n\n• **Express Bus to Mysuru** — 6:00 AM, ₹180, 12 seats left\n• **Cab Booking** — Indiranagar to Whitefield, ~₹220, 12 min away\n• **Auto Share** — MG Road, ₹60, 3 min away\n\nWhich would you prefer?",
  food: "🍱 Trending food options near you:\n\n• **Reddy Tiffin Centre** — Full thali ₹80, 4.3★, 20 min delivery\n• **Meghana Foods** — Biryani ₹160, 4.7★, 30 min delivery\n• **Sharma Kirana** — Groceries with same-day delivery\n\nShall I place an order?",
  track:
    "📦 Your recent orders:\n\n• **Grocery Order** — Out for delivery, expected in 25 mins\n• **Medicines (Nair Pharma)** — Delivered on Apr 12\n• **Cab Ride** — Completed, Apr 10 — ₹220\n\nNeed details on any specific order?",
  default:
    "Hi there! I'm **Ezy Assistant**, your AI helper for all things Ezy1. I can help you:\n\n• 📅 Book doctors & healthcare\n• 🚌 Find buses & rides\n• 🛒 Order groceries & food\n• 💰 Check wallet & payments\n\nTry asking me something specific!",
};

function getBotResponse(text: string): string {
  const lower = text.toLowerCase();
  if (
    lower.includes("health") ||
    lower.includes("doctor") ||
    lower.includes("healthcare") ||
    lower.includes("fever") ||
    lower.includes("hospital")
  )
    return mockResponses.healthcare;
  if (
    lower.includes("transport") ||
    lower.includes("bus") ||
    lower.includes("ride") ||
    lower.includes("cab") ||
    lower.includes("auto")
  )
    return mockResponses.transport;
  if (
    lower.includes("food") ||
    lower.includes("order food") ||
    lower.includes("eat") ||
    lower.includes("restaurant") ||
    lower.includes("thali")
  )
    return mockResponses.food;
  if (
    lower.includes("track") ||
    lower.includes("delivery") ||
    lower.includes("order status")
  )
    return mockResponses.track;
  return mockResponses.default;
}

// Pre-loaded mock conversation
const initialMessages: Message[] = [
  {
    id: 1,
    role: "bot",
    text: `Hi! I'm ${BOT_NAME}. How can I help you today? 🙏`,
    timestamp: new Date(Date.now() - 5 * 60_000),
  },
  {
    id: 2,
    role: "user",
    text: "Can you help me find a doctor for tomorrow morning?",
    timestamp: new Date(Date.now() - 4 * 60_000),
  },
  {
    id: 3,
    role: "bot",
    text: "🏥 I found 3 top doctors available today!\n\n• **Dr. Priya Sharma** — General Physician, ₹300, slot at 10:30 AM\n• **Dr. Anita Nair** — Pediatrician, ₹400, slot at 2:00 PM\n• **Dr. Vikram Singh** — Orthopedic, ₹700, slot at 4:00 PM\n\nWould you like me to book an appointment?",
    timestamp: new Date(Date.now() - 3 * 60_000),
  },
  {
    id: 4,
    role: "user",
    text: "Book Dr. Priya Sharma at 10:30 AM",
    timestamp: new Date(Date.now() - 2 * 60_000),
  },
  {
    id: 5,
    role: "bot",
    text: "✅ Done! Appointment booked with **Dr. Priya Sharma** (General Physician) for tomorrow at **10:30 AM**.\n\nConfirmation sent to your registered number. Reminder will be sent 30 minutes before. Is there anything else I can help with?",
    timestamp: new Date(Date.now() - 1 * 60_000),
  },
];

function formatTime(date: Date): string {
  return date.toLocaleTimeString("en-IN", {
    hour: "2-digit",
    minute: "2-digit",
    hour12: true,
  });
}

function renderFormatted(text: string) {
  return text.split("\n").map((line, lineIdx) => {
    const segments = line.split(/\*\*(.*?)\*\*/g);
    const rendered = segments.map((seg, segIdx) =>
      segIdx % 2 === 1 ? (
        <strong key={`${lineIdx}-bold-${seg.slice(0, 6)}`}>{seg}</strong>
      ) : (
        seg
      ),
    );
    return lineIdx < text.split("\n").length - 1
      ? [...rendered, <br key={`br-line-${lineIdx}-${line.slice(0, 4)}`} />]
      : rendered;
  });
}

function MessageBubble({ msg }: { msg: Message }) {
  const isBot = msg.role === "bot";
  return (
    <div className={`flex gap-2.5 ${isBot ? "flex-row" : "flex-row-reverse"}`}>
      <div
        className={`w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 shadow-sm ${
          isBot ? "bg-gradient-to-br from-secondary to-accent" : "bg-primary"
        }`}
      >
        {isBot ? (
          <Bot className="w-4 h-4 text-white" />
        ) : (
          <User className="w-4 h-4 text-primary-foreground" />
        )}
      </div>
      <div
        className={`flex flex-col gap-1 max-w-[78%] ${isBot ? "items-start" : "items-end"}`}
      >
        <div
          className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${
            isBot
              ? "bg-muted text-foreground rounded-tl-sm"
              : "bg-primary text-primary-foreground rounded-tr-sm shadow-sm"
          }`}
        >
          {renderFormatted(msg.text)}
        </div>
        <span className="text-[10px] text-muted-foreground px-1">
          {formatTime(msg.timestamp)}
        </span>
      </div>
    </div>
  );
}

function TypingIndicator() {
  return (
    <div className="flex gap-2.5" data-ocid="chat.loading_state">
      <div className="w-8 h-8 rounded-full bg-gradient-to-br from-secondary to-accent flex items-center justify-center flex-shrink-0 shadow-sm">
        <Bot className="w-4 h-4 text-white" />
      </div>
      <div className="bg-muted rounded-2xl rounded-tl-sm px-4 py-3">
        <div className="flex gap-1 items-center h-5">
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:0ms]" />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:150ms]" />
          <span className="w-2 h-2 bg-muted-foreground/60 rounded-full animate-bounce [animation-delay:300ms]" />
        </div>
      </div>
    </div>
  );
}

export default function ChatPage() {
  const [messages, setMessages] = useState<Message[]>(initialMessages);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const nextId = useRef(initialMessages.length + 1);

  const scrollToBottom = () => {
    if (scrollRef.current) {
      scrollRef.current.scrollTop = scrollRef.current.scrollHeight;
    }
  };

  useEffect(scrollToBottom);

  const sendMessage = (text: string) => {
    if (!text.trim() || isTyping) return;
    const userMsg: Message = {
      id: nextId.current++,
      role: "user",
      text: text.trim(),
      timestamp: new Date(),
    };
    setMessages((prev) => [...prev, userMsg]);
    setInput("");
    setIsTyping(true);

    setTimeout(() => {
      const botMsg: Message = {
        id: nextId.current++,
        role: "bot",
        text: getBotResponse(text),
        timestamp: new Date(),
      };
      setMessages((prev) => [...prev, botMsg]);
      setIsTyping(false);
    }, 1200);
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    sendMessage(input);
  };

  return (
    <UserLayout title="AI Assistant">
      <div
        className="flex flex-col bg-card rounded-2xl border border-border overflow-hidden"
        style={{ height: "calc(100vh - 8rem)", maxHeight: "740px" }}
        data-ocid="chat.page"
      >
        {/* Chat header */}
        <div className="p-4 border-b border-border bg-muted/30 flex items-center gap-3 flex-shrink-0">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-secondary to-accent flex items-center justify-center shadow-sm flex-shrink-0">
            <Bot className="w-5 h-5 text-white" />
          </div>
          <div className="flex-1 min-w-0">
            <div className="font-display font-semibold text-foreground">
              {BOT_NAME}
            </div>
            <div className="flex items-center gap-1.5 text-xs text-muted-foreground">
              <span className="w-2 h-2 rounded-full bg-green-500 inline-block" />
              Always online · Smart recommendations
            </div>
          </div>
          <Badge
            variant="outline"
            className="gap-1 text-xs border-secondary/40 text-secondary flex-shrink-0"
          >
            <Sparkles className="w-3 h-3" /> AI
          </Badge>
        </div>

        {/* Messages area */}
        <div
          ref={scrollRef}
          className="flex-1 overflow-y-auto p-4 space-y-4"
          data-ocid="chat.messages_panel"
        >
          <AnimatePresence initial={false}>
            {messages.map((msg) => (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.25 }}
                data-ocid={`chat.message.${msg.id}`}
              >
                <MessageBubble msg={msg} />
              </motion.div>
            ))}
          </AnimatePresence>
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 8 }}
              animate={{ opacity: 1, y: 0 }}
            >
              <TypingIndicator />
            </motion.div>
          )}
        </div>

        {/* Quick action chips */}
        <div className="px-4 py-2 flex gap-2 overflow-x-auto scrollbar-hide flex-shrink-0 border-t border-border/50">
          {quickActions.map((action) => {
            const Icon = action.icon;
            return (
              <button
                key={action.label}
                type="button"
                onClick={() => sendMessage(action.query)}
                disabled={isTyping}
                className="flex-shrink-0 flex items-center gap-1.5 text-xs px-3 py-1.5 bg-primary/10 text-primary border border-primary/25 rounded-full hover:bg-primary/20 transition-smooth disabled:opacity-50 disabled:cursor-not-allowed whitespace-nowrap"
                data-ocid={`chat.quick_action.${action.label.toLowerCase().replace(/\s+/g, "_")}`}
              >
                <Icon className="w-3 h-3" />
                {action.label}
              </button>
            );
          })}
        </div>

        {/* Input area */}
        <form
          onSubmit={handleSubmit}
          className="p-4 border-t border-border flex gap-2 flex-shrink-0"
          data-ocid="chat.input_form"
        >
          <div className="relative flex-1">
            <MessageSquare className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground pointer-events-none" />
            <Input
              ref={inputRef}
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask me anything..."
              className="pl-10 h-11 bg-background border-border rounded-xl"
              disabled={isTyping}
              data-ocid="chat.message_input"
            />
          </div>
          <Button
            type="submit"
            disabled={!input.trim() || isTyping}
            className="bg-primary text-primary-foreground hover:bg-primary/90 h-11 w-11 p-0 rounded-xl flex-shrink-0 shadow-sm"
            aria-label="Send message"
            data-ocid="chat.send_button"
          >
            <Send className="w-4 h-4" />
          </Button>
        </form>
      </div>
    </UserLayout>
  );
}

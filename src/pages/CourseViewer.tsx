import { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Bot, Send, Lock, CreditCard } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const CourseViewer = () => {
  const { slug } = useParams();
  const [isPaid, setIsPaid] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Welcome to **Introduction to Machine Learning**! I'm your AI learning assistant.\n\nWhat would you like to learn about today?\n\n• Core ML Concepts\n• Types of Machine Learning\n• Practical Applications\n• Hands-on Exercises",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [messageCount, setMessageCount] = useState(0);

  const handleSend = async () => {
    if (!input.trim()) return;

    if (!isPaid && messageCount >= 3) {
      return;
    }

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);
    setMessageCount(prev => prev + 1);

    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: "That's a great question! Machine learning allows computers to learn from data and make predictions without being explicitly programmed for every scenario.\n\nHere's a simple example:\n\n🔹 **Input**: Thousands of cat and dog images\n🔹 **Training**: Model learns distinguishing features\n🔹 **Output**: Can classify new images it's never seen\n\nWould you like to explore a specific algorithm?",
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const handlePurchase = () => {
    setIsPaid(true);
    setMessageCount(0);
  };

  return (
    <div className="min-h-screen bg-background flex flex-col">
      {/* Header */}
      <header className="bg-card border-b border-border">
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-primary to-accent flex items-center justify-center">
              <Bot className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-semibold text-foreground">Introduction to Machine Learning</span>
          </div>
          <div className="text-sm text-muted-foreground">
            Powered by{" "}
            <Link to="/" className="text-primary hover:underline">
              LearnAgentAI
            </Link>
          </div>
        </div>
      </header>

      {/* Chat Area */}
      <div className="flex-1 flex flex-col relative">
        <div className="flex-1 overflow-y-auto p-6">
          <div className="max-w-2xl mx-auto space-y-6">
            <AnimatePresence mode="popLayout">
              {messages.map((message) => (
                <motion.div
                  key={message.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`flex gap-4 ${
                    message.role === "user" ? "justify-end" : ""
                  }`}
                >
                  {message.role === "assistant" && (
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                      <Bot className="h-5 w-5 text-primary-foreground" />
                    </div>
                  )}
                  <div
                    className={`max-w-[80%] p-4 rounded-2xl ${
                      message.role === "user"
                        ? "bg-primary text-primary-foreground rounded-br-md"
                        : "bg-card border border-border rounded-bl-md"
                    }`}
                  >
                    <div 
                      className="prose prose-sm max-w-none"
                      dangerouslySetInnerHTML={{ 
                        __html: message.content
                          .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
                          .replace(/\n/g, '<br />')
                          .replace(/• /g, '&bull; ')
                      }}
                    />
                  </div>
                </motion.div>
              ))}
            </AnimatePresence>

            {isTyping && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="flex gap-4"
              >
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div className="bg-card border border-border rounded-2xl rounded-bl-md p-4">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-100" />
                    <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-200" />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Paywall Overlay */}
        <AnimatePresence>
          {!isPaid && messageCount >= 3 && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-background/80 backdrop-blur-sm flex items-center justify-center z-10"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                className="bg-card border border-border rounded-xl p-8 max-w-md text-center shadow-xl"
              >
                <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-primary to-accent flex items-center justify-center mx-auto mb-6">
                  <Lock className="h-8 w-8 text-primary-foreground" />
                </div>
                <h2 className="text-2xl font-bold mb-2 text-foreground">Unlock Full Course</h2>
                <p className="text-muted-foreground mb-6">
                  You've reached the preview limit. Purchase to continue learning with unlimited access.
                </p>
                <div className="text-4xl font-bold mb-6 gradient-text">$9.99</div>
                <Button
                  variant="hero"
                  size="lg"
                  className="w-full"
                  onClick={handlePurchase}
                >
                  <CreditCard className="h-4 w-4 mr-2" />
                  Purchase Now
                </Button>
                <p className="text-xs text-muted-foreground mt-4">
                  Secure payment via Stripe • Lifetime access
                </p>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <div className="p-4 border-t border-border">
          <div className="max-w-2xl mx-auto flex gap-2">
            <Input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder={
                !isPaid && messageCount >= 3
                  ? "Purchase to continue..."
                  : "Ask a question..."
              }
              onKeyDown={(e) => e.key === "Enter" && handleSend()}
              className="flex-1"
              disabled={!isPaid && messageCount >= 3}
            />
            <Button
              onClick={handleSend}
              disabled={!input.trim() || isTyping || (!isPaid && messageCount >= 3)}
            >
              <Send className="h-4 w-4" />
            </Button>
          </div>
          {!isPaid && (
            <p className="text-xs text-center text-muted-foreground mt-2">
              {3 - messageCount > 0
                ? `${3 - messageCount} free messages remaining`
                : "Preview limit reached"}
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default CourseViewer;

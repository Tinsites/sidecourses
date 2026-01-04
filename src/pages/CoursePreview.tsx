import { useState } from "react";
import { Link, useParams, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { 
  ArrowLeft, 
  Bot, 
  Send, 
  Globe, 
  Copy, 
  Check,
  Edit,
  ExternalLink,
  Loader2
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

type Message = {
  id: string;
  role: "user" | "assistant";
  content: string;
};

const CoursePreview = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [messages, setMessages] = useState<Message[]>([
    {
      id: "1",
      role: "assistant",
      content: "👋 Welcome to **Introduction to Machine Learning**! I'm your AI learning assistant. I'll guide you through the fundamentals of ML, from basic concepts to practical applications.\n\nWhat would you like to learn about first?\n\n• **Core Concepts** - What is machine learning?\n• **Types of ML** - Supervised, unsupervised, reinforcement\n• **Practical Examples** - Real-world applications\n• **Get Started** - Jump into hands-on exercises",
    },
  ]);
  const [input, setInput] = useState("");
  const [isTyping, setIsTyping] = useState(false);
  const [isPublishing, setIsPublishing] = useState(false);
  const [slug, setSlug] = useState("intro-to-ml");
  const [copied, setCopied] = useState(false);

  const handleSend = async () => {
    if (!input.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      role: "user",
      content: input,
    };

    setMessages(prev => [...prev, userMessage]);
    setInput("");
    setIsTyping(true);

    // Simulate AI response
    setTimeout(() => {
      const aiResponse: Message = {
        id: (Date.now() + 1).toString(),
        role: "assistant",
        content: generateResponse(input),
      };
      setMessages(prev => [...prev, aiResponse]);
      setIsTyping(false);
    }, 1500);
  };

  const generateResponse = (query: string): string => {
    const lowered = query.toLowerCase();
    
    if (lowered.includes("core") || lowered.includes("what is")) {
      return "**Machine Learning** is a subset of artificial intelligence that enables systems to learn and improve from experience without being explicitly programmed.\n\nKey principles:\n\n🔹 **Data-Driven**: ML models learn patterns from data\n🔹 **Predictive**: Make predictions on new, unseen data\n🔹 **Adaptive**: Improve performance over time\n\nWould you like me to explain how these principles apply to real-world applications?";
    }
    
    if (lowered.includes("type") || lowered.includes("supervised")) {
      return "There are three main types of Machine Learning:\n\n**1. Supervised Learning**\nModels learn from labeled data (input-output pairs)\n• Examples: Classification, Regression\n• Price: Enterprise packages from $99/month\n\n**2. Unsupervised Learning**\nModels find patterns in unlabeled data\n• Examples: Clustering, Dimensionality Reduction\n\n**3. Reinforcement Learning**\nModels learn through trial and error with rewards\n• Examples: Game AI, Robotics\n\nWhich type would you like to explore further?";
    }
    
    return "Great question! Let me help you understand this better.\n\nMachine learning is transforming industries:\n\n• **Healthcare**: Disease diagnosis, drug discovery\n• **Finance**: Fraud detection, algorithmic trading\n• **Tech**: Recommendation systems, voice assistants\n\nWant me to dive deeper into any of these applications?";
  };

  const handlePublish = async () => {
    setIsPublishing(true);
    
    // Simulate publishing
    setTimeout(() => {
      setIsPublishing(false);
      toast({
        title: "Course Published!",
        description: `Your course is now live at /c/${slug}`,
      });
    }, 2000);
  };

  const copyLink = () => {
    navigator.clipboard.writeText(`${window.location.origin}/c/${slug}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast({
      title: "Link copied!",
      description: "Share this link with your students.",
    });
  };

  return (
    <div className="min-h-screen dark flex flex-col">
      {/* Header */}
      <header className="sticky top-0 z-50 glass border-b border-border/50">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="font-semibold">Introduction to Machine Learning</h1>
              <p className="text-xs text-muted-foreground">Preview Mode</p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="outline" asChild>
              <Link to={`/courses/${id}/edit`} className="flex items-center gap-2">
                <Edit className="h-4 w-4" />
                Edit
              </Link>
            </Button>
            <Button
              variant="hero"
              onClick={handlePublish}
              disabled={isPublishing}
            >
              {isPublishing ? (
                <>
                  <Loader2 className="h-4 w-4 animate-spin" />
                  Publishing...
                </>
              ) : (
                <>
                  <Globe className="h-4 w-4" />
                  Publish
                </>
              )}
            </Button>
          </div>
        </div>
      </header>

      <div className="flex-1 flex">
        {/* Chat Preview */}
        <div className="flex-1 flex flex-col">
          {/* Messages */}
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
                          : "card-gradient rounded-bl-md"
                      }`}
                    >
                      <div 
                        className="prose prose-sm prose-invert max-w-none"
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

              {/* Typing indicator */}
              {isTyping && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center shrink-0">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div className="card-gradient rounded-2xl rounded-bl-md p-4">
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

          {/* Input */}
          <div className="p-4 border-t border-border/50">
            <div className="max-w-2xl mx-auto flex gap-2">
              <Input
                value={input}
                onChange={(e) => setInput(e.target.value)}
                placeholder="Ask a question..."
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                className="flex-1"
              />
              <Button onClick={handleSend} disabled={!input.trim() || isTyping}>
                <Send className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Sidebar */}
        <aside className="w-80 glass border-l border-border/50 p-6 space-y-6 hidden lg:block">
          <div>
            <h3 className="font-semibold mb-3">Course Link</h3>
            <div className="flex gap-2">
              <Input
                value={`/c/${slug}`}
                readOnly
                className="flex-1 text-sm"
              />
              <Button variant="outline" size="icon" onClick={copyLink}>
                {copied ? (
                  <Check className="h-4 w-4 text-primary" />
                ) : (
                  <Copy className="h-4 w-4" />
                )}
              </Button>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Settings</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Paywall</span>
                <span className="text-sm text-primary">$9.99</span>
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg bg-secondary">
                <span className="text-sm">Status</span>
                <span className="text-sm text-muted-foreground">Draft</span>
              </div>
            </div>
          </div>

          <div>
            <h3 className="font-semibold mb-3">Quick Actions</h3>
            <div className="space-y-2">
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to={`/c/${slug}`} target="_blank">
                  <ExternalLink className="h-4 w-4 mr-2" />
                  Open Live Preview
                </Link>
              </Button>
              <Button variant="outline" className="w-full justify-start" asChild>
                <Link to={`/courses/${id}/edit`}>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit Content
                </Link>
              </Button>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
};

export default CoursePreview;

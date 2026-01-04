import { motion } from "framer-motion";
import { 
  Bot, 
  Upload, 
  Sparkles, 
  Globe, 
  DollarSign, 
  Shield,
  Cpu,
  Users,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Anything",
    description: "PDFs, videos, images, or text. Our agents extract and structure your content automatically.",
  },
  {
    icon: Cpu,
    title: "Local AI Agents",
    description: "Multi-agent orchestration via LangGraph + Ollama. Zero cloud costs, full privacy.",
  },
  {
    icon: Bot,
    title: "Interactive Chatbots",
    description: "Generate engaging chatbot-based courses that teach through conversation.",
  },
  {
    icon: Globe,
    title: "Deploy Instantly",
    description: "One-click deployment as beautiful, responsive websites with custom slugs.",
  },
  {
    icon: DollarSign,
    title: "Monetize Content",
    description: "Built-in Stripe integration. Set your price, we handle payments (7% platform fee).",
  },
  {
    icon: Users,
    title: "Business Tools",
    description: "Staff training, attendance tracking, and quiz assessments for teams.",
  },
  {
    icon: Shield,
    title: "Secure Paywalls",
    description: "Row-level security ensures only paying users access your premium content.",
  },
  {
    icon: BarChart3,
    title: "Analytics Dashboard",
    description: "Track enrollments, completion rates, and revenue in real-time.",
  },
  {
    icon: Sparkles,
    title: "AI-Powered Content",
    description: "Intelligent content generation with product prices and business context.",
  },
];

const FeaturesSection = () => {
  return (
    <section className="py-24 relative bg-background" id="features">
      <div className="container mx-auto px-4">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
          className="text-center mb-16"
        >
          <h2 className="text-3xl md:text-4xl font-bold mb-4 text-foreground">
            Everything You Need to{" "}
            <span className="gradient-text">Create & Sell</span>
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            A complete platform for building AI-powered educational content, from creation to monetization.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className="group card-gradient p-6 hover:border-primary/50 transition-all duration-300"
            >
              <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                <feature.icon className="h-6 w-6 text-primary" />
              </div>
              <h3 className="text-lg font-semibold mb-2 text-foreground">{feature.title}</h3>
              <p className="text-muted-foreground text-sm leading-relaxed">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default FeaturesSection;

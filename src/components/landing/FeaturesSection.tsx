import { motion } from "framer-motion";
import { 
  Bot, 
  Upload, 
  Sparkles, 
  Globe, 
  DollarSign, 
  Shield,
  MessageSquare,
  Users,
  BarChart3
} from "lucide-react";

const features = [
  {
    icon: Upload,
    title: "Upload Anything",
    description: "PDFs, videos, images, or notes. Our AI extracts and structures your content automatically.",
  },
  {
    icon: Sparkles,
    title: "AI Transforms It",
    description: "Intelligent agents turn your raw content into engaging, conversational course material.",
  },
  {
    icon: Bot,
    title: "Interactive Chatbots",
    description: "Your audience learns through natural conversations, not boring slideshows.",
  },
  {
    icon: Globe,
    title: "Deploy Instantly",
    description: "One-click deployment as beautiful, mobile-friendly websites with custom URLs.",
  },
  {
    icon: DollarSign,
    title: "Monetize Easily",
    description: "Set your price and start earning. Built-in payments with just 7% platform fee.",
  },
  {
    icon: Users,
    title: "Built for Creators",
    description: "Perfect for coaches, influencers, and experts ready to monetize their knowledge.",
  },
  {
    icon: Shield,
    title: "Secure Paywalls",
    description: "Only paying students access your premium content. We handle all the security.",
  },
  {
    icon: BarChart3,
    title: "Track Everything",
    description: "See enrollments, completion rates, and revenue in your analytics dashboard.",
  },
  {
    icon: MessageSquare,
    title: "24/7 Teaching",
    description: "Your AI chatbot teaches while you sleep. Scale without limits.",
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
            From upload to income in minutes. The simplest way for influencers to monetize their expertise.
          </p>
        </motion.div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              whileHover={{ y: -5 }}
              className="group card-gradient p-6"
            >
              <motion.div 
                className="w-12 h-12 rounded-xl bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center mb-4"
                whileHover={{ scale: 1.1, rotate: 5 }}
                transition={{ duration: 0.2 }}
              >
                <feature.icon className="h-6 w-6 text-primary group-hover:text-accent transition-colors" />
              </motion.div>
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
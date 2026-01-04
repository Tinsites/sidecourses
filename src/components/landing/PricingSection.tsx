import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import { Check, Zap } from "lucide-react";
import { Link } from "react-router-dom";

const plans = [
  {
    name: "Individual",
    description: "For creators and educators",
    price: "Free",
    priceDetail: "7% platform fee on sales",
    features: [
      "Unlimited course creation",
      "Upload files up to 100MB",
      "Custom course slugs",
      "Built-in payment processing",
      "Basic analytics",
      "Email support",
    ],
    cta: "Start Creating",
    popular: false,
  },
  {
    name: "Business",
    description: "For teams and organizations",
    price: "$5",
    priceDetail: "/month per seat",
    features: [
      "Everything in Individual",
      "Unlimited uploads & generation",
      "Staff attendance tracking",
      "Quiz & assessment tools",
      "Advanced analytics",
      "Priority support",
      "Custom branding",
      "Team management",
    ],
    cta: "Start Free Trial",
    popular: true,
  },
];

const freeTierLimits = [
  "5 uploads per month",
  "40% generation capacity",
  "Basic chatbot features",
];

const PricingSection = () => {
  return (
    <section className="py-24 relative bg-secondary/30" id="pricing">
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
            Simple, <span className="gradient-text">Transparent</span> Pricing
          </h2>
          <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
            Start free, scale as you grow. No hidden fees.
          </p>
        </motion.div>

        {/* Pricing Cards */}
        <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
          {plans.map((plan, index) => (
            <motion.div
              key={plan.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: index * 0.1 }}
              className={`relative card-gradient p-8 ${
                plan.popular ? "border-primary shadow-lg" : ""
              }`}
            >
              {plan.popular && (
                <div className="absolute -top-3 left-1/2 -translate-x-1/2 px-4 py-1 rounded-full bg-gradient-to-r from-primary to-accent text-xs font-semibold text-primary-foreground flex items-center gap-1">
                  <Zap className="h-3 w-3" />
                  Most Popular
                </div>
              )}

              <div className="mb-6">
                <h3 className="text-xl font-bold mb-1 text-foreground">{plan.name}</h3>
                <p className="text-muted-foreground text-sm">{plan.description}</p>
              </div>

              <div className="mb-6">
                <span className="text-4xl font-bold text-foreground">{plan.price}</span>
                <span className="text-muted-foreground text-sm ml-1">{plan.priceDetail}</span>
              </div>

              <ul className="space-y-3 mb-8">
                {plan.features.map((feature) => (
                  <li key={feature} className="flex items-start gap-3">
                    <Check className="h-5 w-5 text-primary shrink-0 mt-0.5" />
                    <span className="text-sm text-foreground">{feature}</span>
                  </li>
                ))}
              </ul>

              <Button
                variant={plan.popular ? "hero" : "outline"}
                className="w-full"
                asChild
              >
                <Link to="/signup">{plan.cta}</Link>
              </Button>
            </motion.div>
          ))}
        </div>

        {/* Free Tier Note */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="mt-12 text-center"
        >
          <p className="text-muted-foreground text-sm mb-4">
            Business free tier includes:
          </p>
          <div className="flex flex-wrap justify-center gap-4">
            {freeTierLimits.map((limit) => (
              <span
                key={limit}
                className="px-3 py-1 rounded-full bg-secondary text-secondary-foreground text-xs"
              >
                {limit}
              </span>
            ))}
          </div>
        </motion.div>
      </div>
    </section>
  );
};

export default PricingSection;

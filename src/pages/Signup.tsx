import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Bot, Mail, Lock, User, AlertCircle, Loader2, Building, UserCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useToast } from "@/hooks/use-toast";

const Signup = () => {
  const [step, setStep] = useState(1);
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState<"individual" | "business">("individual");
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();
  const { toast } = useToast();

  const handleSubmitStep1 = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    // Validation
    if (!name || !email || !password) {
      setError("Please fill in all fields");
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    setStep(2);
  };

  const handleSubmitStep2 = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    // Simulate signup (replace with actual Supabase auth)
    setTimeout(() => {
      setIsLoading(false);
      toast({
        title: "Account created!",
        description: `Welcome to LearnAgentAI as a ${role} user.`,
      });
      navigate("/dashboard");
    }, 1500);
  };

  return (
    <div className="min-h-screen dark flex">
      {/* Left Panel - Branding */}
      <div className="hidden lg:flex lg:w-1/2 bg-gradient-to-br from-accent/20 to-primary/20 relative overflow-hidden">
        <div className="absolute inset-0 bg-[linear-gradient(rgba(255,255,255,0.02)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.02)_1px,transparent_1px)] bg-[size:60px_60px]" />
        <div className="relative z-10 flex flex-col justify-center p-12">
          <Link to="/" className="flex items-center gap-3 mb-8">
            <Bot className="h-10 w-10 text-primary" />
            <span className="text-2xl font-bold gradient-text">LearnAgentAI</span>
          </Link>
          <h1 className="text-4xl font-bold mb-4">
            Start Creating Today
          </h1>
          <p className="text-muted-foreground text-lg max-w-md">
            Build AI-powered courses with local agents. No cloud costs, full privacy.
          </p>

          {/* Features list */}
          <div className="mt-8 space-y-4">
            {[
              "Upload files, videos, or prompts",
              "AI agents structure your content",
              "Deploy as interactive chatbots",
              "Monetize with built-in payments",
            ].map((feature, index) => (
              <motion.div
                key={feature}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: index * 0.1 }}
                className="flex items-center gap-3"
              >
                <div className="w-6 h-6 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-2 h-2 rounded-full bg-primary" />
                </div>
                <span className="text-sm">{feature}</span>
              </motion.div>
            ))}
          </div>
        </div>
        {/* Decorative elements */}
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-accent/10 rounded-full blur-3xl" />
        <div className="absolute top-1/4 left-1/4 w-64 h-64 bg-primary/10 rounded-full blur-3xl" />
      </div>

      {/* Right Panel - Form */}
      <div className="flex-1 flex items-center justify-center p-8">
        <motion.div
          key={step}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="w-full max-w-md"
        >
          {/* Mobile Logo */}
          <Link to="/" className="flex items-center gap-2 mb-8 lg:hidden">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-xl font-bold gradient-text">LearnAgentAI</span>
          </Link>

          {/* Progress Indicator */}
          <div className="flex items-center gap-2 mb-8">
            <div className={`h-1 flex-1 rounded-full ${step >= 1 ? "bg-primary" : "bg-border"}`} />
            <div className={`h-1 flex-1 rounded-full ${step >= 2 ? "bg-primary" : "bg-border"}`} />
          </div>

          {step === 1 ? (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Create your account</h2>
                <p className="text-muted-foreground">
                  Already have an account?{" "}
                  <Link to="/login" className="text-primary hover:underline">
                    Sign in
                  </Link>
                </p>
              </div>

              {/* Error Alert */}
              {error && (
                <motion.div
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex items-center gap-2 p-3 rounded-lg bg-destructive/10 border border-destructive/20 text-destructive mb-6"
                >
                  <AlertCircle className="h-4 w-4" />
                  <span className="text-sm">{error}</span>
                </motion.div>
              )}

              <form onSubmit={handleSubmitStep1} className="space-y-5">
                <div className="space-y-2">
                  <Label htmlFor="name">Full Name</Label>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="name"
                      type="text"
                      placeholder="John Doe"
                      value={name}
                      onChange={(e) => setName(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="email">Email</Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="password">Password</Label>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                    <Input
                      id="password"
                      type="password"
                      placeholder="At least 8 characters"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-10"
                    />
                  </div>
                </div>

                <Button type="submit" variant="hero" className="w-full">
                  Continue
                </Button>
              </form>

              <div className="mt-6">
                <div className="relative">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-border" />
                  </div>
                  <div className="relative flex justify-center text-xs uppercase">
                    <span className="bg-background px-2 text-muted-foreground">
                      Or continue with
                    </span>
                  </div>
                </div>

                <Button variant="outline" className="w-full mt-4" type="button">
                  <svg className="h-4 w-4 mr-2" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </Button>
              </div>
            </>
          ) : (
            <>
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">Choose your account type</h2>
                <p className="text-muted-foreground">
                  You can always change this later in settings.
                </p>
              </div>

              <form onSubmit={handleSubmitStep2} className="space-y-6">
                <RadioGroup
                  value={role}
                  onValueChange={(value) => setRole(value as "individual" | "business")}
                  className="grid grid-cols-1 gap-4"
                >
                  <Label
                    htmlFor="individual"
                    className={`cursor-pointer card-gradient p-4 flex items-start gap-4 transition-all ${
                      role === "individual" ? "border-primary glow-primary" : ""
                    }`}
                  >
                    <RadioGroupItem value="individual" id="individual" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <UserCircle className="h-5 w-5 text-primary" />
                        <span className="font-semibold">Individual Creator</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Create and monetize courses. Free to use with 7% platform fee on sales.
                      </p>
                    </div>
                  </Label>

                  <Label
                    htmlFor="business"
                    className={`cursor-pointer card-gradient p-4 flex items-start gap-4 transition-all ${
                      role === "business" ? "border-primary glow-primary" : ""
                    }`}
                  >
                    <RadioGroupItem value="business" id="business" className="mt-1" />
                    <div className="flex-1">
                      <div className="flex items-center gap-2 mb-1">
                        <Building className="h-5 w-5 text-accent" />
                        <span className="font-semibold">Business Team</span>
                      </div>
                      <p className="text-sm text-muted-foreground">
                        Staff training & attendance tracking. Free tier or $5/mo for full features.
                      </p>
                    </div>
                  </Label>
                </RadioGroup>

                <div className="flex gap-3">
                  <Button
                    type="button"
                    variant="outline"
                    className="flex-1"
                    onClick={() => setStep(1)}
                  >
                    Back
                  </Button>
                  <Button
                    type="submit"
                    variant="hero"
                    className="flex-1"
                    disabled={isLoading}
                  >
                    {isLoading ? (
                      <>
                        <Loader2 className="h-4 w-4 animate-spin" />
                        Creating...
                      </>
                    ) : (
                      "Create Account"
                    )}
                  </Button>
                </div>
              </form>
            </>
          )}

          <p className="mt-8 text-xs text-center text-muted-foreground">
            By signing up, you agree to our{" "}
            <Link to="/terms" className="hover:text-foreground">
              Terms of Service
            </Link>{" "}
            and{" "}
            <Link to="/privacy" className="hover:text-foreground">
              Privacy Policy
            </Link>
            .
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default Signup;

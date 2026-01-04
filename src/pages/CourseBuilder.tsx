import { useState, useCallback, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { 
  Bot, 
  Upload, 
  FileText, 
  Video, 
  Image, 
  Sparkles,
  ArrowLeft,
  Loader2,
  Check,
  Cpu,
  MessageSquare,
  Globe
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";

type UploadedFile = {
  name: string;
  type: string;
  size: number;
};

type AgentStep = {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "complete";
  icon: typeof Cpu;
};

const CourseBuilder = () => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [files, setFiles] = useState<UploadedFile[]>([]);
  const [isGenerating, setIsGenerating] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);
  const navigate = useNavigate();
  const { toast } = useToast();
  const { user, loading } = useAuth();

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  const agentSteps: AgentStep[] = [
    {
      id: "extract",
      name: "Agent 1: Content Extraction",
      description: "Analyzing uploads and extracting key information...",
      status: "pending",
      icon: FileText,
    },
    {
      id: "structure",
      name: "Agent 2: Structure & Pricing",
      description: "Organizing content and adding business context...",
      status: "pending",
      icon: Cpu,
    },
    {
      id: "generate",
      name: "Agent 3: Chatbot Generation",
      description: "Creating interactive conversation flows...",
      status: "pending",
      icon: MessageSquare,
    },
    {
      id: "deploy",
      name: "Deployment Ready",
      description: "Preparing for preview and publication...",
      status: "pending",
      icon: Globe,
    },
  ];

  const [steps, setSteps] = useState(agentSteps);

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  }, []);

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    
    const droppedFiles = Array.from(e.dataTransfer.files);
    const validFiles = droppedFiles.filter(file => {
      const validTypes = ['application/pdf', 'video/mp4', 'image/jpeg', 'image/png', 'image/jpg'];
      const maxSize = 100 * 1024 * 1024; // 100MB
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== droppedFiles.length) {
      toast({
        title: "Some files were skipped",
        description: "Only PDF, MP4, JPG, and PNG files under 100MB are allowed.",
        variant: "destructive",
      });
    }

    setFiles(prev => [...prev, ...validFiles.map(f => ({
      name: f.name,
      type: f.type,
      size: f.size,
    }))]);
  }, [toast]);

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selectedFiles = Array.from(e.target.files);
      setFiles(prev => [...prev, ...selectedFiles.map(f => ({
        name: f.name,
        type: f.type,
        size: f.size,
      }))]);
    }
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("video/")) return Video;
    if (type.startsWith("image/")) return Image;
    return FileText;
  };

  const formatFileSize = (bytes: number) => {
    if (bytes < 1024) return `${bytes} B`;
    if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`;
    return `${(bytes / (1024 * 1024)).toFixed(1)} MB`;
  };

  const handleGenerate = async () => {
    if (!title.trim()) {
      toast({
        title: "Title required",
        description: "Please enter a course title.",
        variant: "destructive",
      });
      return;
    }

    if (files.length === 0 && prompt.trim().length < 10) {
      toast({
        title: "Content required",
        description: "Please upload files or enter a prompt (min 10 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Simulate agent flow
    for (let i = 0; i < steps.length; i++) {
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx < i ? "complete" : idx === i ? "running" : "pending",
      })));
      
      await new Promise(resolve => setTimeout(resolve, 2000));
    }

    setSteps(prev => prev.map(step => ({ ...step, status: "complete" })));

    toast({
      title: "Course generated!",
      description: "Your AI course is ready for preview.",
    });

    setTimeout(() => {
      navigate("/courses/1/preview");
    }, 1000);
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Bot className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild>
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <div>
              <h1 className="font-semibold text-foreground">Create New Course</h1>
              <p className="text-xs text-muted-foreground">AI-powered course builder</p>
            </div>
          </div>
          <Button
            variant="hero"
            onClick={handleGenerate}
            disabled={isGenerating}
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Course
              </>
            )}
          </Button>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid lg:grid-cols-2 gap-8">
          {/* Left Panel - Input */}
          <div className="space-y-6">
            <div className="space-y-2">
              <Label htmlFor="title">Course Title</Label>
              <Input
                id="title"
                placeholder="e.g., Introduction to Machine Learning"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg"
              />
            </div>

            <div className="space-y-2">
              <Label>Upload Content (Optional)</Label>
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.mp4,.jpg,.jpeg,.png"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium mb-1 text-foreground">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground">
                  PDF, MP4, JPG, PNG up to 100MB
                </p>
              </div>

              <AnimatePresence>
                {files.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 mt-4"
                  >
                    {files.map((file, index) => {
                      const FileIcon = getFileIcon(file.type);
                      return (
                        <motion.div
                          key={index}
                          initial={{ opacity: 0, x: -20 }}
                          animate={{ opacity: 1, x: 0 }}
                          exit={{ opacity: 0, x: -20 }}
                          className="flex items-center gap-3 p-3 rounded-lg bg-secondary"
                        >
                          <FileIcon className="h-4 w-4 text-primary" />
                          <span className="flex-1 text-sm truncate text-foreground">{file.name}</span>
                          <span className="text-xs text-muted-foreground">
                            {formatFileSize(file.size)}
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-destructive"
                          >
                            ×
                          </button>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </div>

            <div className="space-y-2">
              <Label htmlFor="prompt">Describe Your Course (Optional)</Label>
              <Textarea
                id="prompt"
                placeholder="Tell our AI agents what you want to teach. Include topics, target audience, skill level, and any specific content requirements..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={6}
              />
              <p className="text-xs text-muted-foreground">
                {prompt.length}/1000 characters • Minimum 10 characters if no files uploaded
              </p>
            </div>
          </div>

          {/* Right Panel - Agent Flow */}
          <div className="space-y-6">
            <div className="card-gradient p-6">
              <div className="flex items-center gap-3 mb-6">
                <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <Bot className="h-5 w-5 text-primary-foreground" />
                </div>
                <div>
                  <h2 className="font-semibold text-foreground">AI Agent Pipeline</h2>
                  <p className="text-sm text-muted-foreground">Local LangGraph + Ollama</p>
                </div>
              </div>

              <div className="space-y-4">
                {steps.map((step) => (
                  <motion.div
                    key={step.id}
                    initial={{ opacity: 0.5 }}
                    animate={{
                      opacity: step.status !== "pending" || isGenerating ? 1 : 0.5,
                    }}
                    className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                      step.status === "running"
                        ? "bg-primary/10 border border-primary/30"
                        : step.status === "complete"
                        ? "bg-secondary"
                        : ""
                    }`}
                  >
                    <div
                      className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                        step.status === "complete"
                          ? "bg-primary text-primary-foreground"
                          : step.status === "running"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-muted-foreground"
                      }`}
                    >
                      {step.status === "complete" ? (
                        <Check className="h-5 w-5" />
                      ) : step.status === "running" ? (
                        <Loader2 className="h-5 w-5 animate-spin" />
                      ) : (
                        <step.icon className="h-5 w-5" />
                      )}
                    </div>
                    <div className="flex-1">
                      <h3 className="font-medium text-foreground">{step.name}</h3>
                      <p className="text-sm text-muted-foreground">
                        {step.description}
                      </p>
                    </div>
                  </motion.div>
                ))}
              </div>
            </div>

            <div className="card-gradient p-6">
              <h3 className="font-semibold mb-3 text-foreground">How it works</h3>
              <ul className="space-y-2 text-sm text-muted-foreground">
                <li className="flex items-start gap-2">
                  <span className="text-primary">1.</span>
                  Upload files or describe your course content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">2.</span>
                  AI agents extract, structure, and generate content
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">3.</span>
                  Preview and edit the interactive chatbot
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-primary">4.</span>
                  Publish with a custom URL and start earning
                </li>
              </ul>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default CourseBuilder;

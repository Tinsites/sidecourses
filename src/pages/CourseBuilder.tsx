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
  Music,
  Link as LinkIcon,
  Sparkles,
  ArrowLeft,
  Loader2,
  Check,
  Cpu,
  MessageSquare,
  Globe,
  X,
  Plus
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useToast } from "@/hooks/use-toast";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import logo from "@/assets/logo.png";

type UploadedFile = {
  name: string;
  type: string;
  size: number;
};

type AgentStep = {
  id: string;
  name: string;
  description: string;
  status: "pending" | "running" | "complete" | "error";
  icon: typeof Cpu;
};

const CourseBuilder = () => {
  const [title, setTitle] = useState("");
  const [prompt, setPrompt] = useState("");
  const [links, setLinks] = useState<string[]>([]);
  const [newLink, setNewLink] = useState("");
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

  const [steps, setSteps] = useState<AgentStep[]>([
    {
      id: "extract",
      name: "Content Extraction",
      description: "Analyzing your uploads and extracting key information...",
      status: "pending",
      icon: FileText,
    },
    {
      id: "structure",
      name: "Course Structuring",
      description: "Organizing content into modules and lessons...",
      status: "pending",
      icon: Cpu,
    },
    {
      id: "generate",
      name: "Chatbot Generation",
      description: "Creating interactive Q&A conversation flows...",
      status: "pending",
      icon: MessageSquare,
    },
    {
      id: "deploy",
      name: "Ready for Preview",
      description: "Preparing your course for preview...",
      status: "pending",
      icon: Globe,
    },
  ]);

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
    const validTypes = [
      'application/pdf', 
      'video/mp4', 'video/webm', 'video/quicktime',
      'audio/mpeg', 'audio/wav', 'audio/mp3',
      'image/jpeg', 'image/png', 'image/jpg',
      'text/plain', 'text/markdown'
    ];
    const maxSize = 100 * 1024 * 1024; // 100MB
    
    const validFiles = droppedFiles.filter(file => {
      return validTypes.includes(file.type) && file.size <= maxSize;
    });

    if (validFiles.length !== droppedFiles.length) {
      toast({
        title: "Some files were skipped",
        description: "Only PDF, video, audio, images, and text files under 100MB are allowed.",
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

  const addLink = () => {
    if (newLink.trim() && isValidUrl(newLink)) {
      setLinks(prev => [...prev, newLink.trim()]);
      setNewLink("");
    } else if (newLink.trim()) {
      toast({
        title: "Invalid URL",
        description: "Please enter a valid URL starting with http:// or https://",
        variant: "destructive",
      });
    }
  };

  const removeLink = (index: number) => {
    setLinks(prev => prev.filter((_, i) => i !== index));
  };

  const isValidUrl = (string: string) => {
    try {
      new URL(string);
      return string.startsWith('http://') || string.startsWith('https://');
    } catch {
      return false;
    }
  };

  const getFileIcon = (type: string) => {
    if (type.startsWith("video/")) return Video;
    if (type.startsWith("audio/")) return Music;
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

    if (files.length === 0 && links.length === 0 && prompt.trim().length < 10) {
      toast({
        title: "Content required",
        description: "Please upload files, add links, or describe your course (min 10 characters).",
        variant: "destructive",
      });
      return;
    }

    setIsGenerating(true);

    // Step 1: Content Extraction
    setSteps(prev => prev.map((step, idx) => ({
      ...step,
      status: idx === 0 ? "running" : "pending",
    })));
    
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setSteps(prev => prev.map((step, idx) => ({
      ...step,
      status: idx === 0 ? "complete" : idx === 1 ? "running" : "pending",
    })));

    // Step 2: Call AI to generate course
    try {
      const { data, error } = await supabase.functions.invoke('generate-course', {
        body: {
          title: title.trim(),
          prompt: prompt.trim(),
          files: files,
          links: links,
        },
      });

      if (error) {
        throw error;
      }

      // Step 3: Chatbot generation complete
      setSteps(prev => prev.map((step, idx) => ({
        ...step,
        status: idx <= 1 ? "complete" : idx === 2 ? "running" : "pending",
      })));

      await new Promise(resolve => setTimeout(resolve, 1000));

      // Step 4: Ready for preview
      setSteps(prev => prev.map((step) => ({
        ...step,
        status: "complete",
      })));

      toast({
        title: "Course generated!",
        description: "Your AI course is ready for preview.",
      });

      // Store generated course data temporarily
      if (data?.course) {
        sessionStorage.setItem('generatedCourse', JSON.stringify(data.course));
      }

      setTimeout(() => {
        navigate("/courses/new/preview");
      }, 1000);
    } catch (error) {
      console.error("Generation error:", error);
      setSteps(prev => prev.map((step) => ({
        ...step,
        status: step.status === "running" ? "error" : step.status,
      })));
      
      toast({
        title: "Generation failed",
        description: error instanceof Error ? error.message : "Failed to generate course. Please try again.",
        variant: "destructive",
      });
      setIsGenerating(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Bot className="h-12 w-12 text-primary animate-pulse" />
      </div>
    );
  }

  const hasContent = files.length > 0 || links.length > 0 || prompt.trim().length >= 10;

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <header className="sticky top-0 z-50 bg-background/80 backdrop-blur-xl border-b border-border">
        <div className="container mx-auto px-4 h-16 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="icon" asChild className="hover:bg-secondary">
              <Link to="/dashboard">
                <ArrowLeft className="h-4 w-4" />
              </Link>
            </Button>
            <Link to="/" className="hidden sm:block">
              <img src={logo} alt="Side Courses" className="h-8 w-auto" />
            </Link>
          </div>
          <Button
            variant="hero"
            size="lg"
            onClick={handleGenerate}
            disabled={isGenerating || !title.trim() || !hasContent}
            className="gap-2"
          >
            {isGenerating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                <span className="hidden sm:inline">Generating...</span>
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                <span>Create Course</span>
              </>
            )}
          </Button>
        </div>
      </header>

      <main className="container mx-auto px-4 py-8">
        <div className="max-w-4xl mx-auto">
          {/* Page Title */}
          <div className="text-center mb-8">
            <h1 className="text-3xl md:text-4xl font-bold mb-2 text-foreground">Create Your AI Course</h1>
            <p className="text-muted-foreground">
              Upload your content and let AI transform it into an interactive chatbot course
            </p>
          </div>

          {/* Main Form */}
          <div className="space-y-8">
            {/* Course Title */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="card-gradient p-6"
            >
              <Label htmlFor="title" className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">1</span>
                Course Title
              </Label>
              <Input
                id="title"
                placeholder="e.g., Master Social Media Marketing in 30 Days"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                className="text-lg h-12"
              />
            </motion.div>

            {/* Upload Content */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.1 }}
              className="card-gradient p-6"
            >
              <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-primary text-primary-foreground flex items-center justify-center text-sm">2</span>
                Upload Your Content
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Add videos, PDFs, audio files, or images that contain your knowledge
              </p>
              
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all cursor-pointer ${
                  isDragOver
                    ? "border-primary bg-primary/5"
                    : "border-border hover:border-primary/50 hover:bg-secondary/50"
                }`}
              >
                <input
                  type="file"
                  multiple
                  accept=".pdf,.mp4,.webm,.mov,.mp3,.wav,.jpg,.jpeg,.png,.txt,.md"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                />
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <p className="font-medium mb-1 text-foreground">Drag & drop files here</p>
                <p className="text-sm text-muted-foreground">
                  Video, Audio, PDF, Images, Text • Max 100MB each
                </p>
                <div className="flex justify-center gap-4 mt-4 text-muted-foreground">
                  <Video className="h-5 w-5" />
                  <Music className="h-5 w-5" />
                  <FileText className="h-5 w-5" />
                  <Image className="h-5 w-5" />
                </div>
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
                          <FileIcon className="h-4 w-4 text-primary shrink-0" />
                          <span className="flex-1 text-sm truncate text-foreground">{file.name}</span>
                          <span className="text-xs text-muted-foreground shrink-0">
                            {formatFileSize(file.size)}
                          </span>
                          <button
                            onClick={() => removeFile(index)}
                            className="text-muted-foreground hover:text-destructive transition-colors"
                          >
                            <X className="h-4 w-4" />
                          </button>
                        </motion.div>
                      );
                    })}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Add Links */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.2 }}
              className="card-gradient p-6"
            >
              <Label className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm">3</span>
                Add Links (Optional)
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Include YouTube videos, blog posts, or any web content
              </p>
              
              <div className="flex gap-2">
                <div className="relative flex-1">
                  <LinkIcon className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
                  <Input
                    placeholder="https://youtube.com/watch?v=..."
                    value={newLink}
                    onChange={(e) => setNewLink(e.target.value)}
                    onKeyDown={(e) => e.key === 'Enter' && (e.preventDefault(), addLink())}
                    className="pl-10"
                  />
                </div>
                <Button onClick={addLink} variant="outline" size="icon">
                  <Plus className="h-4 w-4" />
                </Button>
              </div>

              <AnimatePresence>
                {links.length > 0 && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: "auto" }}
                    exit={{ opacity: 0, height: 0 }}
                    className="space-y-2 mt-4"
                  >
                    {links.map((link, index) => (
                      <motion.div
                        key={index}
                        initial={{ opacity: 0, x: -20 }}
                        animate={{ opacity: 1, x: 0 }}
                        exit={{ opacity: 0, x: -20 }}
                        className="flex items-center gap-3 p-3 rounded-lg bg-secondary"
                      >
                        <LinkIcon className="h-4 w-4 text-accent shrink-0" />
                        <span className="flex-1 text-sm truncate text-foreground">{link}</span>
                        <button
                          onClick={() => removeLink(index)}
                          className="text-muted-foreground hover:text-destructive transition-colors"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </motion.div>
                    ))}
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>

            {/* Describe Course */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.3 }}
              className="card-gradient p-6"
            >
              <Label htmlFor="prompt" className="text-lg font-semibold mb-3 flex items-center gap-2">
                <span className="w-6 h-6 rounded-full bg-accent text-accent-foreground flex items-center justify-center text-sm">4</span>
                Describe Your Course (Optional)
              </Label>
              <p className="text-sm text-muted-foreground mb-4">
                Tell our AI what topics to cover, your target audience, and any specific requirements
              </p>
              <Textarea
                id="prompt"
                placeholder="Example: Create a beginner-friendly course about personal finance. Cover budgeting basics, saving strategies, and investing 101. Target audience is young professionals aged 25-35..."
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                rows={5}
                className="resize-none"
              />
              <p className="text-xs text-muted-foreground mt-2 text-right">
                {prompt.length}/1000 characters
              </p>
            </motion.div>

            {/* AI Progress */}
            {isGenerating && (
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="card-gradient p-6"
              >
                <div className="flex items-center gap-3 mb-6">
                  <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                    <Bot className="h-5 w-5 text-primary-foreground" />
                  </div>
                  <div>
                    <h2 className="font-semibold text-foreground">AI Course Generation</h2>
                    <p className="text-sm text-muted-foreground">Creating your interactive course...</p>
                  </div>
                </div>

                <div className="space-y-4">
                  {steps.map((step) => (
                    <motion.div
                      key={step.id}
                      initial={{ opacity: 0.5 }}
                      animate={{ opacity: 1 }}
                      className={`flex items-start gap-4 p-4 rounded-xl transition-all ${
                        step.status === "running"
                          ? "bg-primary/10 border border-primary/30"
                          : step.status === "complete"
                          ? "bg-secondary"
                          : step.status === "error"
                          ? "bg-destructive/10 border border-destructive/30"
                          : ""
                      }`}
                    >
                      <div
                        className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                          step.status === "complete"
                            ? "bg-primary text-primary-foreground"
                            : step.status === "running"
                            ? "bg-primary/20 text-primary"
                            : step.status === "error"
                            ? "bg-destructive text-destructive-foreground"
                            : "bg-secondary text-muted-foreground"
                        }`}
                      >
                        {step.status === "complete" ? (
                          <Check className="h-5 w-5" />
                        ) : step.status === "running" ? (
                          <Loader2 className="h-5 w-5 animate-spin" />
                        ) : step.status === "error" ? (
                          <X className="h-5 w-5" />
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
              </motion.div>
            )}

            {/* CTA Button */}
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
              className="text-center pb-8"
            >
              <Button
                variant="hero"
                size="lg"
                onClick={handleGenerate}
                disabled={isGenerating || !title.trim() || !hasContent}
                className="gap-2 px-8 py-6 text-lg"
              >
                {isGenerating ? (
                  <>
                    <Loader2 className="h-5 w-5 animate-spin" />
                    Generating Course...
                  </>
                ) : (
                  <>
                    <Sparkles className="h-5 w-5" />
                    Create My Course
                  </>
                )}
              </Button>
              <p className="text-sm text-muted-foreground mt-3">
                AI will transform your content into an interactive chatbot course
              </p>
            </motion.div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default CourseBuilder;

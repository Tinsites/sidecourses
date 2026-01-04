import { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Plus, 
  BookOpen, 
  Users, 
  DollarSign, 
  TrendingUp,
  Clock,
  MoreVertical,
  ChevronRight,
  Settings,
  LogOut,
  BarChart3,
  Upload,
  Menu,
  X
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useAuth } from "@/contexts/AuthContext";
import { supabase } from "@/integrations/supabase/client";
import { useToast } from "@/hooks/use-toast";
import logo from "@/assets/logo.png";

type Course = {
  id: string;
  title: string;
  status: string;
  updated_at: string;
};

type Profile = {
  full_name: string;
  role: string;
  tier: string;
};

const stats = [
  { label: "Total Courses", value: "0", icon: BookOpen, change: "Create your first" },
  { label: "Total Students", value: "0", icon: Users, change: "Share your courses" },
  { label: "Revenue", value: "$0", icon: DollarSign, change: "Start earning" },
  { label: "Completion Rate", value: "0%", icon: TrendingUp, change: "Track progress" },
];

const Dashboard = () => {
  const { user, signOut, loading } = useAuth();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [profile, setProfile] = useState<Profile | null>(null);
  const [courses, setCourses] = useState<Course[]>([]);
  const [loadingData, setLoadingData] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);

  useEffect(() => {
    if (!loading && !user) {
      navigate("/login");
    }
  }, [user, loading, navigate]);

  useEffect(() => {
    const fetchData = async () => {
      if (!user) return;

      try {
        const { data: profileData } = await supabase
          .from("profiles")
          .select("full_name, role, tier")
          .eq("id", user.id)
          .maybeSingle();

        if (profileData) {
          setProfile(profileData);
        }

        const { data: coursesData } = await supabase
          .from("courses")
          .select("id, title, status, updated_at")
          .eq("owner_id", user.id)
          .order("updated_at", { ascending: false })
          .limit(5);

        if (coursesData) {
          setCourses(coursesData);
        }
      } catch (error) {
        console.error("Error fetching data:", error);
      } finally {
        setLoadingData(false);
      }
    };

    fetchData();
  }, [user]);

  const handleSignOut = async () => {
    await signOut();
    toast({
      title: "Signed out",
      description: "You've been signed out successfully.",
    });
    navigate("/");
  };

  const formatTimeAgo = (date: string) => {
    const now = new Date();
    const then = new Date(date);
    const diffMs = now.getTime() - then.getTime();
    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffDays > 0) return `${diffDays} day${diffDays > 1 ? "s" : ""} ago`;
    if (diffHours > 0) return `${diffHours} hour${diffHours > 1 ? "s" : ""} ago`;
    return `${diffMins} min${diffMins > 1 ? "s" : ""} ago`;
  };

  if (loading || loadingData) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <motion.img 
            src={logo} 
            alt="Side Courses" 
            className="h-16 w-auto mx-auto"
            animate={{ scale: [1, 1.05, 1] }}
            transition={{ duration: 2, repeat: Infinity }}
          />
          <p className="text-muted-foreground mt-4">Loading...</p>
        </div>
      </div>
    );
  }

  const displayName = profile?.full_name || user?.email?.split("@")[0] || "User";
  const initials = displayName.split(" ").map(n => n[0]).join("").toUpperCase().slice(0, 2);
  const userRole = profile?.role || "individual";

  const SidebarContent = () => (
    <>
      <div className="p-4 border-b border-border">
        <Link to="/" className="flex items-center gap-2">
          <img src={logo} alt="Side Courses" className="h-10 w-auto" />
        </Link>
      </div>

      <nav className="flex-1 p-4 space-y-1">
        <Link
          to="/dashboard"
          className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary text-foreground hover-lift"
          onClick={() => setSidebarOpen(false)}
        >
          <BarChart3 className="h-4 w-4" />
          <span className="font-medium">Dashboard</span>
        </Link>
        <Link
          to="/courses/new"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <Plus className="h-4 w-4" />
          <span>New Course</span>
        </Link>
        <Link
          to="/courses"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <BookOpen className="h-4 w-4" />
          <span>My Courses</span>
        </Link>
        <Link
          to="/analytics"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <TrendingUp className="h-4 w-4" />
          <span>Analytics</span>
        </Link>
        {userRole === "business" && (
          <Link
            to="/attendance"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            onClick={() => setSidebarOpen(false)}
          >
            <Users className="h-4 w-4" />
            <span>Attendance</span>
          </Link>
        )}
        <Link
          to="/settings"
          className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          onClick={() => setSidebarOpen(false)}
        >
          <Settings className="h-4 w-4" />
          <span>Settings</span>
        </Link>
      </nav>

      <div className="p-4 border-t border-border">
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                <span className="text-sm font-medium text-primary-foreground">{initials}</span>
              </div>
              <div className="flex-1 text-left">
                <div className="text-sm font-medium text-foreground">{displayName}</div>
                <div className="text-xs text-muted-foreground capitalize">{userRole}</div>
              </div>
              <ChevronRight className="h-4 w-4 text-muted-foreground" />
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-48">
            <DropdownMenuItem asChild>
              <Link to="/settings" className="flex items-center gap-2">
                <Settings className="h-4 w-4" />
                Settings
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={handleSignOut} className="text-destructive">
              <LogOut className="h-4 w-4 mr-2" />
              Sign Out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </>
  );

  return (
    <div className="min-h-screen bg-background">
      {/* Mobile Header */}
      <div className="lg:hidden fixed top-0 left-0 right-0 h-16 bg-background border-b border-border flex items-center justify-between px-4 z-40">
        <Link to="/">
          <img src={logo} alt="Side Courses" className="h-10 w-auto" />
        </Link>
        <button
          onClick={() => setSidebarOpen(!sidebarOpen)}
          className="p-2 text-muted-foreground hover:text-foreground"
        >
          {sidebarOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
        </button>
      </div>

      {/* Mobile Sidebar Overlay */}
      <AnimatePresence>
        {sidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="lg:hidden fixed inset-0 bg-black/50 z-40"
              onClick={() => setSidebarOpen(false)}
            />
            <motion.aside
              initial={{ x: -280 }}
              animate={{ x: 0 }}
              exit={{ x: -280 }}
              transition={{ type: "spring", damping: 25, stiffness: 300 }}
              className="lg:hidden fixed left-0 top-0 h-screen w-[280px] bg-card border-r border-border flex flex-col z-50"
            >
              <SidebarContent />
            </motion.aside>
          </>
        )}
      </AnimatePresence>

      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex fixed left-0 top-0 h-screen w-64 bg-card border-r border-border flex-col z-50">
        <SidebarContent />
      </aside>

      {/* Main Content */}
      <main className="lg:ml-64 pt-16 lg:pt-0 p-4 lg:p-8">
        <div className="max-w-6xl mx-auto">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1 text-foreground">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, {displayName}!</p>
            </div>
            <Button variant="hero" asChild className="hover-lift w-full sm:w-auto">
              <Link to="/courses/new" className="flex items-center justify-center gap-2">
                <Plus className="h-4 w-4" />
                New Course
              </Link>
            </Button>
          </div>

          {userRole === "business" && profile?.tier === "free" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/10 to-accent/10 border border-primary/30 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
            >
              <div>
                <h3 className="font-semibold mb-1 text-foreground">You're on the Free Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Limited to 5 uploads/month and 40% generation capacity.
                </p>
              </div>
              <Button variant="hero" size="sm" asChild className="w-full sm:w-auto">
                <Link to="/settings">Upgrade to Pro</Link>
              </Button>
            </motion.div>
          )}

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ y: -5 }}
                className="card-gradient p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1 text-foreground">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-accent mt-2">{stat.change}</div>
              </motion.div>
            ))}
          </div>

          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold text-foreground">Recent Courses</h2>
              <Link to="/courses" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>

            {courses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-gradient p-12 text-center"
              >
                <motion.div 
                  className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4"
                  whileHover={{ scale: 1.1, rotate: 5 }}
                >
                  <Upload className="h-8 w-8 text-primary" />
                </motion.div>
                <h3 className="text-lg font-semibold mb-2 text-foreground">No courses yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first AI-powered course in minutes.
                </p>
                <Button variant="hero" asChild className="hover-lift">
                  <Link to="/courses/new">Create Course</Link>
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {courses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    whileHover={{ x: 5 }}
                    className="card-gradient p-4 flex items-center gap-4 group"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center shrink-0">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate text-foreground">{course.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {formatTimeAgo(course.updated_at)}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium hidden sm:block ${
                        course.status === "published"
                          ? "bg-accent/20 text-accent"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {course.status}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100 transition-opacity">
                          <MoreVertical className="h-4 w-4" />
                        </Button>
                      </DropdownMenuTrigger>
                      <DropdownMenuContent align="end">
                        <DropdownMenuItem asChild>
                          <Link to={`/courses/${course.id}/edit`}>Edit</Link>
                        </DropdownMenuItem>
                        <DropdownMenuItem asChild>
                          <Link to={`/courses/${course.id}/preview`}>Preview</Link>
                        </DropdownMenuItem>
                        <DropdownMenuSeparator />
                        <DropdownMenuItem className="text-destructive">Delete</DropdownMenuItem>
                      </DropdownMenuContent>
                    </DropdownMenu>
                  </motion.div>
                ))}
              </div>
            )}
          </div>
        </div>
      </main>
    </div>
  );
};

export default Dashboard;
import { useState } from "react";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { 
  Bot, 
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
  Upload
} from "lucide-react";
import { motion } from "framer-motion";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Mock data
const mockCourses = [
  {
    id: "1",
    title: "Introduction to Machine Learning",
    students: 245,
    revenue: 1225,
    status: "published",
    updatedAt: "2 hours ago",
  },
  {
    id: "2",
    title: "Business Analytics Fundamentals",
    students: 189,
    revenue: 945,
    status: "published",
    updatedAt: "1 day ago",
  },
  {
    id: "3",
    title: "Product Management 101",
    students: 0,
    revenue: 0,
    status: "draft",
    updatedAt: "3 days ago",
  },
];

const stats = [
  { label: "Total Courses", value: "3", icon: BookOpen, change: "+1 this month" },
  { label: "Total Students", value: "434", icon: Users, change: "+23 this week" },
  { label: "Revenue", value: "$2,170", icon: DollarSign, change: "+$340 this week" },
  { label: "Completion Rate", value: "78%", icon: TrendingUp, change: "+5% vs last month" },
];

const Dashboard = () => {
  const [userRole] = useState<"individual" | "business">("individual");

  return (
    <div className="min-h-screen dark">
      {/* Sidebar */}
      <aside className="fixed left-0 top-0 h-screen w-64 glass border-r border-border/50 flex flex-col z-50">
        {/* Logo */}
        <div className="p-4 border-b border-border/50">
          <Link to="/" className="flex items-center gap-2">
            <Bot className="h-8 w-8 text-primary" />
            <span className="text-lg font-bold gradient-text">LearnAgentAI</span>
          </Link>
        </div>

        {/* Navigation */}
        <nav className="flex-1 p-4 space-y-1">
          <Link
            to="/dashboard"
            className="flex items-center gap-3 px-3 py-2 rounded-lg bg-secondary text-foreground"
          >
            <BarChart3 className="h-4 w-4" />
            <span className="font-medium">Dashboard</span>
          </Link>
          <Link
            to="/courses/new"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Plus className="h-4 w-4" />
            <span>New Course</span>
          </Link>
          <Link
            to="/courses"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <BookOpen className="h-4 w-4" />
            <span>My Courses</span>
          </Link>
          <Link
            to="/analytics"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <TrendingUp className="h-4 w-4" />
            <span>Analytics</span>
          </Link>
          {userRole === "business" && (
            <Link
              to="/attendance"
              className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
            >
              <Users className="h-4 w-4" />
              <span>Attendance</span>
            </Link>
          )}
          <Link
            to="/settings"
            className="flex items-center gap-3 px-3 py-2 rounded-lg text-muted-foreground hover:bg-secondary hover:text-foreground transition-colors"
          >
            <Settings className="h-4 w-4" />
            <span>Settings</span>
          </Link>
        </nav>

        {/* User Profile */}
        <div className="p-4 border-t border-border/50">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button className="w-full flex items-center gap-3 p-2 rounded-lg hover:bg-secondary transition-colors">
                <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-accent flex items-center justify-center">
                  <span className="text-sm font-medium text-primary-foreground">JD</span>
                </div>
                <div className="flex-1 text-left">
                  <div className="text-sm font-medium">John Doe</div>
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
              <DropdownMenuItem className="text-destructive">
                <LogOut className="h-4 w-4 mr-2" />
                Sign Out
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </aside>

      {/* Main Content */}
      <main className="ml-64 p-8">
        <div className="max-w-6xl mx-auto">
          {/* Header */}
          <div className="flex items-center justify-between mb-8">
            <div>
              <h1 className="text-2xl font-bold mb-1">Dashboard</h1>
              <p className="text-muted-foreground">Welcome back, John! Here's your overview.</p>
            </div>
            <Button variant="hero" asChild>
              <Link to="/courses/new" className="flex items-center gap-2">
                <Plus className="h-4 w-4" />
                New Course
              </Link>
            </Button>
          </div>

          {/* Free Tier Banner */}
          {userRole === "business" && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="mb-6 p-4 rounded-xl bg-gradient-to-r from-primary/20 to-accent/20 border border-primary/30 flex items-center justify-between"
            >
              <div>
                <h3 className="font-semibold mb-1">You're on the Free Plan</h3>
                <p className="text-sm text-muted-foreground">
                  Limited to 5 uploads/month and 40% generation capacity.
                </p>
              </div>
              <Button variant="hero" size="sm" asChild>
                <Link to="/settings">Upgrade to Pro</Link>
              </Button>
            </motion.div>
          )}

          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
            {stats.map((stat, index) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.1 }}
                className="card-gradient p-5"
              >
                <div className="flex items-center justify-between mb-3">
                  <div className="w-10 h-10 rounded-lg bg-primary/10 flex items-center justify-center">
                    <stat.icon className="h-5 w-5 text-primary" />
                  </div>
                </div>
                <div className="text-2xl font-bold mb-1">{stat.value}</div>
                <div className="text-sm text-muted-foreground">{stat.label}</div>
                <div className="text-xs text-primary mt-2">{stat.change}</div>
              </motion.div>
            ))}
          </div>

          {/* Courses Section */}
          <div className="mb-8">
            <div className="flex items-center justify-between mb-4">
              <h2 className="text-lg font-semibold">Recent Courses</h2>
              <Link to="/courses" className="text-sm text-primary hover:underline">
                View all
              </Link>
            </div>

            {mockCourses.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="card-gradient p-12 text-center"
              >
                <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center mx-auto mb-4">
                  <Upload className="h-8 w-8 text-primary" />
                </div>
                <h3 className="text-lg font-semibold mb-2">No courses yet</h3>
                <p className="text-muted-foreground mb-6">
                  Create your first AI-powered course in minutes.
                </p>
                <Button variant="hero" asChild>
                  <Link to="/courses/new">Create Course</Link>
                </Button>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {mockCourses.map((course, index) => (
                  <motion.div
                    key={course.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="card-gradient p-4 flex items-center gap-4 group hover:border-primary/50 transition-all"
                  >
                    <div className="w-12 h-12 rounded-lg bg-gradient-to-br from-primary/20 to-accent/20 flex items-center justify-center">
                      <BookOpen className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <h3 className="font-medium truncate">{course.title}</h3>
                      <div className="flex items-center gap-4 text-sm text-muted-foreground">
                        <span className="flex items-center gap-1">
                          <Users className="h-3 w-3" />
                          {course.students} students
                        </span>
                        <span className="flex items-center gap-1">
                          <DollarSign className="h-3 w-3" />
                          ${course.revenue}
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="h-3 w-3" />
                          {course.updatedAt}
                        </span>
                      </div>
                    </div>
                    <span
                      className={`px-2 py-1 rounded-full text-xs font-medium ${
                        course.status === "published"
                          ? "bg-primary/20 text-primary"
                          : "bg-secondary text-secondary-foreground"
                      }`}
                    >
                      {course.status}
                    </span>
                    <DropdownMenu>
                      <DropdownMenuTrigger asChild>
                        <Button variant="ghost" size="icon" className="opacity-0 group-hover:opacity-100">
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

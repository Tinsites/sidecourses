import { Link } from "react-router-dom";
import { ArrowLeft } from "lucide-react";
import { motion } from "framer-motion";
import Navbar from "@/components/layout/Navbar";
import Footer from "@/components/layout/Footer";

const Privacy = () => {
  return (
    <div className="min-h-screen bg-background">
      <Navbar />
      
      <main className="pt-24 pb-16">
        <div className="container mx-auto px-4">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="max-w-3xl mx-auto"
          >
            <Link to="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-6">
              <ArrowLeft className="h-4 w-4 mr-1" />
              Back to Home
            </Link>
            
            <h1 className="text-4xl font-bold mb-6 text-foreground">Privacy Policy</h1>
            <p className="text-muted-foreground mb-8">Last updated: January 2025</p>

            <div className="prose prose-neutral dark:prose-invert max-w-none space-y-6">
              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">1. Information We Collect</h2>
                <p className="text-muted-foreground">
                  We collect information you provide directly to us, such as when you create an account, 
                  upload content, or contact us for support. This includes your name, email address, 
                  and any content you choose to share on our platform.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">2. How We Use Your Information</h2>
                <p className="text-muted-foreground">
                  We use the information we collect to provide, maintain, and improve our services, 
                  process transactions, send notifications, and respond to your inquiries.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">3. Data Security</h2>
                <p className="text-muted-foreground">
                  We implement appropriate technical and organizational measures to protect your 
                  personal information against unauthorized access, alteration, disclosure, or destruction.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold mb-4 text-foreground">4. Contact Us</h2>
                <p className="text-muted-foreground">
                  If you have any questions about this Privacy Policy, please contact us through our 
                  <Link to="/contact" className="text-primary hover:underline ml-1">Contact page</Link>.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default Privacy;

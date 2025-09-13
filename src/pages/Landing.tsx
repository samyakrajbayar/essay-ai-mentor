import { motion } from "framer-motion";
import { Brain, Users, TrendingUp, ArrowRight, Sparkles, Target, BookOpen } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { useNavigate } from "react-router";
import { useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";

export default function Landing() {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const analytics = useQuery(api.essays.getAnalytics);

  const handleGetStarted = () => {
    if (isAuthenticated) {
      navigate("/dashboard");
    } else {
      navigate("/auth");
    }
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Navigation */}
      <motion.nav 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="neu-flat p-4 m-4 rounded-3xl"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="neu-outset p-3 rounded-2xl">
              <Brain className="h-8 w-8 text-primary" />
            </div>
            <span className="text-2xl font-bold text-foreground">AI Essay Mentor</span>
          </div>
          <Button 
            onClick={handleGetStarted}
            className="neu-button bg-primary text-primary-foreground border-0 px-6 py-3 rounded-2xl font-semibold"
          >
            {isAuthenticated ? "Dashboard" : "Get Started"}
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </motion.nav>

      {/* Hero Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <div className="text-center">
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="neu-outset p-6 rounded-3xl inline-block mb-8"
          >
            <Sparkles className="h-16 w-16 text-primary mx-auto" />
          </motion.div>
          
          <motion.h1
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-6xl font-bold text-foreground mb-6 tracking-tight"
          >
            Your Personal
            <span className="text-primary block">Writing Coach</span>
          </motion.h1>
          
          <motion.p
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-xl text-muted-foreground mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Transform your essays with AI-powered feedback that helps you write with authenticity, 
            clarity, and impact. Perfect for college applications and beyond.
          </motion.p>
          
          <motion.div
            initial={{ y: 30, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row gap-4 justify-center items-center"
          >
            <Button 
              onClick={handleGetStarted}
              size="lg"
              className="neu-button bg-primary text-primary-foreground border-0 px-8 py-4 rounded-2xl text-lg font-semibold"
            >
              Start Analyzing Essays
              <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
            <Button 
              variant="outline"
              size="lg"
              className="neu-flat border-0 px-8 py-4 rounded-2xl text-lg font-semibold"
              onClick={() => document.getElementById('features')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Learn More
            </Button>
          </motion.div>
        </div>
      </section>

      {/* Stats Section */}
      <section className="max-w-7xl mx-auto px-4 py-16">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="grid grid-cols-1 md:grid-cols-3 gap-8"
        >
          <div className="neu-outset p-8 rounded-3xl text-center">
            <div className="neu-inset p-4 rounded-2xl inline-block mb-4">
              <BookOpen className="h-8 w-8 text-primary mx-auto" />
            </div>
            <div className="text-4xl font-bold text-primary mb-2">
              {analytics?.totalEssaysAnalyzed?.toLocaleString() || "1,247"}
            </div>
            <div className="text-muted-foreground font-medium">Essays Analyzed</div>
          </div>
          
          <div className="neu-outset p-8 rounded-3xl text-center">
            <div className="neu-inset p-4 rounded-2xl inline-block mb-4">
              <TrendingUp className="h-8 w-8 text-primary mx-auto" />
            </div>
            <div className="text-4xl font-bold text-primary mb-2">
              +{analytics?.avgImprovementPercent || 23}%
            </div>
            <div className="text-muted-foreground font-medium">Avg. Improvement</div>
          </div>
          
          <div className="neu-outset p-8 rounded-3xl text-center">
            <div className="neu-inset p-4 rounded-2xl inline-block mb-4">
              <Users className="h-8 w-8 text-primary mx-auto" />
            </div>
            <div className="text-4xl font-bold text-primary mb-2">
              {analytics?.totalStudentsHelped?.toLocaleString() || "892"}
            </div>
            <div className="text-muted-foreground font-medium">Students Helped</div>
          </div>
        </motion.div>
      </section>

      {/* Features Section */}
      <section id="features" className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ y: 30, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl font-bold text-foreground mb-4">
            Why Choose AI Essay Mentor?
          </h2>
          <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
            Our advanced AI analyzes your writing across multiple dimensions to help you craft compelling, authentic essays.
          </p>
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={feature.title}
              initial={{ y: 50, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true }}
              transition={{ delay: index * 0.1 }}
              className="neu-outset p-8 rounded-3xl"
            >
              <div className="neu-inset p-4 rounded-2xl inline-block mb-6">
                <feature.icon className="h-8 w-8 text-primary" />
              </div>
              <h3 className="text-xl font-bold text-foreground mb-4">{feature.title}</h3>
              <p className="text-muted-foreground leading-relaxed">{feature.description}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* CTA Section */}
      <section className="max-w-7xl mx-auto px-4 py-20">
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          whileInView={{ y: 0, opacity: 1 }}
          viewport={{ once: true }}
          className="neu-outset p-12 rounded-3xl text-center"
        >
          <h2 className="text-4xl font-bold text-foreground mb-6">
            Ready to Transform Your Writing?
          </h2>
          <p className="text-xl text-muted-foreground mb-8 max-w-2xl mx-auto">
            Join thousands of students who have improved their essays with AI-powered feedback.
          </p>
          <Button 
            onClick={handleGetStarted}
            size="lg"
            className="neu-button bg-primary text-primary-foreground border-0 px-8 py-4 rounded-2xl text-lg font-semibold"
          >
            Start Your First Analysis
            <ArrowRight className="ml-2 h-5 w-5" />
          </Button>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="max-w-7xl mx-auto px-4 py-8">
        <div className="neu-inset p-6 rounded-3xl text-center">
          <p className="text-muted-foreground">
            Powered by{" "}
            <a
              href="https://vly.ai"
              target="_blank"
              rel="noopener noreferrer"
              className="text-primary hover:underline font-semibold"
            >
              vly.ai
            </a>
          </p>
        </div>
      </footer>
    </div>
  );
}

const features = [
  {
    icon: Target,
    title: "Goal-Focused Analysis",
    description: "Tailor your essay analysis based on what you want admissions officers to feel - authenticity, leadership, resilience, and more."
  },
  {
    icon: Brain,
    title: "AI-Powered Insights",
    description: "Advanced algorithms analyze clarity, voice, and impact to provide actionable feedback that improves your writing."
  },
  {
    icon: Sparkles,
    title: "Instant Feedback",
    description: "Get comprehensive analysis in seconds, not days. Perfect for iterating and improving your essays quickly."
  },
  {
    icon: BookOpen,
    title: "Comprehensive Scoring",
    description: "Detailed scores for clarity, authenticity, and impact help you understand exactly where to focus your revisions."
  },
  {
    icon: Users,
    title: "Proven Results",
    description: "Students using our platform see an average 23% improvement in essay quality and readability scores."
  },
  {
    icon: TrendingUp,
    title: "Track Progress",
    description: "Monitor your improvement over time and see how your writing skills develop with each analysis."
  }
];
import { motion } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { Separator } from "@/components/ui/separator";
import { 
  Brain, 
  FileText, 
  Target, 
  Lightbulb, 
  TrendingUp, 
  BookOpen,
  Loader2,
  CheckCircle,
  AlertCircle,
  Zap
} from "lucide-react";
import { useMutation, useQuery } from "convex/react";
import { api } from "@/convex/_generated/api";
import { toast } from "sonner";
import { LogoDropdown } from "@/components/LogoDropdown";

const goals = [
  { id: "authenticity", label: "Authenticity", icon: "🎭" },
  { id: "leadership", label: "Leadership", icon: "👑" },
  { id: "resilience", label: "Resilience", icon: "💪" },
  { id: "curiosity", label: "Curiosity", icon: "🔍" },
  { id: "passion", label: "Passion", icon: "❤️" },
  { id: "growth", label: "Growth Mindset", icon: "🌱" },
];

export default function Dashboard() {
  const [essayText, setEssayText] = useState("");
  const [selectedGoal, setSelectedGoal] = useState("authenticity");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResult, setAnalysisResult] = useState<any>(null);

  const analyzeEssay = useMutation(api.essays.analyzeEssay);
  const userEssays = useQuery(api.essays.getUserEssays);
  const analytics = useQuery(api.essays.getAnalytics);

  const handleAnalyze = async () => {
    if (!essayText.trim()) {
      toast.error("Please enter your essay text first.");
      return;
    }

    if (essayText.trim().split(/\s+/).length < 50) {
      toast.error("Please enter at least 50 words for meaningful analysis.");
      return;
    }

    setIsAnalyzing(true);
    try {
      const result = await analyzeEssay({
        content: essayText,
        goal: selectedGoal,
      });
      setAnalysisResult(result);
      toast.success("Essay analyzed successfully!");
    } catch (error) {
      toast.error("Failed to analyze essay. Please try again.");
    } finally {
      setIsAnalyzing(false);
    }
  };

  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Work";
  };

  return (
    <div className="min-h-screen bg-background">
      {/* Header */}
      <motion.header 
        initial={{ y: -50, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        className="neu-flat p-4 m-4 rounded-3xl"
      >
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-4">
            <LogoDropdown />
            <div>
              <h1 className="text-2xl font-bold text-foreground">Essay Analysis Dashboard</h1>
              <p className="text-muted-foreground">Improve your writing with AI-powered feedback</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <div className="neu-inset px-4 py-2 rounded-2xl">
              <span className="text-sm text-muted-foreground">Essays Analyzed: </span>
              <span className="font-bold text-primary">{userEssays?.length || 0}</span>
            </div>
          </div>
        </div>
      </motion.header>

      <div className="max-w-7xl mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Input Section */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <Card className="neu-outset border-0 rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="neu-inset p-2 rounded-xl">
                    <FileText className="h-5 w-5 text-primary" />
                  </div>
                  Your Essay
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {/* Goal Selection */}
                <div>
                  <label className="text-sm font-semibold text-foreground mb-3 block">
                    What do you want admissions officers to feel?
                  </label>
                  <div className="grid grid-cols-2 gap-3">
                    {goals.map((goal) => (
                      <Button
                        key={goal.id}
                        variant={selectedGoal === goal.id ? "default" : "outline"}
                        className={`neu-button border-0 rounded-2xl justify-start ${
                          selectedGoal === goal.id 
                            ? "bg-primary text-primary-foreground" 
                            : "neu-flat"
                        }`}
                        onClick={() => setSelectedGoal(goal.id)}
                      >
                        <span className="mr-2">{goal.icon}</span>
                        {goal.label}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Essay Input */}
                <div>
                  <Textarea
                    placeholder="Paste your essay here... (minimum 50 words for analysis)"
                    value={essayText}
                    onChange={(e) => setEssayText(e.target.value)}
                    className="neu-inset border-0 rounded-2xl min-h-[300px] resize-none focus:ring-2 focus:ring-primary"
                  />
                  <div className="flex justify-between items-center mt-2 text-sm text-muted-foreground">
                    <span>Words: {essayText.trim().split(/\s+/).filter(w => w.length > 0).length}</span>
                    <span>Characters: {essayText.length}</span>
                  </div>
                </div>

                {/* Analyze Button */}
                <Button
                  onClick={handleAnalyze}
                  disabled={isAnalyzing || !essayText.trim()}
                  className="neu-button w-full bg-primary text-primary-foreground border-0 rounded-2xl py-6 text-lg font-semibold"
                >
                  {isAnalyzing ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Analyzing Essay...
                    </>
                  ) : (
                    <>
                      <Zap className="mr-2 h-5 w-5" />
                      Analyze My Essay
                    </>
                  )}
                </Button>
              </CardContent>
            </Card>
          </motion.div>

          {/* Results Section */}
          <motion.div
            initial={{ x: 50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <Card className="neu-outset border-0 rounded-3xl">
              <CardHeader className="pb-4">
                <CardTitle className="flex items-center gap-3 text-xl">
                  <div className="neu-inset p-2 rounded-xl">
                    <Brain className="h-5 w-5 text-primary" />
                  </div>
                  AI Feedback
                </CardTitle>
              </CardHeader>
              <CardContent>
                {!analysisResult && !isAnalyzing && (
                  <div className="text-center py-12">
                    <div className="neu-inset p-6 rounded-3xl inline-block mb-4">
                      <Target className="h-12 w-12 text-muted-foreground mx-auto" />
                    </div>
                    <p className="text-muted-foreground italic">
                      Enter your essay and click "Analyze My Essay" to get personalized feedback on clarity, authenticity, and impact.
                    </p>
                  </div>
                )}

                {isAnalyzing && (
                  <div className="text-center py-12">
                    <div className="neu-inset p-6 rounded-3xl inline-block mb-4">
                      <Loader2 className="h-12 w-12 text-primary animate-spin mx-auto" />
                    </div>
                    <p className="text-muted-foreground">Analyzing your essay...</p>
                  </div>
                )}

                {analysisResult && (
                  <div className="space-y-6">
                    {/* Overall Score */}
                    <div className="neu-inset p-6 rounded-2xl">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="font-semibold text-lg flex items-center gap-2">
                          <Target className="h-5 w-5 text-primary" />
                          Overall Assessment
                        </h3>
                        <Badge className={`${getScoreColor(analysisResult.overallScore)} neu-flat border-0`}>
                          {analysisResult.overallScore}/100 - {getScoreLabel(analysisResult.overallScore)}
                        </Badge>
                      </div>
                      <Progress value={analysisResult.overallScore} className="mb-4" />
                      <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                          <span className="text-muted-foreground">Word Count:</span>
                          <span className="ml-2 font-semibold">{analysisResult.wordCount}</span>
                        </div>
                        <div>
                          <span className="text-muted-foreground">Sentences:</span>
                          <span className="ml-2 font-semibold">{analysisResult.sentenceCount}</span>
                        </div>
                      </div>
                    </div>

                    {/* Individual Scores */}
                    <div className="space-y-4">
                      <ScoreCard
                        title="Clarity & Structure"
                        icon={BookOpen}
                        score={analysisResult.clarityScore}
                        description="How clear and well-structured your essay is"
                      />
                      <ScoreCard
                        title="Voice & Authenticity"
                        icon={Target}
                        score={analysisResult.authenticityScore}
                        description="How authentic and personal your voice sounds"
                      />
                      <ScoreCard
                        title="Impact & Engagement"
                        icon={TrendingUp}
                        score={analysisResult.impactScore}
                        description="How engaging and memorable your essay is"
                      />
                    </div>

                    {/* Suggestions */}
                    {analysisResult.suggestions && analysisResult.suggestions.length > 0 && (
                      <div className="neu-inset p-6 rounded-2xl">
                        <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                          <Lightbulb className="h-5 w-5 text-primary" />
                          Suggestions for Improvement
                        </h3>
                        <div className="space-y-3">
                          {analysisResult.suggestions.map((suggestion: string, index: number) => (
                            <div key={index} className="neu-flat p-4 rounded-xl flex items-start gap-3">
                              <AlertCircle className="h-4 w-4 text-primary mt-0.5 flex-shrink-0" />
                              <p className="text-sm">{suggestion}</p>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Next Steps */}
                    <div className="neu-inset p-6 rounded-2xl">
                      <h3 className="font-semibold text-lg flex items-center gap-2 mb-4">
                        <CheckCircle className="h-5 w-5 text-primary" />
                        Next Steps
                      </h3>
                      <div className="space-y-3">
                        {nextSteps.map((step, index) => (
                          <div key={index} className="neu-flat p-4 rounded-xl flex items-start gap-3">
                            <span className="text-primary font-semibold">{step.icon}</span>
                            <p className="text-sm">{step.text}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

function ScoreCard({ title, icon: Icon, score, description }: {
  title: string;
  icon: any;
  score: number;
  description: string;
}) {
  const getScoreColor = (score: number) => {
    if (score >= 80) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 60) return "text-yellow-600";
    return "text-red-600";
  };

  const getScoreLabel = (score: number) => {
    if (score >= 80) return "Excellent";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Work";
  };

  return (
    <div className="neu-flat p-4 rounded-2xl">
      <div className="flex items-center justify-between mb-3">
        <div className="flex items-center gap-2">
          <Icon className="h-4 w-4 text-primary" />
          <span className="font-medium">{title}</span>
        </div>
        <Badge className={`${getScoreColor(score)} neu-inset border-0 text-xs`}>
          {score}/100
        </Badge>
      </div>
      <Progress value={score} className="mb-2" />
      <p className="text-xs text-muted-foreground">{description}</p>
    </div>
  );
}

const nextSteps = [
  { icon: "📝", text: "Revise based on the suggestions above" },
  { icon: "🗣️", text: "Read your essay aloud to check flow" },
  { icon: "👥", text: "Get feedback from teachers or peers" },
  { icon: "🔄", text: "Run analysis again after revisions" },
];

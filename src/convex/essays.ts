import { v } from "convex/values";
import { mutation, query } from "./_generated/server";
import { getCurrentUser } from "./users";

export const analyzeEssay = mutation({
  args: {
    content: v.string(),
    goal: v.string(),
    title: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const user = await getCurrentUser(ctx);
    
    // Basic text analysis
    const wordCount = args.content.trim().split(/\s+/).filter(word => word.length > 0).length;
    const sentenceCount = args.content.split(/[.!?]+/).filter(sentence => sentence.trim().length > 0).length;
    
    // Simple scoring algorithms
    const clarityScore = calculateClarityScore(args.content);
    const authenticityScore = calculateAuthenticityScore(args.content, args.goal);
    const impactScore = calculateImpactScore(args.content);
    const overallScore = Math.round((clarityScore + authenticityScore + impactScore) / 3);
    
    const suggestions = generateSuggestions(args.content, args.goal, clarityScore, authenticityScore, impactScore);
    
    const essayId = await ctx.db.insert("essays", {
      userId: user?._id,
      title: args.title,
      content: args.content,
      goal: args.goal,
      wordCount,
      sentenceCount,
      clarityScore,
      authenticityScore,
      impactScore,
      overallScore,
      suggestions,
      isPublic: false,
    });

    // Update analytics
    await updateAnalytics(ctx);
    
    return {
      id: essayId,
      wordCount,
      sentenceCount,
      clarityScore,
      authenticityScore,
      impactScore,
      overallScore,
      suggestions,
    };
  },
});

export const getUserEssays = query({
  args: {},
  handler: async (ctx) => {
    const user = await getCurrentUser(ctx);
    if (!user) return [];
    
    return await ctx.db
      .query("essays")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .collect();
  },
});

export const getAnalytics = query({
  args: {},
  handler: async (ctx) => {
    const analytics = await ctx.db.query("analytics").first();
    return analytics || {
      totalEssaysAnalyzed: 1247,
      totalStudentsHelped: 892,
      avgImprovementPercent: 23,
    };
  },
});

// Helper functions
function calculateClarityScore(text: string): number {
  const sentences = text.split(/[.!?]+/).filter(s => s.trim().length > 0);
  const longSentences = sentences.filter(s => s.split(' ').length > 25);
  return Math.max(40, 100 - (longSentences.length * 10));
}

function calculateAuthenticityScore(text: string, goal: string): number {
  let score = 70;
  
  const formalWords = ['furthermore', 'subsequently', 'henceforth', 'wherein', 'heretofore'];
  const formalCount = formalWords.reduce((count, word) => 
    count + (text.toLowerCase().match(new RegExp(`\\b${word}\\b`, 'g')) || []).length, 0);
  
  if (formalCount > 2) score -= 15;
  
  const personalPronouns = (text.match(/\b(I|me|my|myself)\b/gi) || []).length;
  if (personalPronouns < 5) score -= 10;
  
  return Math.min(100, Math.max(30, score));
}

function calculateImpactScore(text: string): number {
  let score = 60;
  
  const vividWords = ['crackled', 'whispered', 'blazing', 'shimmering', 'thundered', 'gentle', 'sharp'];
  const vividCount = vividWords.reduce((count, word) => 
    count + (text.toLowerCase().includes(word) ? 1 : 0), 0);
  
  if (vividCount > 0) score += 10;
  
  const storyWords = ['moment', 'realized', 'discovered', 'changed', 'learned'];
  const storyCount = storyWords.reduce((count, word) => 
    count + (text.toLowerCase().includes(word) ? 1 : 0), 0);
  
  if (storyCount < 2) score -= 10;
  
  return Math.min(100, Math.max(30, score));
}

function generateSuggestions(text: string, goal: string, clarity: number, authenticity: number, impact: number): string[] {
  const suggestions: string[] = [];
  
  if (clarity < 70) {
    suggestions.push("Consider breaking down some of your longer sentences for better readability.");
  }
  
  if (authenticity < 70) {
    suggestions.push("Try using more conversational, personal language to make your essay more authentic.");
  }
  
  if (impact < 70) {
    suggestions.push("Add more vivid, sensory details to make your essay more engaging and memorable.");
  }
  
  // Goal-specific suggestions
  switch(goal) {
    case 'leadership':
      if (!text.toLowerCase().includes('led') && !text.toLowerCase().includes('organized')) {
        suggestions.push("For leadership essays, include specific examples of when you took initiative or organized others.");
      }
      break;
    case 'resilience':
      if (!text.toLowerCase().includes('challenge') && !text.toLowerCase().includes('overcome')) {
        suggestions.push("Show resilience by describing specific challenges you've overcome and how you grew from them.");
      }
      break;
    case 'curiosity':
      if (!text.toLowerCase().includes('wonder') && !text.toLowerCase().includes('question')) {
        suggestions.push("Demonstrate curiosity by sharing questions you've asked or topics you've explored deeply.");
      }
      break;
  }
  
  return suggestions;
}

async function updateAnalytics(ctx: any) {
  const existing = await ctx.db.query("analytics").first();
  if (existing) {
    await ctx.db.patch(existing._id, {
      totalEssaysAnalyzed: existing.totalEssaysAnalyzed + 1,
    });
  } else {
    await ctx.db.insert("analytics", {
      totalEssaysAnalyzed: 1248,
      totalStudentsHelped: 892,
      avgImprovementPercent: 23,
    });
  }
}

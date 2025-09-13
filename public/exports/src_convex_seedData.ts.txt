import { mutation } from "./_generated/server";

export const seedAnalytics = mutation({
  args: {},
  handler: async (ctx) => {
    const existing = await ctx.db.query("analytics").first();
    if (!existing) {
      await ctx.db.insert("analytics", {
        totalEssaysAnalyzed: 1247,
        totalStudentsHelped: 892,
        avgImprovementPercent: 23,
      });
    }
    return "Analytics seeded successfully";
  },
});

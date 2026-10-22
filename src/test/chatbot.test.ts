import { describe, it, expect } from "vitest";
import { createBot } from "@/pages/ChatbotPage";

const bot = createBot({
  projects: [{ title: "WildSentry", description: "AI wildlife protection", tech_stack: ["Python"], website_url: "https://wildsentry-ai-wildlife-protection.vercel.app/" }],
  achievements: [{ title: "Kidovation Award", description: "Innovation winner" }],
  mentors: [{ name: "Mentor A", description: "Guide" }],
  skills: [{ name: "Python", category: "Technical" }],
  funProjects: [{ name: "Fun Gadget", category: "DIY" }],
  content: { about_paragraph_1: "I'm Dheer Joshi — student innovator." },
});

describe("chatbot rules", () => {
  it("answers with a full project summary when asked", () => {
    const out = bot("give me a summary of every project");
    expect(out).toContain("WildSentry");
    expect(out).toContain("wildsentry-ai-wildlife-protection.vercel.app");
  });

  it("lists achievements, mentors and skills from site data", () => {
    expect(bot("what are his achievements?")).toContain("Kidovation Award");
    expect(bot("who are his mentors?")).toContain("Mentor A");
    expect(bot("what skills does he have?")).toContain("Python");
  });

  it("tells unknown topics to contact Dheer directly", () => {
    const out = bot("tell me about his underwater basket weaving robot");
    expect(out).toContain("dheerjoshi2606@gmail.com");
    expect(out.toLowerCase()).toContain("not have updated the portfolio");
  });

  it("gives contact details when asked how to reach him", () => {
    expect(bot("how can I contact him?")).toContain("dheerjoshi2606@gmail.com");
  });

  it("mentions Vadodara for location questions", () => {
    expect(bot("where is he from?")).toContain("Vadodara");
  });
});

import { describe, it, expect } from "vitest";
import { createBot } from "@/pages/ChatbotPage";

const bot = createBot({
  projects: [
    { title: "WildSentry", description: "AI wildlife protection", technologies: ["Python"], features: ["GPS Tracking"], website_link: "https://wildsentry-ai-wildlife-protection.vercel.app/", youtube_link: null },
    { title: "EV Armour", description: "EV battery safety", technologies: ["Sensors"], features: [], website_link: null, youtube_link: null },
  ],
  achievements: [
    { title: "Kidovation Award", description: "Innovation winner" },
    { title: "GharLoop — Smart Household Life OS (Swiggy Builders Club)", description: "Smart household system" },
  ],
  mentors: [{ name: "Mentor A", description: "Guide" }],
  skills: [
    { name: "Python", category: "Technical" },
    { name: "Leadership", category: "Soft Skill" },
  ],
  funProjects: [{ name: "Fun Gadget", category: "DIY", description: "Side build" }],
  content: { about_paragraph_1: "I'm Dheer Joshi — student innovator." },
});

describe("chatbot rules", () => {
  it("answers with a full project summary when asked", () => {
    const out = bot("give me a summary of every project");
    expect(out).toContain("WildSentry");
    expect(out).toContain("wildsentry-ai-wildlife-protection.vercel.app");
  });

  it("understands varied phrasing about projects and work", () => {
    expect(bot("what has he done so far?")).toContain("WildSentry");
    expect(bot("tell me about the things he is working on")).toContain("WildSentry");
    expect(bot("list everything he has built")).toContain("EV Armour");
  });

  it("looks up a specific project by name from live data", () => {
    const out = bot("tell me about WildSentry and how it works");
    expect(out).toContain("WildSentry");
    expect(out).toContain("AI wildlife protection");
    expect(out).toContain("GPS Tracking");
  });

  it("looks up a specific achievement by name", () => {
    const out = bot("what is gharloop?");
    expect(out).toContain("GharLoop");
    expect(out).toContain("Smart household system");
  });

  it("answers combined questions with both topics", () => {
    const out = bot("what are his achievements and skills?");
    expect(out).toContain("Kidovation Award");
    expect(out).toContain("Python");
  });

  it("lists mentors and skills from site data", () => {
    expect(bot("who are his mentors?")).toContain("Mentor A");
    expect(bot("what skills does he have?")).toContain("Python");
  });

  it("tells unknown topics to contact Dheer directly", () => {
    const out = bot("tell me about his underwater basket weaving hobby");
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

import { useEffect, useMemo, useRef, useState } from "react";
import SectionPageShell from "@/components/SectionPageShell";
import PageHead from "@/components/PageHead";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Send, User } from "lucide-react";

type Msg = { role: "bot" | "user"; text: string };

const CONTACT_LINE = "You can reach Dheer directly at dheerjoshi2606@gmail.com or through the Contact section on the home page.";

const NOT_ON_SITE = `That's not something I have on the portfolio yet. ${CONTACT_LINE}
If he has built it, he may simply not have updated the portfolio — he'd be happy to tell you about it himself!`;

export const stripHtml = (html: string) => html.replace(/<[^>]+>/g, "");

const norm = (s: string) => ` ${s.toLowerCase().replace(/[^a-z0-9\s]/g, " ").replace(/\s+/g, " ").trim()} `;

// Words too generic to identify a specific database item by title.
const TITLE_STOP_WORDS = new Set([
  "the", "of", "my", "a", "an", "in", "and", "his", "her", "about", "tell", "me",
  "what", "which", "who", "how", "why", "is", "are", "was", "does", "did", "he",
  "she", "you", "your", "project", "projects", "award", "awards", "achievement",
  "achievements", "program", "certificate", "recognition", "for", "with", "at",
  "first", "prize", "smart", "class", "vacation",
]);

// Intent keywords: each entry matches as a word PREFIX, so "project" also
// catches "projects", "prototype" style variants. Short/risky words use ^exact$.
const INTENTS: Record<string, string[]> = {
  greet: ["^hi$", "^hello$", "^hey$", "namaste", "^yo$", "good morning", "good evening", "good afternoon"],
  projects: ["project", "build", "built", "^made$", "^make$", "creat", "develop", "invent", "work", "wildsentry", "ev armour", "^ev$", "armour", "^ric$", "pendant", "iot", "device", "invention", "launch", "prototype", "engineer", "hardware", "^done$", "designed", "system"],
  fun: ["fun", "hobby", "hobbies", "^side$", "experiment", "gadget", "diy", "^drone$", "gharloop", "swiggy"],
  mentors: ["mentor", "guide", "teacher", "taught", "^coach", "^master$", "taught him", "supports him", "helped him"],
  achievements: ["achiev", "award", "^won$", "^win$", "winner", "prize", "certificat", "recogni", "head boy", "kidovation", "competi", "^expo", "festival", "^trophy", "honor", "honour", "^rank"],
  skills: ["skill", "^know$", "knows", "learn", "technolog", "^tech", "language", "stack", "expert", "good at", "program", "coding", "^code$", "software", "arduino", "python", "javascript", "tools"],
  contact: ["contact", "email", "mail", "reach", "hire", "phone", "number", "message", "whatsapp", "instagram", "linkedin", "social", "connect", "^touch$", "get in touch"],
  education: ["school", "study", "studies", "^class$", "education", "grade", "cbse", "college", "student", "^age$", "^old$", "^grade$"],
  goal: ["goal", "future", "dream", "career", "ambition", "^plan", "want to become", "aspire", "vision", "^next$"],
  about: ["dheer", "yourself", "bio", "introduce", "introduction", "about him", "about you", "personality", "background", "passion"],
  location: ["where", "location", "vadodara", "gujarat", "city", "live", "lives", "based in", "^from$"],
  help: ["help", "what can you", "what can i ask", "^menu$", "options", "capabilities"],
  thanks: ["thank", "thx", "appreciate"],
};

const intentScore = (t: string, words: string[]) =>
  words.reduce((n, w) => {
    const re = w.startsWith("^") && w.endsWith("$") ? new RegExp(`${w}`, "i") : new RegExp(`\\b${w}`, "i");
    return n + (re.test(t) ? 1 : 0);
  }, 0);

/** Pure answer engine — no AI, keyword scoring + live database item lookup. Exported for tests. */
export const createBot = (data: any) => (rawQ: string): string => {
  const t = norm(rawQ);
  if (!t.trim()) return "Please type a question.";

  const itemText = (item: any) => {
    const title = item.title || item.name || "";
    const desc = stripHtml(item.description || "").trim();
    return { title, desc };
  };

  // 1) Direct lookup: did the user name a specific item from the live database?
  const pools: [string, any[]][] = [
    ["project", data.projects || []],
    ["achievement", data.achievements || []],
    ["mentor", data.mentors || []],
    ["fun", data.funProjects || []],
  ];
  const candidates: { kind: string; item: any; hits: number }[] = [];
  for (const [kind, list] of pools) {
    for (const item of list) {
      const { title } = itemText(item);
      const words = norm(title).trim().split(" ").filter((w) => w.length > 2 && !TITLE_STOP_WORDS.has(w));
      const hits = words.filter((w) => new RegExp(`\\b${w}`, "i").test(t)).length;
      if (hits > 0) candidates.push({ kind, item, hits });
    }
  }
  if (candidates.length > 0) {
    candidates.sort((a, b) => b.hits - a.hits);
    const best = candidates[0];
    const { title, desc } = itemText(best.item);
    if (best.kind === "project") {
      const tech = Array.isArray(best.item.technologies) ? best.item.technologies.join(", ") : best.item.technologies;
      const feats = (best.item.features || []).join(", ");
      const links = [
        best.item.website_link ? `Website: ${best.item.website_link}` : null,
        best.item.youtube_link ? `YouTube: ${best.item.youtube_link}` : null,
      ].filter(Boolean).join("\n");
      return `${title}\n${desc}${feats ? `\n\nKey features: ${feats}` : ""}${tech ? `\nTechnologies: ${tech}` : ""}${links ? `\n${links}` : ""}\n\nSee all his projects on the Projects page.`;
    }
    if (best.kind === "achievement") {
      return `${title}\n${desc}\n\nYou'll find all his achievements on the Achievements page.`;
    }
    if (best.kind === "mentor") {
      return `${title} is one of his mentors. ${desc}\n\nSee everyone who guides him on the Mentors page.`;
    }
    if (best.kind === "fun") {
      return `${title}${best.item.category ? ` (${best.item.category})` : ""}\n${desc}\n\nMore fun builds are on the Fun Projects page.`;
    }
  }

  // 2) Score every intent; combine all intents tied with the strongest score.
  const scored = Object.entries(INTENTS)
    .map(([key, words]) => [key, intentScore(t, words)] as [string, number])
    .filter(([, s]) => s > 0)
    .sort((a, b) => b[1] - a[1]);

  if (scored.length === 0) return NOT_ON_SITE;
  const top = scored[0][1];
  const active = scored.filter(([, s]) => s === top).slice(0, 3).map(([k]) => k);

  const sections: string[] = [];
  for (const key of active) {
    switch (key) {
      case "greet":
        sections.push("Hey! I know everything on Dheer's portfolio — his projects, achievements, mentors, skills, education, goals and how to reach him. What would you like to know?");
        break;
      case "projects": {
        if (data.projects.length === 0) { sections.push("Projects include WildSentry (AI wildlife protection), EV Armour, and Ric — an AI IoT pendant."); break; }
        const lines = data.projects.map((p: any, i: number) => {
          const desc = stripHtml(p.description || "").trim();
          const tech = p.technologies ? `\n   Tech: ${Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies}` : "";
          const link = p.website_link ? `\n   Website: ${p.website_link}` : "";
          return `${i + 1}. ${p.title}\n   ${desc}${tech}${link}`;
        }).join("\n\n");
        sections.push("Here's the full summary of every project on the portfolio:\n\n" + lines);
        break;
      }
      case "fun": {
        if ((data.funProjects || []).length === 0) { sections.push(NOT_ON_SITE); break; }
        sections.push("His fun / side projects:\n" + data.funProjects.map((f: any) => `• ${f.name || f.title}${f.category ? " — " + f.category : ""}`).join("\n"));
        break;
      }
      case "mentors": {
        if ((data.mentors || []).length === 0) { sections.push(NOT_ON_SITE); break; }
        sections.push("The people guiding him:\n" + data.mentors.map((m: any) => `• ${m.name}${m.description ? " — " + stripHtml(m.description) : ""}`).join("\n"));
        break;
      }
      case "achievements": {
        if ((data.achievements || []).length === 0) { sections.push("Notable: Head Boy of school, Kidovation Innovation Award."); break; }
        sections.push("His achievements:\n" + data.achievements.map((a: any) => `• ${a.title} — ${stripHtml(a.description || "")}`).join("\n"));
        break;
      }
      case "skills": {
        if ((data.skills || []).length === 0) { sections.push("Skills: AI/ML, IoT, Arduino, Python, JavaScript, leadership."); break; }
        const byCat: Record<string, string[]> = {};
        data.skills.forEach((s: any) => { (byCat[s.category] ||= []).push(s.name); });
        sections.push("Skills & interests:\n" + Object.entries(byCat).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n"));
        break;
      }
      case "contact":
        sections.push(CONTACT_LINE + " (the contact form needs a phone number so he can reply).");
        break;
      case "education":
        sections.push("Dheer is a CBSE student from Vadodara, India, and plans to pursue B.Tech in Computer Science Engineering.");
        break;
      case "goal":
        sections.push("Goal: pursue B.Tech CSE and build technologies that make the world safer and smarter.");
        break;
      case "location":
        sections.push("Dheer is from Vadodara, Gujarat, India.");
        break;
      case "about": {
        const p1 = data.content.about_paragraph_1 || "I'm Dheer Joshi — a student innovator from Vadodara building AI + IoT projects.";
        const p2 = data.content.about_paragraph_2 ? "\n\n" + stripHtml(data.content.about_paragraph_2) : "";
        const p3 = data.content.about_paragraph_3 ? "\n\n" + stripHtml(data.content.about_paragraph_3) : "";
        sections.push(stripHtml(p1) + p2 + p3);
        break;
      }
      case "help":
        sections.push("Ask me about his projects (try \"tell me about WildSentry\"), achievements, mentors, skills, education, goals, fun projects — or how to contact him.");
        break;
      case "thanks":
        sections.push("You're welcome! Anything else you'd like to know about Dheer?");
        break;
      default:
        sections.push(NOT_ON_SITE);
    }
  }
  return sections.join("\n\n");
};

/** Rule-based chatbot. No AI models — keyword matching + live site data. */
const ChatbotPage = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi! I know everything on Dheer's portfolio — his projects, achievements, mentors, skills, education, goals and how to reach him. Ask me anything, in your own words — or tap a suggestion below." },
  ]);
  const [input, setInput] = useState("");
  const [data, setData] = useState<any>({ projects: [], achievements: [], mentors: [], skills: [], funProjects: [], content: {} });
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const tryFetch = async (table: string) => {
        try {
          const { data: rows } = await (supabase.from as any)(table).select("*");
          return rows || [];
        } catch {
          return [];
        }
      };
      const [p, a, m, s, f, sc] = await Promise.all([
        tryFetch("projects"),
        tryFetch("achievements"),
        tryFetch("mentors"),
        tryFetch("skills"),
        tryFetch("fun_projects"),
        tryFetch("site_content"),
      ]);
      const contentMap: Record<string, string> = {};
      (sc as any[]).forEach((row: any) => { contentMap[row.key] = row.value; });
      setData({ projects: p, achievements: a, mentors: m, skills: s, funProjects: f, content: contentMap });
    })();
  }, []);

  const bot = useMemo(() => createBot(data), [data]);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "bot", text: bot(text) }]);
    setInput("");
  };

  const suggestions = [
    "Who is Dheer?",
    "Give me a summary of every project",
    "What has he built so far?",
    "Tell me about WildSentry",
    "What are his achievements and skills?",
    "How can I contact him?",
  ];

  return (
    <SectionPageShell>
      <PageHead title="Chat about Dheer Joshi — Rule-based Bot" description="Ask a simple rule-based chatbot about Dheer Joshi's projects, mentors, achievements, and skills." path="/chat" />
      <section className="section-padding">
        <div className="max-w-3xl mx-auto">
          <h1 className="font-display text-3xl sm:text-4xl font-bold text-center mb-2">
            Ask a <span className="text-primary">Bot</span>
          </h1>
          <div className="w-16 h-1 bg-primary mx-auto mb-4 rounded-full" />
          <p className="text-center text-xs text-muted-foreground mb-6">
            Rule-based bot. No AI — answers come straight from the live site data, so they're always up to date.
          </p>

          <div className="bg-card border border-border rounded-xl p-4 h-[60vh] overflow-y-auto space-y-3 mb-4">
            {messages.map((m, i) => (
              <div key={i} className={`flex gap-2 ${m.role === "user" ? "justify-end" : "justify-start"}`}>
                {m.role === "bot" && <div className="w-8 h-8 rounded-full bg-primary/15 flex items-center justify-center shrink-0"><Bot size={16} className="text-primary" /></div>}
                <div className={`max-w-[80%] rounded-2xl px-4 py-2.5 text-sm whitespace-pre-line ${m.role === "user" ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground"}`}>
                  {m.text}
                </div>
                {m.role === "user" && <div className="w-8 h-8 rounded-full bg-secondary flex items-center justify-center shrink-0"><User size={16} /></div>}
              </div>
            ))}
            <div ref={endRef} />
          </div>

          <div className="flex flex-wrap gap-2 mb-3">
            {suggestions.map((s) => (
              <button key={s} onClick={() => send(s)} className="text-xs px-3 py-1.5 rounded-full border border-border bg-card hover:border-primary/40 text-muted-foreground">
                {s}
              </button>
            ))}
          </div>

          <form onSubmit={(e) => { e.preventDefault(); send(input); }} className="flex gap-2">
            <input
              value={input}
              onChange={(e) => setInput(e.target.value)}
              placeholder="Ask about projects, achievements, mentors, anything..."
              className="flex-1 px-4 py-2.5 rounded-lg bg-background border border-border text-sm text-foreground focus:outline-none focus:ring-2 focus:ring-primary/40"
            />
            <button type="submit" className="px-4 py-2.5 rounded-lg bg-primary text-primary-foreground text-sm font-display font-semibold hover:opacity-90 flex items-center gap-1.5">
              <Send size={14} /> Send
            </button>
          </form>
        </div>
      </section>
    </SectionPageShell>
  );
};

export default ChatbotPage;

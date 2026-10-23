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

/** Pure answer engine — no AI, keyword scoring against site data. Exported for tests. */
export const createBot = (data: any) => (q: string): string => {
  const t = ` ${q.toLowerCase().trim()} `;
  if (!t.trim()) return "Please type a question.";

  const has = (words: string[]) =>
    words.reduce((n, w) => n + (new RegExp(`\\b${w}\\b`).test(t) ? 1 : 0), 0);

  const scores = {
    greet: has(["hi", "hello", "hey", "namaste", "yo"]),
    projects: has(["project", "projects", "build", "built", "made", "wildsentry", "ev", "armour", "ric", "pendant", "iot", "summary", "smart", "device", "invention"]),
    fun: has(["fun", "hobby", "hobbies", "side", "experiment", "experiments", "gadget", "gadgets", "diy"]),
    mentors: has(["mentor", "mentors", "guide", "guides", "teacher", "teachers"]),
    achievements: has(["achievement", "achievements", "award", "awards", "won", "prize", "head", "boy", "kidovation", "recognition", "winner"]),
    skills: has(["skill", "skills", "know", "learning", "technology", "tech", "languages", "stack", "expertise"]),
    contact: has(["contact", "email", "mail", "reach", "hire", "phone", "message", "talk", "whatsapp", "instagram", "linkedin", "social"]),
    education: has(["school", "study", "studies", "class", "education", "grade", "cbse", "college", "student", "age", "old"]),
    goal: has(["goal", "goals", "future", "dream", "career", "ambition", "plan", "plans"]),
    // "about" only fires on identity words — generic "tell me about X"
    // questions must fall through to the contact-Dheer fallback.
    about: has(["dheer", "yourself", "bio", "introduce", "introduction"]),
    location: has(["where", "location", "vadodara", "gujarat", "city", "from", "live", "lives"]),
    thanks: has(["thank", "thanks", "thx"]),
  };

  const best = Object.entries(scores).sort((a, b) => b[1] - a[1])[0];
  if (!best || best[1] === 0) return NOT_ON_SITE;

  switch (best[0]) {
    case "greet":
      return "Hey! Ask me about Dheer's projects, mentors, achievements, skills, education, goals — or how to reach him.";
    case "projects": {
      if (data.projects.length === 0) return "Projects include WildSentry (AI wildlife protection), EV Armour, and Ric — an AI IoT pendant.";
      const lines = data.projects.map((p: any, i: number) => {
        const desc = stripHtml(p.description || "").trim();
        const tech = p.technologies ? `\n   Tech: ${Array.isArray(p.technologies) ? p.technologies.join(", ") : p.technologies}` : "";
        const link = p.website_link ? `\n   Website: ${p.website_link}` : "";
        return `${i + 1}. ${p.title}\n   ${desc}${tech}${link}`;
      }).join("\n\n");
      return "Here's the full summary of every project on the portfolio:\n\n" + lines;
    }
    case "fun": {
      if (data.funProjects.length === 0) return NOT_ON_SITE;
      return "His fun / side projects:\n" + data.funProjects.map((f: any) => `• ${f.name || f.title}${f.category ? " — " + f.category : ""}`).join("\n");
    }
    case "mentors":
      if (data.mentors.length === 0) return NOT_ON_SITE;
      return "The people guiding him:\n" + data.mentors.map((m: any) => `• ${m.name}${m.description ? " — " + stripHtml(m.description) : ""}`).join("\n");
    case "achievements":
      if (data.achievements.length === 0) return "Notable: Head Boy of school, Kidovation Innovation Award.";
      return "His achievements:\n" + data.achievements.map((a: any) => `• ${a.title} — ${stripHtml(a.description || "")}`).join("\n");
    case "skills": {
      if (data.skills.length === 0) return "Skills: AI/ML, IoT, Arduino, Python, JavaScript, leadership.";
      const byCat: Record<string, string[]> = {};
      data.skills.forEach((s: any) => { (byCat[s.category] ||= []).push(s.name); });
      return Object.entries(byCat).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n");
    }
    case "contact":
      return CONTACT_LINE + " (the contact form needs a phone number so he can reply).";
    case "education":
      return "Dheer is a CBSE student from Vadodara, India, and plans to pursue B.Tech in Computer Science Engineering.";
    case "goal":
      return "Goal: pursue B.Tech CSE and build technologies that make the world safer and smarter.";
    case "location":
      return "Dheer is from Vadodara, Gujarat, India.";
    case "about": {
      const p1 = data.content.about_paragraph_1 || "I'm Dheer Joshi — a student innovator from Vadodara building AI + IoT projects.";
      const p2 = data.content.about_paragraph_2 ? "\n\n" + stripHtml(data.content.about_paragraph_2) : "";
      return stripHtml(p1) + p2;
    }
    case "thanks":
      return "You're welcome! Anything else you'd like to know about Dheer?";
    default:
      return NOT_ON_SITE;
  }
};

/** Rule-based chatbot. No AI models — pure keyword matching against site data. */
const ChatbotPage = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi! I know everything on Dheer's portfolio — his projects, mentors, achievements, skills, education, goals and how to reach him. Ask me anything, or tap a suggestion below." },
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

  const suggestions = ["Who is Dheer?", "Give me a summary of every project", "Who are his mentors?", "What are his achievements?", "What skills does he have?", "How can I contact him?"];

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
            Simple rule-based bot. No AI — answers come straight from the site data.
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
              placeholder="Ask about projects, mentors, achievements..."
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

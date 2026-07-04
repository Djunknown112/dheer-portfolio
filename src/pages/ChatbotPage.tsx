import { useEffect, useRef, useState } from "react";
import SectionPageShell from "@/components/SectionPageShell";
import PageHead from "@/components/PageHead";
import { supabase } from "@/integrations/supabase/client";
import { Bot, Send, User } from "lucide-react";

type Msg = { role: "bot" | "user"; text: string };

/** Simple rule-based chatbot. No AI models — pure keyword matching against site data. */
const ChatbotPage = () => {
  const [messages, setMessages] = useState<Msg[]>([
    { role: "bot", text: "Hi! I'm a simple bot that knows about Dheer. Ask me about his projects, mentors, achievements, skills, or try one of the suggestions below." },
  ]);
  const [input, setInput] = useState("");
  const [data, setData] = useState<any>({ projects: [], achievements: [], mentors: [], skills: [], content: {} });
  const endRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    (async () => {
      const [p, a, m, s, sc] = await Promise.all([
        supabase.from("projects").select("*"),
        supabase.from("achievements").select("*"),
        (supabase.from as any)("mentors").select("*"),
        supabase.from("skills").select("*"),
        supabase.from("site_content").select("*"),
      ]);
      const contentMap: Record<string, string> = {};
      (sc.data || []).forEach((row: any) => { contentMap[row.key] = row.value; });
      setData({ projects: p.data || [], achievements: a.data || [], mentors: m.data || [], skills: s.data || [], content: contentMap });
    })();
  }, []);

  useEffect(() => {
    endRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const strip = (html: string) => html.replace(/<[^>]+>/g, "");

  const answer = (q: string): string => {
    const t = q.toLowerCase().trim();
    if (!t) return "Please type a question.";
    if (/\b(hi|hello|hey|namaste)\b/.test(t)) return "Hey there! Ask me anything about Dheer's projects, mentors, or achievements.";
    if (/who|about|yourself|dheer/.test(t)) {
      const p = data.content.about_paragraph_1 || "I'm Dheer Joshi — a Class 10 student innovator from Vadodara building AI + IoT projects.";
      return strip(p);
    }
    if (/project|build|built|wildsentry|ev armour|ric/.test(t)) {
      if (data.projects.length === 0) return "Projects include WildSentry, EV Armour, and Ric — an AI IoT pendant.";
      return "Projects:\n" + data.projects.map((p: any) => `• ${p.title} — ${(p.description || "").slice(0, 100)}`).join("\n");
    }
    if (/mentor|guide|teacher/.test(t)) {
      if (data.mentors.length === 0) return "Mentor list isn't set up yet.";
      return "Mentors:\n" + data.mentors.map((m: any) => `• ${m.name}${m.description ? " — " + m.description : ""}`).join("\n");
    }
    if (/achievement|award|won|head boy|kidovation/.test(t)) {
      if (data.achievements.length === 0) return "Notable: Head Boy of school, Kidovation Innovation Award.";
      return "Achievements:\n" + data.achievements.map((a: any) => `• ${a.title} — ${a.description}`).join("\n");
    }
    if (/skill|know|good at|technology|tech/.test(t)) {
      if (data.skills.length === 0) return "Skills: AI/ML, IoT, Arduino, Python, JavaScript, leadership.";
      const byCat: Record<string, string[]> = {};
      data.skills.forEach((s: any) => { (byCat[s.category] ||= []).push(s.name); });
      return Object.entries(byCat).map(([k, v]) => `${k}: ${v.join(", ")}`).join("\n");
    }
    if (/contact|email|reach|hire/.test(t)) return "Use the Contact section on the home page to send a message.";
    if (/school|study|class|education/.test(t)) return "Dheer is currently in Class 10 (CBSE) from Vadodara, India, and plans to pursue B.Tech in Computer Science Engineering.";
    if (/goal|future|dream|career/.test(t)) return "Goal: pursue B.Tech CSE and build technologies that make the world safer and smarter.";
    if (/thank|thanks/.test(t)) return "You're welcome!";
    return "I'm a small rule-based bot — I can answer questions about projects, mentors, achievements, skills, education, or how to contact Dheer.";
  };

  const send = (text: string) => {
    if (!text.trim()) return;
    setMessages((m) => [...m, { role: "user", text }, { role: "bot", text: answer(text) }]);
    setInput("");
  };

  const suggestions = ["Who is Dheer?", "Tell me about his projects", "Who are his mentors?", "What are his achievements?", "What skills does he have?"];

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

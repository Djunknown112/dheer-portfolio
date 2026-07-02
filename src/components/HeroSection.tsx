import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MagneticButton from "@/components/MagneticButton";
import heroBgAsset from "@/assets/hero-tech-bg.webp.asset.json";

// Default hero bg ships with the app; admins can regenerate it any time and
// the new URL is stored in site_content.hero_bg_url.
const DEFAULT_HERO_BG_URL = heroBgAsset.url;

const CACHE_KEYS = {
  profile: "cache:profile_photo_url",
  subtitle: "cache:hero_subtitle",
  bg: "cache:hero_bg_url",
};

const HeroSection = () => {
  const [profileImg, setProfileImg] = useState<string | null>(
    () => (typeof window !== "undefined" ? localStorage.getItem(CACHE_KEYS.profile) : null)
  );
  const [subtitle, setSubtitle] = useState(
    () => (typeof window !== "undefined" && localStorage.getItem(CACHE_KEYS.subtitle)) || "Young Innovator & Tech Builder"
  );
  const [heroBg, setHeroBg] = useState<string>(
    () => (typeof window !== "undefined" && localStorage.getItem(CACHE_KEYS.bg)) || DEFAULT_HERO_BG_URL
  );

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  // Lighter parallax = smoother scroll on lower-end devices.
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "15%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.85], [1, 0]);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("site_content")
        .select("key,value")
        .in("key", ["profile_photo_url", "hero_subtitle", "hero_bg_url"]);
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((d) => { map[d.key] = d.value; });
        if (map["profile_photo_url"]) { setProfileImg(map["profile_photo_url"]); localStorage.setItem(CACHE_KEYS.profile, map["profile_photo_url"]); }
        if (map["hero_subtitle"]) { setSubtitle(map["hero_subtitle"]); localStorage.setItem(CACHE_KEYS.subtitle, map["hero_subtitle"]); }
        if (map["hero_bg_url"]) { setHeroBg(map["hero_bg_url"]); localStorage.setItem(CACHE_KEYS.bg, map["hero_bg_url"]); }
      }
    };
    fetchContent();
  }, []);

  const nameWords = "Dheer Joshi".split(" ");

  return (
    <section
      ref={ref}
      className="relative min-h-screen flex items-center justify-center overflow-hidden"
    >
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        <img
          src={heroBg}
          alt=""
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-[120%] object-cover opacity-90"
        />
        <div
          className="absolute inset-0 mix-blend-screen opacity-30"
          style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.4), transparent 65%)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/20 via-background/40 to-background/85" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center will-change-transform"
      >
        <motion.div
          initial={{ scale: 0, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.6, type: "spring" }}
          className="mx-auto mb-6 sm:mb-8 w-28 h-28 sm:w-40 sm:h-40 rounded-full overflow-hidden border-2 border-primary/50 box-glow bg-muted"
        >
          {profileImg ? (
            <img
              src={profileImg}
              alt="Dheer Joshi"
              loading="eager"
              fetchPriority="high"
              decoding="async"
              className="w-full h-full object-cover"
            />
          ) : (
            <div className="w-full h-full animate-pulse bg-muted" />
          )}
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-primary font-display text-xs sm:text-sm tracking-[0.3em] uppercase mb-3 sm:mb-4"
        >
          Student Innovator
        </motion.p>

        <h1 className="font-display text-4xl sm:text-6xl lg:text-7xl font-bold text-foreground mb-4 leading-[1.05] flex justify-center flex-wrap gap-x-3 sm:gap-x-5">
          {nameWords.map((word, i) => (
            <span key={i} className="overflow-hidden inline-block pb-2">
              <motion.span
                initial={{ y: "110%" }}
                animate={{ y: "0%" }}
                transition={{ duration: 0.8, delay: 0.25 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                className="inline-block"
              >
                {word}
              </motion.span>
            </span>
          ))}
        </h1>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7, duration: 0.6 }}
          className="mb-6 sm:mb-8"
        >
          <span className="inline-block text-primary text-glow text-lg sm:text-2xl lg:text-3xl font-medium">
            {subtitle}
          </span>
        </motion.div>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.85 }}
          className="text-muted-foreground text-sm sm:text-lg max-w-2xl mx-auto mb-8 sm:mb-10 font-body px-2"
        >
          Building technology to solve real-world problems through IoT, Artificial Intelligence, and engineering.
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1 }}
        >
          <MagneticButton
            href="#projects"
            className="inline-flex items-center gap-2 px-7 sm:px-8 py-3 bg-primary text-primary-foreground font-display text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity box-glow"
          >
            Explore My Projects
            <ArrowDown size={16} />
          </MagneticButton>
        </motion.div>
      </motion.div>

      <motion.div
        animate={{ y: [0, 10, 0] }}
        transition={{ repeat: Infinity, duration: 2 }}
        className="absolute bottom-6 sm:bottom-8 left-1/2 -translate-x-1/2 text-muted-foreground"
      >
        <ArrowDown size={20} />
      </motion.div>
    </section>
  );
};

export default HeroSection;

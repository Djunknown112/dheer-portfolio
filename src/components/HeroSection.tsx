import { motion, useScroll, useTransform } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import { supabase } from "@/integrations/supabase/client";
import MagneticButton from "@/components/MagneticButton";
import heroBgAsset from "@/assets/hero-tech-bg.webp.asset.json";

// Hero background is auto-generated, tech-themed, and shipped with the app.
// It is *not* admin-editable — the admin panel intentionally has no control for it.
const HERO_BG_URL = heroBgAsset.url;

const HeroSection = () => {
  const [profileImg, setProfileImg] = useState<string | null>(null);
  const [subtitle, setSubtitle] = useState("Young Innovator & Tech Builder");

  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const bgY = useTransform(scrollYProgress, [0, 1], ["0%", "30%"]);
  const contentY = useTransform(scrollYProgress, [0, 1], ["0%", "20%"]);
  const contentOpacity = useTransform(scrollYProgress, [0, 0.8], [1, 0]);

  useEffect(() => {
    const fetchContent = async () => {
      const { data } = await supabase
        .from("site_content")
        .select("key,value")
        .in("key", ["profile_photo_url", "hero_subtitle"]);
      if (data) {
        const map: Record<string, string> = {};
        data.forEach((d) => { map[d.key] = d.value; });
        if (map["profile_photo_url"]) setProfileImg(map["profile_photo_url"]);
        if (map["hero_subtitle"]) setSubtitle(map["hero_subtitle"]);
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
      {/* Parallax background — auto-generated tech artwork, themed */}
      <motion.div style={{ y: bgY }} className="absolute inset-0 will-change-transform">
        <img
          src={HERO_BG_URL}
          alt=""
          width={1920}
          height={1080}
          loading="eager"
          fetchPriority="high"
          decoding="async"
          className="w-full h-[120%] object-cover opacity-50"
        />
        {/* Theme tint overlay — picks up the primary color from the active theme */}
        <div
          className="absolute inset-0 mix-blend-overlay opacity-40"
          style={{ background: "radial-gradient(circle at 30% 30%, hsl(var(--primary) / 0.35), transparent 60%)" }}
        />
        <div className="absolute inset-0 bg-gradient-to-b from-background/60 via-background/80 to-background" />
      </motion.div>

      <motion.div
        style={{ y: contentY, opacity: contentOpacity }}
        className="relative z-10 max-w-5xl mx-auto px-4 sm:px-6 text-center will-change-transform"
      >
        {/* Profile photo */}
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

        {/* Animated name — word stagger reveal */}
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

      {/* Scroll indicator */}
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

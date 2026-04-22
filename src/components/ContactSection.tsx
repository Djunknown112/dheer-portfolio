import { motion, useInView, AnimatePresence } from "framer-motion";
import { useRef, useState } from "react";
import { MapPin, Mail, Send, Loader2, MessageCircle, X } from "lucide-react";
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

const OWNER_EMAIL = "dheerjoshi2606@gmail.com";
const OWNER_WHATSAPP = "917600338468"; // country code 91 + number

const ContactSection = () => {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", message: "" });
  const [sending, setSending] = useState(false);
  const [showChoice, setShowChoice] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const name = formData.name.trim();
    const email = formData.email.trim();
    const phone = formData.phone.trim();
    const message = formData.message.trim();

    if (!name || !email || !phone || !message) {
      toast.error("Please fill in all fields, including your contact number.");
      return;
    }
    const phoneDigits = phone.replace(/[\s\-()]/g, "");
    if (!/^\+?\d{7,15}$/.test(phoneDigits)) {
      toast.error("Please enter a valid contact number (7–15 digits).");
      return;
    }

    setSending(true);
    try {
      const { error } = await supabase.from("contact_messages").insert({
        name,
        email,
        phone,
        message,
      } as any);
      if (error) throw error;
      setShowChoice(true);
    } catch (err: any) {
      console.error(err);
      toast.error("Failed to save message. Please try again.");
    } finally {
      setSending(false);
    }
  };

  const buildBodyText = () =>
    `Hi Dheer,\n\nMy name is ${formData.name}.\nEmail: ${formData.email}\nPhone: ${formData.phone}\n\n${formData.message}`;

  const sendViaEmail = () => {
    const subject = encodeURIComponent(`Portfolio contact from ${formData.name}`);
    const body = encodeURIComponent(buildBodyText());
    window.open(`mailto:${OWNER_EMAIL}?subject=${subject}&body=${body}`, "_blank");
    finalize();
  };

  const sendViaWhatsApp = () => {
    const text = encodeURIComponent(buildBodyText());
    window.open(`https://wa.me/${OWNER_WHATSAPP}?text=${text}`, "_blank");
    finalize();
  };

  const finalize = () => {
    toast.success("Message ready! Just press Send in the app that opened.");
    setShowChoice(false);
    setFormData({ name: "", email: "", phone: "", message: "" });
  };

  return (
    <section id="contact" className="section-padding" ref={ref}>
      <div className="max-w-5xl mx-auto">
        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <h2 className="font-display text-2xl sm:text-4xl font-bold text-foreground mb-2 text-center">
            Get in <span className="text-primary">Touch</span>
          </h2>
          <div className="w-16 h-1 bg-primary mx-auto mb-10 rounded-full" />

          <div className="grid md:grid-cols-2 gap-10">
            <div className="space-y-6">
              <div className="flex items-start gap-4">
                <MapPin className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">Location</h3>
                  <p className="text-sm text-muted-foreground font-body">Vadodara, India</p>
                </div>
              </div>
              <div className="flex items-start gap-4">
                <Mail className="text-primary shrink-0 mt-1" size={20} />
                <div>
                  <h3 className="font-display text-sm font-semibold text-foreground">Email</h3>
                  <p className="text-sm text-muted-foreground font-body">dheerjoshi2606@gmail.com</p>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <input
                type="text"
                placeholder="Your Name"
                value={formData.name}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                required
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-body"
              />
              <input
                type="email"
                placeholder="Your Email"
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                required
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-body"
              />
              <textarea
                placeholder="Your Message"
                value={formData.message}
                onChange={(e) => setFormData({ ...formData, message: e.target.value })}
                required
                rows={4}
                className="w-full bg-card border border-border rounded-lg px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:outline-none focus:border-primary font-body resize-none"
              />
              <button
                type="submit"
                disabled={sending}
                className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-primary-foreground font-display text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity box-glow disabled:opacity-50"
              >
                {sending ? <Loader2 size={16} className="animate-spin" /> : <Send size={16} />}
                {sending ? "Sending..." : "Send Message"}
              </button>
            </form>
          </div>
        </motion.div>
      </div>

      <AnimatePresence>
        {showChoice && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4"
            onClick={() => setShowChoice(false)}
          >
            <motion.div
              initial={{ scale: 0.9, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              exit={{ scale: 0.9, opacity: 0 }}
              onClick={(e) => e.stopPropagation()}
              className="relative bg-card border border-border rounded-2xl p-6 max-w-md w-full shadow-2xl"
            >
              <button
                onClick={() => setShowChoice(false)}
                className="absolute top-3 right-3 text-muted-foreground hover:text-foreground"
                aria-label="Close"
              >
                <X size={18} />
              </button>
              <h3 className="font-display text-lg font-bold text-foreground mb-1">
                How would you like to send it?
              </h3>
              <p className="text-sm text-muted-foreground font-body mb-5">
                Your message is saved. Pick an app to deliver it — it will open prefilled, just press Send.
              </p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <button
                  onClick={sendViaEmail}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-primary text-primary-foreground font-display text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <Mail size={16} />
                  Send via Email
                </button>
                <button
                  onClick={sendViaWhatsApp}
                  className="inline-flex items-center justify-center gap-2 px-4 py-3 bg-[#25D366] text-white font-display text-sm font-semibold rounded-lg hover:opacity-90 transition-opacity"
                >
                  <MessageCircle size={16} />
                  Send via WhatsApp
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};

export default ContactSection;

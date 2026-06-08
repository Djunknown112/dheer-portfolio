import { useEffect, useRef, useState, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  minHeight?: string;
  rootMargin?: string;
  id?: string;
}

/**
 * Defers mounting of its children until close to entering the viewport,
 * OR until a `lovable:preload-all` window event is fired (used by the navbar
 * so anchor links scroll to the *real* section position on mobile).
 */
const LazySection = ({ children, minHeight = "400px", rootMargin = "300px", id }: LazySectionProps) => {
  const ref = useRef<HTMLDivElement>(null);
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    if (!ref.current || visible) return;
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setVisible(true);
          observer.disconnect();
        }
      },
      { rootMargin }
    );
    observer.observe(ref.current);
    return () => observer.disconnect();
  }, [visible, rootMargin]);

  // Listen for global preload event (fired when a nav link is clicked).
  useEffect(() => {
    const handler = () => setVisible(true);
    window.addEventListener("lovable:preload-all", handler);
    return () => window.removeEventListener("lovable:preload-all", handler);
  }, []);

  return (
    <div id={id} ref={ref} style={!visible ? { minHeight } : undefined}>
      {visible ? children : null}
    </div>
  );
};

export default LazySection;

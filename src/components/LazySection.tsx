import { useEffect, useRef, useState, ReactNode } from "react";

interface LazySectionProps {
  children: ReactNode;
  /** Approx min height to reserve so layout doesn't jump */
  minHeight?: string;
  /** Distance before viewport to begin loading */
  rootMargin?: string;
}

/**
 * Defers mounting of its children until it is close to entering the viewport.
 * Drastically reduces initial JS execution and Supabase requests on first paint.
 */
const LazySection = ({ children, minHeight = "400px", rootMargin = "300px" }: LazySectionProps) => {
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

  return (
    <div ref={ref} style={!visible ? { minHeight } : undefined}>
      {visible ? children : null}
    </div>
  );
};

export default LazySection;

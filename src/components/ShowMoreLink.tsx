import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";

interface Props {
  to: string;
  count?: number;
  label?: string;
}

const ShowMoreLink = ({ to, count, label = "Show more" }: Props) => (
  <div className="flex justify-center mt-8">
    <Link
      to={to}
      className="inline-flex items-center gap-1.5 px-6 py-2.5 text-xs font-display font-semibold text-primary border border-primary/40 rounded-lg hover:bg-primary/10 transition-colors"
    >
      {label}{count !== undefined ? ` (${count} more)` : ""} <ArrowRight size={14} />
    </Link>
  </div>
);

export default ShowMoreLink;

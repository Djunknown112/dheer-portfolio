import { Helmet } from "react-helmet-async";

interface PageHeadProps {
  title: string;
  description: string;
  path: string;
  noindex?: boolean;
}

const SITE = "https://dheer-portfolio.lovable.app";

/** Per-route <title>, description, canonical, and og:* tags. */
const PageHead = ({ title, description, path, noindex }: PageHeadProps) => {
  const url = `${SITE}${path}`;
  return (
    <Helmet>
      <title>{title}</title>
      <meta name="description" content={description} />
      <link rel="canonical" href={url} />
      <meta property="og:title" content={title} />
      <meta property="og:description" content={description} />
      <meta property="og:url" content={url} />
      <meta name="twitter:title" content={title} />
      <meta name="twitter:description" content={description} />
      {noindex && <meta name="robots" content="noindex, nofollow" />}
    </Helmet>
  );
};

export default PageHead;

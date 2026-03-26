import { Helmet } from "react-helmet-async";

const SEO = ({
  title = "Cosmopolitan Climbs Life Plan Inc.",
  description = "Secure your family's future with affordable memorial life plans from Cosmopolitan Climbs Life Plan Inc.",
  keywords = "life plan Philippines, memorial plan, pre-need plan, funeral plan, cclpi life plan",
  url = "https://cclpi.com.ph",
  image = "https://cclpi.com.ph/cover.jpg",
}) => {

  const siteName = "Cosmopolitan Climbs Life Plan Inc.";

  return (
    <Helmet>
      {/* Basic SEO */}
      <title>{title} | {siteName}</title>

      <meta name="description" content={description} />
      <meta name="keywords" content={keywords} />
      <meta name="author" content={siteName} />

      <meta name="robots" content="index, follow" />

      <link rel="canonical" href={url} />

      {/* Mobile SEO */}
      <meta name="viewport" content="width=device-width, initial-scale=1" />

      {/* Open Graph (Facebook) */}
      <meta property="og:site_name" content={siteName} />
      <meta property="og:title" content={`${title} | ${siteName}`} />
      <meta property="og:description" content={description} />
      <meta property="og:type" content="website" />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={image} />

      {/* Twitter SEO */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={`${title} | ${siteName}`} />
      <meta name="twitter:description" content={description} />
      <meta name="twitter:image" content={image} />

    </Helmet>
  );
};

export default SEO;
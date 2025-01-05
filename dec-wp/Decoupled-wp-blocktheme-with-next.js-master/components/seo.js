// components/SEO.js
import React from "react";
import Head from "next/head";

const SEO = ({ seoData, title }) => {
  const { generalSettings = {}, user = {}, customizerOptions = {} } = seoData;
  const authorName = user ? user.name : "";
  const authorAvatar = user && user.avatar ? user.avatar.url : "";
  const customSiteIcon = customizerOptions.siteIcon || "";

  return (
    <Head>
      {/* Meta tags for SEO purposes */}
      <meta name="description" content={generalSettings.description} />
      <meta name="keywords" content="HTML, CSS, JavaScript" />
      <meta name="author" content={authorName} />
      <meta name="viewport" content="width=device-width, initial-scale=1.0" />
      
      {/* Open Graph meta tags for social media sharing */}
      <meta property="og:title" content={generalSettings.title} />
      <meta property="og:description" content={generalSettings.description} />
      <meta property="og:type" content="website" />
      <meta property="og:image" content={authorAvatar} />
      <meta property="og:url" content={generalSettings.url} />
      <meta property="og:site_name" content={generalSettings.title} />
      
      {/* Twitter card meta tags for Twitter sharing */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:site" content="@yourTwitterHandle" />
      <meta name="twitter:title" content={generalSettings.title} />
      <meta name="twitter:description" content={generalSettings.description} />
      <meta name="twitter:image" content={authorAvatar} />
      
      {/* Favicon */}
      <link rel="icon" href={customSiteIcon} />
      
      {/* Title tag for the document */}
      <title>{generalSettings.title + " || " + title}</title>
    </Head>
  );
};

export default SEO;

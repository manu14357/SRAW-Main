import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { Helmet } from "react-helmet"; // For SEO

const root = ReactDOM.createRoot(document.getElementById("root"));

// Function to render Helmet for SEO
const renderHelmet = () => (
  <Helmet>
    <title>Sraws - Scam Reporting & Alert Platform</title>
    <meta 
      name="description" 
      content="Post and comment platform for Sraws" 
    />
    <meta name="robots" content="index, follow" />
    <link rel="canonical" href="https://sraws.com/" />
    <link rel="icon" href="/favicon.ico" sizes="any" />
    <meta property="og:title" content="Sraws" />
    <meta property="og:description" content="Post and comment platform for Sraws" />
    <meta property="og:url" content="https://sraws.com/" />
    <meta property="og:type" content="website" />
    <meta property="og:image" content="https://sraws.com/logo.png" />
    <meta property="og:site_name" content="Sraws" />
    
    {/* Structured Data */}
    <script type="application/ld+json">
      {`
        {
          "@context": "https://schema.org",
          "@type": "WebSite",
          "name": "Sraws",
          "url": "https://sraws.com/",
          "description": "Post and comment platform for Sraws",
          "potentialAction": {
            "@type": "SearchAction",
            "target": "https://sraws.com/search?q={search_term_string}",
            "query-input": "required name=search_term_string"
          }
        }
      `}
    </script>
  </Helmet>
);

root.render(
  <>
    {renderHelmet()}
    <App />
  </>
);

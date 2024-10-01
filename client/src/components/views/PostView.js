import { Container, Stack, useMediaQuery } from "@mui/material";
import React, { useEffect, useState } from "react";
import GoBack from "../GoBack";
import PostGridLayout from "../PostGridLayout";
import Loading from "../Loading";
import Navbar from "../Navbar";
import PostCard from "../PostCard";
import Sidebar from "../Sidebar";
import { useParams } from "react-router-dom";
import { getPost } from "../../api/posts";
import Comments from "../Comments";
import ErrorAlert from "../ErrorAlert";
import { isLoggedIn } from "../../helpers/authHelper";
import AdContainer from "./AdContainer"; // Import AdContainer component for ads
import { Helmet } from "react-helmet"; // Import react-helmet for SEO

const PostView = () => {
  const params = useParams();
  const [post, setPost] = useState(null);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(true);
  const user = isLoggedIn();
  const isDesktop = useMediaQuery((theme) => theme.breakpoints.up("md"));

  const fetchPost = async () => {
    setLoading(true);
    const data = await getPost(params.id, user && user.token);
    if (data.error) {
      setError(data.error);
    } else {
      setPost(data);
    }
    setLoading(false);
  };

  useEffect(() => {
    fetchPost();
  }, [params.id]);

  return (
    <Container maxWidth="xl">
      <Helmet>
        {/* Dynamic Meta Tags for SEO */}
        <title>{post ? post.title : "Loading Post..."} | Sraws</title>
        <meta
          name="description"
          content={post ? post.metaDescription || post.content.slice(0, 160) : "View detailed scam reports and user comments."}
        />
        <meta
          name="keywords"
          content={post ? post.metaKeywords || "scam reports, user comments, fraud, alert platform" : "scam, fraud, reporting"}
        />
        <meta property="og:title" content={post ? post.title : "Post | Sraws"} />
        <meta property="og:description" content={post ? post.metaDescription || post.content.slice(0, 160) : "View scam reports"} />
        <meta property="og:image" content={post && post.metaImage ? post.metaImage : "/default-image.jpg"} />
        <meta property="og:url" content={`https://www.sraws.com/posts/${params.id}`} />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:title" content={post ? post.title : "Post | Sraws"} />
        <meta name="twitter:description" content={post ? post.metaDescription || post.content.slice(0, 160) : "View scam reports"} />
        <meta name="twitter:image" content={post && post.metaImage ? post.metaImage : "/default-image.jpg"} />
        <meta name="robots" content="index, follow" />
        <link rel="canonical" href={`https://www.sraws.com/posts/${params.id}`} />

        {/* Structured Data (JSON-LD) for better SEO */}
        {post && (
          <script type="application/ld+json">
            {`
              {
                "@context": "https://schema.org",
                "@type": "Article",
                "headline": "${post.title}",
                "description": "${post.metaDescription || post.content.slice(0, 160)}",
                "author": {
                  "@type": "Person",
                  "name": "${post.poster.username}"
                },
                "datePublished": "${post.createdAt}",
                "publisher": {
                  "@type": "Organization",
                  "name": "Sraws"
                },
                "image": "${post.metaImage || '/default-image.jpg'}",
                "mainEntityOfPage": {
                  "@type": "WebPage",
                  "@id": "https://www.sraws.com/posts/${params.id}"
                }
              }
            `}
          </script>
        )}
      </Helmet>

      <Navbar />
      <GoBack />
      <PostGridLayout
        left={isDesktop ? <AdContainer /> : null} // Display ads only on desktop
        center={
          loading ? (
            <Loading />
          ) : post ? (
            <Stack spacing={2}>
              <PostCard post={post} key={post._id} />
              <Comments />
            </Stack>
          ) : (
            error && <ErrorAlert error={error} />
          )
        }
        right={<Sidebar />} // Sidebar
      />
    </Container>
  );
};

export default PostView;

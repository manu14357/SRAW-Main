import React, { useEffect, useState, useRef } from "react";
import { Button, Card, Box, Stack, Typography } from "@mui/material";
import { useSearchParams } from "react-router-dom";
import { getPosts, getUserLikedPosts } from "../api/posts";
import { isLoggedIn } from "../helpers/authHelper";
import CreatePost from "./CreatePost";
import Loading from "./Loading";
import PostCard from "./PostCard";
import SortBySelect from "./SortBySelect";
import HorizontalStack from "./util/HorizontalStack";
import AdContainer from "./views/AdContainer";

const adsData = [

];

const PostBrowser = (props) => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [page, setPage] = useState(0);
  const [end, setEnd] = useState(false);
  const [sortBy, setSortBy] = useState("-createdAt");
  const [count, setCount] = useState(0);
  const user = isLoggedIn();

  const [search] = useSearchParams();
  const [effect, setEffect] = useState(false);

  const searchExists =
    search && search.get("search") && search.get("search").length > 0;

  const fetchPosts = async () => {
    setLoading(true);
    const newPage = page + 1;
    setPage(newPage);

    let query = {
      page: newPage,
      sortBy,
    };

    if (props.contentType === "posts") {
      if (props.profileUser) query.author = props.profileUser.username;
      if (searchExists) query.search = search.get("search");
    }

    let data;
    if (props.contentType === "posts") {
      data = await getPosts(user && user.token, query);
    } else if (props.contentType === "liked") {
      data = await getUserLikedPosts(
        props.profileUser._id,
        user && user.token,
        query
      );
    }

    if (data.data.length < 1) {
      setEnd(true);
    }

    setLoading(false);
    if (!data.error) {
      setPosts([...posts, ...data.data]);
      setCount(data.count);
    }
  };

  useEffect(() => {
    fetchPosts();
  }, [sortBy, effect]);

  useEffect(() => {
    setPosts([]);
    setPage(0);
    setEnd(false);
    setEffect(!effect);
  }, [search]);

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + document.documentElement.scrollTop ===
          document.documentElement.offsetHeight &&
        !loading &&
        !end
      ) {
        fetchPosts();
      }
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, [posts, loading, end]);

  const handleSortBy = (e) => {
    const newSortName = e.target.value;
    let newSortBy;

    Object.keys(sorts).forEach((sortName) => {
      if (sorts[sortName] === newSortName) newSortBy = sortName;
    });

    setPosts([]);
    setPage(0);
    setEnd(false);
    setSortBy(newSortBy);
  };

  const removePost = (removedPost) => {
    setPosts(posts.filter((post) => post._id !== removedPost._id));
  };

  const contentTypeSorts = {
    posts: {
      "-createdAt": "Latest",
      "-likeCount": "Likes",
      "-commentCount": "Comments",
      createdAt: "Earliest",
    },
    liked: {
      "-createdAt": "Latest",
      createdAt: "Earliest",
    },
  };

  const sorts = contentTypeSorts[props.contentType];

  const getRandomAd = () => {
    const randomIndex = Math.floor(Math.random() * adsData.length);
    return adsData[randomIndex];
  };

  return (
    <>
      <Stack spacing={1}>
        <Card>
          <HorizontalStack justifyContent="space-between">
            {props.createPost && <CreatePost />}
            <SortBySelect onSortBy={handleSortBy} sortBy={sortBy} sorts={sorts} />
          </HorizontalStack>
        </Card>

        {searchExists && (
          <Box>
            <Typography variant="h5" gutterBottom>
              Showing results for "{search.get("search")}"
            </Typography>
            <Typography color="text.secondary" variant="span">
              {count} results found
            </Typography>
          </Box>
        )}

        {posts.map((post, i) => (
          <React.Fragment key={post._id}>
            <PostCard preview="primary" post={post} removePost={removePost} />
            {/* Display an ad every 15 posts */}
            {i > 0 && i % 15 === 0 && <AdContainer ad={getRandomAd()} />}
          </React.Fragment>
        ))}

        {loading && <Loading />}
        {end && (
          <Stack py={5} alignItems="center">
            <Typography variant="h5" color="text.secondary" gutterBottom>
              {posts.length > 0 ? <>All posts have been viewed</> : <>No posts available</>}
            </Typography>
          </Stack>
        )}
      </Stack>
    </>
  );
};

export default PostBrowser;

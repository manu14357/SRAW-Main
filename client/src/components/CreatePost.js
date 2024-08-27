import { Button, Tooltip } from "@mui/material";
import React from "react";
import { useNavigate } from "react-router-dom";
import { AiOutlinePlus } from "react-icons/ai";

const CreatePost = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/posts/create");
  };

  return (
    <Tooltip title="Create a new post" arrow>
      <Button
        variant="outlined"
        size="medium"
        onClick={handleClick}
        sx={{
          gap: "0.2rem",
          whiteSpace: "nowrap",
        }}
        aria-label="Create a new post"
      >
        <AiOutlinePlus style={{ flexShrink: 0 }} />
        <span>Report!</span>
      </Button>
    </Tooltip>
  );
};

export default CreatePost;

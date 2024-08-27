import { Grid, Stack } from "@mui/material";
import React from "react";

const CreatePostGridLayout = (props) => {
  const { left } = props;

  return (
    <Grid container spacing={1} justifyContent="center">
      <Grid item xs={12} md={8}>
        <Stack 
          direction="row" 
          justifyContent="center" 
          alignItems="center" 
          spacing={2}
        >
          {left}
        </Stack>
      </Grid>
    </Grid>
  );
};

export default CreatePostGridLayout;

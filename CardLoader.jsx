import { Skeleton } from "@mui/material";
import React from "react";

const CardLoader = () => (
  <Skeleton animation="wave" variant="rectangular" width={280} height={400} />
);

export default CardLoader;

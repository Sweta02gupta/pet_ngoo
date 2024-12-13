import { Skeleton } from "@mui/material";
import React from "react";

const SkeletonLoader = () => (
  <Skeleton animation="wave" variant="rectangular" width="100%" height={40} />
);

export default SkeletonLoader;

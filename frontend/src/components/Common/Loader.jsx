// src/components/Loader.jsx
import React from "react";
import { ClipLoader } from "react-spinners";

const override = {
  display: "block",
  margin: "0 auto",
  borderColor: "gray-800",
};

const Loader = ({color}) => {
  return (
    <ClipLoader
      color={color}
      loading={true}
      cssOverride={override}
      size={150}
      aria-label="Loading Spinner"
      data-testid="loader"
    />
  );
};

export default Loader;

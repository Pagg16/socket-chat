import React from "react";
import "./buttonLoader.css";

function ButtonLoader({ addClass }) {
  return <span className={`buttonLoader ${!!addClass ? addClass : ""}`}></span>;
}

export default ButtonLoader;

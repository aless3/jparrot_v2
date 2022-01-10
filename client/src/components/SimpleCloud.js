import React from "react";
import "../App.css";
import { TagCloud } from "react-tagcloud";

export function SimpleCloud({ values, setter }) {
  return (
    <TagCloud
      style={{ width: 1000, textAlign: "center" /*color: "#5BD199"*/ }}
      //disableRandomColor={true}
      minSize={10}
      maxSize={60}
      tags={values}
      shuffle={true}
      onClick={(tag) => setter(tag.value)}
      /*colorOptions={{
        luminosity: "light",
        hue: "green",
      }}*/
    />
  );
}

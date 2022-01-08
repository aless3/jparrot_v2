import React from "react";
import "../App.css";
import { TagCloud } from "react-tagcloud";

export function SimpleCloud({ values, setter }) {
  return (
    <TagCloud
      minSize={10}
      maxSize={60}
      tags={values}
      shuffle={true}
      onClick={(tag) => setter(tag.value)}
    />
  );
}

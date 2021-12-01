import React, { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import "./App.css";
import axios from "axios";

import { TagCloud } from 'react-tagcloud';

function Terms() {


  const [values, setValues] = useState({});
  const [counts, setCounts] = useState({});

/*
  const [showCloud, setShowCloud] = useState(true);
  const [showError, setShowError] = useState(false);*/

const data = [
  { value: 'JavaScript', count: 38 },
  { value: 'React', count: 30 },
  { value: 'Nodejs', count: 28 },
  { value: 'Express.js', count: 25 },
  { value: 'HTML5', count: 33 },
  { value: 'MongoDB', count: 18 },
  { value: 'CSS3', count: 20 },
]

  const searchTweets = async () => {
    try {
      const result = await axios.get("http://localhost:8000/terms", {
        params: {
          values,
          counts
        },
      });
      console.log(result);
      if (result.data.data !== undefined) {
        setValues(() => {
          return result.values;
        });
        setCounts(() => {
          return result.counts;
        });

        //setShowError(false);
        //setShowCloud(true);
        ///console.log(result);
      } else {
        //setShowCloud(false);
        //setShowError(true);
      }
    } catch (error) {
      console.error(error);
    }
  };



  return (
    <div className='container'>
      <p style={{ margin: "1rem" }}>ecco la term cloud</p>
      <TagCloud
        minSize={12}
        maxSize={35}
        tags={data}
        onClick={tag => alert(`'${tag.value}' was selected!`)}
      />
    </div>
  );
}

const data = [
  { value: 'JavaScript', count: 38 },
  { value: 'React', count: 30 },
  { value: 'Nodejs', count: 28 },
  { value: 'Express.js', count: 25 },
  { value: 'HTML5', count: 33 },
  { value: 'MongoDB', count: 18 },
  { value: 'CSS3', count: 20 },
]


const SimpleCloud = () => (
  <TagCloud
    minSize={12}
    maxSize={35}
    tags={data}
    onClick={tag => alert(`'${tag.value}' was selected!`)}
  />
)

export default Terms;

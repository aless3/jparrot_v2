import React, { useState } from "react";
import "./App.css";
import axios from "axios";

import { TagCloud } from "react-tagcloud";

function Terms_frontEnd() {
  const [data, setData] = useState([]);

  const searchTrending = async () => {
    const posOptions = {
      enableHighAccuracy: true,
      timeout: 5000,
      maximumAge: 0
    };

    async function posSuccess(pos) {
      let latitude = pos.coords.latitude;
      let longitude = pos.coords.longitude;

      try {
        const result = await axios.get("http://localhost:8000/terms", {
          params: {
            latitude,
            longitude
          },
        });

        setData(() => {
          return result.data;
        });

        console.log(data);
      } catch (error) {
        console.error(error);
      }
    }

    function posError(err) {
      console.warn(`ERROR(${err.code}): ${err.message}`);
    }

    if('geolocation' in navigator){
      navigator.geolocation.getCurrentPosition(posSuccess, posError, posOptions);
    }

  };

  return (
    <div className='container'>

        <div className='cloud'>
          <SimpleCloud values={data} />
          <button onClick={searchTrending}>Reload</button>
        </div>

    </div>
  );
}

function SimpleCloud({ values }) {
  return (
    <TagCloud
      minSize={10}
      maxSize={60}
      tags={values}
      shuffle={true}
      onClick={(tag) => alert(`'${tag.value}' was selected!`)}
    />
  );
}

export default Terms_frontEnd;

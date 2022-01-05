import React, { useState } from "react";
import "./App.css";
import axios from "axios";

import { SimpleCloud } from "./SimpleCloud";

const Terms_frontEnd = () => {
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

        if(result.data !== undefined){
          setData((result.data));
        }
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

        <SimpleCloud values={data} className='cloud' />
        <button onClick={searchTrending}>Load/Reload</button>

      </div>
  );
}

export default Terms_frontEnd;

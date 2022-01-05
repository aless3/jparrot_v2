import React, {useEffect, useState} from "react";
import "../App.css";
import axios from "axios";

import { SimpleCloud } from "./SimpleCloud";

const TermsFrontEnd = () => {
  const [data, setData] = useState([]);
  const [firstSearch, setFirstSearch] = useState(true);

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

    setFirstSearch(false);

  };

  useEffect(async () => {
    if(firstSearch){
      await searchTrending();
    }
  }, [data, firstSearch]);

  return (
      <div className='container'>

        <SimpleCloud values={data} className='cloud' />
        <button onClick={searchTrending}>Load/Reload</button>

      </div>
  );
}

export default TermsFrontEnd;

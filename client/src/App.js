import React, { useState, useEffect } from "react";
import ReactDOM, { render } from "react-dom";
import "./App.css";
import Tweet from "./Tweet";
import axios from "axios";



import { TagCloud } from 'react-tagcloud';



import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  MapConsumer,
  useMapEvent,
  useMapEvents,
  useMap,
} from "react-leaflet";

import "leaflet/dist/leaflet.css";
import L from "leaflet";
import icon from "leaflet/dist/images/marker-icon.png";
import iconShadow from "leaflet/dist/images/marker-shadow.png";
let DefaultIcon = L.icon({
  iconUrl: icon,
  shadowUrl: iconShadow,
  iconSize: [25, 41],
  iconAnchor: [12, 41],
});
L.Marker.prototype.options.icon = DefaultIcon;



function App() {
  var marker = {};
  const [range, setRange] = useState(1);
  var [position, setPosition] = useState({ lat: 0, lng: 0 });

  const [showRange, setShowRange] = useState(false);
  const [showTweets, setShowTweets] = useState(false);
  const [showCloud, setShowCloud] = useState(true);
  const [showError, setShowError] = useState(false);

  const [tweets, setTweets] = useState([]);
  const [users, setUsers] = useState([]);
  const [keyword, setKeyword] = useState("");

  // var data = [];

  var data = [{ value: 'JavaScript', count: 38 },
    { value: 'React', count: 30 },
    { value: 'Nodejs', count: 28 },
    { value: 'Express.js', count: 25 },
    { value: 'HTML5', count: 33 },
    { value: 'MongoDB', count: 18 },
    { value: 'CSS3', count: 20 },];

  const rangeHandle = (event) => {
    setRange(() => {
      return event.target.value;
    });
  };

  const searchTweets = async () => {
    try {
      const result = await axios.get("http://localhost:8000/geokeyword", {
        params: {
          range,
          position,
          keyword,
        },
      });
      console.log(result);
      if (result.data.data !== undefined) {
        setTweets(() => {
          return result.data.data;
        });
        setUsers(() => {
          return result.data.includes.users;
        });
        setShowError(false);
        setShowTweets(true);
        //console.log(result);
      } else {
        setShowTweets(false);
        setShowError(true);
      }
    } catch (error) {
      console.error(error);
    }
  };

  const updatePosition = (lat, lng) => {
    setPosition(() => {
      return { lat: lat, lng: lng };
    });
  };

  const searchTrending = async () => {
    try {
      const result = await axios.get("http://localhost:8000/terms", {
        params: {
          position
        }
      });


      // result.data.forEach(function(item, index, array) {
      //   //console.log(item, index);
      //   if(index < 3){
      //
      //     let t = {value: item.name, count: item.count};
      //     data.push(item);
      //   }
      // })
       data.push(result.data);


      // data = [{ value: 'JavaScript', count: 38 },
      //   { value: 'React', count: 30 },
      //   { value: 'Nodejs', count: 28 },
      //   { value: 'Express.js', count: 25 },
      //   { value: 'HTML5', count: 33 },
      //   { value: 'MongoDB', count: 18 },
      //   { value: 'CSS3', count: 20 },];

      console.log(data);


    } catch (error) {
      console.error(error);
    }

  }



  return (
    <div className='container'>
      <p style={{ margin: "1rem" }}>scegli una posizione sulla mappa</p>
      {false  && (
        <div className='input'>
          <p>Scegli un area</p>
          <input
            type='range'
            min='1'
            max='40000'
            value={range}
            onChange={rangeHandle}
          />
          <p>metri: {range}</p>
          <div className='label'>aggiungi una parola chiave e cerca</div>
          <input
            type='text'
            value={keyword}
            onChange={(e) => {
              setKeyword(e.target.value);
            }}
          />
          <button onClick={searchTweets}>Cerca</button>
        </div>
      )}

{false   &&
      <MapContainer
        style={{ height: "30rem" }}
        center={[44.494887, 11.3426163]}
        zoom={13}
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
        />

        <Mycomponent
          position={position}
          updatePosition={updatePosition}
          range={range}
          setShowRange={setShowRange}
        />
      </MapContainer>
}

      {false  && (
        <div className='tweet-list'>
          {tweets.map((tweet) => {
            const user = users.filter((user) => user.id == tweet.author_id);
            return <Tweet key={tweet.id} user={user[0]} tweet={tweet} />;
          })}
        </div>
      )}
      {true && (<div className='cloud'>

            <SimpleCloud
            values={data}/>

            {/*<TagCloud*/}
            {/*    minSize={12}*/}
            {/*    maxSize={35}*/}
            {/*    tags={data}*/}
            {/*    shuffle={true}*/}
            {/*    onClick={tag => alert(`'${tag.value}' was selected!`)}*/}
            {/*/>*/}
            <button onClick={searchTrending}>CercaTTT</button>
          </div>
      )}


      {showError && <div className='errormsg'>No Tweets Found :C</div>}
    </div>
  );
}

function Mycomponent({ position, updatePosition, range, setShowRange }) {
  const [clicked, setClicked] = useState(false);
  //const map = useMap();
  const map = useMapEvents({
    click(e) {
      updatePosition(e.latlng.lat, e.latlng.lng);
      setClicked(true);
      setShowRange(true);
    },
  });
  return (
    <>
      {clicked && (
        <>
          <Circle
            center={position}
            pathOptions={{ color: "blue", stroke: false }}
            radius={range}
          />
          <Marker position={position}></Marker>
        </>
      )}
    </>
  );
}

function SimpleCloud ({values}) {
  return(
      <TagCloud
          minSize={12}
          maxSize={35}
          tags={values}
          shuffle={true}
          onClick={tag => alert(`'${tag.value}' was selected!`)}
      />
  );
}


export default App;

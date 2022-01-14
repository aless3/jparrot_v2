import React, { useState } from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
import DatePicker from "rsuite/DatePicker";
import axios from "axios";
import TweetList from "./TweetList";
import "./MapsFrontEnd.css";
import {
  MapContainer,
  TileLayer,
  Marker,
  Circle,
  useMapEvents,
  Popup,
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

function MapsFrontEnd() {
  const [range, setRange] = useState("");
  const [position, setPosition] = useState({ lat: 0, lng: 0 });
  const [showRange, setShowRange] = useState(false);
  const [showTweets, setShowTweets] = useState(false);
  const [showError, setShowError] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [tweets, setTweets] = useState();
  const [start, setStart] = useState();
  const [end, setEnd] = useState();

  const searchTweets = async () => {
    if (range == "") {
      setRange(1);
    }
    try {
      const result = await axios.get("http://localhost:8000/map/geo-keyword", {
        params: {
          range,
          position,
          keyword,
          start,
          ...(start ? { start } : {}),
          ...(end ? { end } : {}),
        },
      });
      console.log(result);
      if (result.data.data !== undefined) {
        setTweets(result.data);
        console.log(tweets);
        setShowError(false);
        setShowTweets(true);
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
  return (
    <div className='container'>
      <br />
      <h2 style={{ textAlign: "center", color: "white" }}>Mappe</h2>
      <br />
      <Row className='mx-auto'>
        <Col>
          <Card
            id='cardinput'
            border='light'
            className='mx-auto'
            style={{ width: "50vw" }}
          >
            <Card.Header>Select a position in the man</Card.Header>
            <Card.Body>
              <Card.Title>
                {showRange && (
                  <div className='input'>
                    <Form.Label>Select an area</Form.Label>
                    <Form.Range
                      onChange={(e) => setRange(e.target.value)}
                      className='slider'
                      value={range}
                      min='1'
                      max='40000'
                    />
                    <p>Meters: {range} </p>
                    <br />
                    <Row className='mb-3 dates'>
                      <p>from</p>
                      <DatePicker
                        format='dd-MM-yyyy HH:mm:ss'
                        oneTap
                        style={{ width: 300 }}
                        onChange={(date) => {
                          if (date) {
                            setStart(
                              date.toISOString().split(".")[0].concat("Z")
                            );
                            console.log(
                              date.toISOString().split(".")[0].concat("Z")
                            );
                          }
                        }}
                        disabledDate={(date) => {
                          return new Date().getTime() < date.getTime()
                            ? true
                            : false;
                        }}
                      />
                      <p>to</p>
                      <DatePicker
                        format='dd-MM-yyyy HH:mm:ss'
                        oneTap
                        style={{ width: 300 }}
                        onChange={(date) => {
                          if (date) {
                            setEnd(
                              date.toISOString().split(".")[0].concat("Z")
                            );
                          }
                        }}
                        disabledDate={(date) => {
                          return new Date().getTime() < date.getTime()
                            ? true
                            : false;
                        }}
                      />
                    </Row>
                    <Row className='mb-3'>
                      <Form.Group
                        as={Col}
                        md='6'
                        controlId='validationFormik03'
                      >
                        <FormControl
                          value={keyword}
                          onChange={(e) => {
                            setKeyword(e.target.value);
                          }}
                          aria-label='Username'
                          aria-describedby='basic-addon1'
                          placeholder='Input a keyword  '
                        />
                      </Form.Group>

                      <Form.Group
                        as={Col}
                        md='6'
                        controlId='validationFormik03'
                      >
                        <Button
                          onClick={searchTweets}
                          variant='outline-primary'
                        >
                          Search
                        </Button>{" "}
                      </Form.Group>
                    </Row>
                  </div>
                )}
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <br />
      <Row className='mx-auto'>
        <MapContainer
          className='mapcontainer mx-auto'
          style={{ height: "50vmin", width: "110vmin", zIndex: "1" }}
          center={[44.494887, 11.3426163]}
          zoom={13}
          scrollWheelZoom={true}
        >
          <TileLayer
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
            url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
          />

          <MarkerPosition
            position={position}
            updatePosition={updatePosition}
            range={range}
            setShowRange={setShowRange}
          />
          {showTweets &&
            tweets.data.map((tweet) => {
              if (tweet.geo.coordinates) {
                console.log(tweet);
                const username = tweets.includes.users.filter(
                  (user) => user.id === tweet.author_id
                )[0].username;
                return (
                  <Marker
                    position={[
                      tweet.geo.coordinates.coordinates[1],
                      tweet.geo.coordinates.coordinates[0],
                    ]}
                  >
                    <Popup>{username}</Popup>
                  </Marker>
                );
              } else {
                return <></>;
              }
            })}
        </MapContainer>
      </Row>
      <Row>{showTweets && <TweetList tweets={tweets} stream={false} />}</Row>
      <Row>{}</Row>
      {showError && <div className='errormsg'>No Tweets Found :C</div>}
    </div>
  );
}

function MarkerPosition({ position, updatePosition, range, setShowRange }) {
  const [clicked, setClicked] = useState(false);
  useMapEvents({
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
          <Marker position={position} />
        </>
      )}
    </>
  );
}

export default MapsFrontEnd;

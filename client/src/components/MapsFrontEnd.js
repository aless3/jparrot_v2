import React, { useEffect, useState } from "react";
import Button from "react-bootstrap/Button";
import FormControl from "react-bootstrap/FormControl";
import Form from "react-bootstrap/Form";
import Col from "react-bootstrap/Col";
import Row from "react-bootstrap/Row";
import { Card } from "react-bootstrap";
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

import TextField from "@mui/material/TextField";

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
  const [range, setRange] = useState(1);
  const [position, setPosition] = useState({ lat: 44.494887, lng: 11.3426163 });
  const [showMap, setShowMap] = useState(true);
  const [showTweets, setShowTweets] = useState(false);
  const [showError, setShowError] = useState(false);
  const [keyword, setKeyword] = useState("");
  const [tweets, setTweets] = useState();
  const [start, setStart] = useState("");
  const [end, setEnd] = useState("");

  const now = new Date().toISOString().split("T")[0];

  const posOptions = {
    enableHighAccuracy: true,
    timeout: 5000,
    maximumAge: 0,
  };

  useEffect(async () => {
    if ("geolocation" in navigator) {
      navigator.geolocation.getCurrentPosition(
        (pos) => {
          setPosition(() => {
            return { lat: pos.coords.latitude, lng: pos.coords.longitude };
          });
          setShowMap(true);
        },
        () => {
          return 0;
        },
        posOptions
      );
    }
  }, []);

  const searchTweets = async () => {
    try {
      const result = await axios.get("http://localhost:8000/map/geo-keyword", {
        params: {
          range,
          position,
          keyword,
          ...(start ? { start } : {}),
          ...(end ? { end } : {}),
        },
      });
      if (result.data.data !== undefined) {
        setTweets(result.data);
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
      <h2 style={{ textAlign: "center", color: "white" }}>Maps</h2>
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
                <div className='input'>
                  <Form.Label>Select an area</Form.Label>
                  <Form.Range
                    onChange={(e) => setRange(e.target.value)}
                    className='slider'
                    value={range}
                    min='1'
                    max='40000'
                    data-testid='areaSelector'
                    id='areaSelector'
                  />
                  <p>Meters: {range} </p>
                  <br />
                  <Row className='mb-3 dates'>
                    <TextField
                      id='fromDate'
                      label='From (optional)'
                      type='date'
                      sx={{ width: 220, marginRight: "1rem" }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ max: now }}
                      onChange={(date) => {
                        setStart(
                          date.target.value
                            ? date.target.value.concat("T00:00:00Z")
                            : ""
                        );
                      }}
                    />
                    <TextField
                      id='toDate'
                      label='To (optional)'
                      type='date'
                      sx={{ width: 220 }}
                      InputLabelProps={{
                        shrink: true,
                      }}
                      inputProps={{ max: now }}
                      onChange={(date) => {
                        setEnd(
                          date.target.value
                            ? date.target.value.concat("T00:00:00Z")
                            : ""
                        );
                      }}
                    />
                  </Row>
                  <Row className='mb-3'>
                    <Form.Group as={Col} md='6' controlId='validationFormik03'>
                      <FormControl
                        data-testid='keyword'
                        value={keyword}
                        onChange={(e) => {
                          setKeyword(e.target.value);
                        }}
                        aria-label='Username'
                        aria-describedby='basic-addon1'
                        placeholder='Input a keyword (optional)'
                      />
                    </Form.Group>

                    <Form.Group as={Col} md='6' controlId='validationFormik03'>
                      <Button
                        onClick={searchTweets}
                        variant='outline-primary'
                        data-testid='searchButton'
                      >
                        Search
                      </Button>{" "}
                    </Form.Group>
                  </Row>
                </div>
              </Card.Title>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      <br />
      <Row>
        {showError && (
          <h4 className='errormsg d-flex justify-content-center text-danger mb-2'>
            No Tweets Found :C
          </h4>
        )}
      </Row>
      <Row className='mx-auto'>
        {showMap && (
          <MapContainer
            className='mapcontainer mx-auto'
            style={{ height: "50vmin", width: "110vmin", zIndex: "1" }}
            center={[position.lat, position.lng]}
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
            />
            {showTweets &&
              tweets?.data.map((tweet) => {
                if (tweet.geo.coordinates) {
                  const username = tweets["includes"].users.filter(
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
                }
              })}
          </MapContainer>
        )}
      </Row>
      <Row>{showTweets && <TweetList tweets={tweets} stream={false} />}</Row>
    </div>
  );
}

function MarkerPosition({ position, updatePosition, range }) {
  useMapEvents({
    click(e) {
      updatePosition(e.latlng.lat, e.latlng.lng);
    },
  });
  return (
    <>
      <>
        <Circle
          center={position}
          pathOptions={{ color: "blue", stroke: false }}
          radius={range}
        />
        <Marker position={position} title='positionMarker' />
      </>
    </>
  );
}

export default MapsFrontEnd;

import React, { useEffect, useState } from "react";
import Card from "react-bootstrap/Card";
import { Row, Col, Container } from "react-bootstrap";

import {
  FaRetweet,
  FaReply,
  FaHeart,
  FaQuoteRight,
  FaCalendar,
} from "react-icons/fa";
import "./Tweet.css";

import { MapContainer, TileLayer, Marker } from "react-leaflet";

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

function Tweet({ user, tweet, stream }) {
  const [isRT, setIsRT] = useState(false);
  const [showGeoButton, setShowGeoButton] = useState(false);
  const [showMap, setShowMap] = useState(false);

  useEffect(() => {
    if (tweet !== undefined) {
      console.log(tweet);
      if (tweet.text.substring(0, 2) === "RT") {
        setIsRT(true);
        tweet.text = tweet.text.slice(2);
      }
    }

    if (tweet?.geo?.coordinates) {
      setShowGeoButton(true);
    }
  }, []);

  try {
    const { name, username, profile_image_url } = user;
    const { created_at, text } = tweet;

    const { like_count, quote_count, reply_count, retweet_count } = !stream
      ? tweet.public_metrics
      : 0;
    return (
      <Container className='card-container'>
        <Card border='light'>
          <Card.Header>
            <Row>
              {isRT && <div className='rt-text'>Retweet</div>}
              <Col className='tweet-top'>
                <img className='userimg' src={profile_image_url} alt={name} />
                <div>
                  <div className='name'>{name}</div>
                  <div className='username'>@{username}</div>
                </div>
              </Col>
            </Row>
          </Card.Header>
          <Card.Body>
            <Card.Text as='div'>
              <div className='text' data-testid='testText'>
                {text}
              </div>
              <div className='tweet-details'>
                {!stream && (
                  <>
                    <div className='like'>
                      <FaHeart />
                      <div className='icon-container'>{like_count}</div>
                    </div>
                    <div className='reply'>
                      <FaReply />
                      <div className='icon-container'>{reply_count}</div>
                    </div>
                    <div className='retweet'>
                      <FaRetweet />
                      <div className='icon-container'>{retweet_count}</div>
                    </div>
                    <div className='quote'>
                      <FaQuoteRight />
                      <div className='icon-container'>{quote_count}</div>
                    </div>
                  </>
                )}
                <div className='date'>
                  <FaCalendar />
                  <div className='iconed'>{created_at.split("T")[0]}</div>
                  <div>{created_at.split("T")[1].split(".")[0]}</div>
                </div>
              </div>
              {showGeoButton && (
                <div>
                  <button
                    className='mt-2'
                    onClick={() => {
                      setShowMap(!showMap);
                    }}
                  >
                    Show Map
                  </button>
                </div>
              )}
              {showMap && (
                <div>
                  <MapContainer
                    className='mapcontainer mx-auto'
                    style={{ height: "20rem", width: "auto", zIndex: "1" }}
                    center={[
                      tweet.geo.coordinates.coordinates[1],
                      tweet.geo.coordinates.coordinates[0],
                    ]}
                    zoom={13}
                    scrollWheelZoom={true}
                  >
                    <TileLayer
                      attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
                      url='https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png'
                    />
                    <Marker
                      position={[
                        tweet.geo.coordinates.coordinates[1],
                        tweet.geo.coordinates.coordinates[0],
                      ]}
                    />
                  </MapContainer>
                </div>
              )}
            </Card.Text>
          </Card.Body>
        </Card>
      </Container>
    );
  } catch (error) {
    console.error(error);
    return null;
  }
}

export default Tweet;

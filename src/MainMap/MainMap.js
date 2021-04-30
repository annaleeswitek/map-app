import React, { useState, useEffect } from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet'
import './MainMap.css';
import useSwr from 'swr';
import axios from 'axios';
import { Input, Button, Flex, Heading, Box, Image } from "@chakra-ui/react"
import Geocode from "react-geocode";

// configure Geocode
Geocode.setLanguage("en");
Geocode.setRegion("es");
Geocode.setLocationType("ROOFTOP");
Geocode.setApiKey("AIzaSyCO9T7g7wMVfnDOPAfCPlbl34F7eGhGqoU");

const MainMap = () => {

  const [value, setValue] = useState('')
  const [ll, setLL] = useState('')
  const [bb, setBB] = useState('')
  const [center, setCenter] = useState('');
  const [art, setArt] = useState({})
  const [showMap, setShowMap] = useState(false)



  const handleChange = e => {
    setShowMap(false);
    setCenter('');
    setLL('');
    setBB('');
    setArt({})
    console.log(e.target.value)
    setValue(e.target.value)
    console.log(value)
  }

  useEffect(() => {
    if (showMap) {
      axios.get(`https://www.philart.net/api/geo.json?ll=${ll}&bb=${bb}`)
      .then(function (response) {
        console.log('response', response);
        setArt(response.data);
        setCenter([response.data.body.art[0].location.latitude, response.data.body.art[0].location.longitude ])
      })
      .catch(function (error) {
        console.log(error);
      })
    }

  }, [showMap, ll, bb])

  const handleSubmit = e => {

    // Clear any previous map
    setShowMap(false);

    // Get Latitude and Longitude from Address using Geocode
    // latitudes cannot be more than 9 characters long (inclusive of the decimal point), must be numbers, and cannot be < 39 or > 41
    // longitudes cannot be more than 10 characters long (inclusive of a minus sign and decimal point), must be numbers, and cannot be < -76 or > -74

    Geocode.fromAddress(e.target.value).then(
      (response) => {
        const { lat, lng } = response.results[0].geometry.location;

        const formattedLat = lat.toString().slice(0,9);
        const formattedLng = lng.toString().slice(0,10);
        setLL(`${formattedLat},${formattedLng}`)

        console.log('response', response.results[0].geometry)

        const formatBB = (coord, operator, sliceAtIdx) => {
          if (operator === 'add') {
            const num = coord + .01;
            const str = num.toString().slice(0, sliceAtIdx)
            return parseFloat(str, 10)
          }

          if (operator === 'sub') {
            const num = coord - .01;
            const str =num.toString().slice(0, sliceAtIdx)
            return parseFloat(str, 10)
          }
        }

        console.log('formattedLat', formattedLat)
        console.log('formattedLng', formattedLng)

        const boundingBox = `${formatBB(lat, 'sub', 9)},${formatBB(lng, 'sub', 10)},${formatBB(lat, 'add', 9)},${formatBB(lng, 'add', 10)}`;
        console.log('boundingBox', boundingBox)
        setBB(boundingBox);
        setShowMap(true)

      },
      (error) => {
        console.log('****error from geocode****')
        console.error(error);
        console.log('********')
      }
    );
  }

  return (
    <div>
      <div id="leaflet-container" data-testid="MainMap">
        <Heading m={8}>🎨 Philly Public Art Explorer 🎨</Heading>
        <Flex
          direction='row'
          justify='center'
        >
          <Input
            m={4}
            w='500px'
            placeholder="Enter a Philadelphia address"
            size="lg"
            value={value}
            onChange={handleChange}
          />
          <Button
            m={4}
            value={value}
            onClick={handleSubmit}
            colorScheme="teal"
            size="lg"
          >
            Submit
          </Button>
        </Flex>
        {
          showMap && center &&  (<MapContainer center={center} zoom={14} scrollWheelZoom={false}>
            <TileLayer
              attribution='&copy; <a href="http://osm.org/copyright">OpenStreetMap</a> contributors'
              url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            />
            { art && art?.body?.art.map((singleArt, idx) => {
              console.log('singleArtwork', singleArt)
              return(
                <Marker key={idx} position={[singleArt.location.latitude, singleArt.location.longitude]}>
                  <Popup>
                    <div>{singleArt?.title?.display}</div>
                    <Box>
                      <Image src={singleArt.pictures[0].large.url} alt={singleArt?.title?.display} />
                    </Box>
                  </Popup>
                </Marker>
              )
              }
            )}
          </MapContainer> )
        }

      </div>
    </div>
  )
};

export default MainMap;

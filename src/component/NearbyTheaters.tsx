import React, { useState, useEffect } from 'react';
import { GoogleMap, LoadScript, Marker, InfoWindow } from '@react-google-maps/api';
import { Box, Paper, Typography, CircularProgress, TextField, Button } from '@mui/material';
import { toast } from 'react-hot-toast';

interface Theater {
  id: string;
  name: string;
  vicinity: string;
  geometry: {
    location: {
      lat: number;
      lng: number;
    };
  };
  rating?: number;
}

const NearbyTheaters: React.FC = () => {
  const [theaters, setTheaters] = useState<Theater[]>([]);
  const [currentLocation, setCurrentLocation] = useState<{lat: number; lng: number} | null>(null);
  const [loading, setLoading] = useState(false);
  const [selectedTheater, setSelectedTheater] = useState<Theater | null>(null);
  const [searchAddress, setSearchAddress] = useState('');

  const GOOGLE_MAPS_API_KEY = 'AIzaSyBGIxHtmrZfUA3OU0UhYtn3uQZc7kwvIZY';
  const PROXY_URL = 'http://localhost:3001';

  const mapContainerStyle = {
    width: '100%',
    height: '400px',
    borderRadius: '8px'
  };

  const getCurrentLocation = () => {
    setLoading(true);
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setCurrentLocation({ lat: latitude, lng: longitude });
          fetchNearbyTheaters(latitude, longitude);
        },
        (error) => {
          toast.error('Error getting location: ' + error.message);
          setLoading(false);
        }
      );
    } else {
      toast.error('Geolocation is not supported by your browser');
      setLoading(false);
    }
  };

  const searchLocation = async () => {
    try {
      setLoading(true);
      const response = await fetch(
        `${PROXY_URL}/api/geocode?address=${encodeURIComponent(searchAddress)}`
      );
      const data = await response.json();

      if (data.results?.[0]?.geometry?.location) {
        const { lat, lng } = data.results[0].geometry.location;
        setCurrentLocation({ lat, lng });
        fetchNearbyTheaters(lat, lng);
      } else {
        toast.error('Location not found');
        setLoading(false);
      }
    } catch (error) {
      toast.error('Error searching location');
      setLoading(false);
    }
  };

  const fetchNearbyTheaters = async (latitude: number, longitude: number) => {
    try {
      const response = await fetch(
        `${PROXY_URL}/api/theaters/nearby?lat=${latitude}&lng=${longitude}`
      );
      const data = await response.json();

      if (data.results) {
        setTheaters(data.results);
      }
    } catch (error) {
      toast.error('Error fetching nearby theaters');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Paper elevation={3} sx={{ p: 3, m: 2 }}>
      <Typography variant="h5" gutterBottom>
        Nearby Movie Theaters
      </Typography>

      <Box sx={{ mb: 2 }}>
        <TextField
          fullWidth
          placeholder="Enter location"
          value={searchAddress}
          onChange={(e) => setSearchAddress(e.target.value)}
          sx={{ mr: 1 }}
        />
        <Box sx={{ mt: 1, display: 'flex', gap: 1 }}>
          <Button
            variant="contained"
            onClick={searchLocation}
            disabled={loading || !searchAddress}
          >
            Search Location
          </Button>
          <Button
            variant="outlined"
            onClick={getCurrentLocation}
            disabled={loading}
          >
            Use Current Location
          </Button>
        </Box>
      </Box>

      {loading ? (
        <Box display="flex" justifyContent="center" p={3}>
          <CircularProgress />
        </Box>
      ) : (
        <LoadScript googleMapsApiKey={GOOGLE_MAPS_API_KEY}>
          <GoogleMap
            mapContainerStyle={mapContainerStyle}
            zoom={13}
            center={currentLocation || { lat: 20.5937, lng: 78.9629 }}
          >
            {currentLocation && (
              <Marker
                position={currentLocation}
                icon={{
                  url: 'http://maps.google.com/mapfiles/ms/icons/blue-dot.png'
                }}
              />
            )}

            {theaters.map((theater) => (
              <Marker
                key={theater.id}
                position={theater.geometry.location}
                onClick={() => setSelectedTheater(theater)}
              />
            ))}

            {selectedTheater && (
              <InfoWindow
                position={selectedTheater.geometry.location}
                onCloseClick={() => setSelectedTheater(null)}
              >
                <Box>
                  <Typography variant="subtitle1">{selectedTheater.name}</Typography>
                  <Typography variant="body2">{selectedTheater.vicinity}</Typography>
                  {selectedTheater.rating && (
                    <Typography variant="body2">
                      Rating: {selectedTheater.rating} ⭐
                    </Typography>
                  )}
                </Box>
              </InfoWindow>
            )}
          </GoogleMap>
        </LoadScript>
      )}

      {theaters.length > 0 && (
        <Box sx={{ mt: 2 }}>
          <Typography variant="h6" gutterBottom>
            Found {theaters.length} theaters nearby
          </Typography>
          <Box sx={{ maxHeight: '200px', overflowY: 'auto' }}>
            {theaters.map((theater) => (
              <Box
                key={theater.id}
                sx={{
                  p: 2,
                  mb: 1,
                  bgcolor: 'background.paper',
                  borderRadius: 1,
                  cursor: 'pointer',
                  '&:hover': { bgcolor: 'action.hover' }
                }}
                onClick={() => setSelectedTheater(theater)}
              >
                <Typography variant="subtitle1">{theater.name}</Typography>
                <Typography variant="body2" color="text.secondary">
                  {theater.vicinity}
                </Typography>
                {theater.rating && (
                  <Typography variant="body2" color="text.secondary">
                    Rating: {theater.rating} ⭐
                  </Typography>
                )}
              </Box>
            ))}
          </Box>
        </Box>
      )}
    </Paper>
  );
};

export default NearbyTheaters;
import { useState, useEffect } from 'react';

// Haversine formula to calculate distance between two points in meters
const calculateDistance = (lat1, lon1, lat2, lon2) => {
  const R = 6371e3; // metres
  const φ1 = lat1 * Math.PI/180;
  const φ2 = lat2 * Math.PI/180;
  const Δφ = (lat2-lat1) * Math.PI/180;
  const Δλ = (lon2-lon1) * Math.PI/180;

  const a = Math.sin(Δφ/2) * Math.sin(Δφ/2) +
          Math.cos(φ1) * Math.cos(φ2) *
          Math.sin(Δλ/2) * Math.sin(Δλ/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));

  return R * c;
};

const useProximity = (userLocation, obstacles, thresholdMeters = 50) => {
  const [nearbyObstacles, setNearbyObstacles] = useState([]);

  useEffect(() => {
    if (!userLocation || !obstacles) return;

    const nearby = obstacles.filter(obs => {
      const dist = calculateDistance(
        userLocation.latitude, userLocation.longitude,
        obs.lat, obs.lng
      );
      return dist <= thresholdMeters;
    }).map(obs => ({
      ...obs,
      distance: calculateDistance(
        userLocation.latitude, userLocation.longitude,
        obs.lat, obs.lng
      ),
    })).sort((a, b) => a.distance - b.distance);

    setNearbyObstacles(nearby);
  }, [userLocation, obstacles, thresholdMeters]);

  return nearbyObstacles;
};

export default useProximity;

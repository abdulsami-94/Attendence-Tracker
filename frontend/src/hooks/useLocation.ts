import { useState, useCallback } from 'react';
import * as Location from 'expo-location';

interface LocationState {
  latitude: number | null;
  longitude: number | null;
  loading: boolean;
  error: string | null;
}

export function useLocation() {
  const [state, setState] = useState<LocationState>({
    latitude: null,
    longitude: null,
    loading: false,
    error: null,
  });

  const getLocation = useCallback(async () => {
    setState((s) => ({ ...s, loading: true, error: null }));

    const { status } = await Location.requestForegroundPermissionsAsync();
    if (status !== 'granted') {
      setState({
        latitude: null,
        longitude: null,
        loading: false,
        error: 'Location permission denied. Enable it in Settings to mark attendance.',
      });
      return null;
    }

    try {
      const position = await Location.getCurrentPositionAsync({
        accuracy: Location.Accuracy.High,
      });
      const { latitude, longitude } = position.coords;
      setState({ latitude, longitude, loading: false, error: null });
      return { latitude, longitude };
    } catch {
      setState({
        latitude: null,
        longitude: null,
        loading: false,
        error: 'Could not get GPS location. Make sure location services are on.',
      });
      return null;
    }
  }, []);

  return { ...state, getLocation };
}
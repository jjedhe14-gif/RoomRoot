import { useAppStore } from '../stores/appStore';

export function useGeolocation() {
  const setUserLocation = useAppStore(s => s.setUserLocation);
  const setLocationLoading = useAppStore(s => s.setLocationLoading);

  const requestLocation = () => {
    if (!navigator.geolocation) return;
    setLocationLoading(true);
    navigator.geolocation.getCurrentPosition(
      (position) => {
        setUserLocation({ lat: position.coords.latitude, lng: position.coords.longitude });
        setLocationLoading(false);
      },
      () => {
        setLocationLoading(false);
        setUserLocation(null);
      },
      { timeout: 10000, enableHighAccuracy: false }
    );
  };

  return { requestLocation };
}

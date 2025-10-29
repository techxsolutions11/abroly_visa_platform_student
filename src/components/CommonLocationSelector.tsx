import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import Autocomplete from 'react-google-autocomplete';
import { setArea, setLatitude, setLongitude } from '@/redux/slices/userLocationSlice';
import {
  Drawer,
  DrawerContent,
  DrawerBody,
} from "@nextui-org/react";
import { MapPin, Search } from 'lucide-react';
import { Button } from '@nextui-org/react';
import { addToLocal } from '@/utils/localstorage';
import { ErrorToast } from '@/utils/Toaster';

interface CommonLocationSelectorProps {
  isOpen: boolean;
  onOpenChange: (isOpen: boolean) => void;
}

const placesApiKey = import.meta.env.VITE_GOOGLE_PLACES_API_KEY;

const CommonLocationSelector: React.FC<CommonLocationSelectorProps> = ({ isOpen, onOpenChange }) => {
  const { latitude, longitude, area } = useSelector((state: any) => state.user_location);
  const dispatch = useDispatch();

  const [isEditing, setIsEditing] = useState(!area); // State to toggle Autocomplete visibility

  const handlePlaceSelected = (place) => {
    console.log(place, "PLACE");
    if (place && place.geometry?.location) {
      const addressComponents = place.address_components;

      const getComponent = (types: string[]) =>
        addressComponents?.find((component) =>
          types.some((type) => component.types.includes(type))
        )?.long_name || '';

      const formattedArea = place.formatted_address || getComponent(['locality']);

      dispatch(setArea(formattedArea.split(",")[0]));
      addToLocal("area", formattedArea.split(",")[0]);
      dispatch(setLatitude(place.geometry.location.lat()));
      addToLocal("latitude", place.geometry.location.lat() + "");
      dispatch(setLongitude(place.geometry.location.lng()));
      addToLocal("longitude", place.geometry.location.lng() + "");
      setIsEditing(false); // Exit editing mode after selection
    }
  };

  const handleGetCurrentLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          const { latitude, longitude } = position.coords;
          dispatch(setLatitude(latitude));
          addToLocal("latitude", latitude + "");
          dispatch(setLongitude(longitude));
          addToLocal("longitude", longitude + "");

          // Fetch the area using the Geocoding API
          await fetchAreaFromCoordinates(latitude, longitude);
        },
        (error) => {
          console.error("Error getting location:", error);
          ErrorToast("Failed to get your location. Please enable location services.");
        },
        {
          enableHighAccuracy: true, // Request high-accuracy location
          timeout: 10000, // Timeout after 10 seconds
          maximumAge: 0, // Do not use cached location
        }
      );
    } else {
      ErrorToast("Geolocation is not supported by your browser.");
    }
  };

  const fetchAreaFromCoordinates = async (lat: number, lng: number) => {
    try {
      const response = await fetch(
        `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${placesApiKey}`
      );

      const data = await response.json();

      if (data.status === "OK" && data.results.length > 0) {
        const formattedAddress = data.results[0].formatted_address; // Full address
        const areaName = data.results[0].address_components.find((component: any) =>
          component.types.includes("locality")
        )?.long_name; // Area name
        dispatch(setArea(areaName || formattedAddress || "Unknown Area"));
        addToLocal("area", areaName || formattedAddress || "Unknown Area");
      } else {
        console.error("Failed to fetch area:", data);
        dispatch(setArea("Unknown Area"));
      }
    } catch (error) {
      console.error("Error fetching area:", error);
      dispatch(setArea("Unknown Area"));
    }
    setIsEditing(false); // 
  };

  return (
    <Drawer
      isOpen={isOpen}
      isDismissable={false}
      onOpenChange={onOpenChange}
      size="md"
      placement="top"
      className="flex flex-col items-center justify-center"
      backdrop="blur"
    >
      <DrawerContent>
        <DrawerBody>
          <div className="text-center p-4">
            <h2 className="text-xl font-semibold text-gray-800 mb-2 flex items-center justify-center gap-2">
              <MapPin className="w-6 h-6 text-blue-500" />
              Select Your Location
            </h2>
            <p className="text-gray-600 text-sm mb-4">
              Search and select your preferred location from the dropdown below to personalize your experience.
            </p>

            <div className="relative w-full max-w-lg mx-auto">
              {isEditing ? (
                <section className="flex flex-col gap-3">
                  <div>
                    <Autocomplete
                      apiKey={placesApiKey}
                      onPlaceSelected={handlePlaceSelected}
                      options={{ types: ['(regions)'] }}
                      defaultValue={area}
                      className="w-full border border-gray-300 focus:ring-2 focus:ring-blue-500 focus:outline-none rounded-md p-2 text-gray-800 shadow-sm"
                    />
                    <Search className="absolute top-2.5 right-3 text-gray-400 w-5 h-5" />
                  </div>

                  <hr />

                  <Button className='mx-auto w-fit' variant='solid' color='primary' size='sm' startContent={<MapPin className='p-1' />} onClick={handleGetCurrentLocation}>Use My Current Location</Button>

                </section>
              ) : (
                <div className="text-center space-y-3">
                  <p className="text-sm text-gray-500">Selected Location:</p>
                  <p className="text-lg font-medium text-blue-600">{area}</p>
                  <div className='flex items-center justify-center gap-2'>
                    <Button
                      color="primary"
                      variant="shadow"
                      onClick={() => setIsEditing(true)}
                    >
                      Change Location
                    </Button>
                    <Button
                      color="primary"
                      variant="shadow"
                      onClick={() => onOpenChange(false)}
                    >
                      Confirm Location
                    </Button>
                  </div>

                </div>
              )}
            </div>
          </div>
        </DrawerBody>
      </DrawerContent>
    </Drawer>
  );
};

export default CommonLocationSelector;

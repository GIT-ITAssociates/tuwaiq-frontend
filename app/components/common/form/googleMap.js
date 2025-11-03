"use client";
import { GoogleMap, Marker, Polyline } from "@react-google-maps/api";
import { useEffect, useRef, useState } from "react";
import { fetchAdminSettings } from "../../app/helpers/backend";
import { useFetch } from "../../app/helpers/hooks";

const loadGoogleMapsScript = (apiKey) => {
    return new Promise((resolve, reject) => {
        const script = document.createElement("script");
        script.src = `https://maps.googleapis.com/maps/api/js?key=${apiKey}&libraries=places`;
        script.async = true;
        script.onload = () => resolve();
        script.onerror = () => reject(new Error("Google Maps API failed to load"));
        document.head.appendChild(script);
    });
};

export const MapViewer = ({ from, to, height = 200 }) => {
    const [googleLoaded, setGoogleLoaded] = useState(false);
    const [routePath, setRoutePath] = useState([]);
    const [data, getdata, { loading }] = useFetch(fetchAdminSettings);
    const mapRef = useRef(null);

    const calculateRoute = async (apiKey, origin, destination) => {
        if (!origin || !destination) return;

        const directionsService = new google.maps.DirectionsService();
        try {
            const response = await directionsService.route({
                origin,
                destination,
                travelMode: google.maps.TravelMode.DRIVING,
            });
            if (response.status === "OK") {
                const path = response.routes[0].overview_path.map((point) => ({
                    lat: point.lat(),
                    lng: point.lng(),
                }));
                setRoutePath(path);

                // Adjust bounds to fit the route
                const bounds = new google.maps.LatLngBounds();
                path.forEach((point) => bounds.extend(point));
                if (mapRef.current) {
                    mapRef.current.fitBounds(bounds);
                }
            } else {
            }
        } catch (error) {
        }
    };

    useEffect(() => {
        if (data?.google_api_key) {
            loadGoogleMapsScript(data?.google_api_key)
                .then(() => {
                    setGoogleLoaded(true);

                })
                .catch((error) => {
                });
        }
    }, [data?.google_api_key]);

    useEffect(() => {
        if (googleLoaded && from && to) {
            calculateRoute(
                data?.google_api_key,
                { lat: from.lat, lng: from.lng },
                { lat: to.lat, lng: to.lng }
            );
        }
    }, [googleLoaded, from, to, data?.google_api_key]);

    return (
        <>
            {googleLoaded && (
                <GoogleMap
                    mapContainerStyle={{
                        width: "100%",
                        height: height,
                        borderRadius: 5,
                        marginBottom: 8,
                    }}
                    onLoad={(map) => (mapRef.current = map)} // Save map instance
                    zoom={13} // Default zoom in case no bounds are set
                    options={{
                        disableDefaultUI: true,
                        zoomControl: true,
                        fullscreenControl: false,
                        streetViewControl: false,
                        mapTypeControl: false,
                    }}
                >
                    {/* Markers for the two locations */}
                    {from && (
                        <Marker
                            position={{ lat: from.lat, lng: from.lng }}
                            title={from.name || "From Location"}
                        />
                    )}
                    {to && (
                        <Marker
                            position={{ lat: to.lat, lng: to.lng }}
                            title={to.name || "To Location"}
                        />
                    )}

                    {/* Polyline showing the shortest route */}
                    {routePath.length > 0 && (
                        <Polyline
                            path={routePath}
                            options={{
                                strokeColor: "#FF0000",
                                strokeOpacity: 0.8,
                                strokeWeight: 2,
                                clickable: false,
                            }}
                        />
                    )}
                </GoogleMap>
            )}
        </>
    );
};

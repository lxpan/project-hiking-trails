import React, { useRef, useEffect, useState } from 'react';
import bbox from '@turf/bbox';
import setAllLayersVisibility from '../utils/utils';
import { useAppState } from '../overmind';
import mapboxgl from '!mapbox-gl'; // eslint-disable-line import/no-webpack-loader-syntax
import 'mapbox-gl/dist/mapbox-gl.css';
import '../styles/Map.css';
import { convertLength } from '@turf/turf';

mapboxgl.accessToken =
    'pk.eyJ1IjoibHBhbmRldiIsImEiOiJjbGdlZnFvNDEwdTF0M3JyeW5nNjF0bHg2In0.FeOaetmAXx5D4hb1A4e-hg';

const palette = require('tailwindcss/colors'); // eslint-disable-line
const COLOURS = [
    palette.blue[500],
    palette.indigo[500],
    palette.orange[400],
    palette.emerald[500],
    palette.purple[500],
    palette.red[500],
];

const INITIAL_LNG = 143.9221;
const INITIAL_LAT = -37.655;
const ZOOM = 13.2;

function Map() {
    const { routes } = useAppState();

    const mapContainer = useRef(null);
    const map = useRef(null);
    const [lng, setLng] = useState(INITIAL_LNG);
    const [lat, setLat] = useState(INITIAL_LAT);
    const [zoom, setZoom] = useState(ZOOM);

    const [stateMap, setStateMap] = useState(null);
    const [currentRoute, setCurrentRoute] = useState(null);

    // initialise the map right after component load
    useEffect(() => {
        // console.log('routes state in Map component');
        // console.log(routes);
        if (map.current) return; // initialize map only once
        map.current = new mapboxgl.Map({
            container: mapContainer.current,
            style: 'mapbox://styles/mapbox/outdoors-v11',
            center: [lng, lat],
            zoom,
        });

        map.current.on('load', () => {
            map.current.resize();
            routes.forEach((route) => {
                const { slug } = route;

                // 1. Add the source using the slug as unique id
                map.current.addSource(slug, {
                    type: 'geojson',
                    data: route.geoJson,
                });

                // 2. Add a layer displaying our route
                map.current.addLayer({
                    id: slug,
                    type: 'line',
                    source: slug, // same id as above
                    layout: {
                        'line-join': 'round',
                        'line-cap': 'round',
                    },
                    paint: {
                        'line-color': COLOURS.shift(),
                        'line-width': 4,
                    },
                });

                map.current.addLayer({
                    id: `${slug}-fill`,
                    type: 'fill',
                    source: slug,
                    paint: {
                        'fill-color': 'transparent',
                        'fill-outline-color': 'transparent',
                    },
                });

                // Change cursor on route fill hover
                map.current.on('mouseenter', `${slug}-fill`, () => {
                    map.current.getCanvas().style.cursor = 'pointer';
                    map.current.setPaintProperty(slug, 'line-width', 6);
                });

                // Restore cursor on route fill exit
                map.current.on('mouseleave', `${slug}-fill`, () => {
                    map.current.getCanvas().style.cursor = '';
                    map.current.setPaintProperty(slug, 'line-width', 4);
                });

                // Pan to route (bounding box) on click
                map.current.on('click', `${slug}-fill`, () => {
                    const bounds = bbox(route.geoJson);

                    // pan map to bounds
                    map.current.fitBounds(bounds, {
                        padding: 20,
                    });

                    setCurrentRoute(slug);
                });
            });
        });

        setStateMap(map);
    });

    // store new coordinates as user moves the map
    useEffect(() => {
        if (!map.current) return; // wait for map to initialize
        map.current.on('move', () => {
            setLng(map.current.getCenter().lng.toFixed(4));
            setLat(map.current.getCenter().lat.toFixed(4));
            setZoom(map.current.getZoom().toFixed(2));
        });
    });

    useEffect(() => {
        if (currentRoute && stateMap.current) {
            routes.forEach((route) => {
                const { slug } = route;
                // set currently selected route visible and pan to route
                if (slug === currentRoute) {
                    setAllLayersVisibility(stateMap.current, slug, 'visible');
                    const bounds = bbox(route.geoJson);
                    // pan map to bounds
                    stateMap.current.fitBounds(bounds, {
                        padding: 20,
                    });
                }
                // hide all other routes on the map
                else {
                    setAllLayersVisibility(stateMap.current, slug, 'none');
                }
            });
        }
        else {
            // Reset initial map state
            routes.forEach((route) => {
                const { slug } = route;
                if (stateMap.current) {
                    setAllLayersVisibility(stateMap.current, slug, 'visible');
                    stateMap.current.flyTo({
                        center: [INITIAL_LNG, INITIAL_LAT],
                        essential: true,
                        zoom,
                    });
                }
            });
        }
    }, [currentRoute, stateMap]);

    // useEffect(() => {
    //     console.log(stateMap);
    // }, [stateMap]);

    return (
        <>
            <div className="sidebar">
                Longitude: {lng} | Latitude: {lat} | Zoom: {zoom}
            </div>
            <div ref={mapContainer} className="map-container" />
        </>
    );
}

export default Map;

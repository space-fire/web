"use client"
import React, { useEffect, useRef } from 'react';
import 'ol/ol.css';
import Map from 'ol/Map';
import View from 'ol/View';
import TileLayer from 'ol/layer/Tile';
import OSM from 'ol/source/OSM';
import VectorLayer from 'ol/layer/Vector';
import VectorSource from 'ol/source/Vector';
import Feature from 'ol/Feature';
import Point from 'ol/geom/Point';
import { fromLonLat } from 'ol/proj';
import { Style, Icon } from 'ol/style';

interface FireMapProps {
  data: {
    latitude: string;
    longitude: string;
  }[];
}

const FireMap: React.FC<FireMapProps> = ({ data }) => {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstance = useRef<Map | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;

    if (!mapInstance.current) {
      const map = new Map({
        layers: [
          new TileLayer({
            source: new OSM(),
          }),
        ],
        target: mapRef.current,
        view: new View({
          center: fromLonLat([-97.0, 38.0]),
          zoom: 4,
        }),
      });

      mapInstance.current = map;
    }

    const vectorSource = new VectorSource();

    data.forEach((item) => {
      const lon = parseFloat(item.longitude);
      const lat = parseFloat(item.latitude);

      if (!isNaN(lon) && !isNaN(lat)) {
        const marker = new Feature({
          geometry: new Point(fromLonLat([lon, lat])),
        });

        vectorSource.addFeature(marker);
      }
    });

    const vectorLayer = new VectorLayer({
      source: vectorSource,
      style: new Style({
        image: new Icon({
          src: '/fire.png', 
          scale: 0.2,
        }),
      }),
    });

    const map = mapInstance.current;
    const layers = map.getLayers();
    layers.clear();
    
    layers.push(new TileLayer({
      source: new OSM(),
    }));

    layers.push(vectorLayer);
  }, [data]);

  return <div ref={mapRef} className="w-full h-full" />;
};

export default FireMap;

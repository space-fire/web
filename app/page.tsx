"use client"
import React, { useState, useEffect } from 'react';
import Map from './components/map';

const Home: React.FC = () => {
  const [data, setData] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetch('/api')
      .then((response) => response.json())
      .then((responseData) => {
        setData(responseData.data);
        setIsLoading(false);
      })
      .catch((error) => {
        console.error('Error fetching data:', error);
        setIsLoading(false);
      });
  }, []);

  return (
    <div>
      <h1 className="text-3xl font-semibold text-center my-10">F. I. R. E</h1>
      {isLoading ? (
        <div className="text-center">Loading...</div>
      ) : (
        <div className="w-2/3 mx-auto my-20 h-96">
          <Map data={data} />
        </div>
      )}
    </div>
  );
};

export default Home;

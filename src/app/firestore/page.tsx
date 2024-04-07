// Mark the component as a Client Component
"use client";
import React, { useEffect, useState } from 'react';

function DataFetcher() {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    async function fetchData() {
      try {
        setLoading(true);
        const host = window.location.host;
        const url = `http://${host}/api/data`;
        const response = await fetch(url);
        if (!response.ok) {
          throw new Error(`Data fetching failed with status: ${response.status}`);
        }
        const jsonData = await response.json();
        console.log(jsonData);
        setData(jsonData);
      } catch (err) {
        if (err instanceof Error) {
          setError(err.message);
        } else {
          setError('An unexpected error occurred');
        }
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div>
      <h1>Fetched Data</h1>
      <ul>
      </ul>
    </div>
  );
}

export default DataFetcher;

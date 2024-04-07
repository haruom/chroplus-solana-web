"use client";
import { Timestamp } from 'firebase-admin/firestore';
import React, { useEffect, useState } from 'react';


interface RewardData {
    id: string;
    createdAt: Date; // Or string if you've converted it before sending
    price: number;
    seconds: number;
    uid: string;
  }

function DataFetcher() {
  const [data, setData] = useState<RewardData[]>([]);
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
        setData(jsonData); // Expect jsonData to be an array
        console.log(jsonData);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'An unexpected error occurred');
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;
  if (!data) return <div>No data available</div>; // Handle case when there is no data

  return (
    <table className="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>Data</th>
          <th>Amount</th>
        </tr>
      </thead>
    <tbody>
        {data.map((record, index) => (
            <tr key={index}>
                <td>{record.createdAt.toString()}</td> 
                <td>{record.seconds} seconds</td>
                <td>{record.price.toFixed(8)} SOL</td>
            </tr>
        ))}
    </tbody>
    </table>
  );
}

export default DataFetcher;

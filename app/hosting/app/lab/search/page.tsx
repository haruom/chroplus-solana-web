'use client'
import React, { useState } from 'react';
import Link from "next/link";
import Image from "next/image";

export default function Page() {
    const [showResult, setShowResult] = useState(false);
    const oneweek = new Date(new Date().getTime() - (24 * 60 * 60 * 7000)).toISOString().split('T')[0];
    const [startDate, setStartDate] = useState(oneweek);
    const [endDate, setEndDate] = useState(new Date().toISOString().split('T')[0]);
    const [days, setDays] = useState(0);
    const [amount, setAmount] = useState(0);
    const [aleart, setAleart] = useState('');

    const handleSearchClick = () => {
        const result = checkDate(startDate, endDate);
        if (!result.result) {
            setAleart(result.message);
            setShowResult(false);
        }else{
            setAleart('');
            calculateDaysBetweenAndAmount(); 
            setShowResult(true);
        }
    };

    const checkDate = (startDate: string, endDate: string) => {
      if (startDate === '' || endDate === '') {
        return { result: false, message: 'input date' };
      }
      if (new Date(startDate) > new Date(endDate)) {
        return { result: false, message: 'Please enter a date after the start date for the end date.' };
      }
      const today = new Date().toISOString().split('T')[0];
      if (new Date(startDate) > new Date(today)) {
        return { result: false, message: 'Please enter a date before today for the start date.' };
      }
      if (new Date(endDate) > new Date(today)) {
        return { result: false, message: 'Please enter a date before today for the end date.' };
      }
      return { result: true, message: '' };
    }
    
    const calculateDaysBetweenAndAmount = () => {
      const difference = new Date(endDate).getTime() - new Date(startDate).getTime();
      const calculatedDays = difference / (1000 * 3600 * 24); 
      setDays(calculatedDays);
      
      const calculatedAmount = calculatedDays * 1000;
      setAmount(calculatedAmount);
    };

  return (
    <>
      <header className="bg-black relative lg:w-full">
        <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
          <div className="flex">
            <a href="/" className="">
              <Image
                className="relative dark:invert"
                src="/chro-plus_logo_wht.svg"
                alt="chro-plus Logo"
                width={90}
                height={22}
                priority
              />
            </a>
          </div>
          <div className="flex text-white">Lab.</div>
        </nav>
      </header>
      <h1 className="text-3xl text-center m-5">Search</h1>
      <p className="text-center m-3">"XHRO" data acquisition date</p>
      <div className="flex justify-center m-3">
        <input type="date" className="w-3/7 mx-auto" value={startDate} onChange={e => setStartDate(e.target.value)}/>
        <span className="mx-1">〜</span>
        <input type="date" className="w-3/7 mx-auto" value={endDate} onChange={e => setEndDate(e.target.value)}/>
      </div>
      <div className="flex justify-center m-3">
        {aleart && <p className="text-red-500">{aleart}</p>}
      </div>
      <div className="flex justify-center m-3">
        <button onClick={handleSearchClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Search</button>
      </div>

      {showResult && (
        <>
          <p className="text-center m-3">result</p>
          <div className="flex justify-center m-3">
            <table className="table-auto border-separate">
              <thead>
                <tr>
                  <th className="border px-4 py-2">population</th>
                  <th className="border px-4 py-2">number of date</th>
                  <th className="border px-4 py-2">cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="border px-4 py-2 text-center">1000</td>
                  <td className="border px-4 py-2 text-center">{days}</td>
                  <td className="border px-4 py-2 text-center">{amount}</td>
                </tr>
              </tbody>
            </table>
          </div>
          <div className="flex justify-center m-3">
            <Link  href={{pathname: '/lab/order', query: { startDate:startDate, endDate:endDate, amount:amount}}} >
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Pay</button>
            </Link>
          </div>
        </>
      )}
      <div className="flex justify-center m-3">
        <Link  href={{pathname: '/lab/download'}} >
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Your NFT Collections</button>
        </Link>
      </div>
    </>
  );
}

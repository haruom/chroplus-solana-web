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
        return { result: false, message: '日付を入力してください。' };
      }
      if (new Date(startDate) > new Date(endDate)) {
        return { result: false, message: '終了日は開始日以降の日付を入力してください。' };
      }
      const today = new Date().toISOString().split('T')[0];
      if (new Date(startDate) > new Date(today)) {
        return { result: false, message: '開始日は本日以前の日付を入力してください。' };
      }
      if (new Date(endDate) > new Date(today)) {
        return { result: false, message: '終了日は本日以前の日付を入力してください。' };
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
      <a href="../" className="m-5">
        <img src="/Sleepin.svg" alt="sleepin" width={100} height={100} />
      </a>
      <h1 className="text-3xl text-center m-5">Search</h1>
      <p className="text-center m-3">睡眠データ取得日時</p>
      <div className="flex justify-center m-3">
        <input type="date" className="w-3/7 mx-auto" value={startDate} onChange={e => setStartDate(e.target.value)}/>
        <span className="mx-1">〜</span>
        <input type="date" className="w-3/7 mx-auto" value={endDate} onChange={e => setEndDate(e.target.value)}/>
      </div>
      <div className="flex justify-center m-3">
        {aleart && <p className="text-red-500">{aleart}</p>}
      </div>
      <div className="flex justify-center m-3">
        <button onClick={handleSearchClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">検索</button>
      </div>

      {showResult && (
        <>
          <p className="text-center m-3">結果</p>
          <div className="flex justify-center m-3">
            <table className="table-auto border-separate">
              <thead>
                <tr>
                  <th className="border px-4 py-2">人数</th>
                  <th className="border px-4 py-2">日数</th>
                  <th className="border px-4 py-2">金額</th>
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
              <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">支払い</button>
            </Link>
          </div>
        </>
      )}


    </>
  );
}

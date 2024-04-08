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
      <h1 className="text-3xl text-center m-20 font-bold">Search</h1>

      <section className="CONTENTS_WRAP m-30 mx-auto max-w-3xl">
        <h3 className="mt-10 m-5 font-bold">"XHRO" User data list</h3>
        <hr/>
        <div className="C-data-list">
          <div className="flex justify-between font-bold m-5">
            <span className="basis-3/12">Date</span>
            <span className="basis-7/12 flex justify-between">
              <span className="basis-4/6">Data Info</span>
              <span className="basis-2/6">Amount</span>
            </span>
            <span className="basis-2/12 text-right">Cost</span>
          </div>

          <fieldset>

            <hr/>
            <label for="{`ITEM-ID`}">
              <div className="flex justify-between m-5">
                <input type="checkbox" id="{`ITEM-ID`}" name="data-items" value="{`ITEM-ID`}"/>
                <span className="basis-3/12 pl-3">2024-04-01</span>
                <span className="basis-7/12 flex justify-between">
                  <details className="w-full">
                    <summary className="flex justify-between">
                      <span className="basis-4/6">▼ {`4`} types of data</span>
                      <span className="basis-2/6">{`20h23m`}</span>
                    </summary>
                    <span className="flex justify-between mt-3">
                      <span className="basis-4/6">- EEG</span>
                      <span className="basis-2/6">{`330MB`}</span>
                    </span>
                    <span className="flex justify-between">
                      <span className="basis-4/6">- ECG</span>
                      <span className="basis-2/6">{`330MB`}</span>
                    </span>
                    <span className="flex justify-between">
                      <span className="basis-4/6">- PPG</span>
                      <span className="basis-2/6">{`132MB`}</span>
                    </span>
                    <span className="flex justify-between">
                      <span className="basis-4/6">- Body temperature</span>
                      <span className="basis-2/6">{`0.66MB`}</span>
                    </span>
                  </details>
                </span>
                <span className="basis-2/12 text-right">{`0.8`} SOL</span>
              </div>
            </label>


            <hr/>
            <label for="{`ITEM-ID`}">
              <div className="flex justify-between m-5">
                <input type="checkbox" id="{`ITEM-ID`}" name="data-items" value="{`ITEM-ID`}"/>
                <span className="basis-3/12 pl-3">2024-04-01</span>
                <span className="basis-7/12 flex justify-between">
                  <details className="w-full">
                    <summary className="flex justify-between">
                      <span className="basis-4/6">▼ {`4`} types of data</span>
                      <span className="basis-2/6">{`20h23m`}</span>
                    </summary>
                    <span className="flex justify-between mt-3">
                      <span className="basis-4/6">- EEG</span>
                      <span className="basis-2/6">{`330MB`}</span>
                    </span>
                    <span className="flex justify-between">
                      <span className="basis-4/6">- ECG</span>
                      <span className="basis-2/6">{`330MB`}</span>
                    </span>
                    <span className="flex justify-between">
                      <span className="basis-4/6">- PPG</span>
                      <span className="basis-2/6">{`132MB`}</span>
                    </span>
                    <span className="flex justify-between">
                      <span className="basis-4/6">- Body temperature</span>
                      <span className="basis-2/6">{`0.66MB`}</span>
                    </span>
                  </details>
                </span>
                <span className="basis-2/12 text-right">{`0.8`} SOL</span>
              </div>
            </label>


            <hr/>
            <label for="{`ITEM-ID`}">
              <div className="flex justify-between m-5">
                <input type="checkbox" id="{`ITEM-ID`}" name="data-items" value="{`ITEM-ID`}"/>
                <span className="basis-3/12 pl-3">2024-04-01</span>
                <span className="basis-7/12 flex justify-between">
                  <details className="w-full">
                    <summary className="flex justify-between">
                      <span className="basis-4/6">▼ {`4`} types of data</span>
                      <span className="basis-2/6">{`20h23m`}</span>
                    </summary>
                    <span className="flex justify-between mt-3">
                      <span className="basis-4/6">- EEG</span>
                      <span className="basis-2/6">{`330MB`}</span>
                    </span>
                    <span className="flex justify-between">
                      <span className="basis-4/6">- ECG</span>
                      <span className="basis-2/6">{`330MB`}</span>
                    </span>
                    <span className="flex justify-between">
                      <span className="basis-4/6">- PPG</span>
                      <span className="basis-2/6">{`132MB`}</span>
                    </span>
                    <span className="flex justify-between">
                      <span className="basis-4/6">- Body temperature</span>
                      <span className="basis-2/6">{`0.66MB`}</span>
                    </span>
                  </details>
                </span>
                <span className="basis-2/12 text-right">{`0.8`} SOL</span>
              </div>
            </label>

          </fieldset>
        </div>
      <hr/>
      </section>


      <div className="flex justify-center m-3">
        {aleart && <p className="text-red-500">{aleart}</p>}
      </div>
      <div className="flex justify-center m-3">
        <button onClick={handleSearchClick} className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Estimate</button>
      </div>

      {showResult && (
        <>
          <p className="text-center m-3">result</p>
          <div className="flex justify-center m-3">
            <table className="table-auto border-separate">
              <thead>
                <tr>
                  <th className="border px-4 py-2">number of data</th>
                  <th className="border px-4 py-2">cost</th>
                </tr>
              </thead>
              <tbody>
                <tr>
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


      <div className="flex justify-center m-30 pt-10 pb-10 mx-auto max-w-3xl ">
        <Link  href={{pathname: '/lab/download'}} >
          <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Your NFT Collections</button>
        </Link>
      </div>
    </>
  );
}

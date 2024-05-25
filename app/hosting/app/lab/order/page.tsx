"use client";
import { useEffect, useState } from 'react';
import { Suspense } from 'react';
import Image from "next/image";
import Link from "next/link";
import Quantity from "./quantity";
import Amount from "./amount";

const Page = () => {
    const [startDate, setStartDate] = useState('');
    const [endDate, setEndDate] = useState('');
    const [amount, setAmount] = useState('');
    const [clickedCopy, setClickedCopy] = useState(false);
    const [csvUrl, setCsvUrl] = useState('');
    const address = "CQzBVzHWbwkcUQ9Ey251bzPFLocXt27ZvjjTn9UfFMnR";


    const clickCopyHandler = async () => {
        try {
            await navigator.clipboard.writeText(address);
            alert('save to clipboard');
            setClickedCopy(true);
        } catch (error) {
            alert('failed to save to clipboard');
        }
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
        <h1 className="text-3xl text-center m-20 font-bold">Order</h1>
        <div className="m-30 mx-auto max-w-3xl">
          <section className="m-10">
            <div className="flex justify-between">
              <h3 className="m-3 font-bold">Quantity</h3>
              <div className="flex m-3">
              <Suspense>
              <Quantity />
              </Suspense>
              </div>
            </div>
            <div className="flex justify-between">
              <h3 className="m-3 font-bold ">Amount of Remittance</h3>
              <div className="flex m-3">
                <Amount />
                <span className="mx-3">SOL</span>
              </div>
            </div>
          </section>
          <hr/>
          <section className="m-10">
            <div className="flex justify-between items-center">
              <h3 className=" m-3 font-bold">Remittance Address</h3>
              <div className="flex m-3 items-center">
                  <span className="mx-8">{address}</span>
                  <button className='btn border border-blue-500 hover:border-blue-700 text-black font-bold py-2 px-4 rounded' onClick={() => clickCopyHandler()}>copy</button>
              </div>
            </div>
          </section>
          <hr/>
            {clickedCopy && (
              <div className="flex justify-center m-3">
                <Link  href={{pathname: '/lab/download'}} >
                  <button className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded">Your NFT Collections</button>
                </Link>
              </div>
            )}
        </div>
        </>
    );
}


export default Page;
"use client";
import { useEffect, useState } from 'react';
import { useRouter } from 'next/router';
import { useSearchParams } from 'next/navigation'
import Image from "next/image";

export default function Page() {
    const searchParams = useSearchParams()
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const amount = searchParams.get('amount')
    const address = "0x123456789"

    const clickCopyHandler = async () => {
        try {
          await navigator.clipboard.writeText(address)
          alert('Saved to clipboard.')
        } catch (error) {
          alert('failed')
        }
      }
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
              <h3 className="m-3 font-bold">Data Period</h3>
              <div className="flex m-3">
                  <span className="mx-3">{startDate}</span>
                  <span className="mx-3">〜</span>
                  <span className="mx-3">{endDate}</span>
              </div>
            </div>
            <div className="flex justify-between">
              <h3 className="m-3 font-bold ">Amount of Remittance</h3>
              <div className="flex m-3">
                <span className="mx-3">{amount}</span>
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
          {/* a href の中に松嶋さんからもらった データの CSV のリンクを入れてしまうにしましょう！*/}
          {/* フォールバックプランとして、上のcopy が完了したら下のSectionを表示するロジックをいれてもらえると！*/}
          <section className="m-10">
            <div className="flex justify-between items-center">
              <h3 className=" m-3 font-bold">Data Download</h3>
              <div className="flex m-3 items-center">
                  <span className="mx-8"> ID = K6tTYUkcJHwPQUDu </span>
                  <a href="" className='btn border border-blue-500 hover:border-blue-700 text-black font-bold py-2 px-4 rounded'>Download</a>
              </div>
            </div>
          </section>
        </div>
        </>
    );
}
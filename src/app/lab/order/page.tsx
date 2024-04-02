"use client";
import { useSearchParams } from 'next/navigation'


export default function Page() {
    const searchParams = useSearchParams()
    const startDate = searchParams.get('startDate')
    const endDate = searchParams.get('endDate')
    const amount = searchParams.get('amount')
    const address = "0x123456789"

    const clickCopyHandler = async () => {
        try {
          await navigator.clipboard.writeText(address)
          alert('クリップボードに保存しました。')
        } catch (error) {
          alert('失敗しました。')
        }
      }
    return (
        <>
      <a href="../" className="m-5">
        <img src="/Sleepin.svg" alt="sleepin" width={100} height={100} />
      </a>
        <h1 className="text-3xl text-center m-5">Order</h1>
        <p className="text-center m-3">送金先アドレス</p>
        <div className="flex justify-center items-center m-3">
            <span className="w-1/3 text-center">{address}</span>
            <button className='btn m-5 border border-blue-500 hover:border-blue-700 text-black font-bold py-2 px-4 rounded' onClick={() => clickCopyHandler()}>copy</button>
        </div>
        <p className="text-center m-3">データの期間</p>
        <div className="flex justify-center m-3">
            <span className="mx-3">{startDate}</span>
            <span className="mx-3">〜</span>
            <span className="mx-3">{endDate}</span>
        </div>
        <p className="text-center m-3">送金額</p>
        <p className="text-center m-3">{amount}MATIC</p>
        </>
    );
    }
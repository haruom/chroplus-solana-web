'use client'
import { bigint2Float } from "@/lib/reward/reward"
import { RecordEventType } from "@prisma/client"
import { useRef, useState } from "react"
import { MetaMaskProvider, useSDK } from "@metamask/sdk-react";

const chainId = process.env.NEXT_PUBLIC_POLYGON_CHAIN_ID;

interface Record {
  type: RecordEventType
  amount: bigint
  sleepDuration: number | null
  sleepDate: Date | null
  recordedAt: Date
}
interface Props {
  records: Record[]
  earnSum: number
  withdrawSum: number
}
const Dialog = ({ records, earnSum, withdrawSum }: Props) => {
  const buttonClass = "bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded";
  const { sdk, connected, connecting, provider, account } = useSDK();
  console.info({ sdk, connected, connecting, provider, chainId })
  const addNetwork = async () => {
    if (!provider?.isConnected()) { await sdk?.connect() }

    await provider?.request({
      method: 'wallet_addEthereumChain',
      params: [{
        chainId,
        chainName: 'Polygon Amoy Testnet',
        rpcUrls: [process.env.NEXT_PUBLIC_POLYGON_RPC_URL],
        nativeCurrency: {
          name: 'MATIC',
          symbol: 'MATIC',
          decimals: 18,
        },
        blockExplorerUrls: ['https://www.oklink.com/amoy'],
      }],
    })
    await provider?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    })
  }

  const [userAddress, setUserAddress] = useState(account ?? '')
  const requestAccount = async () => {
    if (!provider?.isConnected()) { await sdk?.connect() }
    await provider?.request({
      method: 'wallet_switchEthereumChain',
      params: [{ chainId }]
    })
    const accounts = await provider?.request({
      method: 'eth_requestAccounts'
    }) as string[];

    if (!accounts || accounts?.length <= 0) {
      alert('Please specify an account');
      throw 'error';
    }

    setUserAddress(accounts[0]);
  };

  const [amountStr, setAmountStr] = useState('0.01')
  const sleepTableData = records.filter(x => x.type === 'SLEEP').map(x => {
    const { type, amount: amount_, recordedAt } = x
    const amount = bigint2Float(amount_)

    switch (type) {
      case 'SELLDATA':
        return { date: recordedAt, detail: 'Sale of sleep data', amount };
      case 'WITHDRAW':
        return { date: recordedAt, detail: 'Withdrawal', amount };
      case 'SLEEP':
        if (!x.sleepDuration || !x.sleepDate) { throw 'Missing required data'; }
        const hour = Math.floor(x.sleepDuration / 3600)
        const minute = Math.floor((x.sleepDuration - (hour * 3600)) / 60)
        const detail = `${hour}h${minute}m of sleep`;
        return { date: x.sleepDate, detail, amount }
    }
  })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ date, ...rest }) => ({ date: date.toISOString().substring(0, 10), ...rest }))
  const withdrawTableData = records.filter(x => x.type === 'WITHDRAW').map(x => {
    const { type, amount: amount_, recordedAt } = x
    const amount = bigint2Float(amount_)

    switch (type) {
      case 'SELLDATA':
        return { date: recordedAt, detail: 'Sale of sleep data', amount };
      case 'WITHDRAW':
        return { date: recordedAt, detail: 'Withdrawal', amount };
      case 'SLEEP':
        if (!x.sleepDuration || !x.sleepDate) { throw 'Missing required data'; }
        const hour = Math.floor(x.sleepDuration / 3600)
        const minute = Math.floor((x.sleepDuration - (hour * 3600)) / 60)
        const detail = `${hour}h${minute}m of sleep`;
        return { date: x.sleepDate, detail, amount }
    }
  })
    .sort((a, b) => b.date.getTime() - a.date.getTime())
    .map(({ date, ...rest }) => ({ date: date.toISOString().substring(0, 10), ...rest }))
  const dialog = useRef<HTMLDialogElement>(null)

  const openHandler = () => {
    dialog.current?.showModal()
  }

  const cancelHandler = () => {
    dialog.current?.close()
  }

  const closeHandler = async () => {
    const amount = parseFloat(amountStr)
    if (isNaN(amount) || amount < 0) {
      alert('The amount value is invalid');
      return
    }
    const res = await fetch('/api/user/withdraw', {
      method: 'POST',
      mode: 'same-origin',
      credentials: 'same-origin',
      body: JSON.stringify({ address: userAddress, amount: amount }),
    })
    const text = await res.text()
    if (res.status !== 200) {
      alert('Failed to send MATIC');
      if (text !== '') { alert(JSON.parse(text).message); }
      return
    } else {
      alert('Successfully sent MATIC')
      dialog.current?.close()
      location.reload()
      return
    }
  }

  return (
    <>
      <div className="flex flex-col justify-center px-3">
        <p className="text-center text-red-700">※For demo purposes, a Solana Testnet account is required</p>
        <button
          className={buttonClass}
          onClick={addNetwork}>Add Solana Testnet to Wallet</button>
      </div>
      <h2 className="px-3 mt-3">{`Sleep Reward Earned: ${earnSum} SOL`}</h2>
      <div className="p-3">
        <div className="overflow-auto max-h-48 lg:w-7/12 md:w-9/12 sm:w-10/12 mx-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-white px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-700">
                  Date
                </th>
                <th className="text-white px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-700">
                  Detail
                </th>
                <th className="text-white px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {sleepTableData.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{row.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{row.detail}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{row.amount} MATIC</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <h2 className="px-3 mt-3">{`Withdrawn: ${withdrawSum} SOL`}</h2>
      <div className="p-3">
        <div className="overflow-auto max-h-48 lg:w-7/12 md:w-9/12 sm:w-10/12 mx-auto rounded-lg">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="text-white px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-700">
                  Date
                </th>
                <th className="text-white px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-700">
                  Detail
                </th>
                <th className="text-white px-4 py-3 text-left text-xs font-medium uppercase tracking-wider bg-gray-700">
                  Amount
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {withdrawTableData.map((row, index) => (
                <tr key={index}>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{row.date}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{row.detail}</td>
                  <td className="px-4 py-4 whitespace-nowrap text-sm text-black">{row.amount} MATIC</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
      <dialog className="bg-white p-5 rounded-lg shadow-lg text-center" ref={dialog}>
        <button onClick={cancelHandler} type="button"
          className="absolute top-0 right-0 mt-2 mr-2 bg-red-500 p-2 rounded-full font-bold text-white">
          X
        </button>
        <div className="mt-4">
          <p>Recipient Address</p>
          <div className="flex px-10">
            <input type="text" className="grow w-2/4 p-3 rounded-lg border" value={userAddress} onChange={(e) => setUserAddress(e.target.value)} placeholder="0x..." />
            <button className={buttonClass + ' shrink'} onClick={requestAccount}>
              👛
            </button>
          </div>
          <p>Amount</p>
          <div className="flex px-10">
            <input type="number" className="grow w-2/4 p-3 rounded-lg border" value={amountStr} onChange={(e) => setAmountStr(e.target.value)} />
          </div>
          <button onClick={closeHandler} type="button" className="bg-blue-500 p-3 rounded-full font-bold text-white mt-4 hover:bg-blue-700 transition duration-300">
            Receive
          </button>
        </div>
      </dialog>
      <div className="text-center m-3">
        <button type="button"
          className='bg-blue-500 p-3 rounded-full font-bold text-white hover:bg-blue-700 transition duration-300'
          onClick={openHandler}>
          Receive
        </button>
      </div>
    </>
  )
}

const Dialog_ = (props: Props) => (
  <MetaMaskProvider
    sdkOptions={{
      dappMetadata: {
        name: 'SleePIN',
        url: process.env.NEXT_PUBLIC_APP_URL,
      }
    }}
    >
      <Dialog {...props}></Dialog>
  </MetaMaskProvider>
)
export default Dialog_

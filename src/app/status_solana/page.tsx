import { logoutAndGoHome } from "@/lib/next-auth/auth";
import Token, { } from "./token";
import Image from "next/image"
import { bigint2Float, getRewardState } from "@/lib/reward/reward";


export default async function Page() {
    // const { records, balance } = await getRewardState();
    // const earnSum_ = records
    //   .filter(x => x.type === 'SLEEP')
    //   .map(x => x.amount)
    //   .reduce((a, b) => a + b, BigInt(0))
    // const withdrawSum_ = records
    //   .filter(x => x.type === 'WITHDRAW')
    //   .map(x => x.amount)
    //   .reduce((a, b) => a + b, BigInt(0))
    // const earnSum = bigint2Float(earnSum_)
    // const withdrawSum = bigint2Float(withdrawSum_)

    return (<>
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
          <div className="flex text-white">User.</div>
        </nav>
      </header>

      <h1 className="text-3xl text-center m-20 font-bold">My data</h1>

      <section className="CONTENTS_WRAP m-30 mx-auto max-w-3xl">
        <h3 className="mt-10 m-5 font-bold">"XHRO" Measurement data </h3>
        <hr/>
        <div className="C-data-list">
          <div className="flex justify-between font-bold m-5">
            <span className="basis-3/12">Date</span>
            <span className="basis-7/12 flex justify-between">
              <span className="basis-4/6">Data Info</span>
              <span className="basis-2/6">Amount</span>
            </span>
            <span className="basis-2/12 text-right">Reward</span>
          </div>


          <hr/>
          <div className="flex justify-between m-5">
            <span className="basis-3/12">2024-04-01</span>
            <span className="basis-7/12 flex justify-between">
              <details className="w-full">
                <summary className="flex justify-between">
                  <span className="basis-4/6">▼ {`4`} types of data</span>
                  <span className="basis-2/6">{`20h23m`}</span>
                </summary>
                <span className="flex justify-between mt-3">
                  <span className="basis-4/6">- EEG</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
                <span className="flex justify-between">
                  <span className="basis-4/6">- ECG</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
                <span className="flex justify-between">
                  <span className="basis-4/6">- Heart Rate</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
                <span className="flex justify-between">
                  <span className="basis-4/6">- Body temperature</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
              </details>
            </span>
            <span className="basis-2/12 text-right">{`0.001`} SOL</span>
          </div>


          <hr/>
          <div className="flex justify-between m-5">
            <span className="basis-3/12">2024-04-01</span>
            <span className="basis-7/12 flex justify-between">
              <details className="w-full">
                <summary className="flex justify-between">
                  <span className="basis-4/6">▼ {`4`} types of data</span>
                  <span className="basis-2/6">{`20h23m`}</span>
                </summary>
                <span className="flex justify-between mt-3">
                  <span className="basis-4/6">- EEG</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
                <span className="flex justify-between">
                  <span className="basis-4/6">- ECG</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
                <span className="flex justify-between">
                  <span className="basis-4/6">- Heart Rate</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
                <span className="flex justify-between">
                  <span className="basis-4/6">- Body temperature</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
              </details>
            </span>
            <span className="basis-2/12 text-right">{`0.001`} SOL</span>
          </div>


          <hr/>
          <div className="flex justify-between m-5">
            <span className="basis-3/12">2024-04-01</span>
            <span className="basis-7/12 flex justify-between">
              <details className="w-full">
                <summary className="flex justify-between">
                  <span className="basis-4/6">▼ {`4`} types of data</span>
                  <span className="basis-2/6">{`20h23m`}</span>
                </summary>
                <span className="flex justify-between mt-3">
                  <span className="basis-4/6">- EEG</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
                <span className="flex justify-between">
                  <span className="basis-4/6">- ECG</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
                <span className="flex justify-between">
                  <span className="basis-4/6">- Heart Rate</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
                <span className="flex justify-between">
                  <span className="basis-4/6">- Body temperature</span>
                  <span className="basis-2/6">{`1MB`}</span>
                </span>
              </details>
            </span>
            <span className="basis-2/12 text-right">{`0.001`} SOL</span>
          </div>


        </div>

        <hr/>
      </section>
      <section className="CONTENTS_WRAP mt-20 mx-auto max-w-3xl pb-20">
        <div className="flex justify-between font-bold p-5 bg-slate-400">
          <h3 className="font-bold">Total Rewards Earned</h3>
          <div className="text-center">{`Balance: 10 SOL`}</div>
            {/* <Token records={records} earnSum={earnSum} withdrawSum={withdrawSum} /> */}
        </div>
      </section>

    </>);
}

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
      <div className="m-5">
        <h3 className="text-center">{`Balance: 10 SOL`}</h3>
        {/* <Token records={records} earnSum={earnSum} withdrawSum={withdrawSum} /> */}
      </div>
    </>);
}

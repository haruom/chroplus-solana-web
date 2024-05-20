'use client'

import Image from "next/image";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { redirect } from "next/navigation";
import WorldIDVerification from "./utils/worldIdAuth";

export default function Home() {
  
  return (<>

    <header className="bg-black fixed lg:w-full">
      <nav className="mx-auto flex max-w-7xl items-center justify-between p-6 lg:px-8" aria-label="Global">
        <div className="flex">
          <Image
            className="relative dark:invert"
            src="/chro-plus_logo_wht.svg"
            alt="chro-plus Logo"
            width={90}
            height={27}
            priority
          />
        </div>
        <div className="flex">items</div>
      </nav>
    </header>

    <main className="flex min-h-screen flex-col items-center justify-between p-24">
      <div className="z-10 max-w-5xl w-full items-center justify-between font-mono text-sm lg:flex">
        <p className="fixed left-0 top-0 flex w-full justify-center border-b border-gray-300 bg-gradient-to-b from-zinc-200 pb-6 pt-8 backdrop-blur-2xl dark:border-neutral-800 dark:bg-zinc-800/30 dark:from-inherit lg:static lg:w-auto  lg:rounded-xl lg:border lg:bg-gray-200 lg:p-4 lg:dark:bg-zinc-800/30">
          DEMO version&nbsp;
          <code className="font-mono font-bold">0.2.3</code>
        </p>
      </div>

      <div className="relative flex place-items-center">
        <Image
          className="relative dark:invert"
          src="/chro-plus_logo_blk.svg"
          alt="chro-plus Logo"
          width={708}
          height={212}
          priority
        />
      </div>

      <div className="mb-32 grid text-center lg:max-w-5xl lg:w-full lg:mb-0 lg:grid-cols-4 lg:text-left">
      <WorldIDVerification /> 
        {/* <Link href="/status_solana" 
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            login{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            login with World Id as user.
          </p>
        </Link> */}

        <Link href="/lab/search" 
          className="group rounded-lg border border-transparent px-5 py-4 transition-colors hover:border-gray-300 hover:bg-gray-100 hover:dark:border-neutral-700 hover:dark:bg-neutral-800/30"
          rel="noopener noreferrer"
        >
          <h2 className={`mb-3 text-2xl font-semibold`}>
            login{" "}
            <span className="inline-block transition-transform group-hover:translate-x-1 motion-reduce:transform-none">
              -&gt;
            </span>
          </h2>
          <p className={`m-0 max-w-[30ch] text-sm opacity-50`}>
            login as lab.
          </p>
        </Link>
      </div>
    </main>
  </>);
}

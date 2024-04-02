'use client'

import { auth } from "@/lib/next-auth/auth";
import { signIn, useSession } from "next-auth/react";
import Link from "next/link";

export function SignInButton() {
  const { status } = useSession();

  const className = 'bg-blue-500 p-3 rounded-full font-bold text-white';

  if (status == 'authenticated') {
    return (
      <Link href="/status" className={className}>
        マイページ
      </Link>
    );
  }

  return (
    <button onClick={() => { signIn('oura'); }} className={className}>
        利用する&nbsp;
        <span aria-hidden="true">&rarr;</span>
    </button>
  );
}

import { ethers } from 'ethers';
import { getRewardState, matic2Finney } from "@/lib/reward/reward";
import { PrismaClient } from '@prisma/client';
import { getUserId } from '@/lib/next-auth/auth';
import { NextResponse } from 'next/server';

export async function POST(req: Request) {
  const params = await req.json()
  const address: string | null = params?.address
  const amount: number | null = params?.amount

  if (!address || !amount) {
    return mkResponse({ message: 'not enough params' }, { status: 400 });
  }
  if (typeof amount !== 'number' || isNaN(amount) || amount <= 0) {
    return mkResponse({ message: 'The amount value is invalid' }, { status: 400 });
  }

  const { balance } = await getRewardState()
  if (balance < amount) {
    return mkResponse({ message: 'The amount exceeds the balance' }, { status: 400 });
  }
  if (amount > 0.01) {
    return mkResponse({ message: 'For the demo, the maximum amount is 0.01 MATIC' }, { status: 400 });
  }

  const provider = new ethers.JsonRpcProvider(process.env.NEXT_PUBLIC_POLYGON_RPC_URL)
  const privateKey = process.env.POLYGON_PRIVATE_KEY as string
  const wallet = new ethers.Wallet(privateKey, provider)

  try {
    const tx = await wallet.sendTransaction({
      from: wallet.address,
      to: address,
      value: ethers.parseEther(amount.toString()),
    })

    // await tx.wait()
    console.log(`txHash: ${tx.hash}`)

    const prisma = new PrismaClient()
    const userId = await getUserId();
    await prisma.record.create({
      data: {
        userId, type: 'WITHDRAW',
        amount: -1 * matic2Finney(amount),
      }
    })
    await prisma.$disconnect()
  } catch (e) {
    console.error(e);
    return mkResponse({ message: 'Failed to send MATIC' }, { status: 500 })
  }

  return mkResponse({ message: `Sent ${amount} MATIC` })
}

/**
 * As a workaround because sometimes Response.json cannot be used due to a bug in Next.js
 */
function mkResponse(body: any, option?: any) {
  return new NextResponse(JSON.stringify(body), option)
}

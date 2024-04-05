import { sleep } from "@/lib/oura/client";
import { calcAmount } from "@/lib/reward/reward";
import { store } from "@/lib/symbol/store";
import { PrismaClient } from "@prisma/client";
import { NextResponse } from "next/server";
  
  export async function POST(request: Request) {
    const api = await request.json()
    const accountId = api.accountId
    const dateStr = api.dateStr
    if (!accountId) {
      return  Response.json({ result: 'not enough accountID' }, { status: 400 });
    }else if(!dateStr){
        return Response.json({ result: 'not enough dateStr' }, { status: 400 });
    }
    const prisma = new PrismaClient();
    const account = await prisma.account.findFirst({
      where: { providerAccountId: accountId, provider: 'oura' }
    })
    if (!account) {
      return Response.json({ result: 'Oura account not found' }, { status: 500 });
    }
    const userId = account.userId;
    console.log('userId', userId)
    const [year, month_, date] = dateStr.split('-').map(x => parseInt(x))
    const month = month_ - 1
    const targetDate = new Date(Date.UTC(year, month, date));
    const startDate = new Date(targetDate);
    startDate.setDate(targetDate.getDate() - 1);
    const endDate = new Date(targetDate);
    endDate.setDate(targetDate.getDate() + 1);
    const sleepData = await sleep(startDate, endDate, accountId)
    if(!sleepData){
        return Response.json({ result: 'sleepData not found' }, { status: 400 });
    }
    return Response.json({ result: sleepData }, { status: 200 });
    const sleepDataFilter = sleepData.data.filter(x => x.day === dateStr)
    if(sleepDataFilter.length === 0) {
        return Response.json({ result: `${dateStr} 分の睡眠データが存在しません` }, { status: 400 });
    }
    return Response.json({ result: 'sleepData found' }, { status: 200 });


  const sd = await prisma.encryptedSleepData.findFirst({
    where: {
      userId,
      date: targetDate
    }
  })
  if(!sd){
    return Response.json({ result: 'encryptedSleepData not found' }, { status: 400 });
  }else{
    return Response.json({ result: 'encryptedSleepData already saved' }, { status: 200 });
  }

  if (sd) {
    return Response.json({ result: 'already saved' },{status: 200})
  }

  const dataStr = JSON.stringify(sleepData);
  return Response.json({ result: dataStr },{status: 200})
  try {
    const { aggregateTransactionHash, keyStr, ivStr } = await store(dataStr);
    await prisma.encryptedSleepData.create({
      data: {
        userId, date: targetDate, keyStr, ivStr,
        transactionHash: aggregateTransactionHash,
      }, 
    })

    const { sleepDuration, amount } = calcAmount(sleepData);
    await prisma.record.create({
      data: {
        userId, type: 'SLEEP',
        sleepDate: targetDate.toISOString(), sleepDuration, amount
      }
    })
  } catch {
    return Response.json({ result: 'Symbol へのデータ保存に失敗しました' }, { status: 500 });
  }

//   await prisma.$disconnect()
//   return Response.json({ result: `${dateStr}分の睡眠データを保存しました` })  

  }
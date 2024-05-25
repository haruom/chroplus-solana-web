import { NextResponse } from "next/server";
import admin from '../../utils/firestore';

export async function GET(request:Request) {
    const db = admin.firestore();
    try {
        const data: any= [];
        const snapshot = await admin.firestore().collection('rewards').get();
        snapshot.forEach((doc) => {
          const docData = doc.data();
          const createdAt = docData.createdAt?._seconds
            ? new Date(docData.createdAt._seconds * 1000).toLocaleDateString("ja-JP")
            : "Unknown Date";
            const seconds = docData.seconds != null && !isNaN(docData.seconds)
            ? docData.seconds
            : (docData.measuredTime != null && !isNaN(docData.measuredTime)
              ? docData.measuredTime
              : "Unknown");
          
          data.push({
            id: doc.id,
            createdAt,
            price: docData.price,
            seconds: seconds,
            uid: docData.uid,
          });
        });
          
        return mkResponse(data,{status:200});
    } catch (error) {
        console.error('Error fetching data:', error);
        return mkResponse({ error: 'Internal Server Error' },{status:500});
    }
}

function mkResponse(body: any, option?: any) {
    return new NextResponse(JSON.stringify(body), option)
  }
  
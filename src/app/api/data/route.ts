import { NextResponse } from "next/server";
import admin from '../../utils/firestore';

export async function GET(request:Request) {
    const db = admin.firestore();
    try {
        const snapshot = await db.collection('rewards').get();
        const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));
        return mkResponse(data,{status:200});
    } catch (error) {
        console.error('Error fetching data:', error);
        return mkResponse({ error: 'Internal Server Error' },{status:500});
    }
}

function mkResponse(body: any, option?: any) {
    return new NextResponse(JSON.stringify(body), option)
  }
  
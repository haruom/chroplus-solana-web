import { NextResponse } from "next/server";
import admin from '../../utils/firestore';

const BUCKETNAME = 'chro-plus.appspot.com';
const FILENAME = 'xhro-data/0698AYxvd2ccyCScLSv9.csv';

export async function GET(request:Request) {
    try{
    const storage = admin.storage();
    const bucket = storage.bucket(BUCKETNAME);
    const file = bucket.file(FILENAME);
    const url = await file.getSignedUrl({
        action: 'read',
        expires: Date.now() + 1000 * 60 * 5, // 5 minutes
    });
    return mkResponse({ csvUrl: url[0] },{status:200});
    } catch (error) {
        return mkResponse({ error: 'Internal Server Error' },{status:500});
    }
}

function mkResponse(body: any, option?: any) {
    return new NextResponse(JSON.stringify(body), option)
}

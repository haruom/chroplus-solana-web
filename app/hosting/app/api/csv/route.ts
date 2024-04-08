import { NextResponse } from "next/server";
import admin from '../../utils/firestore';
import axios from "axios";

const BUCKETNAME = 'chro-plus.appspot.com';

export async function GET(request:Request) {
    try{
        const queryURL = new URL(request.url);
        // metadataの取得
        const metadataURL = queryURL.searchParams.get('url');
        console.log(metadataURL);
        const metadataResponse = await axios.get(metadataURL!);
        console.log(metadataResponse.data);
        // XHROデータにアクセスするための情報取得
        const dataAccessURL = metadataResponse.data.properties.files[0].uri;
        const dataAccessResponse = await axios.get(dataAccessURL);
        console.log(dataAccessResponse.data);
        const fileId = dataAccessResponse.data.id;
        const filePath = `xhro-data/${fileId}.csv`;

        const storage = admin.storage();
        const bucket = storage.bucket(BUCKETNAME);
        const file = bucket.file(filePath);
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

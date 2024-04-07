// // src/app/firestore/route.tsx (Though typically, this should be a .ts file if it's not a React component)

// import type { NextApiRequest, NextApiResponse } from 'next';
// const { cert } = require('firebase-admin/app');
// const { getFirestore } = require('firebase-admin/firestore');
// const serviceAccount = require('../../../../nextjs-project-75393-firebase-adminsdk.json'); // 秘密鍵を取得
// const admin = require('firebase-admin');

// export default async function handler(
//   req: NextApiRequest,
//   res: NextApiResponse,
//  ) {
//   const COLLECTION_NAME = 'users';
//   //　初期化する
//   if (admin.apps.length === 0) {
//     admin.initializeApp({
//       credential: cert(serviceAccount),
//     });
//   }

// const db = getFirestore();
// const targetDoc = 'ahkYoeUkkmaM6fIBId5I'; //書き換える
// if (req.method === 'POST') {
//   const docRef = db.collection(COLLECTION_NAME).doc();
//   const insertData = { name: 'Nakata' };
//   await docRef.set(insertData); // Ensure this is awaited
//   res.status(201).json({ message: 'Document created' });
// } else if (req.method === 'PATCH') {
//   const docRef = db.collection(COLLECTION_NAME).doc(targetDoc);
//   const updateData = { name: 'KM' };
//   await docRef.set(updateData); // Use update instead of set for partial updates
//   res.status(200).json({ message: 'Document updated' });
// } else if (req.method === 'GET') {
//   const doc = await db.collection(COLLECTION_NAME).doc(targetDoc).get();
//   if (!doc.exists) {
//     res.status(404).json({ message: 'Document not found' });
//   } else {
//     res.status(200).json(doc.data());
//   }
// }else if (req.method === 'DELETE') {
//   const doc = await db.collection(COLLECTION_NAME).doc(targetDoc).delete();
// } else {
//   res.setHeader('Allow', ['POST', 'PATCH', 'GET']);
//   res.status(405).end(`Method ${req.method} Not Allowed`);
// }

// res.status(200);
// }

// pages/api/data.js

// import admin from '../../utils/firestore'; // Adjust the import path as necessary

// export default async function handler(req: any, res: any) {
//     const db = admin.firestore();

//     try {
//         const snapshot = await db.collection('rewords').get();
//         const data = snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }));

//         res.status(200).json(data);
//     } catch (error) {
//         console.error('Error fetching data:', error);
//         res.status(500).json({ error: 'Internal Server Error' });
//     }
// }


import { NextApiRequest, NextApiResponse } from 'next';

export const get = async (req: NextApiRequest, res: NextApiResponse) => {
  // Example response
  res.json({ message: 'Hello from GET /api/data' });
};
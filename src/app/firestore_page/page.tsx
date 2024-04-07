'use client'
import axios from 'axios';

export default function Page() {
  const insertUser = async () => {
    try{
    await axios.post('/api/firestore');
    }catch(e){
      console.log(e);
    }
  };
  const updateUser = async () => {
    await axios.patch('/api/firestore');
  };
  const getUser = async () => {
    try{
      await axios.get('/api/firestore');
    }catch(e){
      console.log(e);
    }
  };
  const deleteUser = async () => {
    await axios.delete('/api/firestore');
  };

  return (
    <div className="flex min-h-screen flex-col items-center justify-center py-2">
      <button
        className="mt-4 w-60 rounded-full bg-green-500 py-2 px-4 font-bold text-white hover:bg-green-700"
        onClick={() => insertUser()}>
        Insert User
      </button>
      <button
        className="mt-4 w-60 rounded-full bg-yellow-500 py-2 px-4 font-bold text-white hover:bg-yellow-700"
        onClick={() => updateUser()}>
        Update User
      </button>
      <button
        className="mt-4 w-60 rounded-full bg-blue-500 py-2 px-4 font-bold text-white hover:bg-blue-700"
        onClick={() => getUser()}>
        Get User
      </button>
      <button
        className="mt-4 w-60 rounded-full bg-red-500 py-2 px-4 font-bold text-white hover:bg-red-700"
        onClick={() => deleteUser()}>
        Delete User
      </button>
    </div>
  );
};









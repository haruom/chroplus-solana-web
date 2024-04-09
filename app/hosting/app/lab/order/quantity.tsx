'use client'
import { useSearchParams } from 'next/navigation'
 
export default function Quantity() {
  const searchParams = useSearchParams()
 
  const search = searchParams.get('quantity')
 
  // This will not be logged on the server when using static rendering
  console.log(search)
 
  return <>
  <span className="mx-3">{search}</span>
  </>
}
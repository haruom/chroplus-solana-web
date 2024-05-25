'use client';
import { useSearchParams } from 'next/navigation';

const getAmount = () => {
  const searchParams = useSearchParams();
  const amountWithUnit = searchParams.get('amount');
  let amountFloat = 0;
  if (amountWithUnit) {
    let amountWithoutUnit = amountWithUnit.replace('SOL', '');
    let amountFixed = parseFloat(amountWithoutUnit);
    amountFloat = amountFixed;
  }
  return amountFloat;
};

export default getAmount;

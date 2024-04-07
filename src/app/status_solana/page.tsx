import Image from "next/image"




export default async function Page() {
    // const { records, balance } = await getRewardState();
    // const earnSum_ = records
    //   .filter(x => x.type === 'SLEEP')
    //   .map(x => x.amount)
    //   .reduce((a, b) => a + b, BigInt(0))
    // const withdrawSum_ = records
    //   .filter(x => x.type === 'WITHDRAW')
    //   .map(x => x.amount)
    //   .reduce((a, b) => a + b, BigInt(0))
    // const earnSum = bigint2Float(earnSum_)
    // const withdrawSum = bigint2Float(withdrawSum_)

    return (<>
      <Image src="/SleepinWhite.svg" alt="sleepin white" className="m-5" width={100} height={100} />
      <h3 className="text-center">{`Balance: 10 SOL`}</h3>
      {/* <Token records={records} earnSum={earnSum} withdrawSum={withdrawSum} /> */}

    </>);
}

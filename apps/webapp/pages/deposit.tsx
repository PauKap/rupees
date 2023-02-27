import Head from "next/head";

import { DepositForm } from "@components";

const Deposit = () => {
  return (
    <>
      <Head>
        <title>Deposit Rupees</title>
        <meta name="description" content="Generated by create next app" />
        <meta name="viewport" content="width=device-width, initial-scale=1" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <DepositForm />
    </>
  );
};

export default Deposit;

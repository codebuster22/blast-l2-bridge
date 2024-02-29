import type { NextPage } from "next";
import Head from "next/head";
import BridgeForm from "../components/BridgeForm";
import Header from "../components/Header";

const Home: NextPage = () => {
  return (
    <div>
      <Head>
        <title>ETH to BLAST L2 bridge</title>
        <meta
          content="Want to transfer your eth tokens to Blast L2 chain, We can help you."
          name="description"
        />
        <link href="/favicon.ico" rel="icon" />
      </Head>

      <main>
        <Header />
        <BridgeForm />
        <p className="text-ui-white text-center py-4 ">
          Made with ❤️ by{"  "}
          <a
            href="https://x.com/0xmihir"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ui-highlight inline"
          >
            0xmihir{" "}
          </a>
          &{" "}
          <a
            href="https://www.cryptolancer.in/"
            target="_blank"
            rel="noopener noreferrer"
            className="text-ui-highlight inline"
          >
            Kritik Sah (dheet.eth)
          </a>
        </p>
      </main>
    </div>
  );
};

export default Home;

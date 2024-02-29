import { ConnectButton } from "@rainbow-me/rainbowkit";
import React, { useEffect, useState } from "react";
import { FaCopy } from "react-icons/fa6";
import { toast } from "react-toastify";
import { parseEther } from "viem";
import {
  useAccount,
  useBalance,
  usePrepareSendTransaction,
  useSendTransaction,
} from "wagmi";
import { copyToClipboard } from "../utils/copyToClipboard";
import { shortenEthAddress } from "../utils/shortAddress";
import Modal from "./Modal";

const BridgeForm = () => {
  const { address, isConnecting, isDisconnected } = useAccount();
  const [isModalOpen, setisModalOpen] = useState(false);
  const { data: balanceData } = useBalance({
    address,
  });
  const [amount, setAmount] = useState("");
  const [weiAmount, setWeiAmount] = useState(0);

  const { config } = usePrepareSendTransaction({
    to: process?.env?.NEXT_PUBLIC_CONTRACT_ADDRESS
      ? process?.env?.NEXT_PUBLIC_CONTRACT_ADDRESS
      : address,
    value: parseEther(amount),
  });

  const {
    data: transactionData,
    isLoading: transactionLoading,
    isSuccess: transactionSuccessFull,
    isError: transactinFailed,
    sendTransaction,
  } = useSendTransaction(config);

  const handleAmountChange = (event: any) => {
    const inputValue = event.target.value;
    let wei = Number(inputValue) * 10 ** 18;

    // Check if the input is a valid number using regex
    if (
      (/^\d*\.?\d*$/.test(inputValue) || inputValue === "") &&
      wei <= Number(balanceData?.value)
    ) {
      setAmount(inputValue);
      setWeiAmount(wei);
    }
  };

  const handleSendClick = () => {
    // Add your logic for handling the "Send" button click
    setisModalOpen(true);
  };

  const handleSendTransaction = () => {
    onModalClose();
    if (weiAmount <= Number(balanceData?.value)) {
      sendTransaction && sendTransaction();
    }
  };
  const onModalClose = () => {
    setisModalOpen(false);
  };
  const handlePercenClick = (percent: number) => {
    const wei = (percent / 100) * Number(balanceData?.value);
    const amount = String(wei / 10 ** 18);
    setAmount(amount);
    setWeiAmount(wei);
  };

  useEffect(() => {
    if (transactionSuccessFull) {
      toast.success("Bridging successful");
    }
    if (transactinFailed) {
      toast.error("Bridging failed");
    }
  }, [transactionSuccessFull, transactinFailed]);

  useEffect(() => {
    const data = {
      address: address,
      amount: Number(amount),
      hash: transactionData
        ? `https://etherscan.io/tx/${transactionData?.hash}`
        : "",
    };
    if (transactionData) {
      fetch(`${process.env.NEXT_PUBLIC_API_URL}/record`, {
        method: "POST",
        body: JSON.stringify(data),
      });
    }
    console.log(data);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [transactionData]);

  console.log("transactionData:", transactionData);

  return (
    <div className="flex items-center justify-center flex-grow flex-shrink-0 min-h-[75vh] p-4">
      <div className="bg-ui-stroke/50 border border-ui-white/30 p-5 rounded-xl bg-opacity-70 backdrop-filter backdrop-blur-lg">
        {isConnecting ? (
          <div className="text-ui-highlight">Connecting...</div>
        ) : isDisconnected ? (
          <div className="space-y-4">
            <div className="">
              <h3 className="text-ui-white">Welcome</h3>
              <p className="text-ui-white/60">
                Connect to your wallet to get started.
              </p>
            </div>
            <div className="flex items-center justify-center">
              <ConnectButton />
            </div>
          </div>
        ) : address ? (
          <div className="space-y-4">
            <div className="border border-ui-white p-2 rounded-xl">
              <div className="border-b border-dashed border-ui-highlight py-3">
                <input
                  className="outline-none bg-transparent text-ui-white caret-ui-highlight md:min-w-[250px] lg:min-w-[340px]"
                  type="number"
                  placeholder="Enter the $ETH amount"
                  value={amount}
                  onChange={handleAmountChange}
                />
              </div>
              <div className="flex items-center justify-start gap-2 pt-3 pb-2">
                <button
                  onClick={handlePercenClick.bind(null, 10)}
                  className="px-2 bg-ui-white text-ui-dark rounded"
                >
                  10%
                </button>
                <button
                  onClick={handlePercenClick.bind(null, 50)}
                  className="px-2 bg-ui-white text-ui-dark rounded"
                >
                  50%
                </button>
                <button
                  onClick={handlePercenClick.bind(null, 70)}
                  className="px-2 bg-ui-white text-ui-dark rounded"
                >
                  70%
                </button>
                <button
                  onClick={handlePercenClick.bind(null, 100)}
                  className="px-2 bg-ui-white text-ui-dark rounded"
                >
                  MAX
                </button>
              </div>
            </div>
            <div className="flex flex-col items-start justify-between gap-2 text-ui-white">
              <p>
                Current Balance:{" "}
                <span className="text-ui-highlight">
                  {Number(balanceData?.formatted)?.toFixed(4)}
                  {` $${balanceData?.symbol}`}
                </span>
              </p>
              {process?.env?.NEXT_PUBLIC_CONTRACT_ADDRESS && (
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 mt-2">
                  <p className="flex items-center justify-start gap-2">
                    Sending to :
                    <span
                      onClick={copyToClipboard.bind(
                        null,
                        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
                        () => {
                          toast.success("Copied!");
                        }
                      )}
                      className="text-ui-highlight"
                    >
                      {shortenEthAddress(
                        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS
                      )}
                    </span>
                    <FaCopy
                      onClick={copyToClipboard.bind(
                        null,
                        process.env.NEXT_PUBLIC_CONTRACT_ADDRESS,
                        () => {
                          toast.success("Copied!");
                        }
                      )}
                      className="text-ui-highlight"
                    />
                  </p>
                </div>
              )}
            </div>
            <button
              className={`bg-ui-highlight text-ui-dark font-bold uppercase p-3 w-full flex items-center justify-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed`}
              onClick={handleSendClick}
              disabled={weiAmount < 1 || transactionLoading}
            >
              {transactionLoading ? "Bridging..." : "Bridge to blast l2"}
            </button>
            <Modal isOpen={isModalOpen} onClose={onModalClose}>
              <div className="max-w-2xl mx-auto">
                <p className="text-red-400">
                  You are about to bridge funds to network mentioned below.
                  DYOR, Blast haven’t annouced mainnet officially yet.
                </p>
                <div className="border border-ui-stroke overflow-x-scroll my-4">
                  <table className="">
                    <tbody>
                      <tr>
                        <td className="font-medium px-4 py-2 border border-ui-stroke">
                          Name
                        </td>
                        <td className="px-4 py-2 border border-ui-stroke">
                          Blast L2 Mainnet
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium px-4 py-2 border border-ui-stroke">
                          RPC
                        </td>
                        <td className="px-4 py-2 border border-ui-stroke">
                          <p
                            onClick={copyToClipboard.bind(
                              null,
                              "https://blast.blockpi.network/v1/rpc/public",
                              () => {
                                toast.success("Copied!");
                              }
                            )}
                            className="text-wrap break-words"
                          >
                            https://blast.blockpi.network/v1/rpc/public
                          </p>
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium px-4 py-2 border border-ui-stroke">
                          Network ID
                        </td>
                        <td className="px-4 py-2 border border-ui-stroke">
                          81457
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium px-4 py-2 border border-ui-stroke">
                          Scanner
                        </td>
                        <td className="px-4 py-2 border border-ui-stroke">
                          https://81547.routescan.io
                        </td>
                      </tr>
                      <tr>
                        <td className="font-medium px-4 py-2 border border-ui-stroke">
                          Currency
                        </td>
                        <td className="px-4 py-2 border border-ui-stroke">
                          ETH
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
                <button
                  className={`bg-ui-highlight text-ui-dark font-bold uppercase p-3 w-full flex items-center justify-center rounded-xl disabled:opacity-50 disabled:cursor-not-allowed`}
                  onClick={handleSendTransaction}
                  disabled={weiAmount < 1 || transactionLoading}
                >
                  I understand
                </button>
              </div>
            </Modal>
          </div>
        ) : (
          <div className="text-ui-highlight">Something went wrong!!!</div>
        )}
      </div>
    </div>
  );
};

export default BridgeForm;

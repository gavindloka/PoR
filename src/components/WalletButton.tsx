import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { LuPlug } from 'react-icons/lu';
import { IoArrowForward } from 'react-icons/io5';

export function censorAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const WalletButton = () => {
  const [publicAdress, setPublicAdress] = useState<string>('');

  useEffect(() => {
    // @ts-ignore
    if (!window?.ic?.plug.agent) {
      setPublicAdress('');
    } else {
      (async () => {
        // @ts-ignore
        const address = await window?.ic?.plug.agent?.getPrincipal();
        setPublicAdress(address.toString());
      })();
    }

    //@ts-ignore
  }, [window?.ic?.plug.agent]);

  return (
    <>
      {
        // @ts-ignore
        window?.ic?.plug.agent ? (
          <Button
            className="h-9 rounded-lg bg-purple-700 hover:bg-purple-800 pr-7 pl-5 transition-all duration-500 flex gap-3 hover:gap-5 hover:pl-3 items-center"
            // @ts-ignore
            onClick={() => window?.ic?.plug.requestDisconnect()}
          >
            <LuPlug />
            <p>{censorAddress(publicAdress)}</p>
          </Button>
        ) : (
          <Button
            className="h-9 rounded-lg bg-purple-700 hover:bg-purple-800 pl-7 pr-5  transition-all duration-500 flex gap-3 hover:gap-5 hover:pr-3 items-center"
            // @ts-ignore
            onClick={() => window?.ic?.plug.requestConnect()}
          >
            <p>Connect Wallet</p>
            <IoArrowForward className="transition-all duration-300 text-base" />
          </Button>
        )
      }
    </>
  );
};

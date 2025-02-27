import React, { useEffect, useState } from 'react';
import { Button } from './ui/button';
import { LuPlug } from 'react-icons/lu';

export function censorAddress(address: string) {
  return `${address.slice(0, 6)}...${address.slice(-4)}`;
}

export const WalletButton = () => {
  const [publicAddress, setPublicAddress] = useState<string | null>(null);

  const checkPlugConnection = async () => {
    // @ts-ignore
    if (window.ic?.plug?.isConnected) {
      try {
        // @ts-ignore
        const principal = await window.ic.plug.agent.getPrincipal();
        setPublicAddress(principal.toString());
      } catch (error) {
        console.error('Failed to get principal:', error);
      }
    } else {
      setPublicAddress(null);
    }
  };

  useEffect(() => {
    checkPlugConnection();
  }, []);

  const connectPlug = async () => {
    try {
      // @ts-ignore
      await window.ic.plug.requestConnect();
      await checkPlugConnection(); // Ensure we update state after connecting
    } catch (error) {
      console.error('Plug connection failed:', error);
    }
  };

  const disconnectPlug = async () => {
    try {
      // @ts-ignore
      await window.ic.plug.requestDisconnect();
    } catch (error) {
      console.error('Failed to disconnect:', error);
    } finally {
      window.location.reload(); // Ensure page refresh happens no matter what
    }
  };

  return (
    <>
      {publicAddress ? (
        <Button
          className="h-9 rounded-lg bg-purple-700 hover:bg-purple-800 pr-7 pl-5 transition-all duration-500 flex gap-3 hover:gap-5 hover:pl-3 items-center"
          onClick={disconnectPlug}
        >
          <LuPlug />
          <p>{censorAddress(publicAddress)}</p>
        </Button>
      ) : (
        <Button
          className="h-9 rounded-lg bg-purple-700 hover:bg-purple-800 pl-7 pr-5 transition-all duration-300 flex gap-3 items-center"
          onClick={connectPlug}
        >
          <p>Connect Wallet</p>
          <LuPlug className="transition-all duration-200 text-base" />
        </Button>
      )}
    </>
  );
};

import { useQueryCall, useUserPrincipal } from '@ic-reactor/react';
import { icp_ledger_canister } from '@/declarations/icp_ledger_canister';
import { Principal } from '@ic-reactor/react/dist/types';
import icpLogo from '../assets/internet-computer-icp-logo.png';
import { RefreshCw } from 'lucide-react';
import { Button } from './ui/button';
import { motion } from 'framer-motion';

export type ICPLedger = typeof icp_ledger_canister;
export const Balance = () => {
  const principal = useUserPrincipal() as Principal;

  const { call, data, loading, error } = useQueryCall<
    ICPLedger,
    'icrc1_balance_of'
  >({
    functionName: 'icrc1_balance_of',
    canisterId: 'ryjl3-tyaaa-aaaaa-aaaba-cai',
    args: [{ owner: principal, subaccount: [] }],
  });
  const balance = data
    ? JSON.stringify(data, (_, v) => (typeof v === 'bigint' ? v.toString() : v))
    : '0';
  return (
    <div className="flex items-center justify-center">
      <Button
        onClick={call}
        disabled={loading}
        className="flex items-center gap-2 px-2 py-1 text-white bg-purple-700 rounded-lg shadow-md hover:bg-purple-800 transition-all 
        focus:outline-none focus:ring-4 focus:ring-purple-300 disabled:opacity-50 disabled:cursor-not-allowed"
      >
        <img src={icpLogo} alt="ICP" className="w-5 h-5" />
        <span className="font-semibold">
          Balance: {loading ? '0 ICP' : `${balance} ICP`}
        </span>
        <motion.div
          animate={loading ? { rotate: 360 } : { rotate: 0 }}
          transition={
            loading ? { repeat: Infinity, duration: 1, ease: 'linear' } : {}
          }
        >
          <RefreshCw className="h-4 w-4" />
        </motion.div>
      </Button>
    </div>
  );
};

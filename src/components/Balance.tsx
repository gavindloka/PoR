import { useQueryCall, useUserPrincipal } from '@ic-reactor/react';
import { icp_ledger_canister } from '@/declarations/icp_ledger_canister';
import { Principal } from '@ic-reactor/react/dist/types';
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

  return (
    <div>
      <h2>ICP Balance:</h2>
      <div>
        Loading: {loading}
        <br />
        Error: {error?.toString()}
        <br />
        balance:{' '}
        {data !== undefined
          ? JSON.stringify(data, (_, v) =>
              typeof v === 'bigint' ? v.toString() : v,
            )
          : null}
      </div>
      <button onClick={call}>Get Balance</button>
    </div>
  );
};

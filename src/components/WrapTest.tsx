import { ActorProvider, CandidAdapterProvider } from '@ic-reactor/react';
import React from 'react';

type Props = {};
import { idlFactory } from '@/declarations/icp_ledger_canister';
import TestPage from '@/pages/TestPage';
export const WrapTest = (props: Props) => {
  return (
    <div>
      <CandidAdapterProvider>
        <ActorProvider
          canisterId={'ryjl3-tyaaa-aaaaa-aaaba-cai'}
          idlFactory={idlFactory}
          loadingComponent={<div>Loading Icp Ledger...</div>}
        >
          <TestPage />
        </ActorProvider>
      </CandidAdapterProvider>
    </div>
  );
};

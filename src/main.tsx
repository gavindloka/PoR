import {
  ActorProvider,
  AgentProvider,
  CandidAdapterProvider,
} from '@ic-reactor/react';
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import { canisterId, idlFactory } from './declarations/backend';
import { idlFactory as idl2 } from './declarations/icp_ledger_canister';
import './index.scss';
import { RouterProvider } from 'react-router';
import { router } from './routes/Routes';

ReactDOM.createRoot(document.getElementById('root') as HTMLElement).render(
  <React.StrictMode>
    <AgentProvider withProcessEnv>
      <ActorProvider idlFactory={idlFactory} canisterId={canisterId}>
        <CandidAdapterProvider>
          <ActorProvider
            canisterId={'ryjl3-tyaaa-aaaaa-aaaba-cai'}
            idlFactory={idl2}
            loadingComponent={<div>Loading Icp Ledger...</div>}
          >
            <RouterProvider router={router} />
          </ActorProvider>
        </CandidAdapterProvider>
      </ActorProvider>
    </AgentProvider>
  </React.StrictMode>,
);

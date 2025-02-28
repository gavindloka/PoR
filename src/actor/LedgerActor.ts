import { createReactor } from '@ic-reactor/react';
import {
  icp_ledger_canister,
  canisterId,
  idlFactory,
} from '@/declarations/icp_ledger_canister';

export type ICP_LEDGER_CANISTER = typeof icp_ledger_canister;

export const { useActorStore, useAuth, useQueryCall } =
  createReactor<ICP_LEDGER_CANISTER>({
    canisterId,
    idlFactory,
    host: 'https://localhost:4943',
  });

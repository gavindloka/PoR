dfx identity new minter
dfx identity use minter
export MINTER_ACCOUNT_ID=$(dfx ledger account-id)

dfx identity use default
export DEFAULT_ACCOUNT_ID=$(dfx ledger account-id)

dfx deploy --specified-id ryjl3-tyaaa-aaaaa-aaaba-cai icp_ledger_canister --argument "(variant {Init = record { minting_account = \"$MINTER_ACCOUNT_ID\"; initial_values = vec { record { \"$DEFAULT_ACCOUNT_ID\"; record { e8s = 100_000_000_000 : nat64;};};};send_whitelist = vec {};transfer_fee = opt record {e8s = 10_000 : nat64;};token_symbol = opt \"LICP\";token_name = opt \"Local ICP\";}})"

dfx canister create icp_ledger_canister_backend --specified-id avqkn-guaaa-aaaaa-qaaea-cai

dfx canister call icp_ledger_canister icrc1_transfer "(record {to=record {owner=principal \"avqkn-guaaa-aaaaa-qaaea-cai\"; subaccount=null}; fee=opt 10000; memo=null; from_subaccount=null; created_at_time=null; amount=50_000_000_000})"
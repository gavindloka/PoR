import {
  ActorProvider,
  CandidAdapterProvider,
  useAuth,
} from '@ic-reactor/react';
import React, { useEffect, useState } from 'react';
import { Link } from 'react-router';
import { Button } from './ui/button';
import { WalletButton } from './WalletButton';
import { Balance } from './Balance';
import { idlFactory } from '@/declarations/icp_ledger_canister';

type Props = {};

export const Navbar = (props: Props) => {
  const { login, logout, authenticated, identity, loginError } = useAuth({
    onLoginSuccess: (principal) => console.log(`Logged in as ${principal}`),
    onLoginError: (error) => console.error(`Login failed: ${error}`),
  });

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);

  useEffect(() => {
    const controlNavbar = () => {
      const currentScrollY = window.scrollY;

      if (currentScrollY < lastScrollY || currentScrollY < 10) {
        setIsVisible(true);
      } else if (currentScrollY > lastScrollY) {
        setIsVisible(false);
      }

      setLastScrollY(currentScrollY);
    };

    window.addEventListener('scroll', controlNavbar);

    return () => {
      window.removeEventListener('scroll', controlNavbar);
    };
  }, [lastScrollY]);
  console.log(identity?.getPrincipal().toText());

  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${
        isVisible ? 'translate-y-0' : '-translate-y-full'
      }`}
    >
      <div className="bg-white mx-4 md:mx-20 flex justify-between items-center py-3 px-10 font-satoshi mt-3 rounded-xl border-gray-100 border shadow-lg">
        <div className="flex gap-4 items-center">
          <Link
            to="/"
            className="font-bold text-xl hover:text-purple-700 duration-200"
          >
            Proof of Research
          </Link>
          <div className="ml-3 hidden sm:flex sm:gap-4">
            <Link
              to="/"
              className="hover:text-purple-700 duration-200 font-normal"
            >
              Home
            </Link>
            <Link
              to="/browse"
              className="hover:text-purple-700 duration-200 font-normal"
            >
              Browse
            </Link>
            <Link
              to="/forms"
              className="hover:text-purple-700 duration-200 font-normal"
            >
              Create
            </Link>
            <Link
              to="/verified"
              className="hover:text-purple-700 duration-200 font-normal"
            >
              Get Verified
            </Link>
          </div>
        </div>
        {/* <div>
          <CandidAdapterProvider>
            <ActorProvider
              canisterId={'ryjl3-tyaaa-aaaaa-aaaba-cai'}
              idlFactory={idlFactory}
              loadingComponent={<div>Loading Icp Ledger...</div>}
            >
              <Balance />
            </ActorProvider>
          </CandidAdapterProvider>
        </div> */}
        <div className="flex gap-3">
          <div>
            <WalletButton />
          </div>
          {authenticated ? (
            <Button
              onClick={() => logout()}
              variant="default"
              className="bg-purple-700 hover:bg-purple-800 hover:text-white font-bold rounded-lg font-satoshi"
            >
              Log Out
            </Button>
          ) : (
            <Button
              onClick={() =>
                login({
                  identityProvider:
                    process.env.DFX_NETWORK === 'ic'
                      ? 'https://identity.ic0.app/#authorize'
                      : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943/#authorize',
                })
              }
              variant="default"
              className="bg-purple-700 hover:bg-purple-800 hover:text-white font-bold rounded-lg font-satoshi"
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    </div>
  );
};

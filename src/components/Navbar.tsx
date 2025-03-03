import {
  ActorProvider,
  CandidAdapterProvider,
  useAuth,
  useQueryCall,
} from '@ic-reactor/react';
import React, { useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router';
import { Button } from './ui/button';
import { WalletButton } from './WalletButton';
import { idlFactory } from '@/declarations/icp_ledger_canister';
import { Backend, Response_1 } from '@/declarations/backend/backend.did';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuGroup,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { CheckCircle, LogOut, Settings, User } from 'lucide-react';
import { Avatar, AvatarFallback } from './ui/avatar';
import { Balance } from './Balance';

export const Navbar = () => {
  const navigate = useNavigate();
  const { login, logout, authenticated, identity, loginError } = useAuth({
    onLoginSuccess: (principal) => {
      console.log(`Logged in as ${principal}`);
    },
    onLoginError: (error) => console.error(`Login failed: ${error}`),
  });

  const [isVisible, setIsVisible] = useState(true);
  const [lastScrollY, setLastScrollY] = useState(0);
  const [shouldReload, setShouldReload] = useState(false);
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

  const {
    loading,
    error: errorFetchUser,
    data: rawUser,
    refetch,
  } = useQueryCall<Backend>({
    functionName: 'getUser',
  });

  const user = rawUser as Response_1 | undefined;

  useEffect(() => {
    if (user) {
      console.log(user);
    }
    if (errorFetchUser) {
      console.error('Error fetching user:', errorFetchUser);
    }
  }, [user, errorFetchUser]);

  const handleLogout = async () => {
    try {
      await logout();
      navigate('/');
      window.location.reload();
    } catch (error) {
      console.error('Logout failed:', error);
    }
  };

  const handleLogin = async () => {
    try {
      await login({
        identityProvider:
          process.env.DFX_NETWORK === 'ic'
            ? 'https://identity.ic0.app/#authorize'
            : 'http://rdmx6-jaaaa-aaaaa-aaadq-cai.localhost:4943/#authorize',
      });
      setShouldReload(true);
    } catch (error) {
      console.error('Login failed:', error);
    }
  };
  useEffect(() => {
    if (shouldReload && authenticated) {
      setTimeout(() => {
        window.location.reload();
      }, 250);
    }
  }, [shouldReload, authenticated]);
  return (
    <div
      className={`fixed top-0 left-0 right-0 z-50 transition-transform duration-300 ${isVisible ? 'translate-y-0' : '-translate-y-full'
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
              to="/browse"
              className="hover:text-purple-700 duration-200 font-normal"
            >
              Browse
            </Link>
            <Link
              to="/forms"
              className="hover:text-purple-700 duration-200 font-normal"
            >
              My Forms
            </Link>
          </div>
        </div>
        <div className="flex gap-3 items-center">
          {authenticated && (
            <div>
              <CandidAdapterProvider>
                <ActorProvider
                  canisterId={'ryjl3-tyaaa-aaaaa-aaaba-cai'}
                  idlFactory={idlFactory}
                  loadingComponent={<div>Loading Icp Ledger...</div>}
                >
                  <Balance />
                </ActorProvider>
              </CandidAdapterProvider>
            </div>
          )}
          {authenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  className="relative h-10 w-10 rounded-full"
                >
                  <Avatar className="h-10 w-10 border-2 border-purple-200 bg-purple-100 shadow-sm">
                    <AvatarFallback className="bg-purple-100 text-purple-700">
                      <User className="h-5 w-5" />
                    </AvatarFallback>
                  </Avatar>
                  <span className="absolute bottom-0 right-0 h-3 w-3 rounded-full bg-green-500 border-2 border-white" />
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-48 p-2">
                <DropdownMenuGroup>
                  {user && 'err' in user && (
                    <DropdownMenuItem asChild>
                      <Link
                        to="/verified"
                        className="cursor-pointer focus:bg-purple-50 focus:text-purple-900 text-purple-600 font-medium"
                      >
                        <CheckCircle className="h-4 w-4" />
                        <span>Get Verified</span>
                      </Link>
                    </DropdownMenuItem>
                  )}
                  {user && 'ok' in user && (
                    <>
                      <DropdownMenuItem asChild>
                        <Link
                          to="/profile"
                          className="cursor-pointer focus:bg-purple-50 focus:text-purple-900 text-purple-600 font-medium"
                        >
                          <User className="h-4 w-4" />
                          <span>My Profile</span>
                        </Link>
                      </DropdownMenuItem>
                    </>
                  )}
                </DropdownMenuGroup>
                <DropdownMenuSeparator />
                <DropdownMenuItem
                  onClick={() => {
                    handleLogout();
                  }}
                  className="cursor-pointer focus:bg-red-50 focus:text-red-900 text-red-600 font-medium"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Log Out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <Button
              onClick={() => {
                handleLogin();
              }}
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

import { useAuth } from '@ic-reactor/react';
import React from 'react';
import { Link } from 'react-router';
import { Button } from './ui/button';

type Props = {};

export const Navbar = (props: Props) => {
  const { login, logout, authenticated, identity, loginError } = useAuth({
    onLoginSuccess: (principal) => console.log(`Logged in as ${principal}`),
    onLoginError: (error) => console.error(`Login failed: ${error}`),
  });

  return (
    <>
      <div className="w-full flex justify-between items-center bg-transparent py-3 px-7 border-b font-manrope">
        <div className="flex gap-4 items-center">
          <Link
            to="/"
            className="font-bold text-xl hover:text-green-700 duration-200"
          >
            Proof of Research
          </Link>
          <div className="ml-3 hidden sm:flex sm:gap-4">
            <Link to="" className=" hover:text-green-700 duration-200 font-light">
              Home
            </Link>
            <Link to="" className="hover:text-green-700 duration-200 font-light">
              Survey
            </Link>
            <Link to="" className="hover:text-green-700 duration-200 font-light">
              Reward
            </Link>
          </div>
        </div>

        <div>
          {authenticated ? (
            <Button
              onClick={() => logout()}
              variant="default"
              className="bg-green-600 hover:bg-green-700 hover:text-white font-bold"
            >
              Log Out
            </Button>
          ) : (
            <Button
              onClick={() => login()}
              variant="default"
              className=" bg-green-600 hover:bg-green-700 hover:text-white font-bold"
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

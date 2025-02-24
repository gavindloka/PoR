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
      <div className="flex justify-between items-center bg-transparent py-3 px-10 font-satoshi mx-20 mt-3 rounded-xl border-gray-100 border shadow-lg">
        <div className="flex gap-4 items-center">
          <Link
            to="/"
            className="font-bold text-xl hover:text-purple-700 duration-200"
          >
            Proof of Research
          </Link>
          <div className="ml-3 hidden sm:flex sm:gap-4">
            <Link
              to=""
              className=" hover:text-purple-700 duration-200 font-light"
            >
              Home
            </Link>
            <Link
              to=""
              className="hover:text-purple-700 duration-200 font-light"
            >
              Browse
            </Link>
            <Link
              to=""
              className="hover:text-purple-700 duration-200 font-light"
            >
              Create
            </Link>
          </div>
        </div>

        <div className="flex gap-3">
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
              onClick={() => login()}
              variant="default"
              className=" bg-purple-700 hover:bg-purple-800 hover:text-white font-bold rounded-lg font-satoshi"
            >
              Log In
            </Button>
          )}
        </div>
      </div>
    </>
  );
};

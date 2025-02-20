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
    <div className="w-full px-10 text-black py-1 border-b">
      <div className="sticky top-0 z-50 w-full">
        <div className="container flex h-14 items-center">
          <div className="mr-4 md:flex">
            <Link className="mr-6 flex items-center space-x-2" to="/">
              <span className=" text-xl font-bold hover:text-green-700 sm:inline-block duration-300">
                 Proof of Research
              </span>
            </Link>
            <nav className="flex items-center space-x-6 text-sm font-medium">
              <Link
                to=""
                className="transition-colors hover:text-green-700 duration-300"
              >
                Survey
              </Link>
              <Link
                to=""
                className="transition-colors hover:text-green-700 duration-300"
              >
                Reward
              </Link>
            </nav>
          </div>
          {authenticated ? (
            <>
              <div>Authenticated as {identity?.getPrincipal().toText()}</div>
              <Button
                onClick={() => logout()}
                className="bg-green-600 hover:bg-green-700"
              >
                Logout
              </Button>
            </>
          ) : (
            <Button onClick={() => login()} variant="ghost" className='ml-auto hover:bg-green-700 hover:text-white font-bold'>Log In</Button>
          )}
        </div>
      </div>
    </div>
  );
};

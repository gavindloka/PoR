import { useAuth } from '@ic-reactor/react';
import React from 'react';

type Props = {};

export const Navbar = (props: Props) => {
  const { login, logout, authenticated, identity, loginError } = useAuth({
    onLoginSuccess: (principal) => console.log(`Logged in as ${principal}`),
    onLoginError: (error) => console.error(`Login failed: ${error}`),
  });

  return (
    <div className="w-full">
      <p>{identity?.getPrincipal().toText()}</p>
      {authenticated ? (
        <>
          <div>Authenticated as {identity?.getPrincipal().toText()}</div>
          <button onClick={() => logout()} className="p-2 bg-black text-white">
            Logout
          </button>
        </>
      ) : (
        <button onClick={() => login()}>Login</button>
      )}
    </div>
  );
};

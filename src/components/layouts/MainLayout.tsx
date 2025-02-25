import React, { ReactNode } from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

type Props = { children: ReactNode };

export const MainLayout = (props: Props) => {
  return (
    <div className='min-h-screen flex flex-col bg-white' >
      <Navbar/>
        <main className='flex-1 pt-20'>{props.children}</main>
      <Footer/>
    </div>
  );
};

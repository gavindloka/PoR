import React, { ReactNode } from 'react';
import { Navbar } from '../Navbar';
import { Footer } from '../Footer';

type Props = { children: ReactNode };

export const MainLayout = (props: Props) => {
  return (
    <div className=''>
      <Navbar />
      <main>{props.children}</main>
      <Footer />
    </div>
  );
};

import { Button } from '@/components/ui/button';
import React from 'react';

const HomePage = () => {
  return (
    <>
      <div className="w-full m-auto bg-transparent py-16">
        <div className='flex flex-col justify-center text-center items-center font-manrope font-bold'>
          <p className='text-6xl'>The Future of Research</p>
          <p className='text-7xl mt-3'>
            with <span className='text-green-600'>Decentralized Survey</span>
          </p>
          <p className='mt-6 text-xl font-light text-gray-500'>
            Empowering Research, Preserving Knowledge
          </p>
          <div className='mt-8 flex gap-5'>
            <Button className=' font-bold rounded-lg bg-green-600 w-32 h-11 hover:bg-green-700'>
              Design a Survey
            </Button>
            <Button className=' font-bold rounded-lg w-32 h-11 hover:border-green-700' variant={"outline"}>
              Contribute
            </Button>
          </div>
        </div>
      </div>
    </>
  );
};

export default HomePage;

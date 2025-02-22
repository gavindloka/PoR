import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import React from 'react';
import icpLogo from '../assets/internet-computer-icp-logo.png';

const HomePage = () => {
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2,
        delayChildren: 0.3,
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 50 },
    visible: {
      opacity: 1,
      y: 0,
      transition: {
        duration: 0.8,
        ease: 'easeOut',
      },
    },
  };

  const underlineVariants = {
    hidden: { width: '0%' },
    visible: {
      width: '100%',
      transition: { delay: 2.5, duration: 0.8, ease: 'easeInOut' },
    },
  };

  // const gradientVariants = {
  //   hidden: { opacity: 0 },
  //   visible: {
  //     opacity: 1,
  //     backgroundImage: 'linear-gradient(to right, #16a34a, #38bdf8)',
  //     backgroundClip: 'text',
  //     color: 'transparent',
  //     transition: { duration: 1.5, ease: 'easeInOut' },
  //   },
  // };

  return (
    <>
      <div className="w-full m-auto bg-transparent py-10 px-20">
        <motion.div
          className="flex flex-col justify-center text-center items-center font-satoshi font-bold"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p className="text-6xl" variants={itemVariants}>
            The Future of Research
          </motion.p>
          <motion.p className="text-7xl mt-3" variants={itemVariants}>
            with{' '}
            <motion.span className="relative inline-block">
              <motion.span
                className="relative z-20 bg-gradient-to-r from-green-500 via-green-600 to-green-800 bg-clip-text text-transparent"
                initial={{ backgroundPosition: '0% 50%' }}
                animate={{ backgroundPosition: '100% 50%' }}
                transition={{ duration: 1, delay: 1 }}
              >
                Decentralized Survey
              </motion.span>

              <motion.span
                className="absolute left-0 bottom-0 h-1 bg-yellow-300"
                style={{ width: '100%' }}
                variants={underlineVariants}
                initial="hidden"
                animate="visible"
              />
            </motion.span>
          </motion.p>
          <motion.p
            className="mt-6 text-xl font-light text-gray-500 w-2/6"
            variants={itemVariants}
          >
            Build and complete surveys with transparency, as all data is
            securely stored on the blockchain
          </motion.p>
          <motion.div className="mt-8 flex gap-5" variants={itemVariants}>
            <Button className=" font-bold rounded-lg bg-green-600 w-32 h-11 hover:border-0 hover:bg-green-700 hover:scale-105 transition-all">
              Design a Survey
            </Button>
            <Button
              className=" font-bold rounded-lg w-32 h-11 hover:border-green-700 hover:scale-105 hover:border-2 transition-all"
              variant={'outline'}
            >
              Contribute
            </Button>
          </motion.div>
          <motion.div className="w-full flex items-end justify-center gap-10">
            <motion.div
              className="w-52 h-72 rounded-xl flex flex-col gap-3 justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
              style={{
                backgroundImage: "url('./assets/work1.webp')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundClip: 'content-box',
              }}
            >
            </motion.div>

            <motion.div
              className="w-36 h-52 bg-green-100 rounded-xl p-4 flex flex-col gap-3 justify-center items-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
            >
              <div><img src={icpLogo} alt="" className='w-16 h-16'/></div>
              <p className="font-bold text-lg text-green-700">Build with ICP</p>
            
            </motion.div>
            <motion.div
              className="w-48 h-40 bg-white rounded-xl border-2 p-4 flex flex-col justify-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2 }}
            >
              <p className='font-bold text-xl'>200+</p>
              <p className='font-light'>Surveys Completed</p>
            </motion.div>

            <motion.div
              className="w-36 h-52 bg-green-600 rounded-xl p-4 flex flex-col gap-3 justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2.3 }}
            >
              <p className="font-bold text-xl text-white">Participate in Surveys</p>
              <p className="text-white font-light">
                Your input shapes researches
              </p>
            </motion.div>

            <motion.div
              className="w-52 h-72 bg-green-700 rounded-xl p-4 flex flex-col gap-3 justify-center"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2.3 }}
            >
              <p className="font-bold text-xl text-white">Create Your Survey</p>
              <p className="text-white font-light">
                Design decentralized surveys powered by ICP
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default HomePage;

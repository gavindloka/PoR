import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import React from 'react';
import icpLogo from '../assets/internet-computer-icp-logo.png';
import plugLogo from '../assets/plugLogo.png'

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
      transition: { delay: 2.3, duration: 0.8, ease: 'easeInOut' },
    },
  };

  return (
    <>
      <div className="w-full m-auto bg-transparent py-10 px-20">
        <motion.div
          className="flex flex-col justify-center text-center items-center font-satoshi font-bold"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          <motion.p
            className="text-6xl text-purple-800"
            variants={itemVariants}
          >
            The Future of Research
          </motion.p>
          <motion.p
            className="text-7xl mt-3 text-purple-900"
            variants={itemVariants}
          >
            with{' '}
            <motion.span className="relative inline-block">
              <motion.span
                className="relative z-20 bg-gradient-to-r from-purple-400 via-purple-600 to-purple-800 bg-clip-text text-transparent"
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
            className="mt-6 text-xl text-gray-500 w-3/6 font-medium"
            variants={itemVariants}
          >
            Design and complete surveys with confidence, powered by DeAI and
            secured on the blockchain
          </motion.p>
          <motion.div className="mt-8 flex gap-5" variants={itemVariants}>
            <Button className=" font-bold rounded-lg bg-purple-700 w-32 h-11 hover:border-0 hover:bg-purple-800 hover:scale-105 transition-all">
              Design a Survey
            </Button>
            <Button
              className=" font-bold rounded-lg w-32 h-11 hover:border-purple-700 hover:scale-105 hover:border-2 transition-all"
              variant={'outline'}
            >
              Contribute
            </Button>
          </motion.div>
          <motion.div className="w-full flex items-end justify-center gap-10">
            <motion.div
              className="w-64 h-72 rounded-xl flex flex-col gap-1 justify-center items-center bg-gradient-to-bl from-purple-600 to-indigo-900 p-3"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              <div>
                <img src={icpLogo} alt="" className="w-14 h-14" />
              </div>
              <p className="font-bold text-2xl text-white">
                Built with DeAI ICP
              </p>
              <p className="text-purple-200 text-center font-light">
                AI, but decentralized
              </p>
            </motion.div>

            <motion.div
              className="w-40 h-60 bg-purple-100 rounded-xl flex flex-col gap-3 justify-center items-center"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
              style={{
                backgroundImage: "url('./assets/work1.webp')",
                backgroundSize: 'cover',
                backgroundPosition: 'center',
                backgroundRepeat: 'no-repeat',
                backgroundClip: 'content-box',
              }}
            ></motion.div>
            <motion.div
              className="w-48 h-48 bg-purple-100 rounded-xl border-2 border-purple-300 p-5 flex flex-col justify-center gap-2"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.8 }}
            >
              <p className="font-light text-sm text-purple-800">
                Total Surveys:
              </p>
              <p className="font-bold text-5xl text-indigo-700">200+</p>
              <p className="font-light text-xs text-purple-800">and counting</p>
            </motion.div>

            <motion.div
              className="w-40 h-60 rounded-xl flex flex-col gap-2 justify-center items-center bg-gradient-to-br from-purple-600 to-indigo-900 p-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2.1 }}
            >
              <div>
                <img src={plugLogo} alt="" className="w-14 h-14" />
              </div>
              <p className="font-bold text-xl text-white">On-Chain Wallet</p>
              <p className="text-purple-100 font-light text-sm">
                using Plug Wallet
              </p>
            </motion.div>

            <motion.div
              className="w-64 h-72 rounded-xl flex flex-col gap-3 justify-center bg-gradient-to-br from-purple-600 to-indigo-900 p-6"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 2.1 }}
            >
              <div>
                <p className="font-bold text-2xl text-white">One Face</p>
                <p className="font-bold text-2xl text-white">One Response</p>
              </div>
              <p className="text-purple-100 font-light">
                Running On-Chain Face Recognition AI on ICP
              </p>
            </motion.div>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default HomePage;

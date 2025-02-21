import { Button } from '@/components/ui/button';
import { motion } from 'framer-motion';
import React from 'react';

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
      transition: { delay:2.5, duration: 0.8, ease: 'easeInOut' },
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
      <div className="w-full m-auto bg-transparent py-20">
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
                className="relative z-20"
                initial={{ color: '#000000' }}
                animate={{ color: '#16a34a' }}
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
            className="mt-6 text-xl font-light text-gray-500"
            variants={itemVariants}
          >
            Empowering Research, Preserving Knowledge
          </motion.p>
          <motion.div className="mt-8 flex gap-5" variants={itemVariants}>
            <Button className=" font-bold rounded-lg bg-green-600 w-32 h-11 hover:bg-green-700 hover:scale-105 transition-all">
              Design a Survey
            </Button>
            <Button
              className=" font-bold rounded-lg w-32 h-11 hover:border-green-700 hover:scale-105 hover:border-2 transition-all"
              variant={'outline'}
            >
              Contribute
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </>
  );
};

export default HomePage;

import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef } from 'react';
import icpLogo from '../assets/internet-computer-icp-logo.png';
import plugLogo from '../assets/plugLogo.png';
import workPic from '../assets/section3.jpg';
import CountUp from '@/components/CountUp';
import {
  Award,
  BadgeCheck,
  Brain,
  ClipboardList,
  Infinity,
  LineChart,
  Lock,
  Share2,
  Wallet,
} from 'lucide-react';
import { delay } from 'motion';
import { MaskText } from '@/components/MaskText';

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
      transition: { delay: 1.7, duration: 0.8, ease: 'easeInOut' },
    },
  };

  const howVariants = {
    hidden: { width: '0%' },
    visible: {
      width: '100%',
      transition: { duration: 0.8, ease: 'easeInOut' },
    },
  };

  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const steps = [
    {
      icon: ClipboardList,
      title: 'Design Survey',
      description:
        'DeAI intelligently categorizes your survey by topic for better organization and insights',
    },
    {
      icon: BadgeCheck,
      title: 'Verified Responses',
      description:
        'DeAI ensures every user submits only one response, maintaining survey integrity',
    },
    {
      icon: Lock,
      title: 'Blockchain Security',
      description: 'All data is securely stored and verified on the blockchain',
    },
    {
      icon: Wallet,
      title: 'Seamless Wallet Connection',
      description:
        'Easily connect your Plug Wallet and submit responses securely on-chain',
    },
    {
      icon: Share2,
      title: 'Spread the Word',
      description:
        'Instantly share your survey link and collect responses effortlessly',
    },
    {
      icon: Infinity,
      title: 'Earn Rewards',
      description: 'Get rewarded for contributing to decentralized survey',
    },
  ];
  const y = useTransform(scrollYProgress, [0, 1], [0, -50]);

  const phrases = [
    'The future of surveys is here, and you’re invited',
    'where every answer is verified and impactful',
    'backed by decentralized AI',
    'so you can research smarter, not harder',
  ];
  return (
    <>
      <div className="w-full m-auto bg-transparent pt-10 px-20">
        <motion.div
          className="flex flex-col justify-center text-center items-center font-satoshi font-bold"
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
              className=" font-bold text-purple-600 hover:text-purple-600 rounded-lg w-32 h-11 border-purple-500 hover:border-purple-500 hover:scale-105 hover:border-2 transition-all"
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
              transition={{ duration: 0.5, delay: 1.2 }}
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
              transition={{ duration: 0.5, delay: 1.2 }}
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
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <p className="font-light text-sm text-purple-800">
                Total Surveys:
              </p>
              <motion.p className="font-bold text-5xl text-purple-800">
                <CountUp
                  from={0}
                  to={200}
                  separator=","
                  direction="up"
                  duration={1}
                  className="count-up-text"
                />
              </motion.p>
              <p className="font-light text-sm text-purple-800">
                and counting...
              </p>
            </motion.div>

            <motion.div
              className="w-40 h-60 rounded-xl flex flex-col gap-2 justify-center items-center bg-gradient-to-br from-purple-400 to-indigo-700 p-3"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
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
              transition={{ duration: 0.5, delay: 1.4 }}
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
      <motion.section
        ref={sectionRef}
        className="w-full px-20 pt-20 flex flex-col justify-center bg-white"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.span
          className="w-80 m-auto text-5xl font-bold text-purple-800 text-center mb-16 relative inline-block"
          variants={itemVariants}
        >
          How It Works
          <motion.span
            className="h-1 bg-yellow-300 absolute left-0 bottom-0"
            style={{ width: '100%' }}
            variants={howVariants}
          />
        </motion.span>

        <div className="flex flex-wrap justify-center gap-20 mb-16 max-w-7xl mx-auto px-4">
          {steps.map((step, index) => (
            <motion.div
              key={index}
              className="bg-white rounded-xl shadow-lg p-6 w-80 relative overflow-hidden"
              variants={itemVariants}
              initial="hidden"
              whileInView="visible"
              transition={{ delay: 2 }}
              viewport={{ once: true }}
            >
              <motion.div
                className="absolute inset-0 bg-purple-100"
                initial={{ x: '-100%' }}
                whileInView={{ x: '0%' }}
                transition={{
                  delay: index * 0.3 + 0.2,
                  duration: 0.5,
                  ease: 'easeOut',
                }}
                viewport={{ once: true }}
              />

              <motion.div
                className="relative"
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                transition={{
                  delay: index * 0.3 + 0.4,
                  duration: 0.3,
                }}
                viewport={{ once: true }}
              >
                <motion.div
                  initial={{ scale: 0 }}
                  whileInView={{ scale: 1 }}
                  transition={{
                    delay: index * 0.3 + 0.5,
                    type: 'spring',
                    stiffness: 200,
                    damping: 10,
                  }}
                  viewport={{ once: true }}
                >
                  <step.icon className="w-12 h-12 text-purple-600 mb-4" />
                </motion.div>

                <motion.h3
                  className="text-xl font-semibold text-purple-800 mb-2"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: index * 0.3 + 0.6,
                    duration: 0.4,
                  }}
                  viewport={{ once: true }}
                >
                  {step.title}
                </motion.h3>

                <motion.p
                  className="text-gray-500 text-sm"
                  initial={{ x: -20, opacity: 0 }}
                  whileInView={{ x: 0, opacity: 1 }}
                  transition={{
                    delay: index * 0.3 + 0.7,
                    duration: 0.4,
                  }}
                  viewport={{ once: true }}
                >
                  {step.description}
                </motion.p>
              </motion.div>

              <motion.div
                className="absolute bottom-0 left-0 h-1 bg-purple-600"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                transition={{
                  delay: index * 0.3 + 0.3,
                  duration: 0.6,
                  ease: 'easeOut',
                }}
                viewport={{ once: true }}
              />
            </motion.div>
          ))}
        </div>
      </motion.section>
      <motion.div
        ref={sectionRef}
        className="w-full py-20 flex justify-center bg-white px-32 items-center gap-12"
        initial="hidden"
        whileInView="visible"
        viewport={{ once: true, amount: 0.3 }}
      >
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.5 }}
          className="w-1/3"
          viewport={{ once: true, amount: 0.3 }}
        >
          <img
            src={workPic}
            alt="Research and Knowledge Illustration"
            className="w-full h-auto bg-purple-400 rounded-2xl"
          />
        </motion.div>
        <div className="text-3xl text-purple-800 flex flex-col gap-7">
          <MaskText phrases={phrases} />
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            viewport={{ once: true, amount: 0.3 }}
          >
            <button className="relative inline-flex h-12 overflow-hidden rounded-2xl p-[3px] focus:outline-none">
              <span className="absolute inset-[-1000%] animate-[spin_2s_linear_infinite] bg-[conic-gradient(from_90deg_at_50%_50%,#E2CBFF_0%,#393BB2_50%,#E2CBFF_100%)]" />
              <span className="inline-flex h-full w-full cursor-pointer items-center justify-center rounded-xl bg-white px-3 py-1 font-satoshi text-lg text-purple-700 backdrop-blur-3xl">
                Get Started
              </span>
            </button>
          </motion.div>
        </div>
      </motion.div>
    </>
  );
};

export default HomePage;

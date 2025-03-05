import { Button } from '@/components/ui/button';
import { motion, useScroll, useTransform } from 'framer-motion';
import React, { useRef } from 'react';
import icpLogo from '../assets/internet-computer-icp-logo.png';
import nnsLogo from '../assets/nnsLogo.png';
import face from '../assets/facerecog.png';
import workPic from '../assets/section3.jpg';
import CountUp from '@/components/CountUp';
import {
  Award,
  BadgeCheck,
  BarChart3,
  Brain,
  CircleCheck,
  ClipboardList,
  Infinity,
  LineChart,
  Lock,
  Rocket,
  ScanFace,
  Share2,
  Smile,
  TrendingUp,
  Users,
  Wallet,
} from 'lucide-react';
import { delay } from 'motion';
import { MaskText } from '@/components/MaskText';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import { AvatarFallback, AvatarImage, Avatar } from '@/components/ui/avatar';
import { a } from 'framer-motion/dist/types.d-6pKw1mTI';
import { useNavigate } from 'react-router';
import { FloatingElements } from '@/components/FloatingElements';
import { InfiniteMovingCards } from '@/components/ui/infinite-moving-cards';

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
  interface TestimonialProps {
    name: string;
    role: string;
    content: string;
    avatar: string;
  }

  const testimonials = [
    {
      name: 'Sarah Johnson',
      role: 'Research Director',
      content:
        'DeAI has optimized our data collection workflow. The verification system ensures we gather high-quality responses, improving the reliability of our research findings and industry reports.',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Elena Rodriguez',
      role: 'Academic Researcher',
      content:
        'DeAI’s incentive system enhances respondent engagement while maintaining submission integrity. This has significantly improved data quality in our large-scale behavioral studies.',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'James Carter',
      role: 'Market Analyst',
      content:
        'Reliable consumer insights are crucial for market research. DeAI’s face recognition technology ensures that survey responses are verified, minimizing response bias and strengthening our predictive models and strategic analysis.',
      avatar: '/placeholder.svg?height=40&width=40',
    },
    {
      name: 'Sophia Lee',
      role: 'UX Researcher',
      content:
        'User experience studies depend on high-quality feedback. DeAI’s face recognition system verifies survey responses, ensuring the data is reliable and enabling precise design improvements and innovation.',
      avatar: '/placeholder.svg?height=40&width=40',
    },
  ];
  const navigate = useNavigate();
  const sectionRef = useRef(null);
  const { scrollYProgress } = useScroll({
    target: sectionRef,
    offset: ['start end', 'end start'],
  });
  const features = [
    {
      icon: BadgeCheck,
      title: 'Verified Responses',
      description:
        'DeAI ensures every user submits only one response, maintaining survey integrity',
    },
    {
      icon: Wallet,
      title: 'One-Click',
      description:
        'Connect your NNS Wallet in seconds and securely submit responses on-chain',
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
      <div className="w-full m-auto pt-10 px-20 font-satoshi">
        <FloatingElements />
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
            <Button
              className=" font-bold rounded-lg bg-purple-700 w-32 h-11 hover:border-0 hover:bg-purple-800 hover:scale-105 transition-all"
              onClick={() => navigate('/forms/new')}
            >
              Design a Survey
            </Button>
            <Button
              className=" font-bold text-purple-600 hover:text-purple-600 rounded-lg w-32 h-11 border-purple-500 hover:border-purple-500 hover:scale-105 hover:border-2 transition-all"
              onClick={() => navigate('/browse')}
              variant={'outline'}
            >
              Contribute
            </Button>
          </motion.div>
          <motion.div className="w-full flex items-end justify-center gap-10">
            <motion.div
              className="w-64 h-72 rounded-xl flex flex-col gap-1 justify-center items-center bg-gradient-to-bl from-purple-600 to-indigo-900 p-3 shadow-2xl"
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
              className="w-40 h-60 rounded-xl flex flex-col gap-2 justify-center items-center bg-gradient-to-bl from-purple-400 to-indigo-800 p-5 shadow-3xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div>
                <CircleCheck className="w-10 h-10 text-white" />
              </div>
              <p className="font-bold text-white text-xl">
                Proof, Not Promises
              </p>

              <p className="font-light text-white text-center text-xs">
                No bias, just real data for your research
              </p>
            </motion.div>

            <motion.div
              className="w-60 h-48 rounded-xl overflow-hidden relative shadow-xl"
              initial={{ opacity: 0, x: -50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.2 }}
            >
              <div className="absolute inset-0 bg-gradient-to-br from-purple-200 to-indigo-300"></div>
              <div className="p-5 h-full flex flex-col justify-between relative z-10">
                <div className="flex items-center justify-between">
                  <p className="text-purple-700 font-medium text-sm">
                    Total Surveys
                  </p>
                  <BarChart3 className="text-purple-600 w-5 h-5 " />
                </div>

                <div className="flex flex-col items-center justify-center flex-grow">
                  <motion.div className="font-bold text-5xl flex items-center">
                    <CountUp
                      from={0}
                      to={200}
                      separator=","
                      duration={2}
                      className="count-up-text text-purple-700"
                    />
                  </motion.div>
                </div>

                <div className="flex items-center justify-between">
                  <p className="text-purple-700 text-sm font-light">
                    and counting...
                  </p>
                </div>
              </div>
            </motion.div>

            <motion.div
              className="w-40 h-60 rounded-xl flex flex-col gap-2 justify-center items-center bg-gradient-to-br from-purple-400 to-indigo-800 p-4 shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <div className="rounded-full">
                <img src={nnsLogo} alt="" className="w-14 h-14" />
              </div>
              <p className="font-bold text-xl text-white -mt-2">
                On-Chain Wallet
              </p>
              <p className="text-purple-100 font-light text-xs">
                using NNS Wallet with ICP Ledger
              </p>
            </motion.div>

            <motion.div
              className="w-64 h-72 rounded-xl flex flex-col gap-3 justify-center bg-gradient-to-br from-purple-600 to-indigo-900 p-6 shadow-2xl"
              initial={{ opacity: 0, x: 50 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 1.4 }}
            >
              <div className="rounded-full text-white flex items-center justify-center ">
                <ScanFace size={60} />
              </div>
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
        className="w-full px-4 md:px-8 lg:px-20 lg:py-28 flex flex-col justify-center bg-white"
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.1 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto w-full">
          <motion.div
            className="relative mb-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl lg:text-5xl font-bold text-purple-800 inline-block relative pb-2">
              Key Features
              <motion.span
                className="h-1 bg-yellow-300 absolute left-0 bottom-0"
                initial={{ width: 0 }}
                whileInView={{ width: '100%' }}
                viewport={{ once: true }}
                transition={{ delay: 0.3, duration: 0.8 }}
              />
            </h2>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 lg:gap-8">
            {features.map((feature, index) => (
              <motion.div
                key={index}
                className="bg-white rounded-xl shadow-md hover:shadow-lg p-6 transition-shadow"
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1, duration: 0.5 }}
              >
                <div className="">
                  <feature.icon className="w-10 h-10 text-purple-600 mb-4" />
                  <h3 className="text-xl font-semibold text-purple-800 mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-gray-600">{feature.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </motion.section>

      <motion.section
        className="w-full pb-28 pt-16"
        ref={sectionRef}
        initial={{ opacity: 0 }}
        whileInView={{ opacity: 1 }}
        viewport={{ once: true, amount: 0.3 }}
        transition={{ duration: 1 }}
      >
        <div className="border mx-20 pt-20 pb-28 rounded-3xl bg-gradient-to-br from-purple-100 to-indigo-400 shadow-2xl">
          <div className="text-center mb-16">
            <Badge className="mb-4 bg-purple-100 text-purple-800 hover:bg-purple-200 px-4 py-1.5">
              Real Voices, Real Impact
            </Badge>
            <h2 className="text-4xl md:text-5xl font-bold text-purple-800">
              What Our Users Say
            </h2>
          </div>

          <div className="rounded-md flex flex-col antialiased bg-transparent items-center justify-center relative overflow-hidden">
            <InfiniteMovingCards
              items={testimonials.map((testimonial) => ({
                quote: testimonial.content,
                name: testimonial.name,
                title: testimonial.role,
                avatar: testimonial.avatar,
              }))}
              direction="right"
              speed="slow"
            />
          </div>
        </div>
      </motion.section>

      <motion.div
        ref={sectionRef}
        className="w-full pt-10 pb-40 flex justify-center bg-white px-32 items-center gap-12"
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
            <button className="relative inline-flex h-12 overflow-hidden rounded-2xl p-[3px] focus:outline-none" onClick={()=>navigate("/browse")}>
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

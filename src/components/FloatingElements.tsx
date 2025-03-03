import { motion } from 'framer-motion';
import { Bot, Infinity, Link, ShieldCheck } from 'lucide-react';

export const FloatingElements = () => {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <motion.div
        className="absolute flex items-center justify-center top-[20%] right-[15%] w-12 h-12 rounded-full bg-yellow-500/10 backdrop-blur-md"
        animate={{
          y: [0, 10, 0],
          x: [0, 10, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 6,
          ease: 'easeInOut',
        }}
      >
        <Link className="w-6 h-6 text-yellow-500" />
      </motion.div>
      <motion.div
        className="absolute flex items-center justify-center top-[40%] right-[10%] w-16 h-16 rounded-full bg-purple-500/20 backdrop-blur-md"
        animate={{
          y: [0, 15, 0],
          rotate: [0, 10, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 4,
          ease: 'easeInOut',
        }}
      >
        <ShieldCheck className="w-8 h-8 text-purple-500" />
      </motion.div>

      <motion.div
        className="absolute flex items-center justify-center top-[45%] left-[6%] w-20 h-20 rounded-full bg-indigo-500/10 backdrop-blur-md"
        animate={{
          y: [0, -20, 0],
          rotate: [0, -15, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 3,
          ease: 'easeInOut',
        }}
      >
        <Infinity className="w-10 h-10 text-indigo-500" />
      </motion.div>

      <motion.div
        className="absolute flex items-center justify-center top-[30%] left-[15%] w-12 h-12 rounded-full bg-yellow-500/10 backdrop-blur-md"
        animate={{
          y: [0, 10, 0],
          x: [0, 10, 0],
        }}
        transition={{
          repeat: Number.POSITIVE_INFINITY,
          duration: 6,
          ease: 'easeInOut',
        }}
      >
        <Bot className="w-6 h-6 text-yellow-500" />
      </motion.div>
    </div>
  );
};

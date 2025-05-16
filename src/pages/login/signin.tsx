'use client'

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, ArrowRight } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';

export default function Signin() {
    const [showPassword, setShowPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        console.log('Sign in:', { email, password });
    };

    const containerVariants = {
        hidden: {
            opacity: 0,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 100,
                damping: 15,
                staggerChildren: 0.1,
                delayChildren: 0.3
            }
        }
    };

    const itemVariants = {
        hidden: {
            opacity: 0,
            y: 20,
            scale: 0.95
        },
        visible: {
            opacity: 1,
            y: 0,
            scale: 1,
            transition: {
                type: "spring",
                stiffness: 300,
                damping: 20
            }
        }
    };

    const pageVariants = {
        initial: {
            opacity: 0,
            rotateY: 90,
            scale: 0.8
        },
        animate: {
            opacity: 1,
            rotateY: 0,
            scale: 1,
            transition: {
                duration: 0.7,
                ease: [0.4, 0, 0.2, 1],
                rotateY: {
                    duration: 0.7,
                    ease: [0.4, 0, 0.2, 1]
                }
            }
        },
        exit: {
            opacity: 0,
            rotateY: -90,
            scale: 0.8,
            transition: {
                duration: 0.5,
                ease: [0.4, 0, 1, 1],
                rotateY: {
                    duration: 0.5,
                    ease: [0.4, 0, 1, 1]
                }
            }
        }
    };

    return (
        <AnimatePresence mode="wait">
            <motion.div
                variants={pageVariants}
                initial="initial"
                animate="animate"
                exit="exit"
                style={{ perspective: 1000 }}
                className="min-h-screen flex w-full"
            >
                {/* Left side - Image */}
                <motion.div
                    initial={{ x: -100, opacity: 0, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        delay: 0.2
                    }}
                    className="hidden lg:flex lg:w-1/2 bg-[#1a2234] relative overflow-hidden"
                >
                    <motion.div
                        initial={{ scale: 1.2, opacity: 0 }}
                        animate={{ scale: 1, opacity: 1 }}
                        transition={{
                            duration: 0.8,
                            delay: 0.4,
                            ease: [0.4, 0, 0.2, 1]
                        }}
                        className="absolute inset-0 bg-gradient-to-br from-blue-600/20 to-purple-600/20 z-10"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                        <div className="relative w-full h-full">
                            <motion.div
                                initial={{ opacity: 0, scale: 1.1 }}
                                animate={{ opacity: 0.1, scale: 1 }}
                                transition={{
                                    duration: 1,
                                    delay: 0.6,
                                    ease: [0.4, 0, 0.2, 1]
                                }}
                                className="absolute inset-0 bg-[url('/medical-pattern.svg')]"
                            />
                            <div className="absolute inset-0 flex items-center justify-center">
                                <motion.div
                                    initial={{ y: 50, opacity: 0, scale: 0.95 }}
                                    animate={{ y: 0, opacity: 1, scale: 1 }}
                                    transition={{
                                        type: "spring",
                                        stiffness: 100,
                                        damping: 20,
                                        delay: 0.8
                                    }}
                                    className="text-center space-y-6 p-12"
                                >
                                    <motion.h1
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1 }}
                                        className="text-4xl font-bold text-white"
                                    >
                                        Medical Management System
                                    </motion.h1>
                                    <motion.p
                                        initial={{ y: 20, opacity: 0 }}
                                        animate={{ y: 0, opacity: 1 }}
                                        transition={{ delay: 1.2 }}
                                        className="text-gray-300 text-lg"
                                    >
                                        Streamline your healthcare operations with our comprehensive management solution
                                    </motion.p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right side - Sign in form */}
                <motion.div
                    initial={{ x: 100, opacity: 0, scale: 0.95 }}
                    animate={{ x: 0, opacity: 1, scale: 1 }}
                    transition={{
                        type: "spring",
                        stiffness: 100,
                        damping: 20,
                        delay: 0.2
                    }}
                    className="w-full lg:w-1/2 flex items-center justify-center p-8 bg-[#0c1322]"
                >
                    <motion.div
                        variants={containerVariants}
                        initial="hidden"
                        animate="visible"
                        className="w-full max-w-md space-y-8"
                    >
                        <motion.div variants={itemVariants} className="text-center">
                            <motion.h2
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.4 }}
                                className="text-3xl font-bold text-white"
                            >
                                Welcome back
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-2 text-gray-400"
                            >
                                Please sign in to your account
                            </motion.p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <motion.div variants={itemVariants} className="space-y-4">
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <label htmlFor="email" className="block text-sm font-medium text-gray-300">
                                        Email address
                                    </label>
                                    <div className="mt-1 relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Mail className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            id="email"
                                            name="email"
                                            type="email"
                                            autoComplete="email"
                                            required
                                            value={email}
                                            onChange={(e) => setEmail(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-[#1a2234] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Enter your email"
                                        />
                                    </div>
                                </motion.div>
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <label htmlFor="password" className="block text-sm font-medium text-gray-300">
                                        Password
                                    </label>
                                    <div className="mt-1 relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            id="password"
                                            name="password"
                                            type={showPassword ? "text" : "password"}
                                            autoComplete="current-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-[#1a2234] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Enter your password"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                type="button"
                                                onClick={() => setShowPassword(!showPassword)}
                                                className="text-gray-400 hover:text-gray-300 focus:outline-none transition-colors"
                                            >
                                                {showPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                </motion.div>
                            </motion.div>

                            <motion.div variants={itemVariants} className="flex items-center justify-between">
                                <div className="flex items-center">
                                    <input
                                        id="remember-me"
                                        name="remember-me"
                                        type="checkbox"
                                        className="h-4 w-4 rounded border-gray-700 bg-[#1a2234] text-blue-500 focus:ring-blue-500"
                                    />
                                    <label htmlFor="remember-me" className="ml-2 block text-sm text-gray-300">
                                        Remember me
                                    </label>
                                </div>
                                <div className="text-sm">
                                    <Link href="/forgot-password" className="text-blue-500 hover:text-blue-400 transition-colors">
                                        Forgot your password?
                                    </Link>
                                </div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 group"
                                >
                                    Sign in
                                    <motion.div
                                        animate={{ x: [0, 5, 0] }}
                                        transition={{ repeat: Infinity, duration: 1.5 }}
                                    >
                                        <ArrowRight className="ml-2 h-4 w-4" />
                                    </motion.div>
                                </motion.button>
                            </motion.div>
                        </form>

                        <motion.div variants={itemVariants} className="text-center">
                            <p className="text-sm text-gray-400">
                                Don&apos;t have an account?{' '}
                                <Link href="/login/signup" className="text-blue-500 hover:text-blue-400 transition-colors">
                                    Sign up
                                </Link>
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}
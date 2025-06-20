'use client'

import { useState } from 'react';
import { Eye, EyeOff, Mail, Lock, User, Phone, ArrowRight, Upload } from 'lucide-react';
import Link from 'next/link';
import { motion, AnimatePresence } from 'framer-motion';
import { request } from '@/lib/request';
import { toast } from '../../hooks/use-toast';
import Image from 'next/image';

const ROLES = [
    { value: 'client', label: 'Client' },
    { value: 'warehouse', label: 'Warehouse' }
] as const;

export default function Signup() {
    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [email, setEmail] = useState('');
    const [username, setUsername] = useState('');
    const [phoneNumber, setPhoneNumber] = useState('');
    const [password, setPassword] = useState('');
    const [confirmPassword, setConfirmPassword] = useState('');
    const [passwordError, setPasswordError] = useState('');
    const [selectedRole, setSelectedRole] = useState<string>('client');
    const [customAvatar, setCustomAvatar] = useState<File | null>(null);
    const [avatarPreview, setAvatarPreview] = useState<string>('');

    const handleAvatarChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const file = event.target.files?.[0];
        if (file) {
            // Validate file size (5MB limit)
            if (file.size > 5 * 1024 * 1024) {
                toast({
                    title: "Error",
                    description: "File size must be less than 5MB",
                    variant: "destructive",
                });
                return;
            }

            // Validate file type
            const allowedTypes = ['image/jpeg', 'image/png', 'image/gif', 'image/webp'];
            if (!allowedTypes.includes(file.type)) {
                toast({
                    title: "Error",
                    description: "Only JPEG, PNG, GIF and WebP files are allowed",
                    variant: "destructive",
                });
                return;
            }

            setCustomAvatar(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const handleSubmit = async (e: React.FormEvent) => {
        e.preventDefault();
        if (password !== confirmPassword) {
            setPasswordError('Passwords do not match');
            return;
        }

        // Basic validation
        if (!email || !username || !phoneNumber || !password || !selectedRole) {
            toast({
                title: "Error",
                description: "All fields are required",
                variant: "destructive",
            });
            return;
        }

        try {
            const formData = new FormData();
            formData.append('name', username.trim());
            formData.append('email', email.trim());
            formData.append('password', password);
            formData.append('phone', phoneNumber.trim());
            formData.append('role', selectedRole);

            if (customAvatar && customAvatar instanceof File) {
                formData.append('avatar', customAvatar);
            }

            const response = await request({
                method: "POST",
                url: "/auth/register",
                data: formData,
            }, {
                successMessage: "Registration successful! Please verify your email.",
                errorMessage: "Registration failed. Please try again.",
                showToast: true
            });

            if (response) {
                window.location.href = '/login/signin';
            }
        } catch (error) {
            console.error('Registration error:', error);
        }

        setPasswordError('');
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
                                        Join our healthcare management platform today
                                    </motion.p>
                                </motion.div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Right side - Sign up form */}
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
                                Create Account
                            </motion.h2>
                            <motion.p
                                initial={{ y: 20, opacity: 0 }}
                                animate={{ y: 0, opacity: 1 }}
                                transition={{ delay: 0.5 }}
                                className="mt-2 text-gray-400"
                            >
                                Please fill in your details to sign up
                            </motion.p>
                        </motion.div>

                        <form onSubmit={handleSubmit} className="mt-8 space-y-6">
                            <motion.div variants={itemVariants} className="space-y-4">
                                {/* Avatar Selection */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    className="flex flex-col items-center space-y-4"
                                >
                                    <div className="relative w-24 h-24 rounded-full overflow-hidden border-2 border-blue-500 bg-[#1a2234]">
                                        {avatarPreview ? (
                                            <Image
                                                src={avatarPreview}
                                                alt="Avatar preview"
                                                fill
                                                className="object-cover"
                                            />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <User className="w-12 h-12 text-gray-400" />
                                            </div>
                                        )}
                                    </div>
                                    <div className="flex flex-col items-center space-y-2">
                                        <label className="relative cursor-pointer">
                                            <input
                                                type="file"
                                                accept="image/*"
                                                onChange={handleAvatarChange}
                                                className="hidden"
                                            />
                                            <motion.div
                                                whileHover={{ scale: 1.05 }}
                                                whileTap={{ scale: 0.95 }}
                                                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                                            >
                                                <Upload className="h-4 w-4" />
                                                Upload Avatar
                                            </motion.div>
                                        </label>
                                    </div>
                                </motion.div>

                                {/* Role Selection */}
                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <label className="block text-sm font-medium text-gray-300 mb-2">
                                        Select Role
                                    </label>
                                    <div className="grid grid-cols-3 gap-3">
                                        {ROLES.map((role) => (
                                            <motion.button
                                                key={role.value}
                                                type="button"
                                                whileHover={{ scale: 1.02 }}
                                                whileTap={{ scale: 0.98 }}
                                                onClick={() => setSelectedRole(role.value)}
                                                className={`py-2 px-4 rounded-lg text-sm font-medium transition-all ${selectedRole === role.value
                                                    ? 'bg-blue-600 text-white'
                                                    : 'bg-[#1a2234] text-gray-300 hover:bg-[#232b3b]'
                                                    }`}
                                            >
                                                {role.label}
                                            </motion.button>
                                        ))}
                                    </div>
                                </motion.div>

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
                                    <label htmlFor="username" className="block text-sm font-medium text-gray-300">
                                        Username
                                    </label>
                                    <div className="mt-1 relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <User className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            id="username"
                                            name="username"
                                            type="text"
                                            autoComplete="username"
                                            required
                                            value={username}
                                            onChange={(e) => setUsername(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-[#1a2234] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Choose a username"
                                        />
                                    </div>
                                </motion.div>

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <label htmlFor="phone" className="block text-sm font-medium text-gray-300">
                                        Phone Number
                                    </label>
                                    <div className="mt-1 relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Phone className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            id="phone"
                                            name="phone"
                                            type="tel"
                                            autoComplete="tel"
                                            required
                                            value={phoneNumber}
                                            onChange={(e) => setPhoneNumber(e.target.value)}
                                            className="block w-full pl-10 pr-3 py-3 border border-gray-700 rounded-lg bg-[#1a2234] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Enter your phone number"
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
                                            autoComplete="new-password"
                                            required
                                            value={password}
                                            onChange={(e) => setPassword(e.target.value)}
                                            className="block w-full pl-10 pr-10 py-3 border border-gray-700 rounded-lg bg-[#1a2234] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
                                            placeholder="Create a password"
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

                                <motion.div
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                >
                                    <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-300">
                                        Confirm Password
                                    </label>
                                    <div className="mt-1 relative group">
                                        <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                                            <Lock className="h-5 w-5 text-gray-400 group-focus-within:text-blue-500 transition-colors" />
                                        </div>
                                        <input
                                            id="confirmPassword"
                                            name="confirmPassword"
                                            type={showConfirmPassword ? "text" : "password"}
                                            autoComplete="new-password"
                                            required
                                            value={confirmPassword}
                                            onChange={(e) => setConfirmPassword(e.target.value)}
                                            className={`block w-full pl-10 pr-10 py-3 border ${passwordError ? 'border-red-500' : 'border-gray-700'} rounded-lg bg-[#1a2234] text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all`}
                                            placeholder="Confirm your password"
                                        />
                                        <div className="absolute inset-y-0 right-0 pr-3 flex items-center">
                                            <motion.button
                                                whileHover={{ scale: 1.1 }}
                                                whileTap={{ scale: 0.9 }}
                                                type="button"
                                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                                className="text-gray-400 hover:text-gray-300 focus:outline-none transition-colors"
                                            >
                                                {showConfirmPassword ? (
                                                    <EyeOff className="h-5 w-5" />
                                                ) : (
                                                    <Eye className="h-5 w-5" />
                                                )}
                                            </motion.button>
                                        </div>
                                    </div>
                                    <AnimatePresence>
                                        {passwordError && (
                                            <motion.p
                                                initial={{ opacity: 0, y: -10 }}
                                                animate={{ opacity: 1, y: 0 }}
                                                exit={{ opacity: 0, y: -10 }}
                                                transition={{ type: "spring", stiffness: 500, damping: 30 }}
                                                className="mt-1 text-sm text-red-500"
                                            >
                                                {passwordError}
                                            </motion.p>
                                        )}
                                    </AnimatePresence>
                                </motion.div>
                            </motion.div>

                            <motion.div variants={itemVariants}>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    type="submit"
                                    className="w-full flex justify-center items-center py-3 px-4 border border-transparent rounded-lg shadow-sm text-sm font-medium text-white bg-blue-600 hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transition-all duration-200 group"
                                >
                                    Create Account
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
                                Already have an account?{' '}
                                <Link href="/login/signin" className="text-blue-500 hover:text-blue-400 transition-colors">
                                    Sign in
                                </Link>
                            </p>
                        </motion.div>
                    </motion.div>
                </motion.div>
            </motion.div>
        </AnimatePresence>
    );
}

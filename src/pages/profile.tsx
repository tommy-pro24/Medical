import React, { useEffect, useState } from 'react';
import { useData } from '@/context/DataContext';
import { useToast } from '@/hooks/use-toast';
import { z } from 'zod';
import { zodResolver } from '@hookform/resolvers/zod';
import { useForm } from 'react-hook-form';
import { request } from '@/lib/request';
import { Card, CardContent, CardFooter } from '@/components/ui/card';
import ProfileHeader from '@/components/profile/ProfileHeader';
import ProfileInfoGrid from '@/components/profile/ProfileInfoGrid';
import ProfileEditForm from '@/components/profile/ProfileEditForm';
import PasswordChangeCard from '@/components/profile/PasswordChangeCard';

const profileFormSchema = z.object({
    _id: z.string().optional(),
    name: z.string().min(2, 'Name must be at least 2 characters.'),
    email: z.string().email('Please enter a valid email address.'),
    phone: z.string().optional(),
    avatar: z.any().optional(),
});

const passwordFormSchema = z.object({
    currentPassword: z.string().min(1, 'Please enter your current password.'),
    newPassword: z.string().min(6, 'Password must be at least 6 characters.'),
    confirmPassword: z.string().min(6, 'Please confirm your new password.'),
}).refine(data => data.newPassword === data.confirmPassword, {
    message: "New passwords don't match",
    path: ['confirmPassword'],
});

type ProfileFormValues = z.infer<typeof profileFormSchema>;
type PasswordFormValues = z.infer<typeof passwordFormSchema>;

const Profile = () => {
    const { getCurrentUser, updateUser } = useData();
    const { toast } = useToast();
    const currentUser = getCurrentUser();
    const [isProfileEditing, setIsProfileEditing] = useState(false);
    const [isChangingPassword, setIsChangingPassword] = useState(false);
    const [showCurrentPassword, setShowCurrentPassword] = useState(false);
    const [showNewPassword, setShowNewPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);
    const [avatarPreview, setAvatarPreview] = useState<string>('');
    const [selectedAvatarFile, setSelectedAvatarFile] = useState<File | null>(null);
    const [isClient, setIsClient] = useState(false);

    useEffect(() => {
        setIsClient(true);
    }, []);

    // Construct avatar URL
    const getAvatarUrl = (avatarPath?: string) => {
        if (!avatarPath) {
            // Return a default avatar or placeholder if no avatar is set
            return ''; // Let the UI handle a default
        }
        // The avatar path from the backend is relative, e.g., '/img/avatar.png'
        const backendUrl = process.env.NEXT_PUBLIC_BACKEND || 'http://localhost:5000';
        return `${backendUrl}${avatarPath}`;
    };

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            phone: currentUser?.phone || '',
            avatar: currentUser?.avatar || '',
        },
    });

    useEffect(() => {
        if (currentUser) {
            profileForm.reset({
                name: currentUser.name,
                email: currentUser.email,
                phone: currentUser.phone || '',
                avatar: currentUser.avatar || '',
            });
            setAvatarPreview(getAvatarUrl(currentUser.avatar));
        }
    }, [currentUser, profileForm.reset]);

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

    if (!isClient) {
        return null;
    }

    if (!currentUser) {
        return (
            <div className="flex justify-center items-center h-96">
                <p className="text-muted-foreground">Please login to view your profile</p>
            </div>
        );
    }

    // Handlers
    const handleProfileCancel = () => {
        profileForm.reset({
            name: currentUser.name,
            email: currentUser.email,
            phone: currentUser.phone || '',
            avatar: currentUser.avatar || '',
        });
        setAvatarPreview(getAvatarUrl(currentUser.avatar));
        setSelectedAvatarFile(null);
        setIsProfileEditing(false);
    };

    const handlePasswordCancel = () => {
        passwordForm.reset({
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        });
        setIsChangingPassword(false);
    };

    // Avatar file change handler
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

            setSelectedAvatarFile(file);
            const reader = new FileReader();
            reader.onloadend = () => {
                setAvatarPreview(reader.result as string);
            };
            reader.readAsDataURL(file);
        }
    };

    const onProfileSubmit = async (values: ProfileFormValues) => {
        try {
            const formData = new FormData();
            formData.append('name', values.name.trim());
            formData.append('email', values.email.trim());
            formData.append('phone', values.phone?.trim() || '');

            if (selectedAvatarFile) {
                formData.append('avatar', selectedAvatarFile);
            }

            const response = await request({
                method: 'POST',
                url: '/auth/updateProfileWithAvatar',
                data: formData,
                headers: {
                    'Authorization': `Bearer ${currentUser.token}`,
                },
            }, {
                successMessage: 'Profile updated successfully',
                errorMessage: 'Failed to update profile',
                showToast: true,
            });

            if (response && response.user) {
                // Update the user context with new data
                updateUser({
                    name: response.user.name,
                    email: response.user.email,
                    phone: response.user.phone,
                    avatar: response.user.avatar,
                    token: response.user.token,
                });

                // Update avatar preview with new URL
                setAvatarPreview(getAvatarUrl(response.user.avatar));
                setSelectedAvatarFile(null);
                setIsProfileEditing(false);
            }
        } catch (error) {
            console.error('Profile update error:', error);
        }
    };

    const onPasswordSubmit = async (values: PasswordFormValues) => {
        if (currentUser.password && currentUser.password !== values.currentPassword) {
            toast({
                title: 'Password Error',
                description: 'Current password is incorrect.',
                variant: 'destructive',
            });
            return;
        }
        await request({
            method: 'POST',
            url: `/auth/updatePassword`,
            data: {
                currentPassword: values.currentPassword,
                newPassword: values.newPassword,
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`,
            },
        }, {
            successMessage: 'Password updated successfully',
            errorMessage: 'Failed to update password',
            showToast: true,
        });
        setIsChangingPassword(false);
    };

    return (
        <div className="max-w-2xl mx-auto w-full px-2 sm:px-4 py-8">
            <h1 className="text-3xl font-extrabold mb-8 text-center">User Profile</h1>
            <div className="space-y-8">
                {/* Profile Card */}
                <Card className="rounded-2xl shadow-xl border border-border/30 bg-background/80">
                    <ProfileHeader
                        name={currentUser.name}
                        role={currentUser.role}
                        avatar={avatarPreview}
                    />
                    <CardContent className="pt-0 pb-4">
                        {isProfileEditing ? (
                            <ProfileEditForm
                                form={profileForm}
                                onSubmit={onProfileSubmit}
                                onCancel={handleProfileCancel}
                                onAvatarChange={handleAvatarChange}
                                avatarPreview={avatarPreview}
                                setAvatarPreview={setAvatarPreview}
                            />
                        ) : (
                            <ProfileInfoGrid
                                name={currentUser.name}
                                email={currentUser.email}
                                phone={currentUser.phone}
                                role={currentUser.role}
                            />
                        )}
                    </CardContent>
                    <CardFooter className="flex justify-end pt-0">
                        {!isProfileEditing && (
                            <button
                                className="mt-4 w-full sm:w-auto px-6 py-2 rounded-lg bg-primary text-white font-semibold shadow hover:bg-primary/90 transition"
                                onClick={() => setIsProfileEditing(true)}
                            >
                                Edit Profile
                            </button>
                        )}
                    </CardFooter>
                </Card>
                {/* Password Change Card */}
                <Card className="rounded-2xl shadow-xl border border-border/30 bg-background/80">
                    <CardContent className="py-6">
                        <PasswordChangeCard
                            form={passwordForm}
                            onSubmit={onPasswordSubmit}
                            onCancel={handlePasswordCancel}
                            isChanging={isChangingPassword}
                            setIsChanging={setIsChangingPassword}
                            showCurrent={showCurrentPassword}
                            setShowCurrent={setShowCurrentPassword}
                            showNew={showNewPassword}
                            setShowNew={setShowNewPassword}
                            showConfirm={showConfirmPassword}
                            setShowConfirm={setShowConfirmPassword}
                        />
                    </CardContent>
                </Card>
            </div>
        </div>
    );
};

export default Profile;

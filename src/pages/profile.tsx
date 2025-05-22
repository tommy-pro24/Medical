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

    const profileForm = useForm<ProfileFormValues>({
        resolver: zodResolver(profileFormSchema),
        defaultValues: {
            name: currentUser?.name || '',
            email: currentUser?.email || '',
            phone: currentUser?.phone || '',
        },
    });

    useEffect(() => {
        if (currentUser) {
            profileForm.reset({
                name: currentUser.name,
                email: currentUser.email,
                phone: currentUser.phone || '',
            });
        }
    }, [currentUser, profileForm]);

    const passwordForm = useForm<PasswordFormValues>({
        resolver: zodResolver(passwordFormSchema),
        defaultValues: {
            currentPassword: '',
            newPassword: '',
            confirmPassword: '',
        },
    });

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
        });
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

    const onProfileSubmit = (values: ProfileFormValues) => {
        request({
            method: 'POST',
            url: `/auth/updateProfile`,
            data: {
                name: values.name,
                email: values.email,
                phone: values.phone,
            },
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${currentUser.token}`,
            },
        });
        updateUser({
            name: values.name,
            email: values.email,
            phone: values.phone,
        });
        toast({
            title: 'Profile Updated',
            description: 'Your profile information has been updated successfully.',
        });
        setIsProfileEditing(false);
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
                    <ProfileHeader name={currentUser.name} role={currentUser.role} />
                    <CardContent className="pt-0 pb-4">
                        {isProfileEditing ? (
                            <ProfileEditForm
                                form={profileForm}
                                onSubmit={onProfileSubmit}
                                onCancel={handleProfileCancel}
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

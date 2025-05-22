import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Eye, EyeOff } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type PasswordFormValues = {
    currentPassword: string;
    newPassword: string;
    confirmPassword: string;
};

interface PasswordChangeCardProps {
    form: UseFormReturn<PasswordFormValues>;
    onSubmit: (values: PasswordFormValues) => void;
    onCancel: () => void;
    isChanging: boolean;
    setIsChanging: (v: boolean) => void;
    showCurrent: boolean;
    setShowCurrent: (v: boolean) => void;
    showNew: boolean;
    setShowNew: (v: boolean) => void;
    showConfirm: boolean;
    setShowConfirm: (v: boolean) => void;
}

const PasswordChangeCard: React.FC<PasswordChangeCardProps> = ({
    form,
    onSubmit,
    onCancel,
    isChanging,
    setIsChanging,
    showCurrent,
    setShowCurrent,
    showNew,
    setShowNew,
    showConfirm,
    setShowConfirm,
}) => (
    <div className="w-full">
        <div className="mb-2">
            <h3 className="text-xl font-bold">Change Password</h3>
            <p className="text-muted-foreground text-sm">Update your password to keep your account secure.</p>
        </div>
        <div className="pt-2">
            {isChanging ? (
                <Form {...form}>
                    <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
                        <FormField
                            control={form.control}
                            name="currentPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Current Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showCurrent ? 'text' : 'password'}
                                                {...field}
                                                required
                                                className="w-full pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0"
                                                onClick={() => setShowCurrent(!showCurrent)}
                                                tabIndex={-1}
                                            >
                                                {showCurrent ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="newPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showNew ? 'text' : 'password'}
                                                {...field}
                                                required
                                                className="w-full pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0"
                                                onClick={() => setShowNew(!showNew)}
                                                tabIndex={-1}
                                            >
                                                {showNew ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormDescription>Password must be at least 6 characters.</FormDescription>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <FormField
                            control={form.control}
                            name="confirmPassword"
                            render={({ field }) => (
                                <FormItem>
                                    <FormLabel>Confirm New Password</FormLabel>
                                    <FormControl>
                                        <div className="relative">
                                            <Input
                                                type={showConfirm ? 'text' : 'password'}
                                                {...field}
                                                required
                                                className="w-full pr-10"
                                            />
                                            <Button
                                                type="button"
                                                variant="ghost"
                                                size="icon"
                                                className="absolute right-0 top-0"
                                                onClick={() => setShowConfirm(!showConfirm)}
                                                tabIndex={-1}
                                            >
                                                {showConfirm ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                                            </Button>
                                        </div>
                                    </FormControl>
                                    <FormMessage />
                                </FormItem>
                            )}
                        />
                        <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                            <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">Cancel</Button>
                            <Button type="submit" className="w-full sm:w-auto">Update Password</Button>
                        </div>
                    </form>
                </Form>
            ) : (
                <div className="py-4">
                    <p className="text-muted-foreground">For security reasons, you&apos;ll need to confirm your current password before setting a new one.</p>
                    <Button onClick={() => setIsChanging(true)} className="mt-4 w-full sm:w-auto">Change Password</Button>
                </div>
            )}
        </div>
    </div>
);

export default PasswordChangeCard; 
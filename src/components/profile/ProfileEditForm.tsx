import React from 'react';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Upload } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';

type ProfileFormValues = {
    name: string;
    email: string;
    phone?: string;
    avatar?: string;
};

interface ProfileEditFormProps {
    form: UseFormReturn<ProfileFormValues>;
    onSubmit: (values: ProfileFormValues) => void;
    onCancel: () => void;
    onAvatarChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
    avatarPreview: string;
    setAvatarPreview: React.Dispatch<React.SetStateAction<string>>;
}

const ProfileEditForm: React.FC<ProfileEditFormProps> = ({ form, onSubmit, onCancel, onAvatarChange, avatarPreview }) => (
    <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 w-full">
            <FormField
                control={form.control}
                name="name"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Full Name</FormLabel>
                        <FormControl>
                            <Input {...field} required className="w-full" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="email"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                            <Input type="email" {...field} required className="w-full" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                    <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                            <Input type="tel" placeholder="Enter phone number" {...field} className="w-full" />
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <FormField
                control={form.control}
                name="avatar"
                render={() => (
                    <FormItem>
                        <FormLabel>Avatar</FormLabel>
                        <FormControl>
                            <div className="flex items-center space-x-4">
                                <Avatar className="h-12 w-12">
                                    {avatarPreview ? (
                                        <AvatarImage src={avatarPreview} alt="Avatar" />
                                    ) : null}
                                    <AvatarFallback className="text-sm">
                                        {form.getValues('name')?.substring(0, 2).toUpperCase() || 'U'}
                                    </AvatarFallback>
                                </Avatar>
                                <label className="cursor-pointer">
                                    <Input
                                        type="file"
                                        accept="image/*"
                                        onChange={onAvatarChange}
                                        className="hidden"
                                    />
                                    <Button type="button" variant="outline" size="icon">
                                        <Upload className="h-4 w-4" />
                                    </Button>
                                </label>
                            </div>
                        </FormControl>
                        <FormMessage />
                    </FormItem>
                )}
            />
            <div className="flex flex-col sm:flex-row justify-end gap-2 pt-2">
                <Button type="button" variant="outline" onClick={onCancel} className="w-full sm:w-auto">Cancel</Button>
                <Button type="submit" className="w-full sm:w-auto">Save Changes</Button>
            </div>
        </form>
    </Form>
);

export default ProfileEditForm; 
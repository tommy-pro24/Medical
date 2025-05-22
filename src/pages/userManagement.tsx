/* eslint-disable react-hooks/exhaustive-deps */
'use client';

import React, { useEffect, useState } from 'react';
import { useData } from '@/context/DataContext';
import { PaginatedItems } from '@/components/histories/PaginatedItems';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { UserCog } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { request } from '@/lib/request';
import UserManagementHeader from '@/components/userManagement/UserManagementHeader';

type User = {
    _id: string,
    name: string;
    email: string;
    role: 'admin' | 'warehouse' | 'client';
    // optionally add id or phone if needed
};

// Define form schema for user creation/editing
const userFormSchema = z.object({
    name: z.string().min(2, {
        message: "Name must be at least 2 characters.",
    }),
    email: z.string().email({
        message: "Please enter a valid email address.",
    }),
    role: z.enum(['client', 'warehouse', 'admin'], {
        required_error: "Please select a role.",
    }),
});

const UserManagement = () => {
    const { getCurrentUser } = useData();
    const [searchTerm, setSearchTerm] = useState('');
    const [dialogOpen, setDialogOpen] = useState(false);
    const [editingUser, setEditingUser] = useState<User | null>(null);
    const currentUser = getCurrentUser();
    const [users, setUsers] = useState<User[]>([]);

    useEffect(() => {
        if (getCurrentUser()) {
            getUsers();
        }
    }, [getCurrentUser()]);

    const getUsers = async () => {
        try {
            const response = await request({
                method: "POST",
                url: '/auth/getAllUsers',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCurrentUser()?.token}`
                }
            });

            if (response) {
                setUsers(response);
            }
        } catch (error) {
            console.error('Error fetching users:', error);
        }
    };

    // Set up form
    const form = useForm<z.infer<typeof userFormSchema>>({
        resolver: zodResolver(userFormSchema),
        defaultValues: {
            name: "",
            email: "",
            role: "client",
        },
    });

    // Filter users based on search term
    const filteredUsers = users?.filter(user => {
        const lowerSearchTerm = searchTerm.toLowerCase();
        return (
            user.name.toLowerCase().includes(lowerSearchTerm) ||
            user.email.toLowerCase().includes(lowerSearchTerm) ||
            user.role.toLowerCase().includes(lowerSearchTerm)
        );
    });

    // Open dialog for adding new user

    // Open dialog for editing user
    const openEditUserDialog = (user: User) => {
        setEditingUser(user);
        form.reset({
            name: user.name,
            email: user.email,
            role: user.role,
        });
        setDialogOpen(true);
    };

    // Handle form submission
    const onSubmit = async (data: z.infer<typeof userFormSchema>) => {
        try {
            if (!editingUser) return;
            setDialogOpen(false);

            await request({
                method: "POST",
                url: "/api/auth/updateUser",
                data: {
                    _id: editingUser._id,
                    name: data.name,
                    email: data.email,
                    role: data.role
                },
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCurrentUser()?.token}`
                }
            }, {
                successMessage: "User role updated successfully!",
                showToast: true
            });

            getUsers();
        } catch (error) {
            console.error('Error updating user:', error);
        }
    };

    // Render items for pagination
    const renderUsers = (items: User[]) => (
        <>
            {/* Table for desktop */}
            <div className="hidden sm:block overflow-x-auto">
                <Table>
                    <TableHeader>
                        <TableRow>
                            <TableHead className="min-w-[120px]">Name</TableHead>
                            <TableHead className="min-w-[200px]">Email</TableHead>
                            <TableHead className="min-w-[100px]">Role</TableHead>
                            <TableHead className="min-w-[100px]">Actions</TableHead>
                        </TableRow>
                    </TableHeader>
                    <TableBody>
                        {items.map(user => (
                            <TableRow key={user._id}>
                                <TableCell className="font-medium">{user.name}</TableCell>
                                <TableCell className="break-all">{user.email}</TableCell>
                                <TableCell className="capitalize">{user.role}</TableCell>
                                <TableCell>
                                    <Button
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => openEditUserDialog(user)}
                                        disabled={currentUser?._id === user._id}
                                        className="w-full sm:w-auto"
                                    >
                                        <UserCog className="mr-2 h-4 w-4" />
                                        <span className="hidden sm:inline">Edit</span>
                                    </Button>
                                </TableCell>
                            </TableRow>
                        ))}
                    </TableBody>
                </Table>
            </div>
            {/* Card/List for mobile */}
            <div className="sm:hidden space-y-4">
                {items.map(user => (
                    <div key={user._id} className="rounded-lg border border-border bg-background p-4 flex flex-col gap-2 shadow-sm">
                        <div className="flex items-center justify-between">
                            <span className="font-semibold">{user.name}</span>
                            <span className="capitalize text-xs px-2 py-1 rounded bg-muted-foreground/10 text-muted-foreground">{user.role}</span>
                        </div>
                        <div className="text-xs break-all text-muted-foreground">{user.email}</div>
                        <div className="flex justify-end mt-2">
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditUserDialog(user)}
                                disabled={currentUser?._id === user._id}
                                className="w-full"
                            >
                                <UserCog className="mr-2 h-4 w-4" />
                                Edit
                            </Button>
                        </div>
                    </div>
                ))}
            </div>
        </>
    );

    return (
        <div className="p-4 sm:p-6 max-w-7xl mx-auto w-full">
            <UserManagementHeader search={searchTerm} setSearch={setSearchTerm} />
            <PaginatedItems
                items={filteredUsers}
                itemsPerPage={10}
                renderItems={renderUsers}
                className="mt-4"
            />

            {/* User Form Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent className="sm:max-w-[425px]">
                    <DialogHeader>
                        <DialogTitle className="text-lg sm:text-xl">
                            {editingUser ? 'Edit User' : 'Add New Client'}
                        </DialogTitle>
                        <DialogDescription className="text-sm sm:text-base">
                            {editingUser
                                ? 'Make changes to the user account details.'
                                : 'Fill in the information to create a new client user.'}
                        </DialogDescription>
                    </DialogHeader>

                    <Form {...form}>
                        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
                            <FormField
                                control={form.control}
                                name="name"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm sm:text-base">Name</FormLabel>
                                        <FormControl>
                                            <Input placeholder="Enter full name" {...field} />
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
                                        <FormLabel className="text-sm sm:text-base">Email</FormLabel>
                                        <FormControl>
                                            <Input placeholder="email@example.com" type="email" {...field} />
                                        </FormControl>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <FormField
                                control={form.control}
                                name="role"
                                render={({ field }) => (
                                    <FormItem>
                                        <FormLabel className="text-sm sm:text-base">Role</FormLabel>
                                        <FormControl>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm sm:text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50"
                                                {...field}
                                            >
                                                <option value="client">Client</option>
                                                <option value="warehouse">Warehouse</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </FormControl>
                                        <FormDescription className="text-xs sm:text-sm">
                                            {!editingUser && 'New clients default to "Client" role.'}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit" className="w-full sm:w-auto">
                                    Save Changes
                                </Button>
                            </DialogFooter>
                        </form>
                    </Form>
                </DialogContent>
            </Dialog>
        </div>
    );
};

export default UserManagement;

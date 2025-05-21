import React, { useEffect, useState } from 'react';
import { useData } from '@/context/DataContext';
import { PaginatedItems } from '@/components/histories/PaginatedItems';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogFooter } from '@/components/ui/dialog';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { useForm } from 'react-hook-form';
import { UserCog, Search } from 'lucide-react';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { request } from '@/lib/request';

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
        if (getCurrentUser()) getUsers();
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [getCurrentUser()])

    const getUsers = async () => {
        console.log(getCurrentUser()?.role);
        try {

            const response = await request({
                method: "POST",
                url: '/auth/getAllUsers',
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${getCurrentUser()?.token}`
                }
            })

            if (response) {
                setUsers(response);
            }

        } catch (error) {
            console.log(error);
        }

    }

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
                url: "/auth/updateUser",
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
            })

            getUsers();
        } catch (error) {
            console.log(error);
        }
    };

    // Render items for pagination
    const renderUsers = (items: User[]) => (
        <Table>
            <TableHeader>
                <TableRow>
                    <TableHead>Name</TableHead>
                    <TableHead>Email</TableHead>
                    <TableHead>Role</TableHead>
                    <TableHead>Actions</TableHead>
                </TableRow>
            </TableHeader>
            <TableBody>
                {items.map(user => (
                    <TableRow key={user._id}>
                        <TableCell>{user.name}</TableCell>
                        <TableCell>{user.email}</TableCell>
                        <TableCell className="capitalize">{user.role}</TableCell>
                        <TableCell>
                            <Button
                                variant="ghost"
                                size="sm"
                                onClick={() => openEditUserDialog(user)}
                                disabled={currentUser?._id === user._id} // Prevent editing own account
                            >
                                <UserCog className="mr-2" />
                                Edit
                            </Button>
                        </TableCell>
                    </TableRow>
                ))}
            </TableBody>
        </Table>
    );

    return (
        <div className="p-6 max-w-7xl mx-auto w-full">
            <div className="flex items-center justify-between mb-6">
                <div>
                    <h1 className="text-2xl font-bold">User Management</h1>
                    <p className="text-muted-foreground">Manage system users and clients</p>
                </div>
            </div>

            <div className="mb-6">
                <div className="relative">
                    <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
                    <Input
                        placeholder="Search users..."
                        className="pl-8"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                    />
                </div>
            </div>

            <PaginatedItems
                items={filteredUsers}
                itemsPerPage={10}
                renderItems={renderUsers}
                className="mt-4"
            />

            {/* User Form Dialog */}
            <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            {editingUser ? 'Edit User' : 'Add New Client'}
                        </DialogTitle>
                        <DialogDescription>
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
                                        <FormLabel>Name</FormLabel>
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
                                        <FormLabel>Email</FormLabel>
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
                                        <FormLabel>Role</FormLabel>
                                        <FormControl>
                                            <select
                                                className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-base ring-offset-background file:border-0 file:bg-transparent file:text-sm file:font-medium file:text-foreground placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50 md:text-sm"
                                                {...field}
                                            >
                                                <option value="client">Client</option>
                                                <option value="warehouse">Warehouse</option>
                                                <option value="admin">Admin</option>
                                            </select>
                                        </FormControl>
                                        <FormDescription>
                                            {!editingUser && 'New clients default to "Client" role.'}
                                        </FormDescription>
                                        <FormMessage />
                                    </FormItem>
                                )}
                            />

                            <DialogFooter>
                                <Button type="submit">
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

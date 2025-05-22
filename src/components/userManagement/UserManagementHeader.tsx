import React from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';

interface UserManagementHeaderProps {
    search: string;
    setSearch: (v: string) => void;
}

const UserManagementHeader: React.FC<UserManagementHeaderProps> = ({ search, setSearch }) => (
    <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 mb-6">
        <div>
            <h1 className="text-xl sm:text-2xl font-bold">User Management</h1>
            <p className="text-sm sm:text-base text-muted-foreground">Manage system users and clients</p>
        </div>
        <div className="relative w-full sm:w-80">
            <Search className="absolute left-2.5 top-2.5 h-4 w-4 text-muted-foreground" />
            <Input
                placeholder="Search users..."
                className="pl-8 w-full"
                value={search}
                onChange={e => setSearch(e.target.value)}
            />
        </div>
    </div>
);

export default UserManagementHeader; 
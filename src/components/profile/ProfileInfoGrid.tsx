import React from 'react';
import { Mail, Phone, User, Shield } from 'lucide-react';

interface ProfileInfoGridProps {
    name: string;
    email: string;
    phone?: string;
    role: string;
}

const infoItems = [
    { label: 'Full Name', icon: User },
    { label: 'Email', icon: Mail },
    { label: 'Phone', icon: Phone },
    { label: 'Role', icon: Shield },
];

const ProfileInfoGrid: React.FC<ProfileInfoGridProps> = ({ name, email, phone, role }) => {
    const values = [name, email, phone || 'Not provided', role];
    return (
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full">
            {infoItems.map((item, idx) => (
                <div
                    key={item.label}
                    className="flex items-center gap-3 p-4 rounded-xl bg-muted/60 shadow-sm border border-border/30"
                >
                    <item.icon className="h-5 w-5 text-primary/80" />
                    <div>
                        <div className="text-xs text-muted-foreground font-medium">{item.label}</div>
                        <div className="text-base font-semibold break-words">{values[idx]}</div>
                    </div>
                </div>
            ))}
        </div>
    );
};

export default ProfileInfoGrid; 
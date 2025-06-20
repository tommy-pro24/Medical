import React from 'react';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ProfileHeaderProps {
    name: string;
    role: string;
    avatar?: string;
}

const getInitials = (name: string) => {
    return name
        .split(' ')
        .map(part => part[0])
        .join('')
        .toUpperCase();
};

const ProfileHeader: React.FC<ProfileHeaderProps> = ({ name, role, avatar }) => {
    const handleImageError = (error: React.SyntheticEvent<HTMLImageElement, Event>) => {
        console.error('Avatar image failed to load:', error);
        console.error('Avatar URL was:', avatar);
    };

    return (
        <div className="flex flex-col items-center gap-2 py-6">
            <Avatar className="h-20 w-20 shadow-lg border-4 border-primary/30">
                <AvatarImage
                    src={avatar}
                    alt={name}
                    onError={handleImageError}
                />
                <AvatarFallback className="text-2xl bg-primary/20 text-primary font-bold">
                    {getInitials(name)}
                </AvatarFallback>
            </Avatar>
            <div className="text-center mt-2">
                <h2 className="text-2xl font-bold leading-tight">{name}</h2>
                <span className="text-sm text-muted-foreground capitalize">{role}</span>
            </div>
        </div>
    );
};

export default ProfileHeader; 
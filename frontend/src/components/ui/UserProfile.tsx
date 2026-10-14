import { FC } from "react";

interface UserProfileProps {
  user: {
    email: string;
    full_name: string;
    phone?: string | null;
  } | null;
}

export const UserProfile: FC<UserProfileProps> = ({ user }) => {
  if (!user) {
    return null;
  }

  // Get initials from full_name (first letters of each word, up to two)
  const getInitials = (name: string) => {
    return name
      .split(" ")
      .map((part) => part[0])
      .slice(0, 2)
      .join("")
      .toUpperCase();
  };

  return (
    <div className="relative">
      <div className="flex items-center space-x-2">
        <div className="h-8 w-8 bg-navy-200 rounded-full flex items-center justify-center">
          <span className="text-navy-600 font-medium">{getInitials(user.full_name)}</span>
        </div>
        <div className="space-y-0">
          <p className="text-sm font-medium text-navy-800">{user.full_name}</p>
          <p className="text-xs text-navy-500">{user.email}</p>
        </div>
      </div>
    </div>
  );
};
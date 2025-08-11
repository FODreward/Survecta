import { useQuery } from '@tanstack/react-query';
import { type User } from "@shared/schema";

interface ProfileProps {
  onReturnToDashboard: () => void;
}

export default function ProfileSection({ onReturnToDashboard }: ProfileProps) {
  const { data: users, isLoading, error } = useQuery<User[]>({
    queryKey: ["/api/users"],
  });

  const user = users?.[0]; // Get first user (demo user)

  if (isLoading) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
        <div className="flex items-center justify-center min-h-[200px] text-gray-500 text-lg">
          Loading profile...
        </div>
      </div>
    );
  }

  if (error || !user) {
    return (
      <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
        <div className="flex items-center justify-center min-h-[200px] text-red-500 text-lg">
          Failed to load profile.
          <button 
            onClick={onReturnToDashboard}
            className="ml-4 px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
          >
            Return to Dashboard
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white p-8 rounded-2xl shadow-lg max-w-2xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h3 className="text-2xl font-bold text-gray-900 flex items-center space-x-2">
          <span>👤</span>
          <span>Your Profile</span>
        </h3>
        <button 
          onClick={onReturnToDashboard}
          className="px-4 py-2 bg-gray-600 hover:bg-gray-700 text-white rounded-lg transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-lg">
        <p>
          <strong className="text-gray-900">Email:</strong>{" "}
          <span className="text-gray-600">{user.email}</span>
        </p>
        <p>
          <strong className="text-gray-900">Full Name:</strong>{" "}
          <span className="text-gray-600">{user.name || "N/A"}</span>
        </p>
        <p>
          <strong className="text-gray-900">Phone:</strong>{" "}
          <span className="text-gray-600">{user.phone || "N/A"}</span>
        </p>
        <p>
          <strong className="text-gray-900">Age:</strong>{" "}
          <span className="text-gray-600">{user.age || "N/A"}</span>
        </p>
        <p className="col-span-full">
          <strong className="text-gray-900">Created At:</strong>{" "}
          <span className="text-gray-600">{new Date(user.createdAt).toLocaleString()}</span>
        </p>
      </div>
    </div>
  );
}

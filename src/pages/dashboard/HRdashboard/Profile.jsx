import { useContext } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import "../../../components/RobotLoader/RobotLoader.css";

const Profile = () => {
  const { profile, loading } = useContext(AuthContext);

  if (loading) return <RobotLoader></RobotLoader>;

  // Ensure profileImage has a valid fallback
  const profilePhoto = profile?.profileImage?.trim() 
    ? profile.profileImage 
    : profile?.photoURL?.trim() 
    ? profile.photoURL 
    : "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCZsfNob2iOuqhaj7kUj7Bc_XDDyilN3T32Q&s";

  return (
    <div className="flex justify-center mt-8 pb-10">
      <title>HR Profile</title>
      <div className="relative group">
        {/* Gradient border glow */}
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-500"></div>

        <div className="relative bg-base-100 rounded-lg shadow-lg p-6 w-96 transition-transform duration-300 group-hover:scale-105">
          <h2 className="text-2xl font-bold mb-6 text-center">HR Profile</h2>

          {/* Profile photo */}
          <div className="flex justify-center mb-4">
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 ring-4 ring-blue-400 ring-opacity-75 animate-pulse"
            />
          </div>

          {/* Info fields */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={profile?.name || ""}
                readOnly
                className="input input-bordered w-full bg-base-200 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Email</label>
              <input
                type="email"
                value={profile?.email || ""}
                readOnly
                className="input input-bordered w-full bg-base-200 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Company</label>
              <input
                type="text"
                value={profile?.companyName || ""}
                readOnly
                className="input input-bordered w-full bg-base-200 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Position / Role</label>
              <input
                type="text"
                value={profile?.role || ""}
                readOnly
                className="input input-bordered w-full bg-base-200 cursor-not-allowed"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;

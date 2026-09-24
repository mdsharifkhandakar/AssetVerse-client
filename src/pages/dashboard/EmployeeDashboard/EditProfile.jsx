import { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import { useNavigate } from "react-router";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import "../../../components/RobotLoader/RobotLoader.css";

const EditProfile = () => {
  const { user, profile, loading, refreshProfile } = useContext(AuthContext);
  const navigate = useNavigate();
  const API_URL = import.meta.env.VITE_API_URL || "";

  // Initialize state from profile safely
  const [displayName, setDisplayName] = useState(profile?.name || "");
  const [photoURL, setPhotoURL] = useState(profile?.profileImage || user?.photoURL || "");

  if (loading) return <RobotLoader></RobotLoader>;

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!displayName.trim()) {
      toast.error("Name cannot be empty");
      return;
    }

    try {
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        toast.error("Please login first");
        return;
      }
      const token = await currentUser.getIdToken();
      await axios.put(
        `${API_URL}/users/${profile.email}`,
        { displayName, photoURL },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshProfile();
      toast.success("Profile updated successfully!");
      navigate("/dashboard/employeeProfile");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    }
  };

  return (
    <div className="flex justify-center mt-8 pb-10">
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-500"></div>
        <div className="relative bg-base-100 rounded-lg shadow-lg p-6 w-96 transition-transform duration-300 group-hover:scale-105">
          <h2 className="text-2xl font-bold mb-6 text-center">Edit Profile</h2>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="flex justify-center mb-4">
              <img
                src={photoURL || ""}
                alt="Profile"
                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 ring-4 ring-blue-400 ring-opacity-75 animate-pulse"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Profile Photo URL</label>
              <input
                type="text"
                value={photoURL}
                onChange={(e) => setPhotoURL(e.target.value)}
                className="input input-bordered w-full transition duration-300 hover:scale-105"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-1">Full Name</label>
              <input
                type="text"
                value={displayName}
                onChange={(e) => setDisplayName(e.target.value)}
                className="input input-bordered w-full transition duration-300 hover:scale-105"
                required
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

            <div className="flex justify-center">
              <button
                type="submit"
                className="mt-4 px-6 py-2 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:scale-105 transition-transform duration-300"
              >
                Save Changes
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
};

export default EditProfile;

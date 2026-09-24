import { useContext, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import "../../../components/RobotLoader/RobotLoader.css";

const Profile = () => {
  const { profile, loading, refreshProfile } = useContext(AuthContext);
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [name, setName] = useState("");
  const [photoURL, setPhotoURL] = useState("");

  const API_URL = import.meta.env.VITE_API_URL || "";

  if (loading) return <RobotLoader></RobotLoader>;

  const profilePhoto =
    photoURL?.trim() ||
    profile?.profileImage?.trim() ||
    profile?.photoURL?.trim() ||
    "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQCZsfNob2iOuqhaj7kUj7Bc_XDDyilN3T32Q&s";

  const startEdit = () => {
    setName(profile?.name || "");
    setPhotoURL(profile?.profileImage || profile?.photoURL || "");
    setEditing(true);
  };

  const handleSave = async (e) => {
    e.preventDefault();
    if (!name.trim()) {
      toast.error("Name cannot be empty");
      return;
    }
    try {
      setSaving(true);
      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        toast.error("Please login first");
        return;
      }
      const token = await currentUser.getIdToken();
      await axios.put(
        `${API_URL}/users/${profile.email}`,
        {
          displayName: name.trim(),
          photoURL: photoURL.trim(),
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );
      await refreshProfile();
      setEditing(false);
      toast.success("Profile updated successfully!");
    } catch (err) {
      console.error(err);
      toast.error(err?.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="flex justify-center mt-8 pb-10">
      <title>HR Profile</title>
      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-500"></div>

        <div className="relative bg-base-100 rounded-lg shadow-lg p-6 w-96 transition-transform duration-300 group-hover:scale-105">
          <h2 className="text-2xl font-bold mb-6 text-center">HR Profile</h2>

          <div className="flex justify-center mb-4">
            <img
              src={profilePhoto}
              alt="Profile"
              className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 ring-4 ring-blue-400 ring-opacity-75 animate-pulse"
            />
          </div>

          {editing ? (
            <form onSubmit={handleSave} className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-1">Profile Photo URL</label>
                <input
                  type="text"
                  value={photoURL}
                  onChange={(e) => setPhotoURL(e.target.value)}
                  className="input input-bordered w-full"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-1">Full Name</label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  className="input input-bordered w-full"
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
              <div>
                <label className="block text-sm font-medium mb-1">Company</label>
                <input
                  type="text"
                  value={profile?.companyName || ""}
                  readOnly
                  className="input input-bordered w-full bg-base-200 cursor-not-allowed"
                />
              </div>
              <div className="flex gap-2">
                <button
                  type="submit"
                  disabled={saving}
                  className="flex-1 px-4 py-2 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:scale-105 transition-transform disabled:opacity-70"
                >
                  {saving ? "Saving..." : "Save"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setEditing(false)}
                  disabled={saving}
                >
                  Cancel
                </button>
              </div>
            </form>
          ) : (
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
              <button
                type="button"
                onClick={startEdit}
                className="w-full px-4 py-2 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:scale-105 transition-transform"
              >
                Edit Profile
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Profile;

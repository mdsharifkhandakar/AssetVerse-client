import { useContext, useEffect, useState } from "react";
import { AuthContext } from "../../../Context/AuthContext";
import { useNavigate } from "react-router";
import axios from "axios";
import toast from "react-hot-toast";
import { UserRoundPen } from "lucide-react";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import "../../../components/RobotLoader/RobotLoader.css";

const Profile = () => {
    const { user, loading } = useContext(AuthContext);
    const [affiliations, setAffiliations] = useState([]);
    const navigate = useNavigate();

    const API_URL = import.meta.env.VITE_API_URL || "";

    // Fetch employee affiliations
    useEffect(() => {
        if (!user?.email) return;

        const fetchAffiliations = async () => {
            try {
                const { data } = await axios.get(`${API_URL}/employee-affiliations`, {
                    params: { email: user.email },
                });
                setAffiliations(data);
            } catch (err) {
                console.error(err);
                toast.error("Failed to load affiliations");
            }
        };

        fetchAffiliations();
    }, [user?.email]);

    if (loading) return <RobotLoader></RobotLoader>;

    return (
        <div className="flex justify-center mt-8 pb-10">
            <title>Employee Profile</title>
            {/* Card Wrapper with hover gradient border */}
            <div className="relative group">
                {/* Gradient border effect */}
                <div className="absolute -inset-1 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 rounded-lg blur opacity-25 group-hover:opacity-100 transition duration-500"></div>

                {/* Card Content */}
                <div className="relative bg-base-100 rounded-lg shadow-lg p-6 w-96 transition-transform duration-300 group-hover:scale-105">
                    <div className="flex flex-col items-center">
                        {/* Profile Picture with cyan glowing ring */}
                        <div className="relative">
                            <img
                                src={user?.photoURL || ""}
                                alt="Profile"
                                className="w-32 h-32 rounded-full object-cover border-4 border-gray-200 ring-4 ring-blue-400 ring-opacity-75 animate-pulse"
                            />
                        </div>

                        {/* Name */}
                        <h2 className="text-2xl font-bold mb-1">{user?.displayName || "No Name"}</h2>

                        {/* Email (Read-only) */}
                        <p className="text-base-content/60 mb-4">{user?.email}</p>

                        {/* Company Affiliations */}
                        <div className="w-full mt-4">
                            <h3 className="text-lg font-semibold mb-2">Current Company Affiliations</h3>
                            {affiliations.length === 0 ? (
                                <p className="text-base-content/60">No active affiliations</p>
                            ) : (
                                <ul className="space-y-2">
                                    {affiliations.map((aff) => (
                                        <li
                                            key={aff._id}
                                            className="flex items-center p-2 bg-base-200 rounded-lg hover:bg-base-300 transition"
                                        >
                                            {aff.companyLogo && (
                                                <img
                                                    src={aff.companyLogo}
                                                    alt={aff.companyName}
                                                    className="w-8 h-8 rounded-full mr-2 object-cover"
                                                />
                                            )}
                                            <span className="font-medium">{aff.companyName}</span>
                                        </li>
                                    ))}
                                </ul>
                            )}
                        </div>

                        {/* Edit Profile Button */}
                        <button
                            onClick={() => navigate("/employeeEditProfile")}
                            className="mt-6 px-6 py-2 font-semibold text-white rounded-lg bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:scale-105 transition-transform duration-300 flex items-center justify-center gap-2"
                        >
                            Edit Profile
                            <UserRoundPen size={20} />
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default Profile;

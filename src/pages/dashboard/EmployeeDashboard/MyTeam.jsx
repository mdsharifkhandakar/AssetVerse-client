import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import "../../../components/RobotLoader/RobotLoader.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const MyTeam = () => {
    const { user } = useContext(AuthContext);

    const [companies, setCompanies] = useState([]);
    const [selectedCompany, setSelectedCompany] = useState("");
    const [teamMembers, setTeamMembers] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch affiliated companies for employee
    useEffect(() => {
        if (!user?.email) return;

        axios
            .get(`${API_URL}/employee-affiliations?email=${user.email}`)
            .then(res => {
                setCompanies(res.data || []);
                if (res.data?.length > 0) {
                    setSelectedCompany(res.data[0].companyName);
                }
                setLoading(false);
            })
            .catch(() => {
                toast.error("Failed to load affiliations");
                setLoading(false);
            });
    }, [user?.email]);

    // Fetch team members when company changes
    useEffect(() => {
        if (!selectedCompany) return;

        axios
            .get(`${API_URL}/company-employees?company=${selectedCompany}`)
            .then(res => setTeamMembers(res.data || []))
            .catch(() => toast.error("Failed to load team members"));
    }, [selectedCompany]);

    // Get current month birthdays
    const currentMonth = new Date().getMonth();
    const upcomingBirthdays = teamMembers.filter(member => {
        if (!member.dateOfBirth) return false;
        return new Date(member.dateOfBirth).getMonth() === currentMonth;
    });

    if (loading) {
        return <RobotLoader></RobotLoader>;
    }

    return (
        <div className="p-6">
            <title>My Team</title>
            {/* Header */}
            <h2 className="text-3xl font-bold text-base-content mb-1">My Team</h2>
            <p className="text-base-content/60 mb-6">
                View your colleagues by company
            </p>

            {/* Company Selector */}
            {companies.length > 0 && (
                <div className="mb-6">
                    <select
                        className="select select-bordered w-full md:w-1/3"
                        value={selectedCompany}
                        onChange={(e) => setSelectedCompany(e.target.value)}
                    >
                        {companies.map((c, index) => (
                            <option key={index} value={c.companyName}>
                                {c.companyName}
                            </option>
                        ))}
                    </select>
                </div>
            )}

            {/* Empty State */}
            {teamMembers.length === 0 ? (
                <div className="text-center py-12">
                    <p className="text-lg font-medium">No team members found</p>
                    <p className="text-base-content/60">
                        You are the first member in this company.
                    </p>
                </div>
            ) : (
                <>
                    {/* Team Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        {teamMembers.map(member => (
                            <div
                                key={member._id}
                                className="bg-base-100 shadow-md rounded-2xl border border-base-300 
                                           transform transition duration-300 hover:scale-105 hover:-translate-y-1
                                           hover:shadow-lg hover:border-blue-400"
                            >
                                <div className="flex flex-col items-center text-center p-6">
                                    <img
                                            src={member.profileImage || ""}
                                        alt={member.name}
                                        className="w-20 h-20 rounded-full object-cover shadow-md"
                                    />
                                    <h3 className="font-semibold text-lg mt-2">
                                        {member.name}
                                    </h3>
                                    <p className="text-sm text-base-content/60">
                                        {member.email}
                                    </p>
                                    <span className="badge badge-outline mt-2 text-blue-600 border-blue-400">
                                        Employee
                                    </span>
                                </div>
                            </div>
                        ))}
                    </div>

                    {/* Upcoming Birthdays */}
                    {upcomingBirthdays.length > 0 && (
                        <div className="mt-10">
                            <h3 className="text-xl font-bold mb-4 text-base-content">
                                🎉 Upcoming Birthdays
                            </h3>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                {upcomingBirthdays.map(member => (
                                    <div
                                        key={member._id}
                                        className="flex items-center gap-4 p-4 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400
                                                   text-white shadow-md transform transition duration-300 hover:scale-105 hover:-translate-y-1"
                                    >
                                        <img
                                        src={member.profileImage || ""}
                                            alt={member.name}
                                            className="w-12 h-12 rounded-full object-cover border-2 border-white"
                                        />
                                        <div>
                                            <p className="font-semibold">{member.name}</p>
                                            <p className="text-sm">
                                                🎂 {new Date(member.dateOfBirth).toLocaleDateString()}
                                            </p>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </div>
    );
};

export default MyTeam;

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthContext";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import "../../../components/RobotLoader/RobotLoader.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const Requests = () => {
    const { user } = useContext(AuthContext);
    const [requests, setRequests] = useState([]);
    const [loading, setLoading] = useState(true);

    // Fetch all requests for this HR
    useEffect(() => {
        if (!user?.email) return;

        axios
            .get(`${API_URL}/requests?hrEmail=${user.email}`)
            .then((res) => {
                setRequests(res.data);
                setLoading(false);
            })
            .catch((err) => {
                console.error(err);
                toast.error("Failed to fetch requests");
                setLoading(false);
            });
    }, [user]);

    // Approve or Reject request
    const handleAction = async (id, action) => {
        try {
            await axios.put(`${API_URL}/requests/${id}`, {
                requestStatus: action,
                processedBy: user.email
            });

            setRequests((prev) =>
                prev.map((r) =>
                    r._id === id ? { ...r, requestStatus: action } : r
                )
            );

            toast.success(`Request ${action} successfully`);
        } catch (err) {
            console.error(err);
            toast.error("Failed to update request");
        }
    };

    if (loading) return <RobotLoader />;
    if (!user) return null;

    return (
        <div className="p-4 sm:p-6 lg:p-8">
            <title>All Requests</title>
            <h2 className="text-3xl font-bold mb-2 text-base-content">
                All Asset Requests
            </h2>
            <p className="text-base-content/60 mb-6">
                Review and manage employee asset requests
            </p>

            {requests.length === 0 ? (
                <div className="text-center py-10">
                    <p className="text-lg font-medium">No requests found</p>
                    <p className="text-base-content/60">
                        There are no asset requests at the moment.
                    </p>
                </div>
            ) : (
                <div className="overflow-x-auto relative">
                    <table className="min-w-full bg-base-100 shadow-lg divide-y divide-base-300 border-2 border-blue-400/50 rounded-2xl hover:shadow-blue-400/50 transition-shadow">
                        <thead className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400">
                            <tr>
                                <th className="px-3 sm:px-4 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    S/N
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Asset
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Employee
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Company
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Type
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-left text-xs font-medium text-white uppercase tracking-wider">
                                    Status
                                </th>
                                <th className="px-3 sm:px-6 py-3 text-center text-xs font-medium text-white uppercase tracking-wider">
                                    Action
                                </th>
                            </tr>
                        </thead>
                        <tbody className="divide-y divide-base-300">
                            {requests.map((request, index) => (
                                <tr key={request._id} className="hover:bg-base-200 transition">
                                    <td className="px-3 sm:px-4 py-4 whitespace-nowrap text-base-content font-medium text-center">
                                        {index + 1}
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap flex items-center justify-center sm:justify-start gap-3">
                                        <div className="flex-shrink-0 flex items-center justify-center w-14 h-14 bg-base-200 rounded-lg overflow-hidden">
                                            <img
                                                src={request.assetImage || request.productImage || "https://via.placeholder.com/150"}
                                                alt={request.assetName}
                                                className="max-h-full max-w-full object-contain"
                                            />
                                        </div>
                                        <span className="font-medium text-base-content text-center sm:text-left">
                                            {request.assetName}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-base-content/70">
                                        {request.requesterName}<br />
                                        <span className="text-xs text-base-content/50">{request.requesterEmail}</span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-base-content/70">
                                        {request.companyName}
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap text-base-content/70">
                                        {request.assetType}
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                        <span className={`px-2 py-1 text-xs font-semibold rounded-full ${request.requestStatus === "pending"
                                            ? "bg-yellow-100 text-yellow-800"
                                            : request.requestStatus === "approved"
                                                ? "bg-green-100 text-green-800"
                                                : "bg-red-100 text-red-800"
                                            }`}>
                                            {request.requestStatus.toUpperCase()}
                                        </span>
                                    </td>
                                    <td className="px-3 sm:px-6 py-4 whitespace-nowrap">
                                        <div className="flex justify-center gap-2 flex-wrap">
                                            {request.requestStatus === "pending" ? (
                                                <>
                                                    <button
                                                        className="py-1 px-3 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 
                                                       text-white rounded-lg text-sm font-medium 
                                                       hover:scale-105 transition-transform"
                                                        onClick={() => handleAction(request._id, "approved")}
                                                    >
                                                        Approve
                                                    </button>

                                                    <button
                                                        className="py-1 px-3 bg-red-500 text-white rounded-lg text-sm font-medium 
                                                       hover:scale-105 transition-transform"
                                                        onClick={() => handleAction(request._id, "rejected")}
                                                    >
                                                        Reject
                                                    </button>
                                                </>
                                            ) : (
                                                <span className="text-sm text-base-content/60 italic">
                                                    No actions
                                                </span>
                                            )}
                                        </div>
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                </div>
            )}
        </div>
    );
};

export default Requests;

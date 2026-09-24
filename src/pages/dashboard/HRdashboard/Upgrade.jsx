import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { getAuth } from "firebase/auth";
import { AuthContext } from "../../../Context/AuthContext";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import "../../../components/RobotLoader/RobotLoader.css";

const Upgrade = () => {
  const { profile, loading } = useContext(AuthContext);
  const [packages, setPackages] = useState([]);
  const [payments, setPayments] = useState([]);
  const [processingId, setProcessingId] = useState(null);

  const SERVER_URL = import.meta.env.VITE_API_URL || "";

  // Fetch packages
  useEffect(() => {
    axios
      .get(`${SERVER_URL}/packages`)
      .then((res) => setPackages(res.data))
      .catch(() => toast.error("Failed to load packages"));
  }, []);

  // Fetch payment history
  const fetchPayments = async () => {
    if (!profile?.email) return;
    try {
      const res = await axios.get(`${SERVER_URL}/payments?email=${profile.email}`);
      setPayments(res.data);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch payment history");
    }
  };

  useEffect(() => {
    fetchPayments();
  }, [profile]);

  // Handle Stripe checkout
  const handleUpgrade = async (pkg) => {
    if (!profile?.email) return toast.error("Unauthorized");

    try {
      setProcessingId(pkg._id);

      // Persist package choice so success page can apply the upgrade after Stripe
      localStorage.setItem(
        "av_pending_upgrade",
        JSON.stringify({
          packageName: pkg.name,
          employeeLimit: pkg.employeeLimit,
          amount: pkg.price,
        })
      );

      const currentUser = getAuth().currentUser;
      if (!currentUser) {
        localStorage.removeItem("av_pending_upgrade");
        toast.error("Please login first");
        return;
      }
      const token = await currentUser.getIdToken();

      const res = await axios.post(
        `${SERVER_URL}/create-checkout-session`,
        {
          cost: Number(pkg.price),
          parcelName: pkg.name,
          senderEmail: profile.email,
          parcelId: pkg._id,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      if (res.data?.url) {
        window.location.href = res.data.url; // redirect to Stripe
      } else {
        throw new Error("Stripe session URL missing");
      }
    } catch (err) {
      console.error("Stripe error:", err);
      localStorage.removeItem("av_pending_upgrade");
      toast.error("Payment initialization failed");
    } finally {
      setProcessingId(null);
    }
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center min-h-[60vh]">
        <RobotLoader></RobotLoader>
      </div>
    );
  }

  return (
    <div className="min-h-screen px-4 py-10 bg-base-100">
      <title>Upgrade Package</title>
      {/* Header */}
      <div className="text-center mb-12">
        <h2 className="text-3xl md:text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
          Upgrade Your Package
        </h2>
        <p className="mt-3 text-base-content/60 max-w-xl mx-auto">
          Unlock higher employee limits with premium subscriptions.
        </p>
      </div>

      {/* Packages */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto mb-10">
        {packages.map((pkg) => (
          <div
            key={pkg._id}
            className="relative rounded-xl p-[2px] bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 animate-gradient-x"
          >
            <div className="card bg-base-100 h-full shadow-md hover:shadow-2xl transition-all duration-300 hover:-translate-y-2">
              <div className="card-body flex flex-col justify-between">
                <div>
                  <h3 className="text-xl font-semibold text-center">{pkg.name}</h3>
                  <div className="text-center my-4">
                    <span className="text-4xl font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 bg-clip-text text-transparent">
                      ${pkg.price}
                    </span>
                    <span className="text-sm text-base-content/60"> / month</span>
                  </div>
                  <p className="text-center font-medium mb-4">
                    Employee Limit:{" "}
                    <span className="font-bold">{pkg.employeeLimit}</span>
                  </p>
                  <ul className="space-y-2 text-sm text-base-content/70 mb-6">
                    {pkg.features.map((feature, index) => (
                      <li key={index} className="flex items-center gap-2">
                        <span className="text-green-500">✔</span>
                        {feature}
                      </li>
                    ))}
                  </ul>
                </div>

                <button
                  disabled={processingId === pkg._id}
                  onClick={() => handleUpgrade(pkg)}
                  className="btn w-full text-white border-0
                    bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400
                    hover:opacity-90 transition-all duration-300"
                >
                  {processingId === pkg._id ? "Processing..." : "Upgrade Now"}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Payment History */}
      <div className="max-w-6xl mx-auto">
        <h3 className="text-2xl font-bold mb-6">Payment History</h3>
        {payments.length === 0 ? (
          <p className="text-base-content/60">No payments found.</p>
        ) : (
          <div className="overflow-x-auto">
            <table className="table w-full">
              <thead>
                <tr className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white">
                  <th>S/N</th>
                  <th>Date & Time</th>
                  <th>Package</th>
                  <th>Amount</th>
                  <th>Status</th>
                  <th>Transaction ID</th>
                </tr>
              </thead>
              <tbody>
                {payments.map((pay, index) => (
                  <tr key={pay._id}>
                    <td>{index + 1}</td>
                    <td>{new Date(pay.paymentDate || pay.createdAt).toLocaleString()}</td>
                    <td>{pay.packageName}</td>
                    <td>${pay.amount}</td>
                    <td>{pay.status}</td>
                    <td>{pay.transactionId}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>

      {/* Gradient Animation */}
      <style>
        {`
          .animate-gradient-x {
            background-size: 300% 300%;
            animation: gradientMove 6s ease infinite;
          }
          @keyframes gradientMove {
            0% { background-position: 0% 50%; }
            50% { background-position: 100% 50%; }
            100% { background-position: 0% 50%; }
          }
        `}
      </style>
    </div>
  );
};

export default Upgrade;

import { useContext, useEffect, useState } from "react";
import axios from "axios";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthContext";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import "../../../components/RobotLoader/RobotLoader.css";

const API_URL = import.meta.env.VITE_API_URL || "";

const RequestAsset = () => {
  const { user } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [selectedAsset, setSelectedAsset] = useState(null);
  const [note, setNote] = useState("");
  const [loading, setLoading] = useState(true);
  const [requests, setRequests] = useState([]);

  // Fetch assets
  const fetchAssets = async () => {
    try {
      const res = await axios.get(`${API_URL}/assets`);
      const availableAssets = res.data.assets.filter(
        (asset) => asset.availableQuantity > 0
      );
      setAssets(availableAssets);
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch assets");
    }
  };

  // Fetch employee requests
  const fetchRequests = async () => {
    if (!user) return;
    try {
      const res = await axios.get(
        `${API_URL}/requests?userEmail=${user.email}`
      );
      setRequests(res.data);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  // Initial fetch
  useEffect(() => {
    if (!user) return;
    fetchAssets();
    fetchRequests();

    // Polling every 5 seconds to get updated status from HR
    const interval = setInterval(fetchRequests, 5000);
    return () => clearInterval(interval);
  }, [user]);

  // Submit request
  const handleRequest = async () => {
    if (!selectedAsset) return;

    const requestData = {
      assetId: selectedAsset._id,
      assetName: selectedAsset.productName,
      assetType: selectedAsset.productType,
      productImage: selectedAsset.productImage,
      requesterName: user.displayName || user.name,
      requesterEmail: user.email,
      hrEmail: selectedAsset.hrEmail,
      companyName: selectedAsset.companyName,
      note,
      requestStatus: "pending",
      requestDate: new Date(),
      approvalDate: null,
      processedBy: null,
    };

    try {
      await axios.post(`${API_URL}/requests`, requestData);
      toast.success("Asset request submitted successfully!");
      setSelectedAsset(null);
      setNote("");

      // Immediately add pending request to state for instant UI feedback
      setRequests((prev) => [...prev.filter(r => r.assetId !== selectedAsset._id), requestData]);
    } catch (err) {
      console.error("Request failed", err);
      toast.error("Failed to submit request");
    }
  };

  const getStatusText = (request) => {
    if (request.requestStatus === "pending") return "Pending";
    if (request.requestStatus === "approved") return "Approved";
    if (request.requestStatus === "rejected") return "Request Again";
    return request.requestStatus;
  };

  if (loading || !user) return <RobotLoader />;

  return (
    <div className="p-6">
      <title>Request Assets</title>
      <h2 className="text-3xl font-bold mb-2 text-base-content">Request an Asset</h2>
      <p className="text-base-content/60 mb-6">
        Request assets from companies you work with
      </p>

      {assets.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg font-medium">No assets available</p>
          <p className="text-base-content/60">
            Currently there are no assets available to request.
          </p>
        </div>
      ) : (
        <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4">
          {assets.map((asset) => {
            const userRequest = requests.find((r) => r.assetId === asset._id);
            const showRequestButton =
              !userRequest || userRequest.requestStatus === "rejected";

            return (
              <div
                key={asset._id}
                className="bg-base-100 shadow-lg rounded-2xl overflow-hidden hover:shadow-2xl transition transform hover:-translate-y-1"
              >
                <div className="p-4 flex justify-center items-center bg-base-200">
                  <img
                    src={asset.productImage}
                    alt={asset.productName}
                    className="h-32 object-contain"
                  />
                </div>

                <div className="p-4 flex flex-col gap-2">
                  <h3 className="font-semibold text-lg text-base-content">{asset.productName}</h3>
                  <p className="text-sm text-base-content/60">Company: {asset.companyName}</p>

                  <div className="flex justify-between items-center mt-2">
                    <span className="px-2 py-1 text-xs font-medium rounded-full border border-gray-300">
                      {asset.productType}
                    </span>
                    <span className="text-sm text-base-content/70">
                      Available: {asset.availableQuantity}
                    </span>
                  </div>

                  {userRequest && !showRequestButton && (
                    <span className="mt-4 text-sm text-blue-600 font-semibold">
                      {getStatusText(userRequest)}
                    </span>
                  )}

                  {showRequestButton && (
                    <button
                      className="mt-4 py-2 w-full rounded-xl text-white font-bold bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:scale-105 transition transform"
                      onClick={() => {
                        setSelectedAsset(asset);
                        document.getElementById("request_modal").showModal();
                      }}
                    >
                      {userRequest ? "Request Again" : "Request"}
                    </button>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      )}

      {/* Request Modal */}
      <dialog id="request_modal" className="modal">
        <form
          method="dialog"
          className="modal-box bg-base-100 rounded-2xl p-6 shadow-lg flex flex-col gap-4"
        >
          <h3 className="text-xl font-bold">Request {selectedAsset?.productName}</h3>

          <textarea
            className="textarea textarea-bordered w-full"
            placeholder="Add a note (optional)"
            value={note}
            onChange={(e) => setNote(e.target.value)}
          ></textarea>

          <div className="flex justify-end gap-3">
            <button
              className="btn btn-outline"
              onClick={() => {
                setSelectedAsset(null);
                setNote("");
                document.getElementById("request_modal").close();
              }}
            >
              Cancel
            </button>

            <button
              type="button"
              className="btn bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white"
              onClick={() => {
                handleRequest();
                document.getElementById("request_modal").close();
              }}
            >
              Submit Request
            </button>
          </div>
        </form>
      </dialog>
    </div>
  );
};

export default RequestAsset;

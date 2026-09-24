import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { Pencil, Trash2, Boxes, Check } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthContext";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import "../../../components/RobotLoader/RobotLoader.css";

import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

import { getAuth } from "firebase/auth";

const PAGE_SIZE = 10;
const PIE_COLORS = ["#2563eb", "#f97316"];

const AssetList = () => {
  const { user, loading } = useContext(AuthContext);

  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [editAsset, setEditAsset] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [total, setTotal] = useState(0);
  const [topRequests, setTopRequests] = useState([]);

  const API_URL = import.meta.env.VITE_API_URL || "";

  const getFirebaseToken = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("Please login first");
      return null;
    }
    return await currentUser.getIdToken();
  };

  const apiErrorMessage = (err, fallback) => {
    const status = err?.response?.status;
    const code = err?.response?.data?.code;
    const msg = err?.response?.data?.message;
    if (code === "ADMIN_UNAVAILABLE" || status === 503) {
      return "Server auth is not configured (Firebase Admin). Contact admin to set FIREBASE_ADMIN_SDK.";
    }
    if (status === 401) return "Unauthorized. Please login again.";
    if (status === 403) return msg || "You do not have HR access.";
    return msg || fallback;
  };

  const fetchAssets = async (pageNum = page, searchQ = search) => {
    try {
      setDataLoading(true);
      const res = await axios.get(`${API_URL}/assets`, {
        params: {
          page: pageNum,
          limit: PAGE_SIZE,
          hrEmail: user?.email || "",
          search: searchQ || "",
        },
      });
      setAssets(res.data.assets || []);
      setTotal(res.data.total || 0);
      setTotalPages(res.data.totalPages || 1);
      setPage(res.data.page || pageNum);
    } catch (err) {
      console.error(err);
      toast.error(apiErrorMessage(err, "Failed to load assets"));
    } finally {
      setDataLoading(false);
    }
  };

  const fetchTopRequests = async () => {
    if (!user?.email) return;
    try {
      const res = await axios.get(`${API_URL}/requests`, {
        params: { hrEmail: user.email },
      });
      const counts = {};
      (res.data || []).forEach((r) => {
        const name = r.assetName || "Unknown";
        counts[name] = (counts[name] || 0) + 1;
      });
      const top = Object.entries(counts)
        .map(([name, count]) => ({ name, count }))
        .sort((a, b) => b.count - a.count)
        .slice(0, 5);
      setTopRequests(top);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    if (!user?.email) return;
    fetchAssets(1, "");
    fetchTopRequests();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.email]);

  useEffect(() => {
    if (!user?.email) return;
    const t = setTimeout(() => fetchAssets(1, search), 300);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [search, user?.email]);

  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    try {
      const token = await getFirebaseToken();
      if (!token) return;

      await axios.delete(`${API_URL}/assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Asset deleted successfully");
      fetchAssets(page);
      fetchTopRequests();
    } catch (err) {
      console.error(err);
      toast.error(apiErrorMessage(err, "Failed to delete asset."));
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    if (editAsset.availableQuantity > editAsset.productQuantity) {
      toast.error("Available quantity cannot exceed total quantity");
      return;
    }

    try {
      const token = await getFirebaseToken();
      if (!token) return;

      await axios.put(
        `${API_URL}/assets/${editAsset._id}`,
        {
          productName: editAsset.productName,
          productQuantity: Number(editAsset.productQuantity),
          availableQuantity: Number(editAsset.availableQuantity),
          productType: editAsset.productType,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        }
      );

      toast.success("Asset updated successfully");
      setEditAsset(null);
      fetchAssets(page);
    } catch (err) {
      console.error(err);
      toast.error(apiErrorMessage(err, "Failed to update asset."));
    }
  };

  const filteredAssets = assets;

  const returnableCount = assets.filter((a) => a.productType === "Returnable").length;
  const nonReturnableCount = assets.length - returnableCount;
  const pieData = [
    { name: "Returnable", value: returnableCount },
    { name: "Non-returnable", value: nonReturnableCount },
  ].filter((d) => d.value > 0);

  if (loading) return <RobotLoader />;

  return (
    <div className="p-4 md:p-6">
      <title>Assets List</title>

      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 p-6 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Boxes /> Asset List
        </h1>
        <p className="text-sm mt-1 opacity-90">View and manage your assets</p>
      </div>

      {/* Charts: Pie (type mix) + Bar (top 5 requested) */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
        <div className="rounded-2xl bg-base-100 shadow-lg border border-blue-400/30 p-6">
          <h2 className="text-lg font-semibold mb-4 text-base-content">
            Returnable vs Non-returnable
          </h2>
          {pieData.length === 0 ? (
            <p className="text-center text-base-content/60 py-10">No asset data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <PieChart>
                <Pie
                  data={pieData}
                  dataKey="value"
                  nameKey="name"
                  cx="50%"
                  cy="50%"
                  outerRadius={90}
                  label
                >
                  {pieData.map((entry, index) => (
                    <Cell key={entry.name} fill={PIE_COLORS[index % PIE_COLORS.length]} />
                  ))}
                </Pie>
                <Legend />
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
          )}
        </div>

        <div className="rounded-2xl bg-base-100 shadow-lg border border-blue-400/30 p-6">
          <h2 className="text-lg font-semibold mb-4 text-base-content">
            Top 5 Requested Assets
          </h2>
          {topRequests.length === 0 ? (
            <p className="text-center text-base-content/60 py-10">No request data available</p>
          ) : (
            <ResponsiveContainer width="100%" height={280}>
              <BarChart data={topRequests} margin={{ top: 10, right: 20, left: 0, bottom: 10 }}>
                <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
                <XAxis dataKey="name" tick={{ fontSize: 11 }} />
                <YAxis allowDecimals={false} tick={{ fontSize: 12 }} />
                <Tooltip />
                <Bar dataKey="count" fill="#2563eb" radius={[6, 6, 0, 0]} name="Requests" />
              </BarChart>
            </ResponsiveContainer>
          )}
        </div>
      </div>

      <div className="mb-4 flex flex-col md:flex-row md:items-center md:justify-between gap-3">
        <input
          type="text"
          placeholder="Search asset by name..."
          className="input input-bordered w-full md:w-72 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <div className="text-sm text-base-content/60">
          Total: {total} · Page {page} of {totalPages}
        </div>
      </div>

      <div className="overflow-x-auto bg-base-100 rounded-2xl shadow-md border-2 border-blue-400/30">
        {dataLoading ? (
          <div className="p-10 text-center">
            <RobotLoader />
          </div>
        ) : filteredAssets.length === 0 ? (
          <div className="p-10 text-center text-base-content/60">No assets found</div>
        ) : (
          <table className="table w-full min-w-[600px]">
            <thead className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white">
              <tr>
                <th>S/N</th>
                <th>Image</th>
                <th>Name</th>
                <th>Type</th>
                <th>Quantity</th>
                <th>Available</th>
                <th>Date Added</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset, index) => (
                <tr key={asset._id} className="hover:bg-blue-50 transition-colors">
                  <td>{(page - 1) * PAGE_SIZE + index + 1}</td>
                  <td>
                    <img
                      src={asset.productImage}
                      alt={asset.productName}
                      className="w-12 h-12 rounded-xl object-cover"
                    />
                  </td>
                  <td className="font-semibold">{asset.productName}</td>
                  <td>
                    {asset.productType === "Returnable" ? (
                      <span className="badge badge-success">{asset.productType}</span>
                    ) : (
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm">
                        {asset.productType}
                      </span>
                    )}
                  </td>
                  <td>{asset.productQuantity}</td>
                  <td>{asset.availableQuantity}</td>
                  <td className="text-sm">
                    {asset.dateAdded ? new Date(asset.dateAdded).toLocaleDateString() : "—"}
                  </td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button
                        onClick={() => setEditAsset(asset)}
                        className="btn btn-sm btn-outline btn-info"
                        aria-label="Edit asset"
                      >
                        <Pencil size={16} />
                      </button>
                      <button
                        onClick={() => handleDelete(asset._id)}
                        className="btn btn-sm btn-outline btn-error"
                        aria-label="Delete asset"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>

      {/* Pagination */}
      <div className="mt-4 flex flex-wrap items-center justify-center gap-2">
        <button
          className="btn btn-sm"
          disabled={page <= 1 || dataLoading}
          onClick={() => fetchAssets(page - 1)}
        >
          Previous
        </button>
        {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
          <button
            key={p}
            className={`btn btn-sm ${p === page ? "btn-primary" : "btn-outline"}`}
            disabled={dataLoading}
            onClick={() => fetchAssets(p)}
          >
            {p}
          </button>
        ))}
        <button
          className="btn btn-sm"
          disabled={page >= totalPages || dataLoading}
          onClick={() => fetchAssets(page + 1)}
        >
          Next
        </button>
      </div>

      {editAsset && (
        <dialog className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="font-bold text-lg mb-4">Update Asset</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input
                className="input input-bordered w-full"
                value={editAsset.productName}
                onChange={(e) => setEditAsset({ ...editAsset, productName: e.target.value })}
                required
              />
              <input
                type="number"
                min="1"
                className="input input-bordered w-full"
                value={editAsset.productQuantity}
                onChange={(e) =>
                  setEditAsset({ ...editAsset, productQuantity: Number(e.target.value) })
                }
                required
              />
              <input
                type="number"
                min="0"
                className="input input-bordered w-full"
                value={editAsset.availableQuantity}
                onChange={(e) =>
                  setEditAsset({ ...editAsset, availableQuantity: Number(e.target.value) })
                }
                required
              />
              <select
                className="select select-bordered w-full"
                value={editAsset.productType}
                onChange={(e) => setEditAsset({ ...editAsset, productType: e.target.value })}
              >
                <option value="Returnable">Returnable</option>
                <option value="Non-returnable">Non-returnable</option>
              </select>
              <div className="modal-action">
                <button className="btn bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white flex items-center gap-2">
                  <Check size={16} /> Update
                </button>
                <button type="button" className="btn" onClick={() => setEditAsset(null)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AssetList;

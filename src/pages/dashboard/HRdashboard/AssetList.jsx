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
  ResponsiveContainer
} from "recharts";

import { getAuth } from "firebase/auth";

const AssetList = () => {
  const { user, loading } = useContext(AuthContext);

  const [assets, setAssets] = useState([]);
  const [search, setSearch] = useState("");
  const [editAsset, setEditAsset] = useState(null);
  const [dataLoading, setDataLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "";

  /* ================= FETCH ASSETS ================= */
  useEffect(() => {
    if (!user?.email) return;
    fetchAssets();
  }, [user?.email]);

  const fetchAssets = async () => {
    try {
      setDataLoading(true);
      const res = await axios.get(`${API_URL}/assets`);
      const hrAssets = res.data.assets.filter(asset => asset.hrEmail === user.email);
      setAssets(hrAssets);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load assets");
    } finally {
      setDataLoading(false);
    }
  };

  /* ================= GET FIREBASE TOKEN ================= */
  const getFirebaseToken = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) {
      toast.error("Please login first");
      return null;
    }
    return await currentUser.getIdToken();
  };

  /* ================= DELETE ASSET ================= */
  const handleDelete = async (id) => {
    if (!window.confirm("Are you sure you want to delete this asset?")) return;

    try {
      const token = await getFirebaseToken();
      if (!token) return;

      await axios.delete(`${API_URL}/assets/${id}`, {
        headers: { Authorization: `Bearer ${token}` }
      });
      toast.success("Asset deleted successfully");
      fetchAssets();
    } catch (err) {
      console.error(err);
      toast.error("Failed to delete asset. Check if you have HR access.");
    }
  };

  /* ================= UPDATE ASSET ================= */
  const handleUpdate = async (e) => {
    e.preventDefault();

    if (editAsset.availableQuantity > editAsset.productQuantity) {
      toast.error("Available quantity cannot exceed total quantity");
      return;
    }

    try {
      const token = await getFirebaseToken();
      if (!token) return;

      await axios.put(`${API_URL}/assets/${editAsset._id}`, {
        productName: editAsset.productName,
        productQuantity: editAsset.productQuantity,
        availableQuantity: editAsset.availableQuantity,
        productType: editAsset.productType
      }, {
        headers: { Authorization: `Bearer ${token}` }
      });

      toast.success("Asset updated successfully");
      setEditAsset(null);
      fetchAssets();
    } catch (err) {
      console.error(err);
      toast.error("Failed to update asset. Check if you have HR access.");
    }
  };

  /* ================= SEARCH ================= */
  const filteredAssets = assets.filter(asset =>
    asset.productName.toLowerCase().includes(search.toLowerCase())
  );

  /* ================= CHART DATA ================= */
  const chartData = assets.map(asset => ({
    name: asset.productName,
    total: asset.productQuantity
  }));

  if (loading) return <RobotLoader />;

  return (
    <div className="p-4 md:p-6">
      <title>Assets List</title>
      {/* ================= HEADER ================= */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 p-6 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold flex items-center gap-2">
          <Boxes /> Asset List
        </h1>
        <p className="text-sm mt-1 opacity-90">View and manage your assets</p>
      </div>

      {/* ================= BAR CHART ================= */}
      <div className="mb-6 rounded-2xl bg-base-100 shadow-lg border border-blue-400/30 p-6">
        <h2 className="text-lg font-semibold mb-4 text-base-content">
          Asset Quantity Overview
        </h2>
        {chartData.length === 0 ? (
          <p className="text-center text-base-content/60">No asset data available</p>
        ) : (
          <ResponsiveContainer width="100%" height={340}>
            <BarChart
              data={chartData}
              layout="vertical"
              margin={{ top: 20, right: 30, left: 80, bottom: 20 }}
            >
              <defs>
                <linearGradient id="assetBarGradient" x1="0" y1="0" x2="1" y2="0">
                  <stop offset="0%" stopColor="#1d4ed8" />
                  <stop offset="50%" stopColor="#7c3aed" />
                  <stop offset="100%" stopColor="#ec4899" />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" strokeOpacity={0.25} />
              <XAxis type="number" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} allowDecimals={false} />
              <YAxis type="category" dataKey="name" axisLine={false} tickLine={false} tick={{ fontSize: 12 }} />
              <Tooltip
                cursor={{ fill: "rgba(0,0,0,0.05)" }}
                contentStyle={{
                  borderRadius: "14px",
                  border: "none",
                  boxShadow: "0 15px 30px rgba(0,0,0,0.12)"
                }}
              />
              <Bar dataKey="total" fill="url(#assetBarGradient)" barSize={36} name="Total Quantity" />
            </BarChart>
          </ResponsiveContainer>
        )}
      </div>

      {/* ================= SEARCH ================= */}
      <div className="mb-4">
        <input
          type="text"
          placeholder="Search asset by name..."
          className="input input-bordered w-full md:w-72 rounded-xl"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
      </div>

      {/* ================= TABLE ================= */}
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
                <th>Total</th>
                <th>Available</th>
                <th>Date Added</th>
                <th className="text-center">Actions</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset, index) => (
                <tr key={asset._id} className="hover:bg-blue-50 transition-colors">
                  <td>{index + 1}</td>
                  <td>
                    <img src={asset.productImage} alt={asset.productName} className="w-12 h-12 rounded-xl object-cover" />
                  </td>
                  <td className="font-semibold">{asset.productName}</td>
                  <td>
                    {asset.productType === "Returnable" ? (
                      <span className="badge badge-success">{asset.productType}</span>
                    ) : (
                      <span className="bg-blue-500 text-white px-2 py-1 rounded-md text-sm">{asset.productType}</span>
                    )}
                  </td>
                  <td>{asset.productQuantity}</td>
                  <td>{asset.availableQuantity}</td>
                  <td className="text-sm">{new Date(asset.dateAdded).toLocaleDateString()}</td>
                  <td className="text-center">
                    <div className="flex justify-center gap-2">
                      <button onClick={() => setEditAsset(asset)} className="btn btn-sm btn-outline btn-info">
                        <Pencil size={16} />
                      </button>
                      <button onClick={() => handleDelete(asset._id)} className="btn btn-sm btn-outline btn-error">
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

      {/* ================= UPDATE MODAL ================= */}
      {editAsset && (
        <dialog className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="font-bold text-lg mb-4">Update Asset</h3>
            <form onSubmit={handleUpdate} className="space-y-3">
              <input className="input input-bordered w-full" value={editAsset.productName} onChange={(e) => setEditAsset({ ...editAsset, productName: e.target.value })} required />
              <input type="number" className="input input-bordered w-full" value={editAsset.productQuantity} onChange={(e) => setEditAsset({ ...editAsset, productQuantity: Number(e.target.value) })} required />
              <input type="number" className="input input-bordered w-full" value={editAsset.availableQuantity} onChange={(e) => setEditAsset({ ...editAsset, availableQuantity: Number(e.target.value) })} required />
              <select className="select select-bordered w-full" value={editAsset.productType} onChange={(e) => setEditAsset({ ...editAsset, productType: e.target.value })}>
                <option value="Returnable">Returnable</option>
                <option value="Non-returnable">Non-returnable</option>
              </select>
              <div className="modal-action">
                <button className="btn bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white flex items-center gap-2">
                  <Check size={16} /> Update
                </button>
                <button type="button" className="btn" onClick={() => setEditAsset(null)}>Cancel</button>
              </div>
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default AssetList;

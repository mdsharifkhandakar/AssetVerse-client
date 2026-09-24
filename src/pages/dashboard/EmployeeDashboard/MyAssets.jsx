// ... other imports remain the same
import { useContext, useEffect, useState } from "react";
import axios from "axios";
import { AuthContext } from "../../../Context/AuthContext";
import toast from "react-hot-toast";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import jsPDF from "jspdf";
import autoTable from "jspdf-autotable";

const API_URL = import.meta.env.VITE_API_URL || "";

const MyAssets = () => {
  const { user } = useContext(AuthContext);
  const [assets, setAssets] = useState([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [filterType, setFilterType] = useState("All");

  useEffect(() => {
    if (!user?.email) return;

    const fetchAssets = async () => {
      setLoading(true);
      try {
        const res = await axios.get(
          `${API_URL}/assigned-assets?email=${user.email}`
        );

        const data = res.data.map((a) => ({
          _id: a._id || "",
          assetName: a.assetName || a.productName || "—",
          assetType: a.assetType || a.productType || "—",
          companyName: a.companyName || "—",
          assignmentDate: a.assignmentDate
            ? new Date(a.assignmentDate).toLocaleDateString()
            : "—",
          approvalDate: a.approvalDate
            ? new Date(a.approvalDate).toLocaleDateString()
            : a.assignmentDate
            ? new Date(a.assignmentDate).toLocaleDateString()
            : "—",
          status: a.status || "assigned",
          productImage: a.productImage || a.assetImage || "",
        }));

        setAssets(data);
      } catch (err) {
        console.error(err);
        toast.error("Failed to fetch assigned assets");
      } finally {
        setLoading(false);
      }
    };

    fetchAssets();
  }, [user?.email]);

  const handleReturn = async (id) => {
    if (!window.confirm("Are you sure you want to return this asset?")) return;

    try {
      await axios.put(`${API_URL}/assigned-assets/${id}`);
      setAssets((prev) =>
        prev.map((a) => (a._id === id ? { ...a, status: "returned" } : a))
      );
      toast.success("Asset returned successfully!");
    } catch (err) {
      console.error("Return failed", err);
      toast.error("Failed to return asset");
    }
  };

  const filteredAssets = assets.filter((a) => {
    const matchesSearch = a.assetName.toLowerCase().includes(search.toLowerCase());
    const matchesType = filterType === "All" || a.assetType === filterType;
    return matchesSearch && matchesType;
  });

  const downloadPDF = () => {
    if (!filteredAssets.length) {
      toast.error("No assets to download");
      return;
    }

    try {
      const doc = new jsPDF();
      doc.setFontSize(16);
      doc.text("My Assigned Assets", 14, 15);

      autoTable(doc, {
        startY: 25,
        head: [["S/N", "Asset Name", "Type", "Company", "Assigned Date", "Approval Date", "Status"]],
        body: filteredAssets.map((a, index) => [
          index + 1,
          String(a.assetName),
          String(a.assetType),
          String(a.companyName),
          String(a.assignmentDate),
          String(a.approvalDate),
          String(a.status),
        ]),
        styles: { fontSize: 9 },
        headStyles: { fillColor: [0, 180, 216] }, // cyan
      });

      doc.save("my_assets.pdf");
      toast.success("PDF downloaded successfully!");
    } catch (error) {
      console.error("PDF ERROR 👉", error);
      toast.error("Failed to generate PDF");
    }
  };

  if (loading) return <RobotLoader />;

  return (
    <div className="p-6">
      <title>My Assets</title>
      {/* Header */}
      <div className="flex justify-between items-center mb-4">
        <div>
          <h2 className="text-3xl font-bold text-base-content">My Assets</h2>
          <p className="text-base-content/60">Assets assigned to you from all companies</p>
        </div>

        {/* Download PDF button with gradient */}
        <button
          className="px-5 py-2 rounded-lg text-white font-semibold transition-all duration-300 bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 hover:scale-105"
          onClick={downloadPDF}
        >
          Download PDF
        </button>
      </div>

      {/* Controls */}
      <div className="flex flex-col md:flex-row gap-4 mb-6">
        <input
          type="text"
          placeholder="Search by asset name"
          className="input input-bordered w-full md:w-1/3"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />
        <select
          className="select select-bordered w-full md:w-1/4"
          value={filterType}
          onChange={(e) => setFilterType(e.target.value)}
        >
          <option value="All">All Types</option>
          <option value="Returnable">Returnable</option>
          <option value="Non-returnable">Non-returnable</option>
        </select>
      </div>

      {/* Assets Table */}
      {filteredAssets.length === 0 ? (
        <div className="text-center py-10">
          <p className="text-lg font-medium">No assets found</p>
        </div>
      ) : (
        <div className="overflow-x-auto border border-blue-400 rounded-lg">
          <table className="table w-full table-auto border-collapse">
            <thead className="bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white">
              <tr>
                <th>S/N</th>
                <th>Asset</th>
                <th>Type</th>
                <th>Company</th>
                <th>Assigned Date</th>
                <th>Approval Date</th>
                <th>Status</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {filteredAssets.map((asset, index) => (
                <tr key={asset._id} className="hover:bg-base-200 transition">
                  <td>{index + 1}</td>
                  <td className="flex items-center gap-3">
                    <img
                      src={asset.productImage}
                      alt={asset.assetName}
                      className="w-12 h-12 object-contain rounded-lg p-1 bg-base-100 shadow-sm"
                    />
                    <span className="font-medium text-base-content">{asset.assetName}</span>
                  </td>
                  <td>{asset.assetType}</td>
                  <td>{asset.companyName}</td>
                  <td>{asset.assignmentDate}</td>
                  <td>{asset.approvalDate}</td>
                  <td>{asset.status}</td>
                  <td>
                    {asset.status === "assigned" && asset.assetType === "Returnable" && (
                      <button
                        className="btn btn-sm btn-warning"
                        onClick={() => handleReturn(asset._id)}
                      >
                        Return
                      </button>
                    )}
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

export default MyAssets;

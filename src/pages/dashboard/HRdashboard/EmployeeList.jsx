import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Trash2, PackagePlus } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthContext";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import "../../../components/RobotLoader/RobotLoader.css";
import { getAuth } from "firebase/auth";

const EmployeeList = () => {
  const { profile, loading } = useContext(AuthContext);
  const [employees, setEmployees] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);
  const [assets, setAssets] = useState([]);
  const [assignTarget, setAssignTarget] = useState(null);
  const [selectedAssetId, setSelectedAssetId] = useState("");
  const [assignNote, setAssignNote] = useState("");
  const [assigning, setAssigning] = useState(false);

  const API_URL = import.meta.env.VITE_API_URL || "";

  const getFirebaseToken = async () => {
    const auth = getAuth();
    const currentUser = auth.currentUser;
    if (!currentUser) return null;
    return await currentUser.getIdToken();
  };

  const fetchEmployees = async () => {
    if (!profile?.companyName) return;
    try {
      setDataLoading(true);

      const res = await axios.get(`${API_URL}/company-employees`, {
        params: { company: profile.companyName, page: 1, limit: 100 },
      });
      const employeesData = Array.isArray(res.data)
        ? res.data
        : res.data?.employees || [];

      const employeesWithAssets = await Promise.all(
        employeesData.map(async (emp) => {
          const assignedRes = await axios.get(
            `${API_URL}/assigned-assets?email=${emp.email}`
          );
          const assetsCount = assignedRes.data.length || 0;
          const joinDate = emp.createdAt ? new Date(emp.createdAt) : null;
          return { ...emp, assetsCount, joinDate };
        })
      );

      setEmployees(employeesWithAssets);
    } catch (err) {
      console.error(err);
      toast.error("Failed to load employees");
    } finally {
      setDataLoading(false);
    }
  };

  const fetchAssets = async () => {
    if (!profile?.email) return;
    try {
      const res = await axios.get(`${API_URL}/assets`, {
        params: { hrEmail: profile.email, page: 1, limit: 100 },
      });
      const list = (res.data.assets || []).filter((a) => a.availableQuantity > 0);
      setAssets(list);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEmployees();
    fetchAssets();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [profile?.companyName, profile?.email]);

  const openAssign = (employee) => {
    setAssignTarget(employee);
    setSelectedAssetId("");
    setAssignNote("");
  };

  const handleAssign = async (e) => {
    e.preventDefault();
    if (!assignTarget || !selectedAssetId) {
      toast.error("Select an asset to assign");
      return;
    }

    try {
      setAssigning(true);
      const token = await getFirebaseToken();
      if (!token) {
        toast.error("Please login first");
        return;
      }

      await axios.post(
        `${API_URL}/assigned-assets`,
        {
          employeeEmail: assignTarget.email,
          assetId: selectedAssetId,
          note: assignNote,
        },
        { headers: { Authorization: `Bearer ${token}` } }
      );

      toast.success(`Asset assigned to ${assignTarget.name}`);
      setAssignTarget(null);
      fetchEmployees();
      fetchAssets();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to assign asset";
      toast.error(msg);
    } finally {
      setAssigning(false);
    }
  };

  const handleRemove = async (employee) => {
    if (!window.confirm(`Are you sure you want to remove ${employee.name} from your team?`))
      return;

    try {
      const token = await getFirebaseToken();
      if (!token) {
        toast.error("Please login first");
        return;
      }

      await axios.delete(`${API_URL}/employee-affiliation`, {
        data: {
          employeeEmail: employee.email,
          companyName: profile.companyName,
          hrEmail: profile.email,
        },
        headers: { Authorization: `Bearer ${token}` },
      });
      toast.success("Employee removed successfully");
      fetchEmployees();
    } catch (err) {
      console.error(err);
      const msg = err?.response?.data?.message || "Failed to remove employee";
      toast.error(msg);
    }
  };

  if (loading) return <RobotLoader></RobotLoader>;

  const packageLimit = profile?.packageLimit ?? 5;
  const used = profile?.currentEmployees ?? employees.length;

  return (
    <div className="p-4 md:p-6">
      <title>Employee List</title>
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 p-6 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">My Employee List</h1>
        <p className="text-sm mt-1 opacity-90">
          {used}/{packageLimit} employees used
          {used >= packageLimit ? " · Package limit reached" : ""}
        </p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5">
        {dataLoading ? (
          <div className="col-span-full p-10 text-center font-semibold">
            <RobotLoader></RobotLoader>
          </div>
        ) : employees.length === 0 ? (
          <div className="col-span-full p-10 text-center text-base-content/60">
            No employees found
          </div>
        ) : (
          employees.map((emp) => (
            <div
              key={emp.email}
              className="bg-base-100 rounded-2xl shadow-md p-4 flex flex-col items-center text-center transform transition duration-300 hover:scale-[1.03] hover:shadow-xl hover:border-2 hover:border-blue-400"
            >
              <img
                src={emp.profileImage || ""}
                alt={emp.name}
                className="w-24 h-24 rounded-full object-cover mb-3 border-2 border-blue-300"
              />
              <h3 className="font-bold text-lg">{emp.name}</h3>
              <p className="text-sm text-base-content/60">{emp.email}</p>
              <p className="text-sm text-base-content/60 mb-2">
                Joined: {emp.joinDate ? emp.joinDate.toLocaleDateString() : "N/A"}
              </p>
              <p className="text-sm font-semibold mb-4">Assets: {emp.assetsCount}</p>
              <div className="flex flex-wrap justify-center gap-2">
                <button
                  onClick={() => openAssign(emp)}
                  className="btn btn-sm btn-outline btn-info rounded-lg transition-all duration-300 flex items-center gap-1"
                  title="Assign asset directly (affiliated employees only)"
                >
                  <PackagePlus size={16} /> Assign
                </button>
                <button
                  onClick={() => handleRemove(emp)}
                  className="btn btn-sm btn-outline btn-error rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center gap-1"
                >
                  <Trash2 size={16} /> Remove
                </button>
              </div>
            </div>
          ))
        )}
      </div>

      {assignTarget && (
        <dialog className="modal modal-open">
          <div className="modal-box rounded-2xl">
            <h3 className="font-bold text-lg mb-1">Direct Assign Asset</h3>
            <p className="text-sm text-base-content/60 mb-4">
              To: {assignTarget.name} ({assignTarget.email})
              <br />
              Only affiliated employees can receive direct assignments.
            </p>
            <form onSubmit={handleAssign} className="space-y-3">
              <select
                className="select select-bordered w-full"
                value={selectedAssetId}
                onChange={(e) => setSelectedAssetId(e.target.value)}
                required
              >
                <option value="">Select available asset…</option>
                {assets.map((asset) => (
                  <option key={asset._id} value={asset._id}>
                    {asset.productName} ({asset.availableQuantity} available)
                  </option>
                ))}
              </select>
              <textarea
                className="textarea textarea-bordered w-full"
                placeholder="Optional note"
                value={assignNote}
                onChange={(e) => setAssignNote(e.target.value)}
              />
              <div className="modal-action">
                <button
                  type="submit"
                  disabled={assigning || assets.length === 0}
                  className="btn bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white"
                >
                  {assigning ? "Assigning…" : "Assign"}
                </button>
                <button
                  type="button"
                  className="btn"
                  onClick={() => setAssignTarget(null)}
                  disabled={assigning}
                >
                  Cancel
                </button>
              </div>
              {assets.length === 0 && (
                <p className="text-sm text-error">No available assets to assign.</p>
              )}
            </form>
          </div>
        </dialog>
      )}
    </div>
  );
};

export default EmployeeList;

import { useEffect, useState, useContext } from "react";
import axios from "axios";
import { Trash2 } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthContext";
import RobotLoader from "../../../components/RobotLoader/RobotLoader";
import "../../../components/RobotLoader/RobotLoader.css";

const EmployeeList = () => {
  const { profile, loading } = useContext(AuthContext); // HR profile
  const [employees, setEmployees] = useState([]);
  const [dataLoading, setDataLoading] = useState(true);

  const API_URL = import.meta.env.VITE_API_URL || "";

  // Fetch employees for HR's company
  const fetchEmployees = async () => {
    if (!profile?.companyName) return;
    try {
      setDataLoading(true);

      // Fetch active employees for the HR's company
      const res = await axios.get(`${API_URL}/company-employees?company=${profile.companyName}`);
      const employeesData = res.data || [];

      // Fetch assets count for each employee
      const employeesWithAssets = await Promise.all(
        employeesData.map(async (emp) => {
          const assignedRes = await axios.get(`${API_URL}/assigned-assets?email=${emp.email}`);
          const assetsCount = assignedRes.data.length || 0;

          // Join date: use createdAt if available
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

  useEffect(() => {
    fetchEmployees();
  }, [profile?.companyName]);

  // Remove employee from team (affiliation)
  const handleRemove = async (employee) => {
    if (!window.confirm(`Are you sure you want to remove ${employee.name} from your team?`)) return;

    try {
      await axios.delete(`${API_URL}/employee-affiliation`, {
        data: {
          employeeEmail: employee.email,
          companyName: profile.companyName,
          hrEmail: profile.email,
        },
      });
      toast.success("Employee removed successfully");
      fetchEmployees();
    } catch (err) {
      console.error(err);
      toast.error("Failed to remove employee");
    }
  };

  if (loading) return <RobotLoader></RobotLoader>;

  return (
    <div className="p-4 md:p-6">
      <title>Employee List</title>
      {/* Header */}
      <div className="mb-6 rounded-2xl bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 p-6 text-white shadow-lg">
        <h1 className="text-2xl md:text-3xl font-bold">My Employee List</h1>
        <p className="text-sm mt-1 opacity-90">
          {employees.length}/{profile?.currentEmployees || 0} employees used
        </p>
      </div>

      {/* Grid / Table */}
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
              <button
                onClick={() => handleRemove(emp)}
                className="btn btn-sm btn-outline btn-error rounded-lg hover:bg-red-500 hover:text-white transition-all duration-300 flex items-center gap-1"
              >
                <Trash2 size={16} /> Remove
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default EmployeeList;

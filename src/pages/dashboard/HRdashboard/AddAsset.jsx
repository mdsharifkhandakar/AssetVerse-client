import { useState, useContext } from "react";
import { PackagePlus, ImageIcon } from "lucide-react";
import toast from "react-hot-toast";
import { AuthContext } from "../../../Context/AuthContext";
import { getAuth } from "firebase/auth"; // ✅ Import Firebase auth

const API_URL = import.meta.env.VITE_API_URL || "";

const AddAsset = () => {
    const { user } = useContext(AuthContext); // HR email reference
    const [loading, setLoading] = useState(false);

    const handleAddAsset = async (e) => {
        e.preventDefault();
        setLoading(true);

        const form = e.target;

        const assetData = {
            productName: form.productName.value,
            productImage: form.productImage.value,
            productType: form.productType.value,
            productQuantity: parseInt(form.productQuantity.value),
            availableQuantity: parseInt(form.productQuantity.value),
            dateAdded: new Date(),
            hrEmail: user?.email,
            companyName: form.companyName.value
        };

        try {
            const auth = getAuth();
            const currentUser = auth.currentUser;
            if (!currentUser) {
                toast.error("Please login first as HR");
                setLoading(false);
                return;
            }

            const token = await currentUser.getIdToken(); // ✅ Get Firebase token

            const res = await fetch(`${API_URL}/assets`, {
                method: "POST",
                headers: {
                    "Content-Type": "application/json",
                    "Authorization": `Bearer ${token}` // ✅ Send token in header
                },
                body: JSON.stringify(assetData)
            });

            const data = await res.json();

            if (res.ok) {
                toast.success("Asset added successfully!");
                form.reset();
            } else {
                toast.error(data.message || "Failed to add asset");
            }
        } catch (error) {
            console.error(error);
            toast.error("Server error. Check HR access.");
        } finally {
            setLoading(false);
        }
    };

    return (
        <div className="min-h-screen bg-base-200 flex items-center justify-center px-4 py-10">
            <title>Add Assets</title>
            <div className="w-full max-w-3xl bg-base-100 rounded-3xl shadow-xl p-6 md:p-10">

                {/* Header */}
                <div className="flex items-center gap-3 mb-6">
                    <div className="bg-gradient-to-r from-blue-600 to-cyan-400 p-3 rounded-2xl text-white shadow-md">
                        <PackagePlus size={28} />
                    </div>
                    <div>
                        <h2 className="text-2xl md:text-3xl font-bold text-base-content">Add New Asset</h2>
                        <p className="text-sm text-base-content/60">Register a new company asset</p>
                    </div>
                </div>

                {/* Form */}
                <form onSubmit={handleAddAsset} className="grid grid-cols-1 md:grid-cols-2 gap-5">

                    <div>
                        <label className="text-sm font-semibold text-base-content/70">Asset Name</label>
                        <input
                            type="text"
                            name="productName"
                            placeholder="e.g. Dell Laptop"
                            required
                            className="w-full mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-base-content/70">Company Name</label>
                        <input
                            type="text"
                            name="companyName"
                            placeholder="e.g. AssetVerse Ltd"
                            required
                            className="w-full mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-base-content/70">Asset Type</label>
                        <select
                            name="productType"
                            required
                            className="w-full mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        >
                            <option value="">Select type</option>
                            <option value="Returnable">Returnable</option>
                            <option value="Non-returnable">Non-returnable</option>
                        </select>
                    </div>

                    <div>
                        <label className="text-sm font-semibold text-base-content/70">Quantity</label>
                        <input
                            type="number"
                            name="productQuantity"
                            min="1"
                            placeholder="e.g. 10"
                            required
                            className="w-full mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="md:col-span-2">
                        <label className="text-sm font-semibold text-base-content/70 flex items-center gap-2">
                            <ImageIcon size={18} /> Product Image URL
                        </label>
                        <input
                            type="text"
                            name="productImage"
                            placeholder="Enter image URL (ImgBB/Cloudinary)"
                            required
                            className="w-full mt-1 p-3 rounded-xl border focus:outline-none focus:ring-2 focus:ring-blue-400"
                        />
                    </div>

                    <div className="md:col-span-2 mt-4">
                        <button
                            type="submit"
                            disabled={loading}
                            className="w-full bg-gradient-to-r from-blue-600 via-blue-500 to-cyan-400 text-white font-bold py-3 rounded-2xl shadow-lg hover:scale-[1.02] transition transform disabled:opacity-60"
                        >
                            {loading ? "Adding Asset..." : "Add Asset"}
                        </button>
                    </div>
                </form>
            </div>
        </div>
    );
};

export default AddAsset;

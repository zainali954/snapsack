import React, { useEffect, useState } from "react";
import { useSelector, useDispatch } from "react-redux";
import { addAddress, removeAddress } from "../slices/authSlice"; 
import { BiTrash } from "react-icons/bi";
import { useNavigate } from "react-router-dom";

const UserProfile = () => {
    const { user } = useSelector(state => state.auth);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const dispatch = useDispatch();
    const navigate = useNavigate();

    const [newAddress, setNewAddress] = useState({
        fullName: user?.name || "",
        phone: "",
        street: "",
        city: "",
        state: "",
        postalCode: "",
        country: "",
    });

    const handleAddAddress = () => {
        setIsModalOpen(false);
        dispatch(addAddress(newAddress));
    };

    const handleRemoveAddress = (index) => {
        dispatch(removeAddress(index));
    };

    useEffect(() => {
        if (!user) {
            navigate("/login");
        }
    }, [user, navigate]);

    return (
        <div className="p-6 max-w-4xl mx-auto">
            <h2 className="text-3xl font-semibold text-orange-600">User Profile</h2>
            <div className="mt-4 p-6 border border-gray-300 rounded-lg">
                <p className="text-lg font-medium">Name: {user?.name}</p>
                <p className="text-lg font-medium flex items-center gap-2">
                    Email: {user?.email} 
                    {user?.isVerified ? (
                        <span className="text-green-700 bg-green-100 px-2 py-1 rounded-lg text-sm font-medium">
                            Verified
                        </span>
                    ) : (
                        <>
                            <span className="text-red-700 bg-red-100 px-2 py-1 rounded-lg text-sm font-medium">
                                Unverified
                            </span>
                            <button onClick={()=>navigate('/verify-email')} className="ml-2 text-orange-600 border border-orange-600 px-3 py-1 text-sm rounded-lg hover:bg-orange-600 hover:text-white transition">
                                Verify Email
                            </button>
                        </>
                    )}
                </p>
            </div>

            <h3 className="text-2xl font-semibold text-orange-600 mt-6">Saved Addresses</h3>
            <div className="mt-4 space-y-4">
                {user?.addresses.length > 0 ? (
                    user?.addresses?.map((addr, index) => (
                        <div key={index} className="p-4 border border-gray-300 rounded-lg flex justify-between items-center">
                            <div>
                                <p>{addr?.fullName}, {addr?.phone}</p>
                                <p>{addr?.street}, {addr?.city}, {addr?.state}, {addr?.postalCode}, {addr?.country}</p>
                            </div>
                            <button onClick={() => handleRemoveAddress(index)} className="text-red-600 hover:text-red-800">
                                <BiTrash size={20} />
                            </button>
                        </div>
                    ))
                ) : (
                    <p>No saved addresses.</p>
                )}
            </div>

            <button onClick={() => setIsModalOpen(true)} className="mt-4 px-4 py-2 bg-orange-600 text-white rounded-lg">
                Add a New Address
            </button>

            {isModalOpen && (
                <div className="fixed inset-0 flex items-center justify-center bg-gray-900 bg-opacity-50 z-20">
                    <div className="bg-white p-6 rounded-lg w-96">
                        <h2 className="text-2xl font-semibold text-orange-600 mb-4">Add Address</h2>
                        <input type="text" placeholder="Phone" value={newAddress.phone} onChange={(e) => setNewAddress({ ...newAddress, phone: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg mb-2" />
                        <input type="text" placeholder="Street" value={newAddress.street} onChange={(e) => setNewAddress({ ...newAddress, street: e.target.value })} className="w-full p-2 border border-gray-300 rounded-lg mb-2" />
                        <div className="grid grid-cols-2 gap-2">
                            <input type="text" placeholder="City" value={newAddress.city} onChange={(e) => setNewAddress({ ...newAddress, city: e.target.value })} className="p-2 border border-gray-300 rounded-lg" />
                            <input type="text" placeholder="State" value={newAddress.state} onChange={(e) => setNewAddress({ ...newAddress, state: e.target.value })} className="p-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div className="grid grid-cols-2 gap-2 mt-2">
                            <input type="text" placeholder="Postal Code" value={newAddress.postalCode} onChange={(e) => setNewAddress({ ...newAddress, postalCode: e.target.value })} className="p-2 border border-gray-300 rounded-lg" />
                            <input type="text" placeholder="Country" value={newAddress.country} onChange={(e) => setNewAddress({ ...newAddress, country: e.target.value })} className="p-2 border border-gray-300 rounded-lg" />
                        </div>
                        <div className="mt-4 flex justify-end gap-2">
                            <button onClick={() => setIsModalOpen(false)} className="px-4 py-2 border border-gray-300 rounded-lg">Cancel</button>
                            <button onClick={handleAddAddress} className="px-4 py-2 bg-orange-600 text-white rounded-lg">Save</button>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
};

export default UserProfile;

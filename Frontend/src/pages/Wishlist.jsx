import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";

export default function Wishlist() {
    const { wishlist } = useSelector(state => state.wishlist);
    const navigate = useNavigate()

    const removeFromWishlist = (id) => {
        alert("Are you sure?");
    };
    
    const ViewProduct =(id)=>{
navigate(`/product/${id}`)
    }

    return (
        <div className="container mx-auto my-4 p-4">
            <h2 className="text-2xl font-bold mb-4">My Wishlist</h2>

            {wishlist.length === 0 ? (
                <p className="text-gray-500 text-center text-lg">Your wishlist is empty.</p>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 border border-b-0 border-r-0 border-gray-200">
                    {wishlist.map((item) => (
                        <div key={item._id} className="bg-white hover:bg-orange-50 p-4 border border-l-0 border-t-0 border-gray-200 text-center">
                            <img src={item.product?.images && item.product.images[0]} alt={item.name} className="w-full h-56 object-cover rounded-md" />
                            <div className="mt-2">
                                <h3 className="text-lg font-semibold">{item.product?.name}</h3>
                                <p className="text-gray-600">{item.product?.basePrice}</p>
                                <div className="flex gap-2 mt-2 justify-center">
                                    <button onClick={()=>ViewProduct(item.product?._id)} className="px-4 py-2 bg-green-500 text-white rounded-md hover:bg-green-600 transition">
                                        View
                                    </button>
                                    <button
                                        onClick={() => removeFromWishlist(item.id)}
                                        className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600 transition"
                                    >
                                        Remove
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}

import { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { createOrUpdateBrand, deleteBrand, resetError, resetMessage } from "../../slices/brandSlice";
import BrandModal from "../../components/BrandModal";
import { Delete02Icon, PencilEdit02Icon } from "hugeicons-react";
import { toast } from "react-toastify";

const BrandManagement = () => {
  const dispatch = useDispatch();
  const { brands, message, error } = useSelector((state) => state.brands);
  const { categories } = useSelector((state) => state.categories);

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [brandName, setBrandName] = useState("");
  const [categoryId, setCategoryId] = useState("");
  const [editingBrand, setEditingBrand] = useState(null);

  const handleCreateBrand = () => {
    dispatch(createOrUpdateBrand({ brandName, categoryId, editingBrand }))
    setIsModalOpen(false);
    setBrandName("");
    setCategoryId("");
    setEditingBrand(null);
  };

  const handleEditBrand = (brand) => {
    setBrandName(brand.name);
    setCategoryId(brand.category?._id);
    setEditingBrand(brand);
    setIsModalOpen(true);
  };

  const handleDeleteBrand = (brandId) => {
    const confirmDelete = window.confirm("Are you sure you want to delete this brand?");
    if (confirmDelete) {
      dispatch(deleteBrand(brandId));
    }
  };
  useEffect(() => {
    if (message) {
      toast.success(message);
      dispatch(resetMessage());
    }
    if (error) {
      toast.error(error);
      dispatch(resetError());
    }
  }, [message, error, dispatch]);

  return (
    <div className="">
      <div className="flex items-center justify-between bg-white mb-4 dark:bg-zinc-900  border border-gray-200 dark:border-zinc-700 p-4">
        <h3 className="text-xl font-medium dark:text-gray-200">Brands</h3>
        
        <button
          type="button"
          onClick={() => setIsModalOpen(true)}
          className="buttonStyled"
        >
          Add new
        </button>
      </div>

      <div className="max-w-full w-full overflow-auto bg-white dark:bg-zinc-900 border border-gray-200 dark:border-zinc-700 p-4 shadow-sm">
        <div className="">
          <table className="min-w-full bg-white dark:bg-zinc-900 border dark:border-zinc-700">
            <thead>
              <tr className="bg-gray-100 dark:bg-zinc-800 dark:text-gray-300 border-b dark:border-zinc-700">
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">#</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Name</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Category</th>
                <th className="py-3 px-4 text-left text-sm font-semibold text-gray-600 dark:text-gray-300 uppercase">Action</th>
              </tr>
            </thead>
            <tbody className="dark:text-zinc-400">
              {brands?.map((brand, index) => (
                <tr
                  key={brand._id}
                  className={`cursor-pointer transition ${isModalOpen?._id === brand?._id
                    ? "bg-orange-50 dark:bg-[#f974160a] border-l-4 border-orange-500 border-b border-b-gray-200 dark:border-b-zinc-700"
                    : "hover:bg-gray-50 dark:hover:bg-zinc-800 dark:border-zinc-700 border-b border-zinc-200"
                    }`}
                >
                  <td className="py-3 px-4">{index + 1}</td>
                  <td className="py-3 px-4">{brand.name}</td>
                  <td className="py-3 px-4">{brand.category?.name}</td>
                  
                  <td className="py-3 px-4 flex items-center gap-2">
                    <button
                      className="p-1.5 rounded-md border dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-blue-500"
                      onClick={() => handleEditBrand(brand)}
                    >
                      <PencilEdit02Icon size={18} />
                    </button>
                    <button
                      className="ml-1 p-1.5 rounded-md border dark:border-zinc-700 bg-gray-50 dark:bg-zinc-800 hover:bg-gray-100 dark:hover:bg-zinc-700 text-red-500"
                      onClick={() => handleDeleteBrand(brand._id)}
                    >
                      <Delete02Icon size={18} />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>


        </div>

        {brands.length === 0 && <p className="py-2 text-center text-gray-400">No brand found</p>}


      </div>

<BrandModal
        isOpen={isModalOpen}
        onClose={() => setIsModalOpen(false)}
        categories={categories}
        brandName={brandName}
        setBrandName={setBrandName}
        categoryId={categoryId}
        setCategoryId={setCategoryId}
        handleCreateBrand={handleCreateBrand}
        isEditing={editingBrand !== null}
      />
    </div>
  );
};

export default BrandManagement;
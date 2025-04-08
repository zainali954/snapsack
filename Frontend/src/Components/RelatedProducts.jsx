import { useSelector } from 'react-redux'
import ProductItem from './ProductItem'

const RelatedProducts = () => {
    const { relatedProducts } = useSelector(state => state.products);

    return (
        <div className=" my-6">
            <div>
                <h2 className="uppercase text-xl font-bold text-gray-800 font-dosis">Related Products</h2>
                <div className='grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 lg:grid-cols-5 mt-6 border  border-gray-200'>
                    {relatedProducts.map((product) => (
                        <ProductItem key={product._id} product={product} />
                    ))}
                </div>
            </div>
        </div>
    )
}

export default RelatedProducts
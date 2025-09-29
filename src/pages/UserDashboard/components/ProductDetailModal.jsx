import React from 'react';
import { X } from 'lucide-react';

const ProductDetailModal = ({ product, onClose }) => {
  if (!product) return null;

  return (
    <div 
      className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex justify-center items-center p-4"
      onClick={onClose}
    >
      <div 
        className="bg-white text-foreground rounded-2xl shadow-2xl w-full max-w-2xl max-h-[90vh] overflow-y-auto" 
        onClick={(e) => e.stopPropagation()}
      >
        <div className="sticky top-0 z-10 flex justify-end p-2 bg-gradient-to-b from-white/80 to-transparent">
          <button onClick={onClose} className="rounded-full h-9 w-9 p-0 bg-gray-200 hover:bg-gray-300 text-gray-700 flex items-center justify-center">
            <X size={24} />
          </button>
        </div>
        <div className="p-6 sm:p-10 -mt-10">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1 flex flex-col items-center">
              <div className="w-40 h-40 bg-gray-100 rounded-lg flex items-center justify-center mb-4">
                  <img src={product.image || 'https://placehold.co/150x150/f1f5f9/334155?text=Product'} alt={product.name} className="w-32 h-32 object-contain" />
              </div>
              <h2 className="text-2xl font-bold font-heading text-center">{product.name}</h2>
              <p className="text-gray-500 text-center">{product.category}</p>
            </div>

            <div className="md:col-span-2 space-y-6">
              <div>
                <h3 className="font-semibold text-lg mb-2 border-b pb-2">Usage</h3>
                <p className="text-gray-600">{product.usage || 'Details not available.'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 border-b pb-2">Application</h3>
                <p className="text-gray-600">{product.application || 'Details not available.'}</p>
              </div>
              <div>
                <h3 className="font-semibold text-lg mb-2 border-b pb-2">Tips</h3>
                <p className="text-gray-600">{product.tips || 'Details not available.'}</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailModal;

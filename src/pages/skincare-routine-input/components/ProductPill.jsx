import React from 'react';

const ProductPill = ({ productName }) => {
  return (
    <div className="bg-primary/10 text-primary font-caption font-caption-medium text-xs rounded-full px-2.5 py-1 truncate">
      {productName || "Unnamed Product"} 
    </div>
  );
};

export default ProductPill;
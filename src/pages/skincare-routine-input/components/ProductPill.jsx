import React from 'react';
import { cn } from "../../../utils/cn";

const ProductPill = ({ product, onClick, onRemove, conflict, isSelected }) => {
  return (
    <div
      onClick={onClick}
      className={cn(
        "bg-primary/10 text-primary font-caption font-caption-medium text-xs rounded-full px-2.5 py-1 truncate cursor-pointer flex justify-between items-center",
        {
          "border border-red-500 bg-red-100/10 text-red-500": conflict?.hasConflict,
          "ring-2 ring-primary": isSelected,
        },
        !onClick && "cursor-default"
      )}
    >
      <span>{product.name || "Unnamed Product"}</span>
      <div className="flex items-center">
        {conflict?.hasConflict && (
          <span className="text-red-500 text-xs ml-2">(Conflict)</span>
        )}
        {onRemove && (
            <button
              onClick={onRemove}
              className="ml-2 text-gray-500 hover:text-gray-700"
            >
              &times;
            </button>
        )}
      </div>
    </div>
  );
};

export default ProductPill;
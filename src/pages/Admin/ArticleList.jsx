
import React from 'react';

const ArticleList = ({ articles, onEdit, onDelete }) => {
  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">Skincare 101 Articles</h2>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {articles.map(article => (
          <div key={article.id} className="bg-white p-4 rounded-lg shadow-md">
            <img src={article.image} alt={article.title} className="w-full h-32 object-cover rounded-md mb-4" />
            <h3 className="text-lg font-bold mb-2">{article.title}</h3>
            <p className="text-gray-600 mb-4">{article.category} - {article.readTime}</p>
            <div className="flex justify-end space-x-2">
              <button
                onClick={() => onEdit(article)}
                className="bg-blue-500 text-white px-3 py-1 rounded-md hover:bg-blue-600"
              >
                Edit
              </button>
              <button 
                onClick={() => onDelete(article.id)}
                className="bg-red-500 text-white px-3 py-1 rounded-md hover:bg-red-600"
              >
                Delete
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ArticleList;


import React, { useState, useEffect } from 'react';

const ArticleForm = ({ article, onSave, onCancel }) => {
  const [editedArticle, setEditedArticle] = useState(article);

  useEffect(() => {
    setEditedArticle(article);
  }, [article]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setEditedArticle(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(editedArticle);
  };

  return (
    <div>
      <h2 className="text-2xl font-bold mb-4">{article.id ? 'Edit Article' : 'Create Article'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={editedArticle.title}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <input
            type="text"
            id="category"
            name="category"
            value={editedArticle.category}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">Read Time</label>
          <input
            type="text"
            id="readTime"
            name="readTime"
            value={editedArticle.readTime}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="image" className="block text-sm font-medium text-gray-700">Image URL</label>
          <input
            type="text"
            id="image"
            name="image"
            value={editedArticle.image}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="color" className="block text-sm font-medium text-gray-700">Color</label>
          <input
            type="color"
            id="color"
            name="color"
            value={editedArticle.color}
            onChange={handleChange}
            className="mt-1 block w-full h-10"
          />
        </div>

        <div className="mb-4">
          <label htmlFor="content" className="block text-sm font-medium text-gray-700">Content</label>
          <textarea
            id="content"
            name="content"
            rows="10"
            value={editedArticle.content}
            onChange={handleChange}
            className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm py-2 px-3 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
          ></textarea>
        </div>

        <div className="mb-4">
          <label className="flex items-center">
            <input
              type="checkbox"
              name="isLarge"
              checked={editedArticle.isLarge}
              onChange={handleChange}
              className="h-4 w-4 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded"
            />
            <span className="ml-2 text-sm text-gray-600">Is Large Card</span>
          </label>
        </div>

        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-3 py-1 rounded-md hover:bg-gray-600">
            Cancel
          </button>
          <button type="submit" className="bg-green-500 text-white px-3 py-1 rounded-md hover:bg-green-600">
            Save
          </button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;

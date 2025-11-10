import React, { useState, useEffect } from 'react';
import ReactQuill from 'react-quill';
import 'react-quill/dist/quill.snow.css'; // import styles

const categories = ['Skincare', 'Ingredients', 'Routines', 'Lifestyle'];

const ArticleForm = ({ article, onSave, onCancel }) => {
  const [formData, setFormData] = useState({
    title: '',
    category: categories[0], // default category
    readTime: '',
    image: '',
    content: ''
  });
  const [imagePreview, setImagePreview] = useState('');

  useEffect(() => {
    if (article) {
      setFormData(article);
      if (article.image) {
        setImagePreview(article.image); // show existing image
      }
    } else {
      setFormData({
        title: '',
        category: categories[0],
        readTime: '',
        image: '',
        content: ''
      });
      setImagePreview('');
    }
  }, [article]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  const handleContentChange = (content) => {
    setFormData(prev => ({ ...prev, content }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreview(reader.result);
        setFormData(prev => ({ ...prev, image: reader.result })); // Store as base64 for now
      };
      reader.readAsDataURL(file);
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSave(formData);
  };

  return (
    <div className="bg-white p-6 rounded-lg shadow-md">
      <h2 className="text-2xl font-bold mb-4">{article ? 'Edit Article' : 'Add New Article'}</h2>
      <form onSubmit={handleSubmit}>
        <div className="mb-4">
          <label htmlFor="title" className="block text-sm font-medium text-gray-700">Title</label>
          <input
            type="text"
            id="title"
            name="title"
            value={formData.title}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label htmlFor="category" className="block text-sm font-medium text-gray-700">Category</label>
          <select
            id="category"
            name="category"
            value={formData.category}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
          >
            {categories.map(cat => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="mb-4">
          <label htmlFor="readTime" className="block text-sm font-medium text-gray-700">Read Time</label>
          <input
            type="text"
            id="readTime"
            name="readTime"
            value={formData.readTime}
            onChange={handleChange}
            className="mt-1 block w-full px-3 py-2 bg-white border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            required
          />
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Article Image</label>
          <div className="mt-1 flex items-center">
            <input type="file" id="image-upload" className="hidden" onChange={handleImageChange} accept="image/*" />
            <label htmlFor="image-upload" className="cursor-pointer bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Upload Image</label>
            {imagePreview && (
              <img src={imagePreview} alt="Preview" className="ml-4 h-20 w-20 object-cover rounded-md" />
            )}
          </div>
        </div>
        <div className="mb-4">
          <label className="block text-sm font-medium text-gray-700">Content</label>
          <ReactQuill value={formData.content} onChange={handleContentChange} theme="snow" />
        </div>
        <div className="flex justify-end space-x-2">
          <button type="button" onClick={onCancel} className="bg-gray-500 text-white px-4 py-2 rounded-md hover:bg-gray-600">Cancel</button>
          <button type="submit" className="bg-blue-500 text-white px-4 py-2 rounded-md hover:bg-blue-600">Save</button>
        </div>
      </form>
    </div>
  );
};

export default ArticleForm;

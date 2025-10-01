import React, { useState, useEffect } from 'react';
import ArticleList from './Admin/ArticleList';
import ArticleForm from '../components/ui/ArticleForm';

// This function would ideally fetch from a backend, but we use a local file for now.
const fetchArticles = async () => {
  const response = await fetch('/api/articles');
  if (!response.ok) {
    throw new Error('Failed to fetch articles');
  }
  return await response.json();
};

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [editingArticle, setEditingArticle] = useState(null);
  const [isFormVisible, setIsFormVisible] = useState(false);

  useEffect(() => {
    fetchArticles().then(setArticles).catch(console.error);
  }, []);

  const handleEdit = (article) => {
    setEditingArticle(article);
    setIsFormVisible(true);
  };

  // This function would send a request to a backend API to save the article.
  const handleSave = async (editedArticle) => {
    // Here you would have your API call logic, e.g., using fetch()
    // For this example, we just update the local state.
    if (editingArticle.id) {
      // Update existing article
      setArticles(articles.map(a => a.id === editedArticle.id ? editedArticle : a));
    } else {
      // Create new article
      const newArticle = { ...editedArticle, id: Date.now() }; // Simple ID generation
      setArticles([...articles, newArticle]);
    }
    setIsFormVisible(false);
    setEditingArticle(null);
    // NOTE: This does not persist changes. You would need a backend.
  };

  // This function would send a request to a backend API to delete the article.
  const handleDelete = (articleId) => {
    setArticles(articles.filter(a => a.id !== articleId));
    // NOTE: This does not persist changes. You would need a backend.
  };

  const handleCancel = () => {
    setIsFormVisible(false);
    setEditingArticle(null);
  };

  const handleCreate = () => {
    setEditingArticle({
      id: null, // Indicates a new article
      title: '',
      category: '',
      readTime: '',
      image: '',
      color: '#ffffff',
      isLarge: false,
      content: ''
    });
    setIsFormVisible(true);
  };

  return (
    <div className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold">Manage Articles</h1>
        <button
          onClick={handleCreate}
          className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
        >
          Create New Article
        </button>
      </div>
      {isFormVisible ? (
        <ArticleForm
          article={editingArticle}
          onSave={handleSave}
          onCancel={handleCancel}
        />
      ) : (
        <ArticleList articles={articles} onEdit={handleEdit} onDelete={handleDelete} />
      )}
    </div>
  );
};

export default AdminArticles;


import React, { useState, useEffect } from 'react';
import ArticleList from './Admin/ArticleList';
import ArticleForm from './Admin/ArticleForm';
import { getArticles, addArticle, updateArticle, deleteArticle } from '../utils/api';

const AdminArticles = () => {
  const [articles, setArticles] = useState([]);
  const [view, setView] = useState('list'); // 'list' or 'form'
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initialize = async () => {
      setLoading(true);
      const fetchedArticles = await getArticles();
      setArticles(fetchedArticles);
      setLoading(false);

      // Check URL for actions
      const params = new URLSearchParams(window.location.search);
      const action = params.get('action');
      const articleId = params.get('id');

      if (action === 'add') {
        setView('form');
        setSelectedArticle(null);
      } else if (action === 'edit' && articleId) {
        const article = fetchedArticles.find(a => a.id.toString() === articleId);
        if (article) {
          setSelectedArticle(article);
          setView('form');
        }
      }
    };
    initialize();
  }, []);

  const updateUrl = (path) => {
    window.history.pushState({}, '', path);
  };

  const handleAdd = () => {
    setSelectedArticle(null);
    setView('form');
    updateUrl('/admin/articles?action=add');
  };

  const handleEdit = (article) => {
    setSelectedArticle(article);
    setView('form');
    updateUrl(`/admin/articles?action=edit&id=${article.id}`);
  };

  const handleDelete = async (articleId) => {
    await deleteArticle(articleId);
    const fetchedArticles = await getArticles();
    setArticles(fetchedArticles);
  };

  const handleSave = async (articleData) => {
    if (articleData.id) {
      await updateArticle(articleData);
    } else {
      await addArticle(articleData);
    }
    const fetchedArticles = await getArticles();
    setArticles(fetchedArticles);
    setView('list');
    setSelectedArticle(null);
    updateUrl('/admin/articles');
  };

  const handleCancel = () => {
    setView('list');
    setSelectedArticle(null);
    updateUrl('/admin/articles');
  };

  if (loading) {
    return <div className="container mx-auto p-4">Loading...</div>;
  }

  return (
    <div className="container mx-auto p-4">
      {view === 'list' ? (
        <>
          <div className="flex justify-between items-center mb-4">
            <h1 className="text-3xl font-bold">Manage Articles</h1>
            <button 
              onClick={handleAdd}
              className="bg-green-500 text-white px-4 py-2 rounded-md hover:bg-green-600"
            >
              Add New Article
            </button>
          </div>
          <ArticleList articles={articles} onEdit={handleEdit} onDelete={handleDelete} />
        </>
      ) : (
        <ArticleForm 
          article={selectedArticle} 
          onSave={handleSave} 
          onCancel={handleCancel} 
        />
      )}
    </div>
  );
};

export default AdminArticles;

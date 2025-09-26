
import React, { useState, useEffect } from 'react';
import { Helmet } from 'react-helmet';
import Button from '../../components/ui/Button';
import Icon from '../../components/AppIcon';
import { X, Heart, Share2, Sparkles } from 'lucide-react';
import { articles } from '../../data/articles'; // Import articles from the new file

// Keyframe animations for our engagement buttons
const animationStyles = `
  @keyframes heartbeat {
    0% { transform: scale(1); }
    50% { transform: scale(1.3); }
    100% { transform: scale(1); }
  }
  .heart-beat { animation: heartbeat 0.5s ease-in-out; }

  @keyframes sparkle-animation {
    0% { transform: scale(0); opacity: 0; }
    50% { transform: scale(1.5); opacity: 1; }
    100% { transform: scale(0); opacity: 0; }
  }
  .sparkle-effect::before, .sparkle-effect::after {
    content: '\✨';
    position: absolute;
    top: 50%;
    left: 50%;
    transform: translate(-50%, -50%);
    animation: sparkle-animation 0.7s forwards;
  }
  .sparkle-effect::after { animation-delay: 0.2s; }

  .modal-content-scroll::-webkit-scrollbar {
    display: none;
  }
  .modal-content-scroll {
    -ms-overflow-style: none;
    scrollbar-width: none;
  }
`;

const EngagementButtons = ({ article, isLiked, onLike, onShare, onSparkle, inModal }) => {
  const buttonClass = `
    rounded-full h-10 w-10 p-0 flex items-center justify-center transition-colors 
    ${inModal ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-black/20 text-white hover:bg-black/40'}
  `;

  const likedClass = `
    ${isLiked ? 'text-red-500 bg-red-100 hover:bg-red-200' : (inModal ? 'bg-gray-200 text-gray-700 hover:bg-gray-300' : 'bg-black/20 text-white hover:bg-black/40')}
  `;

  return (
    <div className="flex items-center space-x-2" onClick={(e) => e.stopPropagation()}>
      <Button onClick={onLike} className={`${buttonClass} ${likedClass}`}>
        <Heart size={20} className={isLiked ? 'fill-current heart-beat' : ''} />
      </Button>
      <Button onClick={onShare} className={buttonClass}>
        <Share2 size={20} />
      </Button>
      <Button onClick={(e) => onSparkle(e.currentTarget)} className={`${buttonClass} relative overflow-hidden`}>
        <Sparkles size={20} />
      </Button>
    </div>
  );
};

const FormattedArticleContent = ({ content }) => {
  const elements = [];
  const lines = content.split('\n');
  let listItems = [];
  let listType = null;

  const flushList = (key) => {
    if (listItems.length > 0) {
      const ListComponent = listType;
      const className = listType === 'ol' ? 'list-decimal list-inside space-y-2 my-4' : 'list-disc list-inside space-y-2 my-4';
      elements.push(
        <ListComponent key={key} className={className}>
          {listItems.map((item, index) => {
            const parts = item.split(/(\*{2}.*?\*{2})/g);
            return (
              <li key={index}>
                {parts.map((part, i) =>
                  part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
                )}
              </li>
            );
          })}
        </ListComponent>
      );
      listItems = [];
      listType = null;
    }
  };

  lines.forEach((line, index) => {
    const olMatch = line.match(/^(\d+)\.\s/);
    const ulMatch = line.match(/^\-\s/);

    if (olMatch) {
      if (listType !== 'ol') flushList(`list-${index}`);
      listType = 'ol';
      listItems.push(line.replace(/^\d+\.\s/, ''));
    } else if (ulMatch) {
      if (listType !== 'ul') flushList(`list-${index}`);
      listType = 'ul';
      listItems.push(line.replace(/^\-\s/, ''));
    } else {
      flushList(`list-${index}`);
      if (line.trim() !== '') {
        if (line.startsWith('**') && line.endsWith('**')) {
          elements.push(
            <h3 key={index} className="text-2xl font-bold font-heading mt-6 mb-3">
              {line.slice(2, -2)}
            </h3>
          );
        } else {
          const parts = line.split(/(\*{2}.*?\*{2})/g);
          elements.push(
            <p key={index} className="my-4">
              {parts.map((part, i) =>
                part.startsWith('**') ? <strong key={i}>{part.slice(2, -2)}</strong> : part
              )}
            </p>
          );
        }
      }
    }
  });

  flushList('last-list');

  return (
    <div className="prose prose-lg max-w-none text-muted-foreground">
      {elements}
    </div>
  );
};

const ArticleModal = ({ article, onClose, isLiked, onLike, onShare, onSparkle }) => {
  useEffect(() => {
    if (article) {
      const handleEsc = (event) => {
        if (event.keyCode === 27) onClose();
      };
      window.addEventListener('keydown', handleEsc);
      document.body.style.overflow = 'hidden';
      return () => {
        window.removeEventListener('keydown', handleEsc);
        document.body.style.overflow = 'unset';
      };
    }
  }, [article, onClose]);

  if (!article) return null;

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4" onClick={onClose}>
      <div className="bg-card text-foreground rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl relative modal-content-scroll" onClick={(e) => e.stopPropagation()}>
        <div className="sticky top-0 z-10 flex justify-end p-2 bg-gradient-to-b from-black/50 to-transparent">
          <Button onClick={onClose} className="rounded-full h-9 w-9 p-0 bg-black/40 hover:bg-black/60 text-white flex items-center justify-center">
            <X size={24} />
          </Button>
        </div>
        <img src={article.image} alt={article.title} className="w-full h-64 object-cover -mt-14 lg:-mt-13" />
        <div className="p-8 sm:p-10">
          <div className="flex flex-col sm:flex-row sm:justify-between sm:items-start gap-4 mb-4">
            <div>
              <p className="text-primary font-semibold">{article.category} • {article.readTime}</p>
              <h2 className="text-3xl sm:text-4xl font-bold font-heading mt-1">{article.title}</h2>
            </div>
            <EngagementButtons article={article} isLiked={isLiked} onLike={onLike} onShare={onShare} onSparkle={onSparkle} inModal={true} />
          </div>
          <FormattedArticleContent content={article.content} />
        </div>
      </div>
    </div>
  );
};

const ArticleCard = ({ article, onArticleSelect, isLiked, onLike, onShare, onSparkle }) => {
  const cardStyle = {
    backgroundColor: article.color,
    backgroundImage: `url(${article.image})`,
    backgroundBlendMode: 'multiply',
    backgroundSize: 'cover',
    backgroundPosition: 'center'
  };

  return (
    <div 
      onClick={() => onArticleSelect(article)} 
      className={`relative flex flex-col justify-between p-6 rounded-2xl text-white overflow-hidden h-80 shadow-lg hover:shadow-2xl transition-all duration-300 group cursor-pointer ${article.isLarge ? 'lg:col-span-2' : ''}`}
      style={cardStyle}
    >
      <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent"></div>
      <div className="relative z-10">
        <p className="text-sm font-semibold uppercase tracking-wider opacity-90 mb-2">{article.category}</p>
        <h2 className="text-2xl sm:text-3xl font-bold font-heading leading-tight">{article.title}</h2>
      </div>
      <div className="relative z-10 mt-auto flex justify-between items-end">
        <span className="text-xs font-semibold bg-black/30 px-2 py-1 rounded-full backdrop-blur-sm">{article.readTime}</span>
        <EngagementButtons 
          article={article} 
          isLiked={isLiked} 
          onLike={onLike} 
          onShare={onShare} 
          onSparkle={onSparkle} 
          inModal={false} 
        />
      </div>
    </div>
  );
};

const Skincare101 = () => {
  const [selectedArticle, setSelectedArticle] = useState(null);
  const [likedArticles, setLikedArticles] = useState({});

  const handleLike = (articleId) => {
    setLikedArticles(prev => ({ ...prev, [articleId]: !prev[articleId] }));
  };

  const handleShare = async (article) => {
    if (navigator.share) {
      try {
        await navigator.share({
          title: article.title,
          text: `Check out this skincare article: ${article.title}`,
          url: window.location.href, // Or a specific URL for the article
        });
      } catch (error) {
        console.error('Error sharing:', error);
      }
    } else {
      // Fallback for browsers that don't support navigator.share
      alert('Sharing is not supported on this browser.');
    }
  };

  const handleSparkle = (element) => {
    element.classList.add('sparkle-effect');
    setTimeout(() => element.classList.remove('sparkle-effect'), 700);
  };

  return (
    <>
      <Helmet>
        <title>Skincare 101 - Your Guide to Skincare Fundamentals</title>
        <meta name="description" content="Learn the basics of skincare with our science-backed articles, guides, and tips." />
        <style>{animationStyles}</style>
      </Helmet>
      <div className="min-h-screen bg-background text-foreground">
        <main className="py-10 sm:py-16">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="text-center mb-14">
              <h1 className="text-5xl sm:text-6xl font-extrabold font-heading text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent mb-4 tracking-tight">Skincare 101</h1>
              <p className="text-lg sm:text-xl text-muted-foreground max-w-3xl mx-auto">Your ultimate guide to the fundamentals of skincare. We provide science-backed, easy-to-understand content to help you achieve your best skin.</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 lg:grid-flow-row-dense gap-8">
              {articles.map((article) => (
                <ArticleCard
                  key={article.id}
                  article={article}
                  onArticleSelect={setSelectedArticle}
                  isLiked={!!likedArticles[article.id]}
                  onLike={() => handleLike(article.id)}
                  onShare={() => handleShare(article)}
                  onSparkle={handleSparkle}
                />
              ))}
            </div>
          </div>
        </main>
        <ArticleModal
          article={selectedArticle}
          onClose={() => setSelectedArticle(null)}
          isLiked={!!selectedArticle && !!likedArticles[selectedArticle.id]}
          onLike={() => selectedArticle && handleLike(selectedArticle.id)}
          onShare={() => selectedArticle && handleShare(selectedArticle)}
          onSparkle={handleSparkle}
        />
      </div>
    </>
  );
};

export default Skincare101;

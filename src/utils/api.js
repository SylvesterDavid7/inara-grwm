
// In-memory database
let articles = [];
let initialized = false;

// Helper to fetch initial data from the new JSON file
const initializeDB = async () => {
    if (!initialized) {
        try {
            // Fetch the static JSON file.
            const response = await fetch('/data/articles.json');
            if (!response.ok) throw new Error('Network response was not ok');
            articles = await response.json();
            initialized = true;
        } catch (error) {
            console.error("Could not initialize DB from articles.json:", error);
            // Fallback to an empty array in case of an error
            articles = [];
        }
    }
};

export const getArticles = async () => {
    // Ensure the DB is initialized before returning articles
    await initializeDB();
    return articles;
};

export const addArticle = async (article) => {
    await initializeDB();
    // Find the highest current ID to generate a new one
    const maxId = articles.reduce((max, p) => p.id > max ? p.id : max, 0);
    const newArticle = { ...article, id: maxId + 1 };
    
    // Add the new article to the in-memory array
    articles = [...articles, newArticle];
    
    // In a real application, you would make a POST request to a backend API here
    // The backend would then write the updated array to the articles.json file.
    console.log("Simulating ADD: The articles array in memory is now:", articles);
    
    return newArticle;
};

export const updateArticle = async (updatedArticle) => {
    await initializeDB();
    
    // Find and update the article in the in-memory array
    articles = articles.map(article => 
        article.id === updatedArticle.id ? updatedArticle : article
    );

    // In a real application, you would make a PUT request to a backend API here.
    console.log("Simulating UPDATE: The articles array in memory is now:", articles);

    return updatedArticle;
};

export const deleteArticle = async (articleId) => {
    await initializeDB();

    // Filter out the deleted article from the in-memory array
    articles = articles.filter(article => article.id !== articleId);
    
    // In a real application, you would make a DELETE request to a backend API here.
    console.log("Simulating DELETE: The articles array in memory is now:", articles);

    return { id: articleId };
};

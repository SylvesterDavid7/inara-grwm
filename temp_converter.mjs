import { articles } from './src/data/articles.js';
import fs from 'fs';

const articlesData = articles;

fs.writeFileSync('./src/data/articles.json', JSON.stringify(articlesData, null, 2));

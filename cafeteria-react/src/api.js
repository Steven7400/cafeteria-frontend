
import axios from 'axios';

const API_URL = 'https://cafeteria-backend-1-whnd.onrender.com';

export const api = axios.create({
  baseURL: API_URL
});
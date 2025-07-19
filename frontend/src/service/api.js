import axios from 'axios';

export const fetchStuff = axios.create({
  baseURL: 'http://localhost:5000/api',
  withCredentials: true
});
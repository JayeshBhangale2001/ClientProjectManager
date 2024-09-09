// src/services/codaService.js

import axios from 'axios';

const CODA_API_BASE_URL = 'https://coda.io/apis/v1';

const apiKey = import.meta.env.VITE_APP_CODA_API_KEY; // Use Vite's way to access environment variables

// Function to fetch data from a specific table
export const fetchCodaData = async (docId, tableId) => {
  if (!apiKey) {
    throw new Error('Coda API key is missing. Please set VITE_APP_CODA_API_KEY in your environment variables.');
  }

  try {
    const response = await axios.get(`${CODA_API_BASE_URL}/docs/${docId}/tables/${tableId}/rows`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching data from Coda:', error);
    throw error;
  }
};

// Function to fetch the list of tables in a document
export const fetchTablesInDoc = async (docId) => {
  if (!apiKey) {
    throw new Error('Coda API key is missing. Please set VITE_APP_CODA_API_KEY in your environment variables.');
  }

  try {
    const response = await axios.get(`${CODA_API_BASE_URL}/docs/${docId}/tables`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching tables from Coda:', error);
    throw error;
  }
};

// Function to fetch details about a specific table
export const fetchTableDetails = async (docId, tableIdOrName) => {
  if (!apiKey) {
    throw new Error('Coda API key is missing. Please set VITE_APP_CODA_API_KEY in your environment variables.');
  }

  try {
    const response = await axios.get(`${CODA_API_BASE_URL}/docs/${docId}/tables/${tableIdOrName}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching table details from Coda:', error);
    throw error;
  }
};

// Function to fetch details about a specific row
export const fetchRowDetails = async (docId, tableIdOrName, rowId) => {
  if (!apiKey) {
    throw new Error('Coda API key is missing. Please set VITE_APP_CODA_API_KEY in your environment variables.');
  }

  try {
    const response = await axios.get(`${CODA_API_BASE_URL}/docs/${docId}/tables/${tableIdOrName}/rows/${rowId}`, {
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
    });
    return response.data;
  } catch (error) {
    console.error('Error fetching row details from Coda:', error);
    throw error;
  }
};

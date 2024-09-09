import React, { useState } from 'react';
import { fetchTablesInDoc, fetchCodaData } from '../utils/codaService'; // Update import path as needed

const CodaDataPage = () => {
  const [docId, setDocId] = useState('');
  const [tableId, setTableId] = useState('');
  const [tables, setTables] = useState([]);
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleFetchTables = async () => {
    setLoading(true);
    setError(null);
    try {
      const tablesData = await fetchTablesInDoc(docId);
      console.log('Fetched Tables Data:', tablesData); // Log the tablesData response
      setTables(tablesData.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleFetchData = async () => {
    setLoading(true);
    setError(null);
    try {
      const codaData = await fetchCodaData(docId, tableId);
      console.log('Fetched Coda Data:', codaData); // Log the codaData response
      setData(codaData.items);
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  // Extract all unique value keys from the data to use as column headers
  const getColumnHeaders = () => {
    const allKeys = new Set();
    data.forEach(item => {
      Object.keys(item.values).forEach(key => allKeys.add(key));
    });
    return Array.from(allKeys);
  };

  const columnHeaders = getColumnHeaders();

  const handleRowClick = (row) => {
    // Modify the browserLink by appending &view=full
    const modifiedLink = `${row.browserLink}&view=full`;
    // Open the modified link in a new tab
    window.open(modifiedLink, '_blank');
  };

  return (
    <div>
      <h1>Coda Data Fetcher</h1>

      <div className="mb-4">
        <label className="block text-sm font-bold mb-2">Doc ID:</label>
        <input
          type="text"
          value={docId}
          onChange={(e) => setDocId(e.target.value)}
          className="border rounded px-2 py-1 w-full"
          placeholder="Enter your Coda Doc ID"
        />
      </div>

      <button
        onClick={handleFetchTables}
        className="bg-blue-500 hover:bg-blue-700 text-white font-bold py-2 px-4 rounded mb-4"
        disabled={!docId || loading}
      >
        {loading ? 'Fetching Tables...' : 'Fetch Tables'}
      </button>

      {error && <p className="text-red-500 mt-4">Error: {error}</p>}

      {tables.length > 0 && (
        <div className="mb-4">
          <label className="block text-sm font-bold mb-2">Select Table:</label>
          <select
            value={tableId}
            onChange={(e) => setTableId(e.target.value)}
            className="border rounded px-2 py-1 w-full"
          >
            <option value="">Select a table</option>
            {tables.map((table) => (
              <option key={table.id} value={table.id}>
                {table.name}
              </option>
            ))}
          </select>
        </div>
      )}

      <button
        onClick={handleFetchData}
        className="bg-green-500 hover:bg-green-700 text-white font-bold py-2 px-4 rounded"
        disabled={!tableId || loading}
      >
        {loading ? 'Fetching Data...' : 'Fetch Table Data'}
      </button>

      {loading && <p className="mt-4">Loading data...</p>}

      {data.length > 0 && (
        <table className="table-auto w-full mt-6">
          <thead>
            <tr>
              <th className="border px-4 py-2">Browser Link</th>
              <th className="border px-4 py-2">Name</th>
              {columnHeaders.map((header) => (
                <th key={header} className="border px-4 py-2">
                  {header}
                </th>
              ))}
            </tr>
          </thead>
          <tbody>
            {data.map((row) => (
              <tr key={row.id} onClick={() => handleRowClick(row)} className="cursor-pointer">
                <td className="border px-4 py-2">
                  <a href={row.browserLink} target="_blank" rel="noopener noreferrer">
                    {row.browserLink}
                  </a>
                </td>
                <td className="border px-4 py-2">{row.name}</td>
                {columnHeaders.map((header) => (
                  <td key={header} className="border px-4 py-2">
                    {row.values[header] || ''}
                  </td>
                ))}
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default CodaDataPage;

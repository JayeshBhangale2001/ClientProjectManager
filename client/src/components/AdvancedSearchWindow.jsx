import React, { useState } from 'react';
import DatePicker from 'react-datepicker';
import 'react-datepicker/dist/react-datepicker.css';

// Sample data for dropdown options, replace with real data
const STAGES = ['To Do', 'In Progress', 'Completed'];
const PRIORITIES = ['High', 'Medium', 'Low'];

const AdvancedSearchWindow = ({ open, setOpen, setAdvancedSearch, tasks }) => {
  const [criteria, setCriteria] = useState({
    title: '',
    priority: '',
    stage: '',
    date: null,
    logicalOperator: 'AND', // Default logical operator
  });

  // Get unique values for dropdowns from tasks
  const uniquePriorities = Array.from(new Set(tasks.map(task => task.priority)));
  const uniqueStages = Array.from(new Set(tasks.map(task => task.stage)));

  const handleSearch = () => {
    setAdvancedSearch(criteria);
    setOpen(false);
  };

  return open ? (
    <div className='fixed inset-0 bg-gray-800 bg-opacity-50 flex items-center justify-center'>
      <div className='bg-white p-6 rounded shadow-md'>
        <h3 className='text-lg font-bold mb-4'>Advanced Search</h3>
        
        <div className='mb-4'>
          <label className='block mb-1'>Task Title:</label>
          <input
            type='text'
            value={criteria.title}
            onChange={(e) => setCriteria({ ...criteria, title: e.target.value })}
            className='border rounded w-full p-2'
          />
        </div>

        <div className='mb-4'>
          <label className='block mb-1'>Priority:</label>
          <select
            value={criteria.priority}
            onChange={(e) => setCriteria({ ...criteria, priority: e.target.value })}
            className='border rounded w-full p-2'
          >
            <option value=''>Select Priority</option>
            {uniquePriorities.map(priority => (
              <option key={priority} value={priority}>
                {priority}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-4'>
          <label className='block mb-1'>Stage:</label>
          <select
            value={criteria.stage}
            onChange={(e) => setCriteria({ ...criteria, stage: e.target.value })}
            className='border rounded w-full p-2'
          >
            <option value=''>Select Stage</option>
            {uniqueStages.map(stage => (
              <option key={stage} value={stage}>
                {stage}
              </option>
            ))}
          </select>
        </div>

        <div className='mb-4'>
          <label className='block mb-1'>Date:</label>
          <DatePicker
            selected={criteria.date}
            onChange={(date) => setCriteria({ ...criteria, date })}
            className='border rounded w-full p-2'
            dateFormat='yyyy-MM-dd'
            placeholderText='Select a date'
          />
        </div>

        <div className='mb-4'>
          <label className='block mb-1'>Logical Operator:</label>
          <select
            value={criteria.logicalOperator}
            onChange={(e) => setCriteria({ ...criteria, logicalOperator: e.target.value })}
            className='border rounded w-full p-2'
          >
            <option value='AND'>AND</option>
            <option value='OR'>OR</option>
          </select>
        </div>

        <div className='flex justify-end'>
          <button
            onClick={() => setOpen(false)}
            className='bg-gray-300 px-4 py-2 rounded mr-2'
          >
            Cancel
          </button>
          <button
            onClick={handleSearch}
            className='bg-blue-500 text-white px-4 py-2 rounded'
          >
            Search
          </button>
        </div>
      </div>
    </div>
  ) : null;
};

export default AdvancedSearchWindow;

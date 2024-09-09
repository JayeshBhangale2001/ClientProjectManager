import React, { useState } from 'react';
import clsx from 'clsx';
import {
  MdKeyboardArrowDown,
  MdKeyboardArrowUp,
  MdKeyboardDoubleArrowUp,
  MdSearch,  // Search icon
  MdClear,   // Clear icon
} from 'react-icons/md';
import { toast } from 'sonner';
import { useTrashTastMutation } from '../redux/slices/api/taskApiSlice.js';
import { BGS, PRIOTITYSTYELS, TASK_TYPE, formatDate } from '../utils/index.js';
import { ConfirmatioDialog, UserInfo, Button } from './index';
import { AddTask, TaskAssets, TaskColor } from './tasks';
import AdvancedSearchWindow from './AdvancedSearchWindow.jsx';
import { MdEdit, MdDelete, MdOpenInNew } from 'react-icons/md'; // Import icons
import { useNavigate } from 'react-router-dom';


const ICONS = {
  high: <MdKeyboardDoubleArrowUp />,
  medium: <MdKeyboardArrowUp />,
  low: <MdKeyboardArrowDown />,
};

const Table = ({ tasks }) => {
  const [openDialog, setOpenDialog] = useState(false);
  const [selected, setSelected] = useState(null);
  const [openEdit, setOpenEdit] = useState(false);
  const [openSearch, setOpenSearch] = useState(false);
  const [advancedSearch, setAdvancedSearch] = useState(null);
  const [searchQuery, setSearchQuery] = useState('');
  const navigate = useNavigate();

  const [deleteTask] = useTrashTastMutation();

  const deleteClicks = (id) => {
    setSelected(id);
    setOpenDialog(true);
  };

  const editClickHandler = (el) => {
    setSelected(el);
    setOpenEdit(true);
  };

  const deleteHandler = async () => {
    try {
      const res = await deleteTask({
        id: selected,
        isTrashed: 'trash',
      }).unwrap();

      toast.success(res?.message);

      setTimeout(() => {
        setOpenDialog(false);
        window.location.reload();
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  const handleSearch = (task) => {
    const searchQueryLower = searchQuery.toLowerCase();
    return (
      task.title.toLowerCase().includes(searchQueryLower) ||
      task.priority.toLowerCase().includes(searchQueryLower) ||
      new Date(task.createdAt).toDateString().toLowerCase().includes(searchQueryLower)
    );
  };

  const filteredTasks = advancedSearch
    ? tasks.filter(task => {
        const {
          title,
          priority,
          stage,
          date,
          logicalOperator
        } = advancedSearch;

        const matchesTitle = title ? task.title.includes(title) : true;
        const matchesPriority = priority ? task.priority === priority : true;
        const matchesStage = stage ? task.stage === stage : true;
        const matchesDate = date ? new Date(task.date).toDateString() === new Date(date).toDateString() : true;

        const fieldMatches = [
          { field: matchesTitle, value: title },
          { field: matchesPriority, value: priority },
          { field: matchesStage, value: stage },
          { field: matchesDate, value: date }
        ].filter(f => f.value !== '');

        if (fieldMatches.length === 0) return true;

        return fieldMatches.reduce((acc, curr, index) => {
          if (index === 0) return curr.field;
          return logicalOperator === 'AND'
            ? acc && curr.field
            : acc || curr.field;
        }, logicalOperator === 'AND');
      })
    : tasks.filter(handleSearch);

  const clearSearchFields = () => {
    setSearchQuery('');
    setAdvancedSearch(null);
  };

  const TableHeader = () => (
    <thead className='w-full border-b border-gray-300 dark:border-gray-600'>
      <tr className='w-full text-black dark:text-white text-left'>
        <th className='py-2'>Task Title</th>
        <th className='py-2'>Priority</th>
        <th className='py-2 line-clamp-1'>Created At</th>
        <th className='py-2'>Assets</th>
        <th className='py-2'>Team</th>
      </tr>
    </thead>
  );

  const TableRow = ({ task }) => {
    const handleTaskClick = (e, taskId) => {
      if (e.ctrlKey || e.metaKey) {
        // Open task in a new tab
        window.open(`/task/${taskId}`, '_blank');
      } else {
        // Navigate to the task detail page in the current tab
        navigate(`/task/${taskId}`);
      }
    };

    return (
      <tr
        className='border-b border-gray-200 text-gray-600 hover:bg-gray-300/10 cursor-pointer'
        onClick={(e) => handleTaskClick(e, task._id)}  // Add the click handler to the entire row
      >
        {/* Task Title (clickable now) */}
        <td className='py-2'>
          <div className='flex items-center gap-2'>
            <TaskColor className={TASK_TYPE[task.stage]} />
            <p className='w-full line-clamp-2 text-base text-black'>
              {task?.title}
            </p>
          </div>
        </td>

        {/* Priority */}
        <td className='py-2'>
          <div className='flex gap-1 items-center'>
            <span className={clsx('text-lg', PRIOTITYSTYELS[task?.priority])}>
              {ICONS[task?.priority]}
            </span>
            <span className='capitalize line-clamp-1'>
              {task?.priority} Priority
            </span>
          </div>
        </td>

        {/* Created At */}
        <td className='py-2'>
          <span className='text-sm text-gray-600'>
            {formatDate(new Date(task?.createdAt))}
          </span>
        </td>

        {/* Assets */}
        <td className='py-2'>
          <TaskAssets assets={task?.assets} />
        </td>

        {/* Team */}
        <td className='py-2'>
          <div className='flex gap-2'>
            {task?.team?.map((m, index) => (
              <div
                key={m._id}
                className={clsx(
                  'w-7 h-7 rounded-full text-white flex items-center justify-center text-sm -mr-1',
                  BGS[index % BGS?.length]
                )}
              >
                <UserInfo user={m} />
              </div>
            ))}
          </div>
        </td>

        {/* Edit and Delete buttons */}
        <td className='py-2 flex gap-2 md:gap-4 justify-end'>
          <button
            onClick={(e) => {
              e.stopPropagation();  // Prevent row click propagation
              editClickHandler(task);
            }}
            className='text-blue-600 hover:text-blue-500'
            title='Edit Task'
          >
            <MdEdit size={24} />
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();  // Prevent row click propagation
              deleteClicks(task._id);
            }}
            className='text-red-700 hover:text-red-500'
            title='Delete Task'
          >
            <MdDelete size={24} />
          </button>
        </td>
      </tr>
    );
  };

  return (
    <>
      <div className='bg-white px-2 md:px-4 pt-4 pb-9 shadow-md rounded'>
        <div className='flex justify-between mb-4'>
          <div className='flex w-full md:w-1/2 items-center'>
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              placeholder="Search..."
              className='border px-3 py-2 rounded w-full'
            />
            <button
              onClick={() => setOpenSearch(true)}
              className='ml-3 text-blue-500'
              title='Advanced Search'
            >
              <MdSearch size={24} /> {/* Advanced search icon */}
            </button>
            {searchQuery && (
              <button
                onClick={clearSearchFields}
                className='ml-3 text-red-500'
                title='Clear Search'
              >
                <MdClear size={24} /> {/* Clear search icon */}
              </button>
            )}
          </div>
        </div>

        <div className='overflow-x-auto'>
          <table className='w-full'>
            <TableHeader />
            <tbody>
              {filteredTasks.map((task, index) => (
                <TableRow key={index} task={task} />
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <ConfirmatioDialog
        open={openDialog}
        setOpen={setOpenDialog}
        onClick={deleteHandler}
      />

      <AddTask
        open={openEdit}
        setOpen={setOpenEdit}
        task={selected}
        key={new Date().getTime()}
      />

      <AdvancedSearchWindow
        open={openSearch}
        setOpen={setOpenSearch}
        setAdvancedSearch={setAdvancedSearch}
        tasks={tasks}
      />
    </>
  );
};

export default Table;

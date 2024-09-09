import React, { useState } from "react";
import TaskCard from "./TaskCard";
import TaskTitle from "./TaskTitle";

const BoardView = ({ tasks }) => {
  const [filterBy, setFilterBy] = useState("stage"); // Default filter by stage
  const [expandedTasks, setExpandedTasks] = useState({}); // Track expanded parent tasks
  const [viewMode, setViewMode] = useState("nested"); // 'nested', 'expandAll', or 'flatten'

  // Toggle the dropdown for subtasks
  const toggleDropdown = (taskId) => {
    setExpandedTasks((prevState) => ({
      ...prevState,
      [taskId]: !prevState[taskId],
    }));
  };

  // Group tasks based on the selected filter
  const groupTasks = (tasks, filterBy) => {
    return tasks.reduce((groups, task) => {
      const key = task[filterBy] || "Uncategorized";
      if (!groups[key]) {
        groups[key] = [];
      }
      groups[key].push(task);
      return groups;
    }, {});
  };

  const groupedTasks = groupTasks(tasks, filterBy);

  // Helper to check if the task is a parent task
  const isParentTask = (task) => !task.parentTaskId;

  // Find subtasks for a parent task
  const getSubtasks = (parentId) =>
    tasks.filter((task) => task.parentTaskId === parentId);

  return (
    <div>
      {/* Filter options */}
      <div className="mb-4 flex justify-between items-center">
        <div>
          <label htmlFor="filter" className="mr-2">
            Filter By:
          </label>
          <select
            id="filter"
            value={filterBy}
            onChange={(e) => setFilterBy(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="stage">Stage</option>
            <option value="priority">Priority</option>
            <option value="date">Date</option>
          </select>
        </div>

        {/* View mode dropdown */}
        <div>
          <label htmlFor="viewMode" className="mr-2">
            View Mode:
          </label>
          <select
            id="viewMode"
            value={viewMode}
            onChange={(e) => setViewMode(e.target.value)}
            className="border rounded px-2 py-1"
          >
            <option value="nested">Nested View</option>
            <option value="expandAll">Expand All</option>
            <option value="flatten">Flatten Board View</option>
          </select>
        </div>
      </div>

      {/* Dynamic columns based on filter */}
      <div className="w-full py-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 2xl:gap-10">
        {Object.keys(groupedTasks).map((group, index) => (
          <div className="space-y-4" key={index}>
            <TaskTitle label={group} className="bg-blue-500" />

            {viewMode === "nested" &&
              groupedTasks[group]
                .filter(isParentTask) // Only show parent tasks in nested view
                .map((task, taskIndex) => (
                  <div key={taskIndex} className="space-y-2">
                    <div className="border p-4 rounded shadow relative">
                      {/* Task card */}
                      <TaskCard task={task} />

                      {getSubtasks(task._id).length > 0 && (
                        <div className="relative">
                          {/* Dropdown button */}
                          <button
                            onClick={() => toggleDropdown(task._id)}
                            className="absolute top-2 left-2 bg-white p-1 rounded-full shadow"
                            style={{ top: "10px", left: "10px" }}
                          >
                            <svg
                              xmlns="http://www.w3.org/2000/svg"
                              fill="none"
                              viewBox="0 0 24 24"
                              stroke="currentColor"
                              className={`w-5 h-5 transition-transform transform ${
                                expandedTasks[task._id]
                                  ? "rotate-180"
                                  : "rotate-0"
                              }`}
                            >
                              <path
                                strokeLinecap="round"
                                strokeLinejoin="round"
                                strokeWidth={2}
                                d="M19 9l-7 7-7-7"
                              />
                            </svg>
                          </button>

                          {/* Subtasks dropdown */}
                          {expandedTasks[task._id] && (
                            <div className="mt-2 space-y-2 pl-6">
                              {getSubtasks(task._id).map(
                                (subTask, subTaskIndex) => (
                                  <div key={subTaskIndex}>
                                    <TaskCard task={subTask} isSubTask={true} />
                                  </div>
                                )
                              )}
                            </div>
                          )}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

            {/* Expand All view groups parent and subtasks in the same frame */}
            {viewMode === "expandAll" &&
              groupedTasks[group]
                .filter(isParentTask) // Only show parent tasks in expand all view
                .map((task, taskIndex) => (
                  <div key={taskIndex} className="space-y-2">
                    <div className="border p-4 rounded shadow relative">
                      {/* Parent task */}
                      <TaskCard task={task} />

                      {/* Subtasks (inside the same frame) */}
                      {getSubtasks(task._id).length > 0 && (
                        <div className="mt-4 space-y-2 pl-4">
                          {getSubtasks(task._id).map((subTask, subTaskIndex) => (
                            <TaskCard task={subTask} key={subTaskIndex} isSubTask={true} />
                          ))}
                        </div>
                      )}
                    </div>
                  </div>
                ))}

            {/* Flatten Board View shows all tasks as separate tasks */}
            {viewMode === "flatten" &&
              groupedTasks[group].map((task, taskIndex) => (
                <div key={taskIndex} className="space-y-2">
                  <div className="border p-4 rounded shadow">
                    <TaskCard task={task} />
                  </div>
                </div>
              ))}
          </div>
        ))}
      </div>
    </div>
  );
};

export default BoardView;

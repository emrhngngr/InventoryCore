import { Pen } from "lucide-react";
import React, { useMemo, useState } from "react";
import { FaSort, FaSortDown, FaSortUp } from "react-icons/fa";
import Button from "../common/Button";
import TruncatedDescription from "../common/TruncatedDescription";

export const TaskTable = ({ tasks, onComplete, onDelete, isAdmin, onEdit }) => {
  const [filter, setFilter] = useState("active");
  const [searchTerm, setSearchTerm] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [sortConfig, setSortConfig] = useState({
    key: null,
    direction: "ascending",
  });
  const [itemsPerPage, setItemsPerPage] = useState(5);
  const requestSort = (key) => {
    let direction = "ascending";
    if (sortConfig.key === key && sortConfig.direction === "ascending") {
      direction = "descending";
    }
    setSortConfig({ key, direction });
    setCurrentPage(1);
  };

  const getSortIcon = (key) => {
    if (sortConfig.key !== key) {
      return <FaSort className="inline ml-1 opacity-50" />;
    }
    return sortConfig.direction === "ascending" ? (
      <FaSortUp className="inline ml-1" />
    ) : (
      <FaSortDown className="inline ml-1" />
    );
  };

  const filteredAndSortedTasks = useMemo(() => {
    let result = [...tasks];

    switch (filter) {
      case "active":
        result = result.filter((task) => task.status === "pending");
        break;
      case "reviewing":
        result = result.filter((task) => task.status === "reviewing");
        break;
      case "approved":
        result = result.filter((task) => task.status === "approved");
        break;
      default:
        break;
    }

    if (searchTerm) {
      const searchLower = searchTerm.toLowerCase();
      result = result.filter(
        (task) =>
          task.title?.toLowerCase().includes(searchLower) ||
          task.description?.toLowerCase().includes(searchLower) ||
          task.assignedAsset?.name?.toLowerCase().includes(searchLower) ||
          task.assignedTo?.toLowerCase().includes(searchLower)
      );
    }

    if (sortConfig.key) {
      result.sort((a, b) => {
        let aValue = sortConfig.key
          .split(".")
          .reduce((obj, key) => obj?.[key], a);
        let bValue = sortConfig.key
          .split(".")
          .reduce((obj, key) => obj?.[key], b);

        if (sortConfig.key === "createdAt" || sortConfig.key === "deadline") {
          aValue = new Date(aValue);
          bValue = new Date(bValue);
        }

        if (aValue < bValue) {
          return sortConfig.direction === "ascending" ? -1 : 1;
        }
        if (aValue > bValue) {
          return sortConfig.direction === "ascending" ? 1 : -1;
        }
        return 0;
      });
    }

    return result;
  }, [tasks, filter, searchTerm, sortConfig]);

  const totalPages = Math.ceil(filteredAndSortedTasks.length / itemsPerPage);
  const currentTasks = filteredAndSortedTasks.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  if (!tasks?.length) {
    return (
      <div className="p-8 text-center text-gray-500">No tasks available right now.</div>
    );
  }

  const columns = [
    { key: "assignedAsset.name", label: "Asset Name", sortable: true },
    { key: "title", label: "Title", sortable: true },
    { key: "description", label: "Description", sortable: true },
    { key: "createdAt", label: "Created At", sortable: true },
    { key: "deadline", label: "Deadline", sortable: true },
    { key: "status", label: "Status", sortable: true },
    { key: "feedback", label: "Feedback", sortable: true },
    { key: "assignedTo", label: "Assigned Group", sortable: true },
    { key: "actions", label: "Actions", sortable: false },
  ];

  return (
    <div className="flex-1 p-6 bg-gray-50">
      <div className="space-y-4">
      <div className="flex flex-col md:flex-row md:justify-between items-center">
      <div className="relative">
            <input
              type="text"
              placeholder="Search tasks..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10 pr-4 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500 w-64"
            />
            <svg
              className="absolute left-3 top-2.5 h-5 w-5 text-gray-400"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value)}
            className="px-3 py-2 border border-gray-300 rounded-md text-sm focus:ring-2 focus:ring-blue-500"
          >
            <option value="all">All Tasks</option>
            <option value="active">Active Tasks</option>
            <option value="reviewing">Reviewing</option>
            <option value="approved">Completed</option>
          </select>
        </div>

        <div className="bg-white rounded-lg shadow overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                {columns.map((column) => (
                  <th
                    key={column.key}
                    className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider cursor-pointer"
                    onClick={() => column.sortable && requestSort(column.key)}
                  >
                    <div className="flex items-center">
                      {column.label}
                      {column.sortable && getSortIcon(column.key)}
                    </div>
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {currentTasks.map((task) => (
                <tr
                  key={task._id}
                  className={`
                    ${
                      new Date(task.deadline) < new Date() &&
                      task.feedback &&
                      task.status !== "approved"
                        ? "bg-red-200" // Deadline passed, feedback received but not approved
                        : new Date(task.deadline) < new Date() && task.status !== "approved" // Only deadline passed but no feedback
                        ? "bg-red-100" // Deadline passed, feedback not received
                        : task.feedback && task.status !== "approved" // Feedback exists but not approved
                        ? "bg-red-50" // Feedback exists but not approved
                        : ""
                    }
                    
                  `}
                >
                  <td className="px-4 py-3 whitespace-nowrap">
                    {task.assignedAsset?.name || "N/A"}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">{task.title}</td>
                  <td className="px-4 py-3">
                    {" "}
                    <TruncatedDescription
                      text={task.description}
                      maxLength={10}
                    />
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(task.createdAt).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    {new Date(task.deadline).toLocaleDateString("en-US")}
                  </td>
                  <td className="px-4 py-3 whitespace-nowrap">
                    <span
                      className={`inline-flex px-2 py-1 text-sm rounded-full
                      ${
                        task.status === "pending"
                          ? "bg-blue-100 text-blue-800"
                          : task.status === "reviewing"
                          ? "bg-yellow-100 text-yellow-800"
                          : "bg-green-100 text-green-800"
                      }`}
                    >
                        {task.status === "pending"
                          ? "Active"
                          : task.status === "reviewing"
                          ? "Reviewing"
                          : "Completed"}
                    </span>
                  </td>
                  <td className="px-4 py-3">
                    <TruncatedDescription text={task.feedback} maxLength={10} />
                  </td>
                  <td className="px-4 py-3">
                    {translateRole(task.assignedTo)}
                  </td>
                  <td className="px-2 py-1 lg:px-4 lg:py-3 flex space-x-2 whitespace-nowrap">
                    {task.status === "pending" ? (
                      <Button
                        onClick={() => onComplete(task._id)}
                        className="px-1.5 lg:px-3 lg:py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                      >
                        Complete
                      </Button>
                    ) : (
                      <Button
                        onClick={() => onComplete(task._id)}
                        className="px-1.5 lg:px-3 py-1.5 bg-green-500 text-white text-sm rounded hover:bg-green-600 transition-colors"
                        disabled
                      >
                        Complete
                      </Button>
                    )}
                    {isAdmin && (
                      <>
                        <Button
                          variant="outline"
                          className="text-sm"
                          onClick={() => onEdit(task)}
                        >
                          <Pen size={16} />
                        </Button>
                        <Button
                          onClick={() => onDelete(task._id)}
                          className="px-3 py-1.5 bg-red-500 text-white text-sm rounded hover:bg-red-600 transition-colors"
                        >
                          Delete
                        </Button>
                      </>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>

        <div className="flex items-center justify-start mt-4">
          <div className="text-sm text-gray-600">
            Page {currentPage} / {totalPages} (Total {filteredAndSortedTasks.length} tasks)
          </div>

          <div className="flex items-center space-x-4 ml-7">
            <label htmlFor="items-per-page" className="text-sm text-gray-600">
              Items per page:
            </label>
            <select
              id="items-per-page"
              value={itemsPerPage}
              onChange={(e) => {
                setItemsPerPage(Number(e.target.value));
                setCurrentPage(1);
              }}
              className="px-2 py-1 border border-gray-300 rounded-md text-sm"
            >
              {[5, 10, 20].map((option) => (
                <option key={option} value={option}>
                  {option} Records
                </option>
              ))}
            </select>
          </div>
        </div>

        {totalPages > 1 && (
          <div className="flex justify-center space-x-2 mt-4">
            <button
              onClick={() => setCurrentPage(1)}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              First
            </button>

            <button
              onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Previous
            </button>

            {Array.from({ length: totalPages }, (_, i) => i + 1)
              .filter((page) => {
                const showAllPages = 5;
                if (page === 1 || page === totalPages) return true;
                if (Math.abs(page - currentPage) < Math.ceil(showAllPages / 2))
                  return true;
                return false;
              })
              .map((page, index, array) => {
                const prevPage = array[index - 1];
                return (
                  <React.Fragment key={`page-${page}`}>
                    {prevPage && page - prevPage > 1 && (
                      <span key={`ellipsis-${index}`} className="px-2">
                        ...
                      </span>
                    )}
                    <button
                      onClick={() => setCurrentPage(page)}
                      className={`px-3 py-1 border rounded-md ${
                        currentPage === page
                          ? "bg-blue-500 text-white"
                          : "hover:bg-gray-50"
                      }`}
                    >
                      {page}
                    </button>
                  </React.Fragment>
                );
              })}

            <button
              onClick={() =>
                setCurrentPage((prev) => Math.min(prev + 1, totalPages))
              }
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Next
            </button>

            <button
              onClick={() => setCurrentPage(totalPages)}
              disabled={currentPage === totalPages}
              className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
            >
              Last
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

const translateRole = (role) => {
  const roleTranslations = {
    admin: "Admin",
    system_group: "System Group",
    a_group: "A Group",
    software_group: "Software Group",
    technical_service: "Technical Service",
  };
  return roleTranslations[role] || "Unknown Role";
};

export default TaskTable;

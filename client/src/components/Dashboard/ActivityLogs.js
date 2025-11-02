import { format } from "date-fns";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import api from "../../api/api";
import Modal from "../common/Modal";

const ActivityLogs = () => {
  const [logs, setLogs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [currentPage, setCurrentPage] = useState(1);
  const [itemsPerPage, setItemsPerPage] = useState(10);
  const totalPages = Math.ceil(logs.length / itemsPerPage);
  const [filters, setFilters] = useState({
    startDate: "",
    endDate: "",
    userId: "",
    action: "",
    resourceType: "",
  });
  const [selectedDetails, setSelectedDetails] = useState(null); // selected details for modal
  const [isModalOpen, setModalOpen] = useState(false);

  useEffect(() => {
    fetchLogs();
  }, []);

  const paginatedLogs = logs.slice(
    (currentPage - 1) * itemsPerPage,
    currentPage * itemsPerPage
  );

  const fetchLogs = async () => {
    try {
      const response = await api.get("/activity-logs")
      setLogs(response.data);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching logs:", error);
      setLoading(false);
    }
  };

  const handleFilterChange = (e) => {
    setFilters({
      ...filters,
      [e.target.name]: e.target.value,
    });
  };

  const applyFilters = async () => {
    try {
      const token = localStorage.getItem("token");
      const queryParams = new URLSearchParams(filters).toString();
      const response = await api.get(
        `http://localhost:5000/api/activity-logs/filter?${queryParams}`,
        {
          headers: {
            Authorization: token,
          },
        }
      );
      setLogs(response.data);
    } catch (error) {
      console.error("Error filtering logs:", error);
    }
  };

  const getFriendlyActionMessage = (log) => {
    const actionMessages = {
      create: "created",
      update: "updated",
      delete: "deleted",
      login: "logged in",
      logout: "logged out",
      pending: "pending",
      reviewed: "reviewed",
      completed: "completed",
      sendback: "sent back",
    };

    const resourceMessages = {
      product: "asset",
      category: "category",
      user: "user",
      task: "task",
    };

    const actor = log.user?.name || "Unknown User";
    const action = actionMessages[log.action] || log.action;
    const resource = resourceMessages[log.resourceType] || log.resourceType;

    // For login/logout actions we don't include a resource
    if (log.action === "login" || log.action === "logout") {
      return `${actor} ${action}.`;
    }

    return `${actor} ${action} a ${resource}.`;
  };

  if (loading) {
    return (
      <div className="flex justify-center items-center py-4">
        <ClipLoader color="#3498db" size={50} /> {/* Loading Spinner */}
      </div>
    );
  }

  return (
    <div className="p-4">
  <h2 className="text-2xl font-bold mb-4">Activity Logs</h2>
      {/* Filters */}
      <div className="mb-4 grid grid-cols-1 md:grid-cols-5 gap-4">
        <input
          type="date"
          name="startDate"
          value={filters.startDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
          placeholder="Start Date"
        />
        <input
          type="date"
          name="endDate"
          value={filters.endDate}
          onChange={handleFilterChange}
          className="border p-2 rounded"
          placeholder="End Date"
        />
        <select
          name="action"
          value={filters.action}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Actions</option>
          <option value="create">Create</option>
          <option value="update">Update</option>
          <option value="delete">Delete</option>
        </select>
        <select
          name="resourceType"
          value={filters.resourceType}
          onChange={handleFilterChange}
          className="border p-2 rounded"
        >
          <option value="">All Resources</option>
          <option value="product">Asset</option>
          <option value="category">Category</option>
          <option value="user">User</option>
          <option value="task">Tasks</option>
        </select>
        <button
          onClick={applyFilters}
          className="bg-blue-500 text-white p-2 rounded hover:bg-blue-600"
        >
          Filter
        </button>
      </div>

      <div className="overflow-x-auto">
        <table className="min-w-full bg-white border">
          <thead>
            <tr>
              <th className="p-2 border">Date</th>
              <th className="p-2 border">Action</th>
              <th className="p-2 border">IP Address</th>
              <th className="p-2 border">Details</th>
            </tr>
          </thead>
          <tbody>
            {paginatedLogs.map((log) => (
              <tr key={log._id}>
                <td className="p-2 border">
                  {format(new Date(log.createdAt), "dd/MM/yyyy HH:mm")}
                </td>
                <td className="p-2 border">{getFriendlyActionMessage(log)}</td>
                <td className="p-2 border">{log.ipAddress}</td>
                <td className="p-2 border">
                  <button
                    onClick={() => {
                      setSelectedDetails(log.details);
                      setModalOpen(true);
                    }}
                    className="bg-gray-200 text-blue-500 px-2 py-1 rounded hover:bg-gray-300"
                  >
                    Details JSON
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        <div className="flex items-center justify-start mt-4">
            <div className="text-sm text-gray-600">
            Page {currentPage} / {Math.ceil(logs.length / itemsPerPage)}{" "}
            (Total {logs.length} entries)
          </div>

          <div className="flex items-center space-x-4 ml-7">
            <label htmlFor="items-per-page" className="text-sm text-gray-600">
              Per page:
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
                  {option} records
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>
      {Math.ceil(logs.length / itemsPerPage) > 1 && (
        <div className="flex justify-center space-x-2 mt-4">
  {/* First page button */}
  <button
    onClick={() => setCurrentPage(1)}
    disabled={currentPage === 1}
    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
  >
    First
  </button>

  {/* Previous page button */}
  <button
    onClick={() => setCurrentPage((prev) => Math.max(prev - 1, 1))}
    disabled={currentPage === 1}
    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
  >
    Previous
  </button>

  {/* Page numbers */}
  {Array.from({ length: totalPages }, (_, i) => i + 1)
    .filter((page) => {
      // Only show relevant pages
      const showAllPages = 5; // Number of pages to show around the current page
      if (page === 1 || page === totalPages) return true; // First and last pages are always shown
      if (Math.abs(page - currentPage) < Math.ceil(showAllPages / 2))
        return true; // Pages around the current page are shown
      return false;
    })
    .map((page, index, array) => {
  // to add "..."
      const prevPage = array[index - 1];
      return (
        <>
          {prevPage && page - prevPage > 1 && (
            <span key={`ellipsis-${index}`} className="px-2">
              ...
            </span>
          )}
          <button
            key={page}
            onClick={() => setCurrentPage(page)}
            className={`px-3 py-1 border rounded-md ${
              currentPage === page
                ? "bg-blue-500 text-white"
                : "hover:bg-gray-50"
            }`}
          >
            {page}
          </button>
        </>
      );
    })}

  {/* Sonraki Sayfa Butonu */}
  <button
    onClick={() =>
      setCurrentPage((prev) =>
        Math.min(prev + 1, totalPages)
      )
    }
    disabled={currentPage === totalPages}
    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
  >
    Next
  </button>

  {/* Son Sayfa Butonu */}
  <button
    onClick={() => setCurrentPage(totalPages)}
    disabled={currentPage === totalPages}
    className="px-3 py-1 border rounded-md disabled:opacity-50 disabled:cursor-not-allowed hover:bg-gray-50"
  >
    Last
  </button>
</div>

      )}

      {/* Modal */}
      <Modal
        isOpen={isModalOpen}
        onClose={() => setModalOpen(false)}
        title="Detaylar"
      >
        <pre className="whitespace-pre-wrap bg-gray-100 p-4 rounded">
          {JSON.stringify(selectedDetails, null, 2)}
        </pre>
      </Modal>
    </div>
  );
};

export default ActivityLogs;

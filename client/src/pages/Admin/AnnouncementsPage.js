import axios from "axios";
import { Pen } from "lucide-react";
import React, { useEffect, useState } from "react";
import { ClipLoader } from "react-spinners";
import Swal from "sweetalert2";
import api from "../../api/api";
import Button from "../../components/common/Button";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");
  const [loading, setLoading] = useState(false); // Loading state
  const [activeAnn, setActiveAnn] = useState(""); // Active announcement

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get("http://localhost:5000/api/announcements");
      setAnnouncements(response.data);

      // Find the active announcement
      const activeAnnouncement = response.data.find((ann) => ann.isActive);
      setActiveAnn(
        activeAnnouncement ? activeAnnouncement.content : "There is no active announcement yet"
      );
    } catch (error) {
      console.error("Error loading announcements:", error);
    }
    setLoading(false);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await api.post("http://localhost:5000/api/announcements", {
        content: newAnnouncement,
      });
      setNewAnnouncement("");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error adding announcement:", error);
    }
  };

  const handleActivate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/announcements/activate/${id}`);
      Swal.fire({
        title: "Success!",
        text: "Active announcement changed successfully.",
        icon: "success",
        confirmButtonText: "OK",
      });
  fetchAnnouncements(); // Refresh announcements
    } catch (error) {
      Swal.fire({
        title: "Error!",
        text: "An error occurred while changing the active announcement.",
        icon: "error",
        confirmButtonText: "OK",
      });
      console.error("Error activating announcement:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Are you sure?",
      text: "Are you sure you want to delete this announcement? This action cannot be undone!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Yes, delete!",
      cancelButtonText: "No, cancel",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/announcements/${id}`);
        fetchAnnouncements();
        Swal.fire({
          title: "Deleted!",
          text: "Announcement deleted successfully.",
          icon: "success",
          confirmButtonText: "OK",
        });
      } catch (error) {
        Swal.fire({
          title: "Error!",
          text: "An error occurred while deleting the announcement.",
          icon: "error",
          confirmButtonText: "OK",
        });
        console.error("Error deleting announcement:", error);
      }
    } else {
      Swal.fire({
        title: "Cancelled!",
        text: "Announcement action cancelled.",
        icon: "info",
        confirmButtonText: "OK",
      });
    }
  };

  const startEditing = (announcement) => {
    setEditingId(announcement._id);
    setEditContent(announcement.content);
  };

  const handleEdit = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/announcements/${id}`, {
        content: editContent,
      });
      setEditingId(null);
      setEditContent("");
      fetchAnnouncements();
    } catch (error) {
      console.error("Error editing announcement:", error);
    }
  };

  return (
    <div className="p-2">
      <div className="flex flex-col md:flex-row">
        <h1 className="text-2xl font-bold mb-6">Announcements</h1>
        <h2 className="mx-10 flex">
          Current Announcement: <span className="text-blue-600">{activeAnn}</span>
        </h2>
      </div>

      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex flex-col sm:flex-row gap-4">
            <input
            type="text"
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            placeholder="New announcement text..."
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement._id}
            className="flex flex-col sm:flex-row justify-between items-start sm:items-center p-4 bg-white border rounded shadow gap-4"
          >
            <div className="flex-1">
              {editingId === announcement._id ? (
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  />
                    <div className="flex gap-2">
                    <button
                      onClick={() => handleEdit(announcement._id)}
                      className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditingId(null)}
                      className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p className={announcement.isActive ? "font-bold" : ""}>
                    {announcement.content}
                  </p>
                  <p className="text-sm text-gray-500">
                    {new Date(announcement.createdAt).toLocaleDateString()}
                  </p>
                </>
              )}
            </div>
            <div className="flex flex-wrap gap-2 w-full sm:w-auto">
              {!editingId && (
                <>
                  <Button
                    onClick={() => startEditing(announcement)}
                    variant="outline"
                    className="w-auto px-2 py-1 text-sm"
                  >
                    <Pen size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleActivate(announcement._id)}
                    disabled={announcement.isActive}
                    className="w-auto px-2 py-1 text-sm"
                  >
                    Make Active
                  </Button>
                  <Button
                    onClick={() => handleDelete(announcement._id)}
                    variant="destructive"
                    className="w-auto px-2 py-1 text-sm"
                  >
                    Delete
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
      {loading && (
        <div className="flex justify-center items-center py-4">
          <ClipLoader color="#3498db" size={50} />
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;

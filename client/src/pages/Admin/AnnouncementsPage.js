import axios from "axios";
import { Pen } from "lucide-react";
import React, { useEffect, useState } from "react";
import Button from "../../components/common/Button";

const AnnouncementsPage = () => {
  const [announcements, setAnnouncements] = useState([]);
  const [newAnnouncement, setNewAnnouncement] = useState("");
  const [editingId, setEditingId] = useState(null);
  const [editContent, setEditContent] = useState("");

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    try {
      const response = await axios.get(
        "http://localhost:5000/api/announcements"
      );
      setAnnouncements(response.data);
    } catch (error) {
      console.error("Duyurular yüklenirken hata:", error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post("http://localhost:5000/api/announcements", {
        content: newAnnouncement,
      });
      setNewAnnouncement("");
      fetchAnnouncements();
    } catch (error) {
      console.error("Duyuru eklenirken hata:", error);
    }
  };

  const handleActivate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/announcements/activate/${id}`);
      fetchAnnouncements();
    } catch (error) {
      console.error("Duyuru aktifleştirilirken hata:", error);
    }
  };

  const handleDelete = async (id) => {
    if (window.confirm("Bu duyuruyu silmek istediğinizden emin misiniz?")) {
      try {
        await axios.delete(`http://localhost:5000/api/announcements/${id}`);
        fetchAnnouncements();
      } catch (error) {
        console.error("Duyuru silinirken hata:", error);
      }
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
      console.error("Duyuru düzenlenirken hata:", error);
    }
  };

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-6">Duyurular</h1>

      {/* Yeni Duyuru Formu */}
      <form onSubmit={handleSubmit} className="mb-8">
        <div className="flex gap-4">
          <input
            type="text"
            value={newAnnouncement}
            onChange={(e) => setNewAnnouncement(e.target.value)}
            placeholder="Yeni duyuru metni..."
            className="flex-1 p-2 border rounded"
            required
          />
          <button
            type="submit"
            className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600"
          >
            Ekle
          </button>
        </div>
      </form>

      {/* Duyuru Listesi */}
      <div className="space-y-4">
        {announcements.map((announcement) => (
          <div
            key={announcement._id}
            className="flex justify-between items-center p-4 bg-white border rounded shadow"
          >
            <div className="flex-1">
              {editingId === announcement._id ? (
                <div className="flex gap-2">
                  <input
                    type="text"
                    value={editContent}
                    onChange={(e) => setEditContent(e.target.value)}
                    className="flex-1 p-2 border rounded"
                  />
                  <button
                    onClick={() => handleEdit(announcement._id)}
                    className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600"
                  >
                    Kaydet
                  </button>
                  <button
                    onClick={() => setEditingId(null)}
                    className="bg-gray-500 text-white px-4 py-2 rounded hover:bg-gray-600"
                  >
                    İptal
                  </button>
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
            <div className="flex gap-2">
              {!editingId && (
                <>
                  <Button
                    onClick={() => startEditing(announcement)}
                    variant="outline"
                  >
                    <Pen size={16} />
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => handleActivate(announcement._id)}
                    disabled={announcement.isActive}
                  >
                    Aktif Yap
                  </Button>
                  <Button
                    onClick={() => handleDelete(announcement._id)}
                    variant="destructive"
                  >
                    Sil
                  </Button>
                </>
              )}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default AnnouncementsPage;

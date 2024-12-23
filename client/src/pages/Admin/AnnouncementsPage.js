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
  const [activeAnn, setActiveAnn] = useState(""); // Aktif duyuru

  useEffect(() => {
    fetchAnnouncements();
  }, []);

  const fetchAnnouncements = async () => {
    setLoading(true);
    try {
      const response = await api.get("http://localhost:5000/api/announcements");
      setAnnouncements(response.data);

      // Aktif duyuruyu bul
      const activeAnnouncement = response.data.find((ann) => ann.isActive);
      setActiveAnn(activeAnnouncement ? activeAnnouncement.content : "Henüz bir duyuru aktif değil");
    } catch (error) {
      console.error("Duyurular yüklenirken hata:", error);
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
      console.error("Duyuru eklenirken hata:", error);
    }
  };

  const handleActivate = async (id) => {
    try {
      await axios.put(`http://localhost:5000/api/announcements/activate/${id}`);
      fetchAnnouncements(); // Yeniden duyuruları çek
    } catch (error) {
      console.error("Duyuru aktifleştirilirken hata:", error);
    }
  };

  const handleDelete = async (id) => {
    const result = await Swal.fire({
      title: "Emin misiniz?",
      text: "Bu duyuruyu silmek istediğinizden emin misiniz? Bu işlem geri alınamaz!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#d33",
      cancelButtonColor: "#3085d6",
      confirmButtonText: "Evet, sil!",
      cancelButtonText: "Hayır, iptal et",
    });
    if (result.isConfirmed) {
      try {
        await axios.delete(`http://localhost:5000/api/announcements/${id}`);
        fetchAnnouncements();
        Swal.fire({
          title: "Silindi!",
          text: "Duyuru başarıyla silindi.",
          icon: "success",
          confirmButtonText: "Tamam",
        });
      } catch (error) {
        Swal.fire({
          title: "Hata!",
          text: "Duyuru silinirken bir hata oluştu.",
          icon: "error",
          confirmButtonText: "Tamam",
        });
        console.error("Duyuru silinirken hata:", error);
      }
    } else {
      Swal.fire({
        title: "İptal edildi!",
        text: "Duyuru işlemi iptal edildi.",
        icon: "info",
        confirmButtonText: "Tamam",
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
      console.error("Duyuru düzenlenirken hata:", error);
    }
  };

  return (
    <div className="p-6">
      <div className="flex">
        <h1 className="text-2xl font-bold mb-6">Duyurular</h1>
        <h2 className="mx-10">
          Güncel Duyuru: <span className="text-blue-600">{activeAnn}</span>
        </h2>
      </div>

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
      {loading && (
        <div className="flex justify-center items-center py-4">
          <ClipLoader color="#3498db" size={50} /> {/* Loading Spinner */}
        </div>
      )}
    </div>
  );
};

export default AnnouncementsPage;

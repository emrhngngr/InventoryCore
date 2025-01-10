import React, { useEffect, useState } from "react";
import api from "../../api/api";
import { AdminTaskReview } from "../../components/Tasks/AdminTaskReview";
import { CompletionModal } from "../../components/Tasks/CompletionModal";
import { SendBackModal } from "../../components/Tasks/SendBackModal";
import { AddTaskModal } from "../../components/Tasks/TaskModal";
import { TaskTable } from "../../components/Tasks/TaskTable";

const AdminDashboard = () => {
  const [tasks, setTasks] = useState([]);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isCompletionModalOpen, setIsCompletionModalOpen] = useState(false);
  const [isSendBackModalOpen, setIsSendBackModalOpen] = useState(false);
  const [selectedTaskId, setSelectedTaskId] = useState(null);
  const [currentUser, setCurrentUser] = useState(null);
  const [products, setProducts] = useState([]);

  useEffect(() => {
    let isMounted = true;

    const fetchProductsAndAssignTasks = async () => {
      try {
        const [productsResponse, tasksResponse] = await Promise.all([
          api.get("/products"),
          api.get("/tasks"),
        ]);

        if (!isMounted) return;

        const oldProducts = productsResponse.data.filter(
          (product) => product.isAuto && isProductOld(product.updatedAt)
        );

        for (const product of oldProducts) {
          const assetControlTasks = tasksResponse.data.filter(
            (task) =>
              task.assignedAsset._id === product._id &&
              task.title === "Eski Varlıkların Kontrolü"
          );

          const hasActiveControlTask = assetControlTasks.some(
            (task) => task.status === "pending" || task.status === "reviewing"
          );

          if (!hasActiveControlTask) {
            await handleAddTask({
              title: "Eski Varlıkların Kontrolü",
              description: `Eski varlık ${product.name} kontrol edilmelidir.`,
              assignedTo: product.assignedTo || "system_group",
              assignedAsset: product._id,
              deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
              riskValue: 21,
              status: "pending",
            });
          }
        }
      } catch (error) {
        console.error("Hata:", error);
      }
    };

    fetchProductsAndAssignTasks();

    return () => {
      isMounted = false;
    };
  }, []);

  const isProductOld = (updatedAt) => {
    const oneWeekAgo = new Date();
    oneWeekAgo.setDate(oneWeekAgo.getDate() - 7);
    return new Date(updatedAt) < oneWeekAgo;
  };

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await api.get("/users/me");
        setCurrentUser(response.data);
      } catch (error) {
        console.error("Error fetching current user:", error);
      }
    };

    fetchCurrentUser();
  }, []);

  useEffect(() => {
    const fetchTasks = async () => {
      try {
        let response;
        if (currentUser?.role === "admin") {
          response = await api.get("/tasks");
        } else if (currentUser?.role) {
          response = await api.get(`/tasks/group/${currentUser.role}`);
        }
        setTasks(response?.data || []);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    if (currentUser) {
      fetchTasks();
    }
  }, [currentUser]);

  const handleAddTask = async (taskData) => {
    try {
      await api.post("/tasks", taskData);
      const response = await api.get("/tasks");
      setTasks(response.data);
      setIsAddModalOpen(false);
    } catch (error) {
      console.error("Error adding task:", error);
    }
  };

  const handleCompleteTask = async (note) => {
    try {
      if (currentUser.role === "admin") {
        await api.put(`/tasks/complete-admin/${selectedTaskId}`, {
          completionNote: note,
        });
        const response = await api.get(`/tasks`);
        setTasks(response.data);
      } else {
        await api.put(`/tasks/complete/${selectedTaskId}`, {
          completionNote: note,
        });
        const response = await api.get(`/tasks/group/${currentUser.role}`);
        setTasks(response.data);
      }
      setIsCompletionModalOpen(false);
      setSelectedTaskId(null);
    } catch (error) {
      console.error("Error completing task:", error);
    }
  };

  const handleApproveTask = async (taskId) => {
    try {
      await api.put(`/tasks/approve/${taskId}`);
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error approving task:", error);
    }
  };
  const handleSendBackTask = async (note) => {
    try {
      await api.put(`/tasks/sendback/${selectedTaskId}`, {
        feedback: note,
      });
      const response = await api.get(`/tasks/`);
      setTasks(response.data);
      setIsCompletionModalOpen(false);
      setSelectedTaskId(null);
    } catch (error) {
      console.error("Error sending back task:", error);
    }
  };

  const handleDeleteTask = async (taskId) => {
    try {
      await api.delete(`/tasks/${taskId}`);
      const response = await api.get("/tasks");
      setTasks(response.data);
    } catch (error) {
      console.error("Error deleting task:", error);
    }
  };

  const openCompletionModal = (taskId) => {
    setSelectedTaskId(taskId);
    setIsCompletionModalOpen(true);
  };

  const openSendBackModal = (taskId) => {
    setSelectedTaskId(taskId);
    setIsSendBackModalOpen(true);
  };

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold">Hoş Geldin {currentUser?.name}</h1>
        {currentUser?.role === "admin" && (
          <button
            onClick={() => setIsAddModalOpen(true)}
            className="px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
          >
            Yeni Görev Ekle
          </button>
        )}
      </div>

      {currentUser?.role === "admin" ? (
        <div>
          <h2 className="text-xl font-semibold mb-4">
            İnceleme Bekleyen Görevler
          </h2>
          <AdminTaskReview
            tasks={tasks.filter((task) => task.status === "reviewing")}
            onApprove={handleApproveTask}
            onSendBack={openSendBackModal}
          />

          <h2 className="text-xl font-semibold mt-8 mb-4">Tüm Görevler</h2>
          <TaskTable
            tasks={tasks}
            onComplete={openCompletionModal}
            onDelete={handleDeleteTask}
            isAdmin={true}
          />
        </div>
      ) : (
        <TaskTable
          tasks={tasks}
          onComplete={openCompletionModal}
          isAdmin={false}
        />
      )}

      <AddTaskModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onSubmit={handleAddTask}
      />

      <CompletionModal
        isOpen={isCompletionModalOpen}
        onClose={() => {
          setIsCompletionModalOpen(false);
          setSelectedTaskId(null);
        }}
        onSubmit={handleCompleteTask}
      />
      <SendBackModal
        isOpen={isSendBackModalOpen}
        onClose={() => {
          setIsSendBackModalOpen(false);
          setSelectedTaskId(null);
        }}
        onSubmit={handleSendBackTask}
      />
    </div>
  );
};

export default AdminDashboard;

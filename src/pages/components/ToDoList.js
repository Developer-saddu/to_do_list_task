import { useState, useEffect } from "react";
import { FaEdit, FaTrash } from "react-icons/fa";
import axios from "axios";
import AddTask from "./AddTask";

export default function ToDoList() {
  const [tasks, setTasks] = useState([]);
  const [editTask, setEditTask] = useState(null);
  const [showDeleteWarning, setShowDeleteWarning] = useState(false);
  const [taskToDelete, setTaskToDelete] = useState(null);
  const [loading, setLoading] = useState(false);
  const [loadingEdit, setLoadingEdit] = useState(false);
  const [loadingDelete, setLoadingDelete] = useState(false);

  const baseUrl = "http://localhost:8080";

  useEffect(() => {
    console.log("---------------------------------");
    fetchAllTasks();
  }, []);

  const fetchAllTasks = async () => {
    setLoading(true);
    try {
      const response = await axios.get(`${baseUrl}/api/v1/task/all`);
      setTasks(response.data.data);
    } catch (error) {
      console.log(error.message);
      alert(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleEditTask = (taskId) => {
    const task = tasks.find((t) => t.id === taskId);
    setEditTask({ ...task });
  };

  const handleEditSubmit = async (e) => {
    e.preventDefault();
    setLoadingEdit(true);
    try {
      let response = await axios.put(
        `${baseUrl}/api/v1/task/update/${editTask.id}`,
        editTask
      );
      setTasks((prev) =>
        prev.map((task) =>
          task.id === editTask.id ? { ...task, ...editTask } : task
        )
      );
      setEditTask(null);
      alert(response.data.message);
    } catch (error) {
      alert(error.message);
      console.log("------error---", error.message);
    } finally {
      setLoadingEdit(false);
    }
  };

  const handleDelete = (taskId) => {
    setShowDeleteWarning(true);
    setTaskToDelete(taskId);
  };

  const confirmDelete = async () => {
    setLoadingDelete(true);
    try {
      let response = await axios.delete(
        `${baseUrl}/api/v1/task/delete/${taskToDelete}`
      );
      alert(response.data.message);
      setTasks(tasks.filter((task) => task.id !== taskToDelete));
      setShowDeleteWarning(false);
      setTaskToDelete(null);
    } catch (error) {
      console.log("----error-----", error.message);
      alert(error.message);
    } finally {
      setLoadingDelete(false);
    }
  };

  const cancelDelete = () => {
    setShowDeleteWarning(false);
    setTaskToDelete(null);
  };

  return (
    <div className="max-w-4xl mx-auto p-4 ">
      <div className="flex justify-between items-center p-4">
        <h1 className="text-2xl font-bold text-left">To-Do List</h1>
        <AddTask />
      </div>
      {editTask && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-96">
            <h2 className="text-lg font-bold mb-4">Edit Task</h2>
            <form onSubmit={handleEditSubmit}>
              <label className="block mb-2">
                Task:
                <input
                  type="text"
                  value={editTask.taskName || ""}
                  onChange={(e) =>
                    setEditTask({ ...editTask, taskName: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded-none focus:outline-none focus:ring-0"
                  required
                />
              </label>
              <label className="block mb-2">
                Due Date:
                <input
                  type="text"
                  value={editTask.dueDate?.split("T")[0] || ""}
                  onChange={(e) =>
                    setEditTask({ ...editTask, dueDate: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded-none focus:outline-none focus:ring-0"
                  required
                />
              </label>
              <label className="block mb-4">
                Status:
                <select
                  value={editTask.status || "Pending"}
                  onChange={(e) =>
                    setEditTask({ ...editTask, status: e.target.value })
                  }
                  className="w-full border px-2 py-1 rounded-none focus:outline-none focus:ring-0"
                >
                  <option value="Pending">Pending</option>
                  <option value="Completed">Completed</option>
                </select>
              </label>
              <label className="block ">
                Remark:
                <textarea
                  value={editTask.remark}
                  onChange={(e) =>
                    setEditTask({ ...editTask, remark: e.target.value })
                  }
                  className="textarea textarea-bordered w-full mb-4 rounded-none focus:outline-none focus:ring-0"
                />
              </label>
              <div className="flex justify-center gap-4">
                <button
                  type="button"
                  onClick={() => setEditTask(null)}
                  className="px-4 py-2 bg-gray-300 rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-blue-500 text-white rounded-none"
                  disabled={loadingEdit}
                >
                  {loadingEdit ? "Loading..." : "Update"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
      {showDeleteWarning && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded shadow-md w-80 text-center">
            <h2 className="text-lg font-bold mb-4">Remove Task</h2>
            <p className="mb-4">Are you sure you want to remove this task?</p>
            <div className="flex justify-end gap-4 justify-center">
              <button
                onClick={cancelDelete}
                className="px-4 py-2 bg-gray-300 rounded-none focus:outline-none focus:ring-0"
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                className="px-4 py-2 bg-red-500 text-white rounded-none focus:outline-none focus:ring-0"
                disabled={loadingDelete}
              >
                {loadingDelete ? "Loading..." : "Remove"}
              </button>
            </div>
          </div>
        </div>
      )}
      <div className="max-h-[600px] overflow-auto">
        <table className="table-auto w-full border-collapse border border-gray-300">
          <thead className="sticky top-0">
            <tr className="bg-gray-100">
              <th className="border border-gray-300 px-4 py-2">S.No</th>
              <th className="border border-gray-300 px-4 py-2">ID</th>
              <th className="border border-gray-300 px-4 py-2 justify-center">
                Task
              </th>
              <th className="border border-gray-300 px-4 py-2">Status</th>
              <th className="border border-gray-300 px-4 py-2">Action</th>
            </tr>
          </thead>
          <tbody>
            {loading ? (
              <tr className="h-40">
                <td
                  colSpan="5"
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  Loading...
                </td>
              </tr>
            ) : tasks.length === 0 ? (
              <tr className="h-40">
                <td
                  colSpan="5"
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  No tasks available
                </td>
              </tr>
            ) : (
              tasks.map((task, index) => (
                <tr
                  key={index}
                  className="border border-gray-300 px-4 py-2 text-center"
                >
                  <td className="border border-gray-300">{index + 1}</td>
                  <td className="border border-gray-300">{task.id}</td>
                  <td className="border border-gray-300">{task.taskName}</td>
                  <td className="border border-gray-300">{task.status}</td>
                  <td className=" px-8 py-2 text-center flex justify-center gap-4">
                    <button
                      onClick={() => handleEditTask(task.id)}
                      className="text-blue-500 hover:text-blue-700"
                    >
                      <FaEdit size={18} />
                    </button>
                    <button
                      onClick={() => handleDelete(task.id)}
                      className="text-red-500 hover:text-red-700"
                    >
                      <FaTrash size={18} />
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}

import { useState } from "react";
import axios from "axios";

const AddTask = () => {
  const [showPopup, setShowPopup] = useState(false);
  const [taskData, setTaskData] = useState({
    newTask: "",
    dueDate: "",
    remark: ""
  });

  const handleAddTask = async (e) => {
    e.preventDefault();
    const { newTask, dueDate, remark } = taskData;
    if (!newTask || !dueDate || !remark) {
      alert("Please fill in all fields.");
      return;
    }
    try {
      let payload = { task: newTask, dueDate, remark };
      const response = await axios.post(
        "https://mp6vd1ss-8080.inc1.devtunnels.ms/api/v1/task/create",
        payload
      );
      console.log(response);

      alert(response.data.message);
      setShowPopup(false);
      setTaskData({ newTask: "", dueDate: "", remark: "" });
    } catch (error) {
      console.log("Error adding task:", error);
      alert("Failed to add task. Try again.");
    } finally {
      window.location.reload();
    }
  };

  return (
    <div className="max-w-md mx-auto ">
      <button
        onClick={() => setShowPopup(true)}
        className="btn btn-primary rounded-none text-white w-[500px] bg-blue-400 hover:bg-blue-600 text-xl"
      >
        Add Task
      </button>

      {showPopup && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
          <div className="bg-white p-4 shadow-lg w-96 rounded-none">
            <h2 className="text-xl font-bold mb-4">Add Task</h2>
            <form onSubmit={handleAddTask}>
              <input
                type="text"
                placeholder="Task"
                value={taskData.newTask}
                onChange={(e) =>
                  setTaskData({ ...taskData, newTask: e.target.value })
                }
                className="input input-bordered w-full mb-4 rounded-none focus:outline-none focus:ring-0"
              />
              <input
                type="date"
                value={taskData.dueDate}
                onChange={(e) =>
                  setTaskData({ ...taskData, dueDate: e.target.value })
                }
                className="input input-bordered w-full mb-4 rounded-none focus:outline-none focus:ring-0"
              />
              <textarea
                placeholder="Remark"
                value={taskData.remark}
                onChange={(e) =>
                  setTaskData({ ...taskData, remark: e.target.value })
                }
                className="textarea textarea-bordered w-full mb-4 rounded-none focus:outline-none focus:ring-0"
              />

              <div className="flex justify-end gap-2">
                <button
                  type="button"
                  onClick={() => setShowPopup(false)}
                  className="btn bg-red-500 text-white hover:bg-red-700 rounded-none"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="btn bg-blue-500 text-white hover:bg-blue-700 rounded-none"
                >
                  Add Task
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default AddTask;

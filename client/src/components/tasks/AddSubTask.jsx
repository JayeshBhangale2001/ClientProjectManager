import { Dialog } from "@headlessui/react";
import React, { useState, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { useCreateSubTaskMutation, useGetAllTaskQuery } from "../../redux/slices/api/taskApiSlice";
import Button from "../Button";
import ModalWrapper from "../ModalWrapper";
import Textbox from "../Textbox";
import Loading from "../Loading";

const AddSubTask = ({ open, setOpen, id }) => {
  const [isCreateNew, setIsCreateNew] = useState(true); // Toggle between creating a new task or choosing an existing one
  const [selectedTaskId, setSelectedTaskId] = useState(null);

  const { data: tasksData, isLoading: isTasksLoading } = useGetAllTaskQuery({
    strQuery: "todo", // Modify the query to fetch specific tasks if needed
    isTrashed: "",
    search: "",
  });

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm();

  const [addSbTask, { isLoading }] = useCreateSubTaskMutation();

  const handleOnSubmit = async (data) => {
    try {
      const payload = isCreateNew
        ? { data, id } // For new subtask creation
        : { data: { subTaskId: selectedTaskId }, id }; // For selecting existing task

      const res = await addSbTask(payload).unwrap();
      toast.success(res.message);

      setTimeout(() => {
        setOpen(false);
      }, 500);
    } catch (err) {
      console.log(err);
      toast.error(err?.data?.message || err.error);
    }
  };

  return (
    <>
      <ModalWrapper open={open} setOpen={setOpen}>
        <form onSubmit={handleSubmit(handleOnSubmit)} className="">
          <Dialog.Title as="h2" className="text-base font-bold leading-6 text-gray-900 mb-4">
            {isCreateNew ? "ADD SUB-TASK" : "CHOOSE EXISTING TASK"}
          </Dialog.Title>

          {/* Toggle to switch between creating a new task or choosing an existing task */}
          <div className="flex items-center mb-4">
            <label className="mr-2">Create new sub-task</label>
            <input
              type="checkbox"
              checked={isCreateNew}
              onChange={() => setIsCreateNew(!isCreateNew)}
            />
          </div>

          {/* Conditional rendering based on toggle */}
          {isCreateNew ? (
            <div className="mt-2 flex flex-col gap-6">
              <Textbox
                placeholder="Sub-Task title"
                type="text"
                name="title"
                label="Title"
                className="w-full rounded"
                register={register("title", { required: "Title is required!" })}
                error={errors.title ? errors.title.message : ""}
              />

              <div className="flex items-center gap-4">
                <Textbox
                  placeholder="Date"
                  type="date"
                  name="date"
                  label="Task Date"
                  className="w-full rounded"
                  register={register("date", { required: "Date is required!" })}
                  error={errors.date ? errors.date.message : ""}
                />
                <Textbox
                  placeholder="Tag"
                  type="text"
                  name="tag"
                  label="Tag"
                  className="w-full rounded"
                  register={register("tag", { required: "Tag is required!" })}
                  error={errors.tag ? errors.tag.message : ""}
                />
              </div>
            </div>
          ) : (
            <div className="mt-2">
              <label className="block mb-2">Select Existing Task</label>
              {isTasksLoading ? (
                <Loading />
              ) : (
                <select
                  className="w-full border rounded p-2"
                  onChange={(e) => setSelectedTaskId(e.target.value)}
                  value={selectedTaskId}
                >
                  <option value="" disabled>
                    Choose a task
                  </option>
                  {tasksData?.tasks.map((task) => (
                    <option key={task._id} value={task._id}>
                      {task.title}
                    </option>
                  ))}
                </select>
              )}
            </div>
          )}

          {isLoading ? (
            <Loading />
          ) : (
            <div className="py-3 mt-4 flex sm:flex-row-reverse gap-4">
              <Button
                type="submit"
                className="bg-blue-600 text-sm font-semibold text-white hover:bg-blue-700 sm:ml-3 sm:w-auto"
                label={isCreateNew ? "Add Task" : "Assign Task"}
              />

              <Button
                type="button"
                className="bg-white border text-sm font-semibold text-gray-900 sm:w-auto"
                onClick={() => setOpen(false)}
                label="Cancel"
              />
            </div>
          )}
        </form>
      </ModalWrapper>
    </>
  );
};

export default AddSubTask;

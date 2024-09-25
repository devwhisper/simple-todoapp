"use client";

import { ITask } from "@/types/tasks";
import { FiEdit, FiTrash2 } from "react-icons/fi";
import Modal from "./Modal";
import { FormEventHandler, useState, useRef, useEffect } from "react";
import { deleteTodo, editTodo } from "@/api";
import { useRouter } from "next/navigation";

interface TaskProps {
  task: ITask;
}

export const Task: React.FC<TaskProps> = ({ task }) => {
  const router = useRouter();

  const inputRef = useRef<HTMLInputElement>(null);
  const [openModalEdit, setOpenModalEdit] = useState<boolean>(false);
  const [openModalDelete, setOpenModalDelete] = useState<boolean>(false);
  const [taskToEdit, setTaskToEdit] = useState<string>(task.text);

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus();
    }
  }, [openModalEdit]);

  const handleSubmitEditTodo: FormEventHandler<HTMLFormElement> = async (e) => {
    e.preventDefault();

    await editTodo({
      id: task.id,
      text: taskToEdit,
    });

    setOpenModalEdit(false);

    router.refresh();
  };

  const handleDeleteTask = async (id: string) => {
    await deleteTodo(id);

    setOpenModalDelete(false);

    router.refresh();
  };

  return (
    <tr>
      <td>{task.text}</td>
      <td className="flex gap-4">
        <FiEdit
          onClick={() => setOpenModalEdit(true)}
          className="text-blue-500 cursor-pointer"
          size={17}
        />
        <Modal modalOpen={openModalEdit} setModalOpen={setOpenModalEdit}>
          <form onSubmit={handleSubmitEditTodo}>
            <h3 className="font-bold text-lg">Add new task</h3>

            <div className="modal-action">
              <input
                type="text"
                value={taskToEdit}
                onChange={(e) => setTaskToEdit(e.target.value)}
                placeholder="Type here"
                className="input input-bordered w-full"
                ref={inputRef}
              />

              <button type="submit" className="btn btn-neutral">
                Submit
              </button>
            </div>
          </form>
        </Modal>
        <FiTrash2
          onClick={() => setOpenModalDelete(true)}
          className="text-red-500 cursor-pointer"
          size={17}
        />
        <Modal modalOpen={openModalDelete} setModalOpen={setOpenModalDelete}>
          <h3 className="text-lg">
            Are you sure, you want to delete this task?
          </h3>

          <div className="modal-action">
            <button className="btn" onClick={() => handleDeleteTask(task.id)}>
              Yes, delete it
            </button>
          </div>
        </Modal>
      </td>
    </tr>
  );
};

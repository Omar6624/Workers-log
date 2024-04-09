import { useQueryClient } from "@tanstack/react-query";
import React from "react";
import { useForm } from "react-hook-form";
import { api } from "../../utils/api";
import Spinner from "../Spinner";

type AddCategoryFormProps = {
  name: string;
  description?: string;
};

function AddCategoryForm() {
  const [editMode, setEditMode] = React.useState(false);
  const { register, handleSubmit, reset } = useForm<AddCategoryFormProps>();
  const addCategoryMutation = api.admin.addCategory.useMutation();
  const queryClient = useQueryClient();

  const onSubmit = (data: AddCategoryFormProps) => {
    addCategoryMutation.mutate(data, {
      onSuccess: () => {
        setEditMode(false);
        queryClient.invalidateQueries([
          ["admin", "getCategories"],
          { type: "query" },
        ]);
        reset();
      },
    });
  };

  if (!editMode)
    return (
      <button
        onClick={() => setEditMode(true)}
        className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
      >
        Add Category
      </button>
    );

  return (
    <div>
      <form onSubmit={handleSubmit(onSubmit)}>
        <div>
          <label
            htmlFor="name"
            className="block text-sm font-medium text-gray-700"
          >
            Name
          </label>
          <div className="mt-1">
            <input
              {...register("name")}
              type="text"
              id="name"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Name"
            />
          </div>
        </div>
        <div className="my-2 mb-5">
          <label
            htmlFor="description"
            className="block text-sm font-medium text-gray-700"
          >
            Description (Optional)
          </label>
          <div className="mt-1">
            <input
              {...register("description")}
              type="text"
              id="description"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 sm:text-sm"
              placeholder="Description"
            />
          </div>
        </div>
        <div className="flex gap-1">
          <button
            className="inline-flex items-center rounded border border-transparent bg-red-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            onClick={() => setEditMode(false)}
          >
            Cancel
          </button>

          <button
            type="submit"
            className="inline-flex items-center rounded border border-transparent bg-indigo-600 px-2.5 py-1.5 text-xs font-medium text-white shadow-sm hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
            disabled={addCategoryMutation.isLoading}
          >
            Add
          </button>
          {addCategoryMutation.isLoading && <Spinner />}
        </div>
      </form>
    </div>
  );
}

export default AddCategoryForm;

import React from "react";
import { useSelectedCategory } from "../../pages/site-admin/services";
import { api } from "../../utils/api";

function CategorytList() {
  const categoriesQuery = api.admin.getCategories.useQuery();
  const deleteCategoryMutation = api.admin.deleteCategory.useMutation();
  const [selectedCategory, setSelectedCategory] = useSelectedCategory();

  const delereCategory = (id: string) => {
    deleteCategoryMutation.mutate(
      { id },
      {
        onSuccess: () => {
          categoriesQuery.refetch();
        },
      }
    );
  };

  const listIsLoading =
    categoriesQuery.isLoading || deleteCategoryMutation.isLoading;
  return (
    <div>
      {categoriesQuery.isLoading && <p>Loading...</p>}
      {categoriesQuery.isError && <p>{categoriesQuery.error.shape?.message}</p>}
      {categoriesQuery.isSuccess && (
        <ul
          role="list"
          className={`my-5 gap-2 divide-y divide-gray-200 ${
            listIsLoading && `opacity-50`
          }`}
          aria-disabled={deleteCategoryMutation.isLoading}
        >
          {categoriesQuery.data.categories.map((item) => (
            <li key={item.id} className="flex justify-between rounded-lg p-4 ">
              <h3
                className={`cursor-pointer font-medium ${
                  selectedCategory === item.id && `text-indigo-500`
                }}`}
                onClick={() => setSelectedCategory(item.id)}
              >
                {item.categoryName}
              </h3>
              <button
                className="text-xs"
                onClick={() => delereCategory(item.id)}
                disabled={deleteCategoryMutation.isLoading}
              >
                Delete
              </button>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

export default CategorytList;

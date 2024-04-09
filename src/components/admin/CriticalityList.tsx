import React from "react";
import { useSelectedCategory } from "../../pages/site-admin/services";
import { api } from "../../utils/api";

type CriticalityListProps = {
  serviceId: string;
};

function CriticalitytList({ serviceId }: CriticalityListProps) {
  const criticalityQuery = api.admin.getCriticalitiesByService.useQuery({
    id: serviceId,
  });
  const deleteCriticalityMutation = api.admin.deleteCriticality.useMutation();

  if (!serviceId) return <div>no service selected</div>;

  const delereCriticality = (id: string) => {
    deleteCriticalityMutation.mutate(
      { id },
      {
        onSuccess: () => {
          criticalityQuery.refetch();
        },
      }
    );
  };

  const listIsLoading =
    criticalityQuery.isLoading || deleteCriticalityMutation.isLoading;
  return (
    <div>
      {criticalityQuery.isLoading && <p>Loading...</p>}
      {criticalityQuery.isError && (
        <p>{criticalityQuery.error.shape?.message}</p>
      )}
      {criticalityQuery.isSuccess && (
        <ul
          role="list"
          className={`my-5 gap-2 divide-y divide-gray-200 ${
            listIsLoading && `opacity-50`
          }`}
          aria-disabled={deleteCriticalityMutation.isLoading}
        >
          {criticalityQuery.data.criticalities.map((item) => (
            <li key={item.id} className="flex justify-between rounded-lg p-4 ">
              <h3 className="cursor-pointer font-medium">
                {item.criticalityName}
              </h3>
              <button
                className="text-xs"
                onClick={() => delereCriticality(item.id)}
                disabled={deleteCriticalityMutation.isLoading}
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

export default CriticalitytList;

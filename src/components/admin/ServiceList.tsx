import React from "react";
import { useSelectedService } from "../../pages/site-admin/services";
import { api } from "../../utils/api";

type ServiceListProps = {
  catId: string;
};

function ServicetList({ catId }: ServiceListProps) {
  const servicesQuery = api.admin.getServicesByCategory.useQuery({
    catId,
  });
  const deleteServiceMutation = api.admin.deleteCategory.useMutation();
  const [, setSelectedService] = useSelectedService();

  if (!catId) return <div>no category selected</div>;

  const delereCategory = (id: string) => {
    deleteServiceMutation.mutate(
      { id },
      {
        onSuccess: () => {
          servicesQuery.refetch();
        },
      }
    );
  };

  const listIsLoading =
    servicesQuery.isLoading || deleteServiceMutation.isLoading;
  return (
    <div>
      {servicesQuery.isLoading && <p>Loading...</p>}
      {servicesQuery.isError && <p>{servicesQuery.error.shape?.message}</p>}
      {servicesQuery.isSuccess && (
        <ul
          role="list"
          className={`my-5 gap-2 divide-y divide-gray-200 ${
            listIsLoading && `opacity-50`
          }`}
          aria-disabled={deleteServiceMutation.isLoading}
        >
          {servicesQuery.data.services.map((item) => (
            <li key={item.id} className="flex justify-between rounded-lg p-4 ">
              <h3
                className="cursor-pointer font-medium"
                onClick={() => {
                  setSelectedService(item.id);
                }}
              >
                {item.serviceName}
              </h3>
              <button
                className="text-xs"
                onClick={() => delereCategory(item.id)}
                disabled={deleteServiceMutation.isLoading}
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

export default ServicetList;

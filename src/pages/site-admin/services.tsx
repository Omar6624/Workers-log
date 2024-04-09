import React from "react";
import { createStateContext } from "react-use";
import AddCategoryForm from "../../components/admin/AddCategoryForm";
import CategorytList from "../../components/admin/CategorytList";
import CriticalityList from "../../components/admin/CriticalityList";
import ServicetList from "../../components/admin/ServiceList";
import AdminLayout from "../../components/layouts/AdminLayout";

export const [useSelectedCategory, SelectedCategoryProvider] =
  createStateContext("");

export const [useSelectedService, SelectedServiceProvider] =
  createStateContext("");

function ServicesManagementPage() {
  const [selectedCategory] = useSelectedCategory();
  const [selectedService] = useSelectedService();

  return (
    <AdminLayout>
      <div className="flex justify-between gap-12">
        <div className="flex-1 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="mb-5 text-2xl">Category List</h1>
            <CategorytList />
            <AddCategoryForm />
          </div>
        </div>
        <div className="flex-1 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="mb-5 text-2xl">Service List</h1>
            <ServicetList catId={selectedCategory} />
          </div>
        </div>
        <div className="flex-1 overflow-hidden rounded-lg bg-white shadow">
          <div className="px-4 py-5 sm:p-6">
            <h1 className="mb-5 text-2xl">Criticality List</h1>
            <CriticalityList serviceId={selectedService} />
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default function servicePageWrapper() {
  return (
    <SelectedServiceProvider>
      <SelectedCategoryProvider>
        <ServicesManagementPage />
      </SelectedCategoryProvider>
    </SelectedServiceProvider>
  );
}

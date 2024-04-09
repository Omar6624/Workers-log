import { getCookie } from "cookies-next";
import { GetServerSideProps } from "next/types";
import React from "react";
import WorkersTable from "../../components/admin/WorkersTable";
import AdminLayout from "../../components/layouts/AdminLayout";
function SiteAdmin() {
  return (
    <AdminLayout>
      <div className="mt-5">
        <h1 className="text-2xl">Workers List</h1>
        <hr className="mt-2 mb-5" />
        <WorkersTable />
      </div>
    </AdminLayout>
  );
}

export default SiteAdmin;

export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokenCookie = getCookie("accessToken", { req: context.req });
  if (!accessTokenCookie) {
    return {
      redirect: {
        destination: "/site-admin/login",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

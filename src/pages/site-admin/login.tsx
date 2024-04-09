import React, { useEffect } from "react";
import { useCookie } from "react-use";
import { LockClosedIcon } from "@heroicons/react/solid";
import { FieldValues, SubmitHandler, useForm } from "react-hook-form";
import { api } from "../../utils/api";
import Spinner from "../../components/Spinner";
import Link from "next/link";
import { useRouter } from "next/router";
import { GetServerSideProps } from "next";
import { getCookie, setCookie } from "cookies-next";

type FormData = {
  email: string;
  password: string;
};

function AdminLoginPage() {
  const { register, handleSubmit, watch } = useForm<FormData>();
  const router = useRouter();
  const loginQuery = api.admin.login.useQuery(
    {
      email: watch("email"),
      password: watch("password"),
    },
    {
      enabled: false,
    }
  );
  const accessTokenCookie = getCookie("accessToken");
  
  useEffect(() => {
    if(loginQuery.data){
      const accessToken = loginQuery.data.admin.accessToken;
      setCookie("accessToken", accessToken, { path: "/" });
      router.replace("/site-admin");
    }
  }, [loginQuery.data])

  const onSubmit = handleSubmit(async () => {
    await loginQuery.refetch();
  });

  if(accessTokenCookie) {
    return <div className="p-12 flex gap-2">
      <span>

      You are Logged in. Visit
      </span>
      <Link href={"/site-admin"} className="text-blue-600">Admin Dashboard</Link>
      </div>
  }

  return (
    <>
      <div className="flex min-h-full items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-md space-y-8">
          <div>
            <img
              className="mx-auto h-12 w-auto"
              src="https://tailwindui.com/img/logos/workflow-mark-indigo-600.svg"
              alt="Workflow"
            />
            <h2 className="mt-6 text-center text-3xl font-extrabold text-gray-900">
              Admin Login
            </h2>
          </div>
          <form className="mt-8 space-y-6" onSubmit={onSubmit}>
            <input type="hidden" name="remember" defaultValue="true" />
            <div className="-space-y-px rounded-md shadow-sm">
              <div>
                <label htmlFor="email-address" className="sr-only">
                  Email address
                </label>
                <input
                  {...register("email")}
                  id="email-address"
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-t-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Email address"
                />
              </div>
              <div>
                <label htmlFor="password" className="sr-only">
                  Password
                </label>
                <input
                  {...register("password")}
                  id="password"
                  name="password"
                  type="password"
                  autoComplete="current-password"
                  required
                  className="relative block w-full appearance-none rounded-none rounded-b-md border border-gray-300 px-3 py-2 text-gray-900 placeholder-gray-500 focus:z-10 focus:border-indigo-500 focus:outline-none focus:ring-indigo-500 sm:text-sm"
                  placeholder="Password"
                />
              </div>
            </div>

            <div className="flex items-center justify-between">
              <div className="flex items-center">
                <input
                  id="remember-me"
                  name="remember-me"
                  type="checkbox"
                  className="h-4 w-4 rounded border-gray-300 text-indigo-600 focus:ring-indigo-500"
                />
                <label
                  htmlFor="remember-me"
                  className="ml-2 block text-sm text-gray-900"
                >
                  Remember me
                </label>
              </div>

              <div className="text-sm">
                <a
                  href="#"
                  className="font-medium text-indigo-600 hover:text-indigo-500"
                >
                  Forgot your password?
                </a>
              </div>
            </div>

            <div>
              <button
                type="submit"
                className="group relative flex w-full justify-center rounded-md border border-transparent bg-indigo-600 py-2 px-4 text-sm font-medium text-white hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2"
                disabled={loginQuery.isFetching}
              >
                <span className="absolute inset-y-0 left-0 flex items-center pl-3">
                  <LockClosedIcon
                    className="h-5 w-5 text-indigo-500 group-hover:text-indigo-400"
                    aria-hidden="true"
                  />
                </span>
                Sign in
              </button>
              <div className="flex justify-center items-center my-2">
                {loginQuery.isFetching && <Spinner />}
                {loginQuery.isError && (
                  <p className="text-red-500">
                    {loginQuery.error.shape?.message}
                  </p>
                )}
              </div>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default AdminLoginPage;


export const getServerSideProps: GetServerSideProps = async (context) => {
  const accessTokenCookie = getCookie("accessToken", { req: context.req });
  if (accessTokenCookie) {
    return {
      redirect: {
        destination: "/site-admin",
        permanent: false,
      },
    };
  }
  return {
    props: {},
  };
};

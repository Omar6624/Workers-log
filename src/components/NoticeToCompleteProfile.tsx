import { ExclamationIcon } from "@heroicons/react/outline";
import { useSession } from "next-auth/react";
import Link from "next/link";
import React from "react";

function NoticeToCompleteProfile() {
  const session = useSession();

  if (
    session.status === "unauthenticated" ||
    session.status === "loading" ||
    session.data?.user.hasCompletedProfile
  )
    return <></>;

  return (
    <div className="border-l-4 border-yellow-400 bg-yellow-50 p-4">
      <div className="flex">
        <div className="flex-shrink-0">
          <ExclamationIcon
            className="h-5 w-5 text-yellow-400"
            aria-hidden="true"
          />
        </div>
        <div className="ml-3">
          <p className="text-sm text-yellow-700">
            You have not completed your profile.{" "}
            <Link
              href="/complete-profile"
              className="font-medium text-yellow-700 underline hover:text-yellow-600"
            >
              PLease Complete Your Profile
            </Link>
          </p>
        </div>
      </div>
    </div>
  );
}

export default NoticeToCompleteProfile;

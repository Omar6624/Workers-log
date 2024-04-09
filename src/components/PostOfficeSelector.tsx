import { Fragment, useCallback, useEffect, useState } from "react";
import { Listbox, Transition } from "@headlessui/react";
import { CheckIcon, SelectorIcon } from "@heroicons/react/solid";
import { PostOffice } from "@prisma/client";
import { api } from "../utils/api";

type PostOfficeSelectorProps = {
  onChange?: (postOffice: PostOffice) => void;
  showProvince?: boolean;
};

function classNames(...classes: string[]) {
  return classes.filter(Boolean).join(" ");
}
function PostOfficeSelector({
  onChange,
  showProvince = false,
}: PostOfficeSelectorProps) {
  const [selected, setSelected] = useState<PostOffice | undefined>(undefined);
  const getPostOfficesQuery = api.address.getPostOffices.useQuery();

  useEffect(() => {
    setSelected(getPostOfficesQuery.data?.at(1) || undefined);
  }, [getPostOfficesQuery.data]);

  useEffect(() => {
    if (onChange && selected) {
      onChange(selected);
    }
  }, [selected]);

  if (getPostOfficesQuery.isError) {
    return <div>Error</div>;
  }

  const getSortedPostOffices = useCallback(() => {
    return getPostOfficesQuery.data?.sort((a, b) => {
      if (a.name < b.name) {
        return -1;
      }
      if (a.name > b.name) {
        return 1;
      }
      return 0;
    });
  }, [getPostOfficesQuery.data]);

  const postOffices = getSortedPostOffices();

  return (
    <div className="flex items-center gap-5">
      <Listbox
        defaultValue={selected}
        onChange={setSelected}
        disabled={getPostOfficesQuery.isLoading}
      >
        {({ open }) => (
          <>
            <div className="relative mt-1 w-64">
              <Listbox.Button className="relative w-full cursor-default rounded-md border border-gray-300 bg-white py-2 pl-3 pr-10 text-left shadow-sm focus:border-indigo-500 focus:outline-none focus:ring-1 focus:ring-indigo-500 sm:text-sm">
                <span className="inline-flex w-full truncate">
                  <span className="truncate">
                    {selected?.name || "Loading..."}
                  </span>
                  <span className="ml-2 truncate text-gray-500">
                    {selected?.postCode}
                  </span>
                </span>
                <span className="pointer-events-none absolute inset-y-0 right-0 flex items-center pr-2">
                  <SelectorIcon
                    className="h-5 w-5 text-gray-400"
                    aria-hidden="true"
                  />
                </span>
              </Listbox.Button>

              <Transition
                show={open}
                as={Fragment}
                leave="transition ease-in duration-100"
                leaveFrom="opacity-100"
                leaveTo="opacity-0"
              >
                <Listbox.Options className="absolute z-10 mt-1 max-h-60 w-full overflow-auto rounded-md bg-white py-1 text-base shadow-lg ring-1 ring-black ring-opacity-5 focus:outline-none sm:text-sm">
                  {postOffices?.map((postOffice) => (
                    <Listbox.Option
                      key={postOffice.id}
                      className={({ active }) =>
                        classNames(
                          active ? "bg-indigo-600 text-white" : "text-gray-900",
                          "relative cursor-default select-none py-2 pl-3 pr-9"
                        )
                      }
                      value={postOffice}
                    >
                      {({ selected, active }) => (
                        <>
                          <div className="flex">
                            <span
                              className={classNames(
                                selected ? "font-semibold" : "font-normal",
                                "truncate"
                              )}
                            >
                              {postOffice.name}
                            </span>
                            <span
                              className={classNames(
                                active ? "text-indigo-200" : "text-gray-500",
                                "ml-2 truncate text-sm"
                              )}
                            >
                              {postOffice.postCode}
                            </span>
                          </div>

                          {selected ? (
                            <span
                              className={classNames(
                                active ? "text-white" : "text-indigo-600",
                                "absolute inset-y-0 right-0 flex items-center pr-4"
                              )}
                            >
                              <CheckIcon
                                className="h-5 w-5"
                                aria-hidden="true"
                              />
                            </span>
                          ) : null}
                        </>
                      )}
                    </Listbox.Option>
                  ))}
                </Listbox.Options>
              </Transition>
            </div>
          </>
        )}
      </Listbox>

      {selected && selected.province && showProvince && (
        <span className="mt-1 text-sm text-gray-500">{selected?.province}</span>
      )}
    </div>
  );
}

export default PostOfficeSelector;

"use client";

import React, { useState } from "react";
import UploadButton from "@components/UploadButton";
import { trpc } from "@app/_trpc/client";
import { Ghost, Loader2, MessageSquare, Plus, Trash } from "lucide-react";
import Skeleton from "react-loading-skeleton";
import Link from "next/link";
import { format } from "date-fns";

const Dashboard = () => {
  const [currentlyDeletingFile, setCurrentlyDeletingFile] = useState<
    string | null
  >(null);

  const utils = trpc.useContext();

  const { data: files, isLoading } = trpc.getUserFiles.useQuery();

  const { mutate: deleteOneFile } = trpc.deleteFile.useMutation({
    onSuccess: () => {
      utils.getUserFiles.invalidate();
    },
    onMutate({ id }) {
      setCurrentlyDeletingFile(id);
    },
    onSettled() {
      setCurrentlyDeletingFile(null);
    },
  });

  return (
    <main className="mx-auto max-w-7xl md:p-10">
      <div className="mt-8 flex flex-col items-start justify-between gap-4 border-b border-gray-200 pb-5 px-2 sm:flex-row sm:items-center sm:gap-0">
        <h1 className="mb-3 font-bold text-5xl text-gray-900">My Files</h1>
        <UploadButton />
      </div>

      {/* display all files */}
      {files && files.length !== 0 ? (
        // if file exists
        <ul className="mt-8 p-2 grid grid-cols-1 gap-6 divide-y divide-zinc-200 md:grid-cols-2 lg:grid-cols-3">
          {files
            .sort(
              (a, b) =>
                new Date(b.createdAt).getTime() -
                new Date(a.createdAt).getTime()
            )
            .map((file) => (
              <li
                key={file.id}
                className="col-span-1 divide-y divide-gray-200 rounded-lg bg-white shadow transition-all hover:shadow-lg"
              >
                <Link
                  href={`/dashboard/${file.id}`}
                  className="flex flex-col gap-2"
                >
                  <div className="pt-6 px-6 flex w-full items-center justify-center space-x-6">
                    <div className="h-10 w-10 flex-shrink-0 rounded-full bg-gradient-to-r from-cyan-500 to-blue-500" />
                    <div className="flex-1 truncate">
                      <div className="flex items-center space-x-3 font-semibold">{file.name}</div>
                    </div>
                  </div>
                </Link>

                <div className=" mt-4 grid grid-cols-3 place-items-center gap-2 text-xs text-zinc-500">
                  <div className="flex items-center gap-2 p-4">
                    <Plus className="h-4 w-4" />
                    {format(new Date(file.createdAt), "dd MMM yyyy")}
                  </div>

                  <div className="flex items-center gap-2 cursor-pointer p-4">
                    <MessageSquare className="h-4 w-4" />
                    mocked
                  </div>
                  <div
                    className="flex items-center gap-2 cursor-pointer hover:text-rose-500 transition select-none p-4"
                    onClick={() => deleteOneFile({ id: file.id })}
                  >
                    {currentlyDeletingFile === file.id ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Trash className="h-4 w-4" />
                    )}
                    Delete
                  </div>
                </div>
              </li>
            ))}
        </ul>
      ) : isLoading ? (
        // if fetch file meen loading
        <Skeleton height={100} className="mt-2" count={3} />
      ) : (
        // no file exists
        <div className="mt-16 flex flex-col items-center gap-2">
          <Ghost className="h-8 w-8 text-zinc-800" />
          <h3 className="font-semibold text-xl">Pretty empty around here.</h3>
          <p>let&apos;s upload your first PDF</p>
        </div>
      )}
    </main>
  );
};

export default Dashboard;

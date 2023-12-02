import ChatWrapper from "@components/ChatWrapper";
import PdfRendarer from "@components/PdfRendarer";
import { db } from "@db/index";
import { getKindeServerSession } from "@kinde-oss/kinde-auth-nextjs/server";
import { notFound, redirect } from "next/navigation";
import React from "react";

interface FilePageProps {
  params: {
    fileId: string;
  };
}

const FileIdPage: React.FC<FilePageProps> = async ({ params }) => {
  const user = getKindeServerSession().getUser();

  if (!user || !user.id) {
    return redirect(`/auth-callback?origin=dashboard/${params.fileId}`);
  }

  const file = await db.file.findFirst({
    where: {
      id: params.fileId,
      userId: user.id,
    },
  });

  if (!file) notFound();

  return (
    <div className="flex-1 justify-between flex flex-col h-[calc(100vh - 3.5rem)]">
      <div className="mx-auto w-full max-w-7xl grow lg:flex xl:px-2">
        {/* left side */}
        <div className="flex-1 xl:flex">
          <div className="px-4 py-6 sm:px-6 lg:pl-8 xl:flex-1 xl:pl-6">
            <PdfRendarer url={file.url} />
          </div>
        </div>

        {/* right side */}
        <div className='shrink-0 flex-[0.75] border-t border-gray-200 lg:w-96 lg:border-l lg:border-t-0'>
          <ChatWrapper />
        </div>

      </div>
    </div>
  );
};

export default FileIdPage;

import { ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
import AddFrame, { FrameData } from "~/components/core/add-frame";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

import { prisma } from "~/db.server";

export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function loader({params}: LoaderFunctionArgs) {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
    include: {
      iFrames: {
        orderBy: {
          order: 'asc'
        }
      }
    }
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  return { user };
}

export async function action({request}: ActionFunctionArgs) {
  const formData = await request.formData();
  const url = formData.get("url");
  const order = formData.get("order");
  const width = formData.get("width");
  const height = formData.get("height");
  await prisma.iFrame.create({
    data: {url, order, width, height},
  });
  return {success: true};
}

export default function Frames() {
  const { user } = useLoaderData<typeof loader>();
  const onAddFrame = async (iframe: FrameData) => {
    const formData = new FormData();
    formData.append("url", iframe.url);
    formData.append("order", iframe.order.toString());
    formData.append("width", iframe.width.toString());
    formData.append("height", iframe.height.toString());

    await fetch("/frames", {
      method: "POST",
      body: formData,
    });
  }

  // This needs to layout the frames in a grid, which is 12 columns on xl and 4 on md, and 2 on sm, and 1 on xs
  return (
    <main className="p-4">
      {user.iFrames.length === 0 ? (
        <div className="text-center py-10">
          <p>No frames available.</p>
          <p>Click on "Add new frame" to add your first frame.</p>
          <AddFrame onSave={onAddFrame} />
        </div>
      ) : (
        <div className="grid xl:grid-cols-12 lg:grid-cols-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-1">
          {user.iFrames.map((iframe: any) => (
            <div key={iframe.id} className="col-span-12 md:col-span-4 sm:col-span-2 xs:col-span-1">
              <iframe src={iframe.url}/>
            </div>
          ))}
        </div>
      )}
    </main>
  );
}
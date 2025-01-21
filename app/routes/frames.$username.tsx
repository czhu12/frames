import { ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import AddFrame, { FrameData } from "~/components/core/add-frame";

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

export async function action({request, params}: ActionFunctionArgs) {
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  const formData = await request.formData();
  const userid = formData.get("userid") as string;

  if (user.id !== userid) {
    throw new Response("User does not match", { status: 403 });
  }

  const url = formData.get("url") as string;
  const order = parseInt(formData.get("order") as string);
  const width = parseInt(formData.get("width") as string);
  const height = parseInt(formData.get("height") as string);
  await prisma.iFrame.create({
    data: {url, order, width, height, user: {connect: {id: userid}}},
  });

  return redirect(`/frames/${params.username}`);
}

export default function Frames() {
  const { user } = useLoaderData<typeof loader>();
  const onAddFrame = async (iframe: FrameData) => {
    const formData = new FormData();
    formData.append("userid", user.id);
    formData.append("url", iframe.url);
    formData.append("order", iframe.order.toString());
    formData.append("width", iframe.width.toString());
    formData.append("height", iframe.height.toString());

    await fetch(`/frames/${user.username}`, {
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
        <div>
          <div className="flex justify-end">
            <AddFrame onSave={onAddFrame} />
          </div>
          <div className="grid xl:grid-cols-12 lg:grid-cols-8 md:grid-cols-4 sm:grid-cols-2 xs:grid-cols-1 gap-1">
            {user.iFrames.map((iframe: any) => (
              <div key={iframe.id} className="col-span-12 md:col-span-4 sm:col-span-2 xs:col-span-1">
                <iframe src={iframe.url}/>
              </div>
            ))}
          </div>
        </div>
      )}
    </main>
  );
}
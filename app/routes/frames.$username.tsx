import { ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import AddFrame, { FrameData } from "~/components/core/add-frame";
import GridLayout from "react-grid-layout";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);

import { prisma } from "~/db.server";
import Frame from "~/components/core/frame";
import { useState } from "react";

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
  const x = parseInt(formData.get("x") as string);
  const y = parseInt(formData.get("y") as string);
  const width = parseInt(formData.get("width") as string);
  const height = parseInt(formData.get("height") as string);
  await prisma.iFrame.create({
    data: {url, x, y, width, height, user: {connect: {id: userid}}},
  });

  return redirect(`/frames/${params.username}`);
}

export default function Frames() {
  const { user } = useLoaderData<typeof loader>();
  const onAddFrame = async (iframe: FrameData) => {
    const formData = new FormData();
    formData.append("userid", user.id);
    formData.append("url", iframe.url);
    formData.append("x", iframe.x.toString());
    formData.append("y", iframe.y.toString());
    formData.append("width", iframe.width.toString());
    formData.append("height", iframe.height.toString());

    await fetch(`/frames/${user.username}`, {
      method: "POST",
      body: formData,
    });
  }

  // This needs to layout the frames in a grid, which is 12 columns on xl and 4 on md, and 2 on sm, and 1 on xs
  const layout = [
    { i: "a", x: 0, y: 0, w: 1, h: 2 },
    { i: "b", x: 2, y: 0, w: 3, h: 2 },
    { i: "c", x: 0, y: 0, w: 1, h: 2 }
  ];
  const frameLayout = user.iFrames.map((iframe: any) => ({
    i: iframe.id,
    x: iframe.x,
    y: iframe.y,
    w: iframe.width,
    h: iframe.height
  }));

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
          <div className="container mx-auto">
            <div className="flex justify-between">
              <div>
                <h1 className="text-2xl font-bold">{user.username}'s Frames</h1>
              </div>
              <AddFrame onSave={onAddFrame} />
            </div>
          </div>
          <ResponsiveGridLayout
                className="layout"
                layouts={{ lg: frameLayout, md: frameLayout, sm: frameLayout, xs: frameLayout, xxs: frameLayout }}
                breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
                cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
                useCSSTransforms={true}
              >
              {user.iFrames.map((iframe: any) => (
                <div key={iframe.id}>
                  <Frame frame={iframe}/>
                </div>
              ))}
          </ResponsiveGridLayout>
        </div>
      )}
      <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: layout, md: layout, sm: layout, xs: layout, xxs: layout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 12, md: 10, sm: 6, xs: 4, xxs: 2 }}
            useCSSTransforms={true}
          >
            <div className="border border-red-500" key="a">a</div>
            <div className="border border-red-500" key="b">b</div>
            <div className="border border-red-500" key="c">c</div>
      </ResponsiveGridLayout>
    </main>
  );
}
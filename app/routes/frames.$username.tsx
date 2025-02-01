import { ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { redirect, useLoaderData } from "@remix-run/react";
import AddFrame from "~/components/core/add-frame";
import { Responsive, WidthProvider } from "react-grid-layout";
const ResponsiveGridLayout = WidthProvider(Responsive);
import { extractFrameData } from "~/lib/utils";

import { prisma } from "~/db.server";
import Frame from "~/components/core/frame";
import Collections from "~/components/core/collections";

export const meta: MetaFunction = ({ params }) => {
  return [
    { title: `${params.username}'s Frames` },
    { name: "description", content: `${params.username}'s collection of frames.` },
    { property: "og:title", content: `${params.username}'s Frames` },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://frames.canine.sh/frames/${params.username}` },
    { property: "og:image", content: "https://frames.canine.sh/dashboard-og.png" },
    { property: "og:description", content: `${params.username}'s collection of frames.` },
  ];
};

export async function loader({params, request}: LoaderFunctionArgs) {
  const url = new URL(request.url);
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  });
  const collectionId = url.searchParams.get("collectionId");
  // Use the first collection if no collectionId is provided
  const condition = collectionId ? { id: collectionId } : { userId: user?.id };
  const collection = await prisma.collection.findFirst({
    where: condition,
    include: {
      frames: true
    }
  });
  const collections = await prisma.collection.findMany({
    where: {
      userId: user?.id,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }
  if (!collection) {
    throw new Response("Collection not found", { status: 404 });
  }

  return { user, collection, collections };
}

export async function action({request, params}: ActionFunctionArgs) {
  const formData = await request.formData();
  // This implements authentication
  const user = await prisma.user.findUnique({
    where: {
      username: params.username,
    },
  });

  if (!user) {
    throw new Response("User not found", { status: 404 });
  }

  const userId = formData.get("userId") as string;

  if (user.id !== userId) {
    throw new Response("User does not match", { status: 403 });
  }
  // Passes authentication

  const intent = formData.get("intent") as string;
  if (intent === "create-collection") {
    const name = formData.get("name") as string;
    const collection = await prisma.collection.create({
      data: { name, userId: user.id },
    });
    return redirect(`/frames/${user.username}?collectionId=${collection.id}`);
  } else if (intent === "delete") {
    const id = formData.get("id") as string;

    await prisma.frame.delete({
      where: { id },
    });
  } else if (intent === "update") {
    const id = formData.get("id") as string;
    const frameData = extractFrameData(formData);
    await prisma.frame.update({
      where: { id },
      data: frameData,
    });
  } else {
    const collectionId = formData.get("collectionId") as string;
    const frameData = extractFrameData(formData);
    await prisma.frame.create({
      data: { ...frameData, collectionId: collectionId},
    });

  }
  return new Response(null, { status: 200 });
}

export default function Frames() {
  const { user, collection, collections } = useLoaderData<typeof loader>();
  // This needs to layout the frames in a grid, which is 12 columns on xl and 4 on md, and 2 on sm, and 1 on xs
  const frameLayout = collection?.frames.map((frame: any) => ({
    i: frame.id,
    x: frame.x,
    y: frame.y,
    w: frame.width,
    h: frame.height
  }));

  return (
    <main className="p-4">
      {collection?.frames.length === 0 ? (
        <div>
          <div className="mb-8 container mx-auto">
            <Collections
              userId={user.id}
              username={user.username}
              collections={collections}
              currentCollection={collection}
            />
          </div>
          <div className="text-center py-10">
            <p>No frames available.</p>
            <p>Click on "Add new frame" to add your first frame.</p>
            <AddFrame userId={user.id} collectionId={collection.id} />
          </div>
        </div>
      ) : (
        <div>
          <div className="mb-8 container mx-auto">
            <div className="flex justify-between">
              <Collections
                userId={user.id}
                username={user.username}
                collections={collections}
                currentCollection={collection}
              />
              <div>
                <h1 className="text-2xl font-bold">{user.username}'s Frames</h1>
              </div>
              <AddFrame userId={user.id} collectionId={collection.id} />
            </div>
          </div>
          <ResponsiveGridLayout
            className="layout"
            layouts={{ lg: frameLayout, md: frameLayout, sm: frameLayout, xs: frameLayout, xxs: frameLayout }}
            breakpoints={{ lg: 1200, md: 996, sm: 768, xs: 480, xxs: 0 }}
            cols={{ lg: 6, md: 4, sm: 2, xs: 1, xxs: 1 }}
            useCSSTransforms={true}
            isResizable={false}
            isDraggable={false}
          >
            {collection?.frames.map((frame: any) => (
              <div key={frame.id}>
                <Frame frame={frame} userId={user.id} collectionId={collection.id} />
              </div>
            ))}
          </ResponsiveGridLayout>
        </div>
      )}
    </main>
  );
}
import { ActionFunctionArgs, type LoaderFunctionArgs, type MetaFunction } from "@remix-run/node";
import { Form, useLoaderData } from "@remix-run/react";
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
  // This needs to layout the frames in a grid, which is 12 columns on xl and 4 on md, and 2 on sm, and 1 on xs
  return (
    <div className="flex h-screen items-center justify-center">
      <h1>{user.username}'s frames</h1>
      <div className="grid grid-cols-12 gap-4">
        {user.iFrames.map((iframe: any) => (
          <div key={iframe.id} className="col-span-12 md:col-span-4 sm:col-span-2 xs:col-span-1">
            <iframe src={iframe.url}/>
          </div>
        ))}
      </div>
    </div>
  );
}
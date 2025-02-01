import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"

export const meta: MetaFunction = () => {
  return [
    { title: "Frames - Create your own dashboard from (mostly) any website" },
    { name: "description", content: "Frames is a super charged bookmark manager" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://frames.canine.sh` },
    { property: "og:image", content: "https://frames.canine.sh/dashboard-og.png" },
  ];
};

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const framesCount = await prisma.frame.count();
  return {
    framesCount
  }
}

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  let username = formData.get("username") as string;

  // Use the validateUsername function
  const isValidUsername = validateUsername(username);

  if (!isValidUsername) {
    return {
      success: false,
      error: "Invalid username. It must be a valid ASCII URL without spaces.",
    };
  }

  const user = await prisma.user.create({
    data: {
      username,
    },
  });
  const collection = await prisma.collection.create({
    data: {
      name: `${username}'s default collection`,
      userId: user.id,
    },
  });

  // Redirect to the new frame
  return redirect(`/frames/${username}?collectionId=${collection.id}`);
}

export function validateUsername(username: string): boolean {
  // Trim the username
  username = username.trim();

  // Validate the username: must be a valid ASCII URL without spaces
  const isValidUsername = /^[\w-]+$/.test(username);

  return isValidUsername;
}

export default function Index() {
  const { framesCount } = useLoaderData<typeof loader>();

  const nav = useNavigation();

  return (
    <main className="container mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Frame Collection</h1>
        <p className="text-lg text-gray-700 mt-2">
          <strong>{framesCount}</strong> frames have been created
        </p>
      </header>
      <section className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a New Frame</h2>
        <Form method="post" className="space-y-4">
          <Input 
            type="text" 
            name="username" 
            aria-label="Username" 
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your username"
            required
            pattern="[\w\-]+"
          />
          <div className="flex items-center">

            <Checkbox 
              name="allowPublic" 
              aria-label="Allow public collection" 
              className="mr-2"
            />
            <Label htmlFor="allowPublic" className="text-gray-700">
              Is public
            </Label>
          </div>
          <Button 
            type="submit" 
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            {nav.state === "submitting" ? "Saving..." : "Save"}
          </Button>
        </Form>
      </section>
    </main>
  );
}
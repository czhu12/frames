import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, redirect, useLoaderData, useNavigation } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"

export const meta: MetaFunction = () => {
  return [
    { title: "Reframe - Create your own dashboard from (mostly) any website" },
    { name: "description", content: "Reframe is a super charged bookmark manager" },
    { property: "og:type", content: "website" },
    { property: "og:url", content: `https://reframe.canine.sh` },
    { property: "og:image", content: "https://reframe.canine.sh/dashboard-og.png" },

    { property: "twitter:card", content: "summary_large_image" },
    { property: "twitter:domain", content: "reframe.canine.sh" },
    { property: "twitter:url", content: "https://reframe.canine.sh" },
    { property: "twitter:title", content: "Reframe - Create your own dashboard from (mostly) any website" },
    { property: "twitter:description", content: "Reframe is a super charged bookmark manager" },
    { property: "twitter:image", content: "https://reframe.canine.sh/dashboard-og.png" },
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
  return redirect(`/${username}?secret=${user.id}`);
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
    <main className="container mx-auto max-w-3xl p-6">
      <header className="text-center mb-8">
        <h1 className="mb-4 text-2xl font-bold italic text-blue-600 logo [text-shadow:_0_1px_3px_rgba(37,99,235,0.4)]">reframe</h1>
        <h2 className="text-3xl sm:text-4xl font-black mb-1 text-center">
          Create your own dashboard from (mostly) any website
        </h2>
        <p className="text-sm font-light text-gray-700 mt-4">
          <strong>{framesCount}</strong> frames created with reframe
        </p>
      </header>
      <section className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a frame collection</h2>
        <Form method="post" className="space-y-4">
          <Input 
            type="text" 
            name="username"
            aria-label="Username" 
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Whats your handle? Ex: czhu12"
            required
            pattern="[\w\-]+"
          />
          <Button 
            type="submit" 
            disabled={nav.state === "submitting"}
            className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition duration-300"
          >
            {nav.state === "submitting" ? "Creating..." : "Create"}
          </Button>
        </Form>
      </section>
      <footer className="text-center text-sm text-gray-500 mt-6">
        <p>Made with ❤️ by <a href="https://warpcast.com/czhu12" target="_blank" className="text-blue-500 hover:underline">@czhu12</a></p>
      </footer>
    </main>
  );
}
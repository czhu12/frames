import type { ActionFunctionArgs, LoaderFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form, redirect, useLoaderData } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Checkbox } from "~/components/ui/checkbox"
import { Label } from "~/components/ui/label"

export const meta: MetaFunction = () => {
  return [
    { title: "Frames - Create a person iframe dashboard" },
    { name: "description", content: "Frames is a tool for creating iframe dashboards for your friends and family." },
  ];
};

export async function loader({
  request,
}: LoaderFunctionArgs) {
  const iFramesCount = await prisma.iFrame.count();
  return {
    iFramesCount
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

  await prisma.user.create({
    data: {
      username,
    },
  });

  // Redirect to the new frame
  return redirect(`/frames/${username}`);
}

export function validateUsername(username: string): boolean {
  // Trim the username
  username = username.trim();

  // Validate the username: must be a valid ASCII URL without spaces
  const isValidUsername = /^[\w-]+$/.test(username);

  return isValidUsername;
}

export default function Index() {
  const { iFramesCount } = useLoaderData<typeof loader>();

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    const form = event.currentTarget;
    const formData = new FormData(form);
    const username = formData.get("username") as string;

    if (!validateUsername(username)) {
      alert("Invalid username. It must be a valid ASCII URL without spaces.");
      event.preventDefault(); // Prevent form submission if validation fails
    }
  };

  return (
    <main className="container mx-auto p-6">
      <header className="text-center mb-8">
        <h1 className="text-3xl font-bold text-blue-600">Frame Collection</h1>
        <p className="text-lg text-gray-700 mt-2">
          <strong>{iFramesCount}</strong> frames have been created
        </p>
      </header>
      <section className="bg-white p-6 rounded-lg shadow-md max-w-md mx-auto">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Create a New Frame</h2>
        <Form method="POST" className="space-y-4" onSubmit={handleSubmit}>
          <Input 
            type="text" 
            name="username" 
            aria-label="Username" 
            className="w-full p-2 border border-gray-300 rounded"
            placeholder="Enter your username"
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
            Save
          </Button>
        </Form>
      </section>
    </main>
  );
}
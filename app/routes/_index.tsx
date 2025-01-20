import type { ActionFunctionArgs, MetaFunction } from "@remix-run/node";
import { Form } from "@remix-run/react";
import { prisma } from "~/db.server";
import { Button } from "~/components/ui/button"


export const meta: MetaFunction = () => {
  return [
    { title: "New Remix App" },
    { name: "description", content: "Welcome to Remix!" },
  ];
};

export async function action({
  request,
}: ActionFunctionArgs) {
  const formData = await request.formData();
  const username = formData.get("username") as string;
  await prisma.user.create({
    data: {
      username,
    },
  });

  return {
    success: true,
  }
}


export default function Index() {
  return (
    <div className="flex h-screen items-center justify-center">
      <h1>Enter a name for your collection</h1>
      <Button>Click me</Button>
      <Form method="POST">
        <input type="text" name="username" />
        <input type="submit" value="Submit" />
      </Form>
    </div>
  );
}
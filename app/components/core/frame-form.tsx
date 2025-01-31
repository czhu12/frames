import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export interface FrameData {
  id?: string;
  url: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export default function FrameForm({userId, collectionId, intent, frame}: {userId: string, collectionId: string, intent: string, frame?: FrameData}) {
  return (
    <Form method="post">
      <input type="hidden" name="userId" value={userId} />
      <input type="hidden" name="collectionId" value={collectionId} />
      <input type="hidden" name="intent" value={intent} />
      {frame && <input type="hidden" name="id" value={frame.id} />}
      <div className="grid gap-4">
        <div className="space-y-2">
          <h4 className="font-medium leading-none">Frame</h4>
          <p className="text-sm text-muted-foreground">
            Set the dimensions and URL for the frame
          </p>
        </div>
        <div className="grid gap-2">
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="url">URL</Label>
            <Input
              id="url"
              name="url"
              defaultValue={frame?.url || "https://pomofocus.io/"}
              className="col-span-2 h-8"
              required
              pattern="https?://.*"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="x">X position</Label>
            <Input
              id="x"
              type="number"
              defaultValue={frame?.x || "0"}
              name="x"
              className="col-span-2 h-8"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="y">Y position</Label>
            <Input
              id="y"
              type="number"
              defaultValue={frame?.y || "0"}
              name="y"
              className="col-span-2 h-8"
              required
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="width">Width</Label>
            <Input
              id="width"
              type="number"
              defaultValue={frame?.width || "1"}
              name="width"
              className="col-span-2 h-8"
              required
              min="1"
              max="6"
            />
          </div>
          <div className="grid grid-cols-3 items-center gap-4">
            <Label htmlFor="height">Height</Label>
            <Input
              id="height"
              name="height"
              type="number"
              defaultValue={frame?.height || "1"}
              className="col-span-2 h-8"
              required
              min="1"
              max="6"
            />
          </div>
        </div>
      </div>

      <Button type="submit" className="w-full mt-6">
        {intent === "add" ? "Add frame to collection ➕" : "Update frame"}
      </Button>
    </Form>
  );
}
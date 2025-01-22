import React, { useState } from "react";
import { Form } from "@remix-run/react";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"

export default function AddFrame(props: { userId: string }) {
  const [previewUrl, setPreviewUrl] = useState("");

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Add new frame</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[48rem]">
        <Form method="post">
          <input type="hidden" name="userId" value={props.userId} />

          <div className="grid gap-4">
            <div className="space-y-2">
              <h4 className="font-medium leading-none">Dimensions</h4>
              <p className="text-sm text-muted-foreground">
                Set the dimensions for the layer.
              </p>
            </div>
            <div className="grid gap-2">
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="url">URL</Label>
                <Input
                  id="url"
                  name="url"
                  placeholder="https://www.google.com"
                  className="col-span-2 h-8"
                  required
                  pattern="https?://.*"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="x">X position</Label>
                <Input
                  id="x"
                  name="x"
                  type="number"
                  defaultValue="0"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="y">Y position</Label>
                <Input
                  id="y"
                  name="y"
                  type="number"
                  defaultValue="0"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  name="width"
                  type="number"
                  defaultValue="1"
                  className="col-span-2 h-8"
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  name="height"
                  type="number"
                  defaultValue="1"
                  className="col-span-2 h-8"
                />
              </div>
            </div>
          </div>

          {previewUrl && (
            <div className="mt-4 flex justify-center items-center">
              <iframe
                title="Preview frame"
                src={previewUrl}
                width="50%"
                height="200"
              />
            </div>
          )}

          <div className="py-8">
            <hr/>
          </div>

          <div className="flex flex-col md:flex-row gap-2">
            <Button variant="outline" type="button" className="w-full" onClick={() => {
              const urlInput = document.getElementById("url") as HTMLInputElement;

              if (urlInput.value) {
                setPreviewUrl(urlInput.value);
              }
            }}
            >
              Preview frame 👀
            </Button>

            <Button className="w-full">
              Add frame ➕
            </Button>
          </div>
        </Form>
      </PopoverContent>
    </Popover>
  );
}
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

export interface FrameData {
  url: string;
  width: number;
  height: number;
  order: number;
}

interface AddFrameProps {
  onSave: (frame: FrameData) => Promise<void>;
}

export default function AddFrame({ onSave }: AddFrameProps) {
  const [frame, setFrame] = useState<FrameData>({url: "", width: 1, height: 1, order: 1});
  const [showIframe, setShowIframe] = useState(false);

  const handlePreview = (event: any) => {
    event.preventDefault();
    console.log(frame);
    setShowIframe(true);
  };

  // This needs to layout the frames in a grid, which is 12 columns on xl and 4 on md, and 2 on sm, and 1 on xs
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Add new frame</Button>
      </PopoverTrigger>
      <PopoverContent className="w-[48rem]">
        <Form onSubmit={handlePreview}>
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
                  defaultValue="https://www.google.com"
                  className="col-span-2 h-8"
                  value={frame.url}
                  onChange={(e) => setFrame({...frame, url: e.target.value})}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="order">Order</Label>
                <Input
                  id="order"
                  type="number"
                  defaultValue="1"
                  className="col-span-2 h-8"
                  value={frame.order}
                  onChange={(e) => setFrame({...frame, order: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="width">Width</Label>
                <Input
                  id="width"
                  type="number"
                  defaultValue="1"
                  className="col-span-2 h-8"
                  value={frame.width}
                  onChange={(e) => setFrame({...frame, width: parseInt(e.target.value)})}
                />
              </div>
              <div className="grid grid-cols-3 items-center gap-4">
                <Label htmlFor="height">Height</Label>
                <Input
                  id="height"
                  type="number"
                  defaultValue="1"
                  className="col-span-2 h-8"
                  value={frame.height}
                  onChange={(e) => setFrame({...frame, height: parseInt(e.target.value)})}
                />
              </div>
            </div>
          </div>

          {showIframe && (
            <div className="mt-4">
              <iframe
                src={frame.url}
                width="100%"
                height="400"
              />
            </div>
          )}
          {!showIframe && (
            <Button variant="outline" type="submit" className="w-full mt-6">
              Preview frame 👀
            </Button>
          )}
          {showIframe && (
            <Button type="submit" className="w-full mt-6" onClick={() => onSave(frame)}>
              Add frame to collection ➕
            </Button>
          )}
        </Form>
      </PopoverContent>
    </Popover>
  );
}
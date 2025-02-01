import { Button } from "~/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "~/components/ui/popover"
import FrameForm from "./frame-form";

export interface FrameData {
  id?: string;
  url: string;
  width: number;
  height: number;
  x: number;
  y: number;
}

export default function AddFrame({userId, collectionId}: {userId: string, collectionId: string}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button variant="outline">Add new frame</Button>
      </PopoverTrigger>
      <PopoverContent className="w-full lg:w-[48rem]">
        <FrameForm userId={userId} collectionId={collectionId} intent="add" />
      </PopoverContent>
    </Popover>
  );
}
import { FrameData } from "./add-frame";

export default function Frame({frame}: {frame: FrameData}) {
  return (
    <div className="border w-full border-red-500">
      <iframe src={frame.url} className="w-full h-full" />
    </div>
  );
}
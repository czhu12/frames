import { FrameData } from "./add-frame";

export default function Frame({frame}: {frame: FrameData}) {
  return (
    <div>
      <iframe src={frame.url} className={`col-span-${frame.width}`} />
    </div>
  );
}
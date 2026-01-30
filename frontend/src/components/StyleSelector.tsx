import {
  ChevronDownIcon,
  CpuIcon,
  ImageIcon,
  PenToolIcon,
  SparkleIcon,
  SquareIcon,
} from "lucide-react";
import { thumbnailStyles, type ThumbnailStyle } from "../assets/assets";
const StyleSelector = ({
  value,
  onChange,
  isOpen,
  setIsOpen,
}: {
  value: ThumbnailStyle;
  onChange: (style: ThumbnailStyle) => void;
  isOpen: boolean;
  setIsOpen: (open: boolean) => void;
}) => {
  const stylesDescription: Record<ThumbnailStyle, string> = {
    "Bold & Graphic": "High contrast, bold typography, striking visuals.",
    "Minimalist": "Clean simple, lots of white space.",
    "Photorealistic": "Photo-based, natural looking.",
    "Illustrated": "Hand-drawn, artistic, creative.",
    "Tech/Futuristic" : "Modern, sleek, and tech-inspired.",
  };
  const stylesIcon: Record<ThumbnailStyle, React.ReactNode> = {
    "Bold & Graphic": <SparkleIcon className="w-4 h-4" />,
    "Minimalist": <SquareIcon className="w-4 h-4" />,
    "Photorealistic": <ImageIcon className="w-4 h-4" />,
    "Illustrated": <PenToolIcon className="w-4 h-4" />,
    "Tech/Futuristic": <CpuIcon className="w-4 h-4" />,
  };

  return (
    <div className="relative space-y-3 dark">
      <label className="block text-sm font-medium text-zinc-200">
        Thumbnail Style
      </label>
      <button
        className="flex w-full items-center justify-between rounded-md border px-4 py-3 
        text-left transition bg-white/8 border-white/10 text-zinc-200 hover:bg-white/12"
        type="button"
        onClick={() => setIsOpen(!isOpen)}
      >
        <div className="space-y-1">
          <div className="flex items-center gap-2 font-medium">
            {stylesIcon[value]}
            <span>{value}</span>
          </div>
          <p className="text-xs text-zinc-400">{stylesDescription[value]}</p>
        </div>
        <ChevronDownIcon
          className={[
            "h-5 w-5 text-zinc-400 transition-transform",
            isOpen && "rotate-180",
          ].join(" ")}
        />
      </button>

      {isOpen && (
        <div
          className="absolute bottom-0 z-50 mt-1 w-full rounded-md border
        border-white/12 bg-black/20 backdrop-blur-3xl shadow-lg"
        >
          {thumbnailStyles.map((style) => (
            <button
              key={style} 
              className="flex w-full items-center gap-3 px-4 py-3 text-left transition hover: bg-black/30"
              type="button"
              onClick={() => {
                onChange(style);
                setIsOpen(false);
              }}
            >
                <div className="mt-0.5">{stylesIcon[style]}</div>
                <div>
                    <p className="font-medium ">{style}</p>
                    <p className="text-sm text-zinc-400 ">{stylesDescription[style]}</p>
                </div>
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default StyleSelector;

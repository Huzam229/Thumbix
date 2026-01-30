import { useEffect, useState } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import {
  colorSchemes,
  type AspectRatio,
  type IThumbnail,
  type ThumbnailStyle,
} from "../assets/assets";
import SoftBackDrop from "../components/SoftBackDrop";
import AspectRatioSelection from "../components/AspectRatioSelection";
import StyleSelector from "../components/StyleSelector";
import ColorSelector from "../components/ColorSelector";
import PreviewPanel from "../components/PreviewPanel";
import { useAuth } from "../context/authContext";
import toast from "react-hot-toast";
import api from "../config/api";

export const Generate = () => {
  const { id } = useParams();
  const { pathname } = useLocation();
  const navigate = useNavigate();
  const { isLoggedIn } = useAuth();
  const [title, setTitle] = useState("");
  const [additionalInfo, setAdditionalInfo] = useState("");
  const [thumbnail, setThumbnail] = useState<IThumbnail | null>(null);
  const [loading, setLoading] = useState(false);
  const [aspectRatio, setAspectRatio] = useState<AspectRatio>("16:9");
  const [colorSchemeId, setColorSchemeId] = useState<string>(
    colorSchemes[0].id,
  );
  const [style, setStyle] = useState<ThumbnailStyle>("Bold & Graphic");
  const [styleDropDownOpen, setStyleDropDownOpen] = useState(false);

  const handleGenerate = async () => {
    // return toast.error("This is not available right now!");
    if (!isLoggedIn) return toast.error("Please login to generate thumbnails");
    if (!title.trim()) return toast.error("Please enter a title or topic");
    setLoading(true);

    try {
      const api_payload = {
        title,
        prompt: additionalInfo,
        style,
        aspect_ratio: aspectRatio,
        color_scheme: colorSchemeId,
        text_overlay: true,
      };

      const { data } = await api.post("/api/thumbnail/generate", api_payload);
      if (data.thumbnail) {
        navigate(`/generate/${data.thumbnail._id}`);
        toast.success(data.message);
      }
    } catch (error: any) {
      console.error(error);
      toast.error(
        error?.response?.data?.message ||
          error.message ||
          "Failed to generate thumbnail",
      );
      setLoading(false);
    }
  };

  const fetchThumbnail = async () => {
    try {
      const { data } = await api.get(`/api/user/thumbnails/${id}`);
      setThumbnail(data?.thumbnail as IThumbnail);
      setLoading(!data?.thumbnail?.image_url);
      setAdditionalInfo(data.thumbnail?.user_prompt);
      setTitle(data.thumbnail?.title || "");
      setStyle(data.thumbnail?.style);
      setAspectRatio(data.thumbnail?.aspect_ratio);
      setColorSchemeId(data.thumbnail?.color_scheme);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    }
  };

  useEffect(() => {
    if (isLoggedIn && id) {
      fetchThumbnail();
    }
    if (id && loading && isLoggedIn) {
      const interval = setInterval(() => {
        fetchThumbnail();
      }, 5000);
      return () => clearInterval(interval);
    }
  }, [id, loading, isLoggedIn]);

  useEffect(() => {
    if (!id && thumbnail) {
      setThumbnail(null);
    }
  }, [pathname]);

  return (
    <>
      <SoftBackDrop />
      <div className="pt-24 min-h-screen">
        <main className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 pb-28">
          <div className="grid lg:grid-cols-[400px_1fr] gap-8">
            {/* Left Side */}
            <div className={`space-y-6 ${id && "pointer-events-none"}`}>
              <div className="p-6 rounded-2xl bg-white/8 border border-white/12 shadow-xl space-y-6">
                <div>
                  <h2 className="text-xl font-bold text-zinc-100 mb-2">
                    Create Your Thumbnail
                  </h2>
                  <p className="text-sm text-zinc-400">
                    Describe your vision and let AI to bring it to life
                  </p>
                </div>
                <div className="space-y-5">
                  {/* Title input */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Title or Topic
                    </label>
                    <input
                      type="text"
                      value={title}
                      onChange={(e) => setTitle(e.target.value)}
                      maxLength={100}
                      placeholder="E.g., 5 Tips to Improve Your Photography Skills"
                      className="w-full px-4 py-3 rounded-lg border border-white/12 bg-black/20 
                      text-zinc-100 placeholder:text-zinc-400 focus:outline-none
                      focus:ring-2 focus:ring-pink-500 mb-2"
                    />
                    <div className="flex justify-end">
                      <span className="text-xs text-zinc-400">
                        {title.length}/100
                      </span>
                    </div>
                  </div>
                  {/* AspectRatioSelection */}
                  <AspectRatioSelection
                    value={aspectRatio}
                    onChange={setAspectRatio}
                  />
                  {/* StyleSelector */}
                  <StyleSelector
                    value={style}
                    onChange={setStyle}
                    isOpen={styleDropDownOpen}
                    setIsOpen={setStyleDropDownOpen}
                  />
                  {/* ColorSchemeSelector */}
                  <ColorSelector
                    value={colorSchemeId}
                    onChange={setColorSchemeId}
                  />

                  {/* Details */}

                  <div className="space-y-2">
                    <label className="block text-sm font-medium">
                      Additonal Details{" "}
                      <span className="text-zinc-400 text-xs">(optional)</span>
                    </label>
                    <textarea
                      value={additionalInfo}
                      rows={3}
                      placeholder="Add any specific elements, mood, or style preferences..."
                      onChange={(e) => setAdditionalInfo(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg border border-white/10 bg-white/6 
                      text-zinc-100 placeholder:text-zinc-400 focus:outline-none
                      focus:ring-2 focus:ring-pink-500 mb-2 resize-none"
                    />
                  </div>
                </div>

                {/* Button */}
                {!id && (
                  <button
                    onClick={handleGenerate}
                    disabled={loading}
                    className="text-[15px] w-full py-3.5 rounded-xl font-medium bg-linear-to-b
                   from-pink-500 to-pink-600 hover:from-pink-700 disabled:cursor-not-allowed transition-colors"
                  >
                    {loading ? "Generating..." : "Generate Thumbnail"}
                  </button>
                )}
              </div>
            </div>
            {/* Right Side */}
            <div>
              <div className="p-6 rounded-2xl bg-white/8 border-white/10 shadow-xl">
                <h2 className="text-lg font-semibold text-zinc-100 mb-4">
                  Preview
                </h2>
                <PreviewPanel
                  thumbnail={thumbnail}
                  isLoading={loading}
                  aspectRatio={aspectRatio}
                />
              </div>
            </div>
          </div>
        </main>
      </div>
    </>
  );
};

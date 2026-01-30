import { useEffect, useState } from "react";
import SoftBackDrop from "../components/SoftBackDrop";
import { type IThumbnail } from "../assets/assets";
import { Link, useNavigate } from "react-router-dom";
import { ArrowUpRightIcon, DownloadIcon, TrashIcon } from "lucide-react";
import api from "../config/api";
import toast from "react-hot-toast";

const Community = () => {
  const [thumbnails, setThumbnails] = useState<IThumbnail[]>([]);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  const aspectRatioClassMap: Record<string, string> = {
    "16:9": "aspect-video",
    "1:1": "aspect-square",
    "9:16": "aspect-[9/16]",
  };

  const fetchThumbnail = async () => {
    try {
      setLoading(true);
      const { data } = await api.get(`/api/thumbnail/getAllThumbnails`);
      setThumbnails(data.thumbnails || []);
    } catch (error: any) {
      console.log(error);
      toast.error(error?.response?.data?.message || error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleDownload = (image_url: string) => {
    if (!image_url) return;
    const link = document.createElement("a");
    link.href = image_url.replace("/upload", "/upload/fl_attachment");
    link.download = "thumbnail.png"; // optional but recommended
    document.body.appendChild(link);
    link.click();
    link.remove();
  };

  useEffect(() => {
    fetchThumbnail();
  }, []);

  return (
    <>
      <SoftBackDrop />
      <div className="min-h-screen mt-32 px-6 md:px-16 lg:px-24 xl:px-32">
        {/* Header */}
        <div className="mb-8">
          <h1 className="text-2xl font-bold text-zinc-200">Community</h1>
          <p className="text-sm text-zinc-400 mt-1 mb-5">
            Browse AI-generated thumbnails created by the community <br /> and
            share your own
          </p>
          <div className="mt-4">
            {/* loading */}
            {loading && (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                {Array.from({ length: 6 }).map((_, i) => (
                  <div
                    key={i}
                    className="rounded-2xl bg-white/6 border border-white/10
                  animate-pulse h-[260px]"
                  />
                ))}
              </div>
            )}
            {/* Empty State */}
            {!loading && thumbnails.length === 0 && (
              <div className="text-center py-24">
                <h3 className="text-zinc-400 mb-2 text-lg font-semibold">
                  No thumbnails generated yet
                </h3>
                <p className="text-sm text-zinc-500 mt-2">
                  Start creating thumbnails to see them appear here.
                </p>
              </div>
            )}

            {/* Thumbnails Grid */}
            {!loading && thumbnails.length > 0 && (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 2xl:grid-cols-4 gap-8">
                {thumbnails.map((thumbnail: IThumbnail) => {
                  const aspectClass =
                    aspectRatioClassMap[thumbnail.aspect_ratio || "16:9"];
                  return (
                    <div
                      key={thumbnail._id}
                      className="mb-8 group relative cursor-pointer rounded-2xl bg-white/6
                      border border-white/10 transform shadow-xl break-inside-avoid"
                      onClick={() => navigate(`/generate/${thumbnail._id}`)}
                    >
                      {/* Image */}
                      <div
                        className={`relative overflow-hidden rounded-t-2xl ${aspectClass}
                      bg-black`}
                      >
                        {thumbnail.image_url ? (
                          <img
                            src={thumbnail.image_url}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform
                            duration-300"
                            alt={thumbnail.title}
                          />
                        ) : (
                          <div className="w-full h-full flex items-center justify-center text-zinc-400 text-sm">
                            {thumbnail.isGenerating
                              ? "Generating..."
                              : "No Image Available"}
                          </div>
                        )}
                        {thumbnail.isGenerating && (
                          <div className="absolute inset-0 bg-black/50 flex items-center justify-center text-sm font-medium">
                            Generating...
                          </div>
                        )}
                      </div>
                      {/* Content */}

                      <div className="space-y-2 p-4">
                        <h3
                          className="text-zinc-100 text-sm
                        font-semibold line-clamp-2"
                        >
                          {thumbnail.title}
                        </h3>
                        <div className="flex flex-wrap gap-2 text-xs text-zinc-400">
                          <span className="px-2 py-0.5 rounded bg-white/8">
                            {thumbnail.style}{" "}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/8">
                            {thumbnail.aspect_ratio}{" "}
                          </span>
                          <span className="px-2 py-0.5 rounded bg-white/8">
                            {thumbnail.color_scheme}
                          </span>
                        </div>
                        <p className="text-zinc-400 text-xs">
                          {new Date(thumbnail.createdAt!).toDateString()}
                        </p>
                      </div>
                      {/* Action */}
                      <div
                        onClick={(e) => e.stopPropagation()}
                        className="absolute bottom-2 right-2 max-sm:flex sm:hidden 
                      group-hover:flex gap-1.5"
                      >
                        <DownloadIcon
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDownload(thumbnail.image_url!);
                          }}
                          className="size-6 bg-black/50 p-1 rounded hover:bg-blue-600 transition-all"
                        />
                        <Link
                          to={`/preview?thumbnail_url=${encodeURIComponent(
                            thumbnail.image_url!,
                          )}&title=${encodeURIComponent(thumbnail.title)}`}
                          target="_blank"
                        >
                          <ArrowUpRightIcon className="size-6 bg-black/50 p-1 rounded hover:bg-blue-600 transition-all" />
                        </Link>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </>
  );
};

export default Community;

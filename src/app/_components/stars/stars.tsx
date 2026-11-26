import { FaStar, FaStarHalfStroke, FaRegStar } from "react-icons/fa6";

export default function Stars({
  rating,
  className = "text-sm",
}: {
  rating: number;
  className?: string;
}) {
  return (
    <div
      className={`flex gap-0.5 text-[#FBC700] ${className}`}
      aria-label={`Rated ${rating} out of 5`}
    >
      {[1, 2, 3, 4, 5].map((i) => {
        if (rating >= i - 0.25) return <FaStar key={i} />;
        if (rating >= i - 0.75) return <FaStarHalfStroke key={i} />;
        return <FaRegStar key={i} />;
      })}
    </div>
  );
}

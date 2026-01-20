import { Star } from "lucide-react";

export default function StarRating({ value, onChange }) {
  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((star) => (
        <button
          key={star}
          type="button"
          onClick={() => onChange(String(star))}
          className="group transition"
        >
          <Star
            size={24}
            className={`transition-all duration-200 
              ${
                Number(value) >= star
                  ? "fill-yellow-400 text-yellow-400 scale-110"
                  : "text-gray-300 group-hover:text-yellow-300"
              }`}
          />
        </button>
      ))}
      <span className="ml-2 text-sm text-muted-foreground">
        {value} / 5
      </span>
    </div>
  );
}

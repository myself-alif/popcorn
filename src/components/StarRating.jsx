import { useState } from "react";
import Star from "./Star";

export default function StarRating({
  maxRating = 5,
  color = "#fcc419",
  size = 48,
  className = "",
  messages = [],
  defaultRating = 0,
  onSetRating,
}) {
  const [rating, setRating] = useState(defaultRating);
  const [tempRating, setTempRating] = useState(0);

  function handleRating(rating) {
    setRating(rating);
    onSetRating?.(rating);
  }

  return (
    <div
      style={{ display: "flex", alignItems: "center", gap: "16px" }}
      className={className}
    >
      <div style={{ display: "flex" }}>
        {Array.from({ length: maxRating }, (_, i) => (
          <Star
            key={i}
            onClick={() => handleRating(i + 1)}
            onHoverIn={() => setTempRating(i + 1)}
            onHoverOut={() => setTempRating(0)}
            full={tempRating ? tempRating >= i + 1 : rating >= i + 1}
            color="#fcc419"
            size={48}
          />
        ))}
      </div>
      <p
        style={{
          lineHeight: "1",
          margin: "0",
          color,
          fontSize: `${size / 1.5}px`,
        }}
      >
        {messages.length === maxRating
          ? messages[tempRating ? tempRating - 1 : rating - 1]
          : tempRating || rating || ""}
      </p>
    </div>
  );
}

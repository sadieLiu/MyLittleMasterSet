import { useState } from "react";
import '../styles/components.css';

export default function ImageCard({ image, onClick }) {
  const [isLandscape, setIsLandscape] = useState(false);

  function handleLoad(event) {
    const { naturalWidth, naturalHeight } = event.target;
    setIsLandscape(naturalWidth > naturalHeight);
  }

  return (
    <div className="image-card" onClick={onClick}>
      <img
        src={image}
        alt="card"
        onLoad={handleLoad}
        className={isLandscape ? "rotate-90" : undefined}
      />
    </div>
  );
}

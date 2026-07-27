import React, { useState } from "react";
import ImageCard from "./ImageCard";
import CardModal from "./CardModal";

export default function CardExample() {
  const [open, setOpen] = useState(false);
  const [favorite, setFavorite] = useState(false);

  const cardData = {
    image: "/images/charizard.png",
    title: "Charizard",
    description: "A powerful Fire/Flying Pokémon known for its fiery breath."
  };

  return (
    <>
      <ImageCard
        image={cardData.image}
        onClick={() => setOpen(true)}
      />

      <CardModal
        open={open}
        onClose={() => setOpen(false)}
        image={cardData.image}
        title={cardData.title}
        description={cardData.description}
        isFavorite={favorite}
        onToggleFavorite={() => setFavorite(!favorite)}
      />
    </>
  );
}

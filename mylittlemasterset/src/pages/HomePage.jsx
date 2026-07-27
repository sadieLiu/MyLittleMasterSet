import CardCarousel from "../components/CardCarousel.jsx";
import TopFavoritesChart from "../components/TopFavoritesChart.jsx";
import TopFavoriteCards from "../components/TopFavoriteCards.jsx";

export default function Home() {
  return (
    <>
      <CardCarousel />
      <TopFavoritesChart title="Most Favorited Cards" collectionName="cards" resultLimit={3} />
      <TopFavoriteCards resultLimit={3} />
      <TopFavoritesChart title="Most Favorited Characters" collectionName="characters" resultLimit={10} />
    </>
  );
}

import { RARITY_ORDER, RARITY_LABELS } from "../util/rarity.js";

export default function About() {
  return (
    <>
      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="card-title">About My Little Master Set</h2>
          <p>
            My Little Master Set is a website for MLP KAYOU enthusiasts to curate their favorite cards into a
            collection. Search the full card catalog by set or character, and filter and sort results by 
            rarity to find exactly what you're looking for.
          </p>
          <p className="mb-0">
            Sign in to save cards to <strong>My Favorites</strong>, and use the{" "}
            <strong>Share My List</strong> button on to share your favorite cards with others!
          </p>
        </div>
      </section>

      <section className="card shadow-sm mb-4">
        <div className="card-body">
          <h2 className="card-title">Card Rarities</h2>
          <p>Listed from most common to rarest.</p>

          <div className="table-wrapper">
            <table className="table">
              <thead>
                <tr>
                  <th>Rank</th>
                  <th>Rarity</th>
                </tr>
              </thead>
              <tbody>
                {RARITY_ORDER.map((code, index) => (
                  <tr key={code}>
                    <td>{index + 1}</td>
                    <td>{RARITY_LABELS[code]}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </>
  );
}

import { useState } from "react";
import { Link } from "react-router-dom";
import ImageCard from "../components/ImageCard.jsx";
import CardModal from "../components/CardModal.jsx";
import ShareListModal from "../components/ShareListModal.jsx";
import LoginRequiredModal from "../components/LoginRequiredModal.jsx";
import CollectionStatusAlert from "../components/CollectionStatusAlert.jsx";
import { useAuth } from "../hooks/useAuth.jsx";
import { useCollection } from "../hooks/useCollection.js";
import { useFavoriteActions } from "../hooks/useFavoriteActions.js";
import { getShareUrl } from "../util/shareUtils.js";

export default function MyFavoritesPage() {
    const { currentUser } = useAuth();
    const { error, items, loading, addToCollection, removeFromCollection, isSaved } = useCollection();
    const [showShareModal, setShowShareModal] = useState(false);
    const [selectedCard, setSelectedCard] = useState(null);
    const {
        showLoginModal,
        setShowLoginModal,
        collectionStatus,
        collectionStatusType,
        clearCollectionStatus,
        handleAddToCollection,
        handleRemoveFromCollection
    } = useFavoriteActions({
        addToCollection,
        removeFromCollection,
        onRemoveSuccess: () => setSelectedCard(null)
    });

    if (!currentUser) {
        return (
            <section className="card shadow-sm mb-4" role="alert">
                <div className="card-body">
                    <h2 className="h4 card-title">My Favorites</h2>
                    <p>Please log in to add cards to your favorites list!</p>
                    <Link className="btn btn-primary navbar-theme-color" to="/login">
                        Login
                    </Link>
                </div>
            </section>
        );
    }

    return (
        <>
            <section className="card shadow-sm mb-4">
                <div className="card-body">
                    <div className="d-flex justify-content-between align-items-center gap-3">
                        <h2 className="card-title mb-0">My Favorites</h2>
                        <button
                            className="btn btn-outline-primary"
                            type="button"
                            onClick={() => setShowShareModal(true)}
                        >
                            Share My List
                        </button>
                    </div>
                    {loading && <p className="mb-0">Loading your saved cards...</p>}
                    {error && <p className="alert alert-warning mb-0">{error}</p>}
                    {!loading && !error && items.length === 0 && (
                        <p className="mb-0">Your favorites list is empty.</p>
                    )}
                </div>
            </section>

            <CollectionStatusAlert
                status={collectionStatus}
                statusType={collectionStatusType}
                onDismiss={clearCollectionStatus}
            />

            <div className="card-grid">
                {items.map((card) => (
                    <ImageCard
                        key={card.collectionId}
                        image={card.imageURL}
                        onClick={() => setSelectedCard(card)}
                    />
                ))}
            </div>

            {selectedCard && (
                <CardModal
                    open={true}
                    onClose={() => setSelectedCard(null)}
                    image={selectedCard.imageURL}
                    title={selectedCard.id}
                    description={`${selectedCard.setName} - ${(selectedCard.characters || []).join(", ")}`}
                    action={
                        isSaved(selectedCard) ? (
                            <button
                                className="btn btn-outline-danger"
                                type="button"
                                onClick={() => handleRemoveFromCollection(selectedCard)}
                            >
                                Remove from Favorites
                            </button>
                        ) : (
                            <button
                                className="btn btn-primary"
                                type="button"
                                onClick={() => handleAddToCollection(selectedCard)}
                            >
                                Add to Favorites
                            </button>
                        )
                    }
                />
            )}

            {showShareModal && (
                <ShareListModal
                    onClose={() => setShowShareModal(false)}
                    shareUrl={getShareUrl(currentUser.uid)}
                />
            )}

            {showLoginModal && (
                <LoginRequiredModal
                    onClose={() => setShowLoginModal(false)}
                    message="Please log in to manage your favorites."
                />
            )}
        </>
    );
}

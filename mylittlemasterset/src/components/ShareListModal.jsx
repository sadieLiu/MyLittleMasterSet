import { useEffect, useState } from "react";
import '../styles/components.css';
import { getQrCodeUrl, shortenUrl } from "../util/shareUtils.js";

export default function ShareListModal({ onClose, shareUrl }) {
    const [shortUrl, setShortUrl] = useState("");
    const [isShortening, setIsShortening] = useState(true);
    const [copied, setCopied] = useState(false);

    useEffect(() => {
        let cancelled = false;

        shortenUrl(shareUrl)
            .then((url) => {
                if (!cancelled) setShortUrl(url);
            })
            .catch(() => {
                if (!cancelled) setShortUrl(shareUrl);
            })
            .finally(() => {
                if (!cancelled) setIsShortening(false);
            });

        return () => {
            cancelled = true;
        };
    }, [shareUrl]);

    const displayUrl = shortUrl || shareUrl;

    async function handleCopy() {
        try {
            await navigator.clipboard.writeText(displayUrl);
            setCopied(true);
        } catch (copyError) {
            console.error("Unable to copy link.", copyError);
        }
    }

    return (
        <div className="modal-overlay" onClick={onClose}>
            <div className="modal-box" onClick={(e) => e.stopPropagation()}>

                {/* Left side: QR code */}
                <div className="modal-image modal-qr">
                    <img
                        src={getQrCodeUrl(displayUrl)}
                        alt="QR code linking to this favorites list"
                    />
                </div>

                {/* Right side: text + buttons */}
                <div className="modal-content">
                    <div className="modal-header">
                        <h2>Share My List</h2>
                    </div>

                    <p>{isShortening ? "Creating your link..." : displayUrl}</p>

                    <div className="modal-actions">
                        <button
                            className="btn btn-primary navbar-theme-color"
                            type="button"
                            onClick={handleCopy}
                            disabled={isShortening}
                        >
                            {copied ? "Copied!" : "Copy Link"}
                        </button>
                        <button className="btn btn-secondary" type="button" onClick={onClose}>
                            Close
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}

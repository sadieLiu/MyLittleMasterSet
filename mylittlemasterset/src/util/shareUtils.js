export function getShareUrl(uid) {
    return `${window.location.origin}/favorites/${uid}`;
}

export async function shortenUrl(longUrl) {
    const response = await fetch(
        `https://tinyurl.com/api-create.php?url=${encodeURIComponent(longUrl)}`
    );

    if (!response.ok) {
        throw new Error("tinyurl-request-failed");
    }

    return (await response.text()).trim();
}

export function getQrCodeUrl(data, size = "200x200") {
    return `https://api.qrserver.com/v1/create-qr-code/?size=${size}&data=${encodeURIComponent(data)}`;
}

function extractPublicId(url) {

    if (typeof url !== "string") {
        console.error("❌ extractPublicId received a non-string value:", url);
        return null;
    }

    const pattern = /\/v\d+\/(.+)$/;
    const match = url.match(pattern);
    if (match) {
        return match[1].split('.')[0]; // Remove file extension
    }

    return null;
}

export default extractPublicId
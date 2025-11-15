export function parseRecommendations(text) {
    return text.split(/\d+\.\s+/).slice(1).map(item => item.trim().replace(/[\r\n]+/g, ' '));
}
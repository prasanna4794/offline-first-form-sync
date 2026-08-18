export function generateFormId() {
    return `form-${Date.now()}-${Math.random()
        .toString(36)
        .substring(2, 8)}`;
}
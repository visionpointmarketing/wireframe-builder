// Singleton image store — keeps base64/URL data outside the history system
const store = new Map();

export function generateImageKey() {
    return 'img_' + Date.now() + '_' + Math.random().toString(36).substr(2, 6);
}

export function setImage(key, data) {
    store.set(key, data);
}

export function getImage(key) {
    return store.get(key);
}

export function removeImage(key) {
    store.delete(key);
}

/** Collect all image data referenced by current sections for JSON export */
export function exportImages(sections) {
    const map = {};
    for (const section of sections) {
        const images = section.content && section.content.images;
        if (!images) continue;
        for (const key of Object.values(images)) {
            if (key && store.has(key)) {
                map[key] = store.get(key);
            }
        }
    }
    return map;
}

/** Load images from a JSON import */
export function importImages(map) {
    if (!map || typeof map !== 'object') return;
    for (const [key, data] of Object.entries(map)) {
        store.set(key, data);
    }
}

/** Remove unreferenced images from the store */
export function gc(sections) {
    const referenced = new Set();
    for (const section of sections) {
        const images = section.content && section.content.images;
        if (!images) continue;
        for (const key of Object.values(images)) {
            if (key) referenced.add(key);
        }
    }
    for (const key of store.keys()) {
        if (!referenced.has(key)) {
            store.delete(key);
        }
    }
}

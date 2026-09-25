const PROJECT_IMAGE_FALLBACKS = {
  "clutch time": "/projects/clutch-time.png",
  "outdoor adventure": "/projects/outdoor-adventure.png",
  "pau playground": "/projects/pau-playground.png",
  "afrik food": "/projects/afrik-food.png",
  "cape town mountain": "/projects/cape-town-mountain.png",
  "osmow blog": "/projects/osmow-blog.png",
};

function normalizeProjectTitle(title) {
  return String(title || "")
    .trim()
    .toLowerCase();
}

export function getProjectImageFallback(project) {
  return PROJECT_IMAGE_FALLBACKS[normalizeProjectTitle(project?.title)] || "";
}

export function getProjectImageSource(project) {
  const image = String(project?.image || "").trim();
  const fallback = getProjectImageFallback(project);

  if (!image || image.includes("/uploads/")) {
    return fallback || image;
  }

  return image;
}

export function applyProjectImageFallback(event, project) {
  const fallback = getProjectImageFallback(project);

  if (!fallback || event.currentTarget.src.endsWith(fallback)) {
    return;
  }

  event.currentTarget.src = fallback;
}

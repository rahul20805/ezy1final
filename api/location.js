// Server-side Geocoding & Reverse Geocoding Proxy
// Uses OpenStreetMap Nominatim with caching, User-Agent, and standard Indian address parsing.

const cache = new Map();
const CACHE_TTL_MS = 1000 * 60 * 60 * 24; // 24 hours

function getCached(key) {
  const item = cache.get(key);
  if (!item) return null;
  if (Date.now() - item.timestamp > CACHE_TTL_MS) {
    cache.delete(key);
    return null;
  }
  return item.data;
}

function setCached(key, data) {
  if (cache.size > 1000) {
    // Clear oldest 200 entries if cache grows large
    const iter = cache.keys();
    for (let i = 0; i < 200; i++) {
      cache.delete(iter.next().value);
    }
  }
  cache.set(key, { data, timestamp: Date.now() });
}

export async function reverseGeocode(lat, lng) {
  const latitude = parseFloat(lat);
  const longitude = parseFloat(lng);

  if (isNaN(latitude) || isNaN(longitude)) {
    throw new Error("Invalid coordinates provided.");
  }

  // Round coordinates to 5 decimal places for caching (~1 meter precision)
  const cacheKey = `rev_${latitude.toFixed(5)}_${longitude.toFixed(5)}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  const url = `https://nominatim.openstreetmap.org/reverse?format=jsonv2&lat=${latitude}&lon=${longitude}&addressdetails=1`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Ezy1-Production-Location-Service/1.0 (contact: support@ezy1.site)",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Geocoding service returned HTTP ${response.status}`);
  }

  const data = await response.json();
  const addr = data.address || {};

  const locality =
    addr.suburb ||
    addr.neighbourhood ||
    addr.residential ||
    addr.subdistrict ||
    addr.quarter ||
    "";

  const city =
    addr.city ||
    addr.town ||
    addr.village ||
    addr.municipality ||
    addr.county ||
    "";

  const district = addr.state_district || addr.county || city;
  const state = addr.state || "";
  const pincode = addr.postcode || "";
  const country = addr.country || "India";

  const road = addr.road || addr.street || "";
  const building = addr.building || addr.house_number || addr.amenity || "";

  const addressLine1 = building || road || locality || "Location Landmark";
  const addressLine2 = road && building ? road : locality || city;

  // Build a clean, readable formatted address
  const parts = [
    addressLine1,
    addressLine2 !== addressLine1 ? addressLine2 : "",
    locality !== addressLine1 && locality !== addressLine2 ? locality : "",
    city,
    state,
    pincode,
  ].filter(Boolean);

  const formattedAddress = data.display_name || parts.join(", ");

  const result = {
    addressLine1,
    addressLine2,
    locality,
    city,
    district,
    state,
    pincode,
    country,
    latitude,
    longitude,
    formattedAddress,
    source: "gps",
    accuracy: null,
  };

  setCached(cacheKey, result);
  return result;
}

export async function searchAddress(query) {
  if (!query || typeof query !== "string" || !query.trim()) {
    return [];
  }

  const trimmed = query.trim();
  const cacheKey = `search_${trimmed.toLowerCase()}`;
  const cached = getCached(cacheKey);
  if (cached) return cached;

  // Append India countrycodes for high relevance if Indian location
  const url = `https://nominatim.openstreetmap.org/search?format=jsonv2&q=${encodeURIComponent(
    trimmed
  )}&addressdetails=1&countrycodes=in&limit=8`;

  const response = await fetch(url, {
    headers: {
      "User-Agent": "Ezy1-Production-Location-Service/1.0 (contact: support@ezy1.site)",
      Accept: "application/json",
    },
  });

  if (!response.ok) {
    throw new Error(`Search service returned HTTP ${response.status}`);
  }

  const data = await response.json();
  if (!Array.isArray(data)) return [];

  const results = data.map((item) => {
    const addr = item.address || {};
    const city = addr.city || addr.town || addr.village || addr.county || "";
    const state = addr.state || "";
    const pincode = addr.postcode || "";
    const locality = addr.suburb || addr.neighbourhood || addr.subdistrict || "";

    return {
      addressLine1: addr.road || addr.building || item.name || "",
      addressLine2: locality || city,
      locality,
      city,
      district: addr.state_district || city,
      state,
      pincode,
      country: addr.country || "India",
      latitude: parseFloat(item.lat),
      longitude: parseFloat(item.lon),
      formattedAddress: item.display_name,
      source: "manual",
      accuracy: null,
    };
  });

  setCached(cacheKey, results);
  return results;
}

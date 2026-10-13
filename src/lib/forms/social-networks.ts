export const SOCIAL_NETWORK_PLATFORMS = [
  { value: "instagram", label: "Instagram", baseUrl: "https://www.instagram.com/" },
  { value: "x", label: "X", baseUrl: "https://x.com/" },
  { value: "snapchat", label: "Snapchat", baseUrl: "https://www.snapchat.com/add/" },
  { value: "tiktok", label: "TikTok", baseUrl: "https://www.tiktok.com/@" },
  { value: "youtube", label: "YouTube", baseUrl: "https://www.youtube.com/@" },
  { value: "facebook", label: "Facebook", baseUrl: "https://www.facebook.com/" },
  { value: "linkedin", label: "LinkedIn", baseUrl: "https://www.linkedin.com/in/" },
  { value: "twitch", label: "Twitch", baseUrl: "https://www.twitch.tv/" },
] as const;

export const MAX_SOCIAL_PROFILES = SOCIAL_NETWORK_PLATFORMS.length;

export type SocialNetworkPlatform = (typeof SOCIAL_NETWORK_PLATFORMS)[number]["value"];

export type SocialProfile = {
  platform: SocialNetworkPlatform;
  username: string;
};

const platformValues = new Set<string>(
  SOCIAL_NETWORK_PLATFORMS.map((platform) => platform.value),
);
const usernamePattern = /^[a-zA-Z0-9._-]{1,60}$/;

export function sanitizeSocialUsername(value: string) {
  return value
    .trimStart()
    .replace(/^@+/, "")
    .replace(/[^a-zA-Z0-9._-]/g, "")
    .slice(0, 60);
}

export function serializeSocialProfiles(profiles: readonly SocialProfile[]) {
  const completedProfiles = profiles
    .map((profile) => ({
      platform: profile.platform,
      username: sanitizeSocialUsername(profile.username),
    }))
    .filter((profile) => profile.username.length > 0);

  return completedProfiles.length > 0 ? JSON.stringify(completedProfiles) : "";
}

export function parseSocialProfiles(value: string | null | undefined): SocialProfile[] {
  if (!value) return [];

  try {
    const profiles: unknown = JSON.parse(value);
    if (!Array.isArray(profiles) || profiles.length > MAX_SOCIAL_PROFILES) return [];

    const validated = profiles.filter(
      (profile): profile is SocialProfile =>
        typeof profile === "object"
        && profile !== null
        && "platform" in profile
        && typeof profile.platform === "string"
        && platformValues.has(profile.platform)
        && "username" in profile
        && typeof profile.username === "string"
        && usernamePattern.test(profile.username),
    );

    return validated.length === profiles.length ? validated : [];
  } catch {
    return [];
  }
}

export function isValidSocialProfilesValue(value: string) {
  if (!value.trim()) return true;
  const profiles = parseSocialProfiles(value);
  return profiles.length > 0 && serializeSocialProfiles(profiles) === value.trim();
}

export function getSocialProfileUrl(profile: SocialProfile) {
  const platform = SOCIAL_NETWORK_PLATFORMS.find(
    (candidate) => candidate.value === profile.platform,
  );
  return platform ? `${platform.baseUrl}${encodeURIComponent(profile.username)}` : "";
}

export function getSocialPlatformLabel(platform: SocialNetworkPlatform) {
  return SOCIAL_NETWORK_PLATFORMS.find((candidate) => candidate.value === platform)?.label ?? platform;
}

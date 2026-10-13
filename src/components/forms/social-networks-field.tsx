"use client";

import {
  Camera,
  ChevronDown,
  Ghost,
  MessageSquare,
  Music2,
  Play,
  Plus,
  Trash2,
} from "lucide-react";
import { useId, useRef, useState, type ReactNode } from "react";
import { Input } from "@/components/ui/input";
import { InternalSelect } from "@/components/ui/internal-select";
import {
  MAX_SOCIAL_PROFILES,
  SOCIAL_NETWORK_PLATFORMS,
  parseSocialProfiles,
  sanitizeSocialUsername,
  serializeSocialProfiles,
  type SocialNetworkPlatform,
  type SocialProfile,
} from "@/lib/forms/social-networks";

type EditableSocialProfile = SocialProfile & { id: number };

function SocialPlatformIcon({ platform }: { platform: SocialNetworkPlatform }) {
  const commonClassName = "size-5";
  const icons: Record<SocialNetworkPlatform, ReactNode> = {
    instagram: <Camera className={commonClassName} />,
    x: <span className="grid size-5 place-items-center text-sm font-black">X</span>,
    snapchat: <Ghost className={commonClassName} />,
    tiktok: <Music2 className={commonClassName} />,
    youtube: <Play className={commonClassName} />,
    facebook: <span className="grid size-5 place-items-center text-lg font-black">f</span>,
    linkedin: <span className="grid size-5 place-items-center text-xs font-black">in</span>,
    twitch: <MessageSquare className={commonClassName} />,
  };

  return icons[platform];
}

const socialNetworkOptions = SOCIAL_NETWORK_PLATFORMS.map((platform) => ({
  value: platform.value,
  label: platform.label,
  icon: <SocialPlatformIcon key={platform.value} platform={platform.value} />,
}));

export function SocialNetworksField({
  initialValue,
  error,
}: {
  initialValue?: string | null;
  error?: string;
}) {
  const initialProfiles = parseSocialProfiles(initialValue);
  const [profiles, setProfiles] = useState<EditableSocialProfile[]>(() => (
    initialProfiles.length > 0
      ? initialProfiles.map((profile, index) => ({ ...profile, id: index }))
      : [{ id: 0, platform: "instagram", username: "" }]
  ));
  const [isOpen, setIsOpen] = useState(Boolean(error));
  const nextId = useRef(Math.max(initialProfiles.length, 1));
  const fieldId = useId();

  const addProfile = () => {
    if (profiles.length >= MAX_SOCIAL_PROFILES) return;
    const unusedPlatform = SOCIAL_NETWORK_PLATFORMS.find(
      (platform) => !profiles.some((profile) => profile.platform === platform.value),
    );

    setProfiles((current) => [
      ...current,
      {
        id: nextId.current++,
        platform: unusedPlatform?.value ?? "instagram",
        username: "",
      },
    ]);
  };

  const updateProfile = (id: number, update: Partial<SocialProfile>) => {
    setProfiles((current) => current.map((profile) => (
      profile.id === id ? { ...profile, ...update } : profile
    )));
  };

  const removeProfile = (id: number) => {
    setProfiles((current) => current.filter((profile) => profile.id !== id));
  };

  const completedCount = profiles.filter((profile) => profile.username.length > 0).length;
  const serializedValue = serializeSocialProfiles(profiles);
  const shouldShowDetails = isOpen || Boolean(error);

  return (
    <section aria-labelledby={`${fieldId}-label`}>
      <input type="hidden" id="socialNetworks" name="socialNetworks" value={serializedValue} />
      <details
        open={shouldShowDetails}
        onToggle={(event) => {
          const nextOpen = event.currentTarget.open;
          setIsOpen(nextOpen);
        }}
        className="border border-border-strong bg-surface"
      >
        <summary
          id={`${fieldId}-label`}
          aria-describedby={error ? "socialNetworks-error" : `${fieldId}-description`}
          aria-invalid={Boolean(error) || undefined}
          className="flex min-h-14 cursor-pointer list-none items-center justify-between gap-4 px-4 font-bold [&::-webkit-details-marker]:hidden"
        >
          <span>
            Redes sociales <span className="font-normal text-muted">(opcional)</span>
            <span className="mt-0.5 block text-xs font-normal text-muted">
              {completedCount > 0
                ? `${completedCount} ${completedCount === 1 ? "perfil añadido" : "perfiles añadidos"}`
                : "Añade solo las que quieras compartir"}
            </span>
          </span>
          <ChevronDown
            aria-hidden="true"
            className={`size-5 shrink-0 text-muted transition-transform ${shouldShowDetails ? "rotate-180" : ""}`}
          />
        </summary>

        <div className="grid gap-4 border-t border-border p-4">
          <p id={`${fieldId}-description`} className="text-sm leading-6 text-muted">
            Elige una red y escribe únicamente tu usuario. La dirección se completa automáticamente.
          </p>

          {profiles.map((profile, index) => {
            const platform = SOCIAL_NETWORK_PLATFORMS.find(
              (candidate) => candidate.value === profile.platform,
            ) ?? SOCIAL_NETWORK_PLATFORMS[0];
            const usernameId = `${fieldId}-username-${profile.id}`;

            return (
              <div
                key={profile.id}
                className="grid min-w-0 gap-2 border-t border-border pt-4 first:border-t-0 first:pt-0 sm:grid-cols-[11rem_minmax(0,1fr)_3rem]"
              >
                <InternalSelect
                  id={`${fieldId}-platform-${profile.id}`}
                  options={socialNetworkOptions}
                  value={profile.platform}
                  onValueChange={(value) => updateProfile(profile.id, {
                    platform: value as SocialNetworkPlatform,
                  })}
                  ariaLabel={`Red social ${index + 1}`}
                />
                <div className="flex min-w-0 items-stretch rounded-[var(--radius-md)] border border-border-strong bg-surface focus-within:border-primary">
                  <span className="flex max-w-[55%] items-center border-r border-border bg-surface-muted px-3 text-xs text-muted sm:max-w-none">
                    <span className="truncate">{platform.baseUrl}</span>
                  </span>
                  <Input
                    id={usernameId}
                    aria-label={`Usuario de ${platform.label}`}
                    value={profile.username}
                    onChange={(event) => updateProfile(profile.id, {
                      username: sanitizeSocialUsername(event.currentTarget.value),
                    })}
                    placeholder="tu_usuario"
                    autoComplete="off"
                    className="min-w-0 rounded-none border-0 focus:outline-none"
                  />
                </div>
                <button
                  type="button"
                  aria-label={`Eliminar ${platform.label}`}
                  onClick={() => removeProfile(profile.id)}
                  className="grid size-12 place-items-center justify-self-end text-muted transition-colors hover:bg-danger-soft hover:text-danger sm:justify-self-auto"
                >
                  <Trash2 aria-hidden="true" className="size-5" />
                </button>
              </div>
            );
          })}

          {profiles.length === 0 ? (
            <p className="text-sm text-muted">No has añadido ningún perfil.</p>
          ) : null}

          <button
            type="button"
            onClick={addProfile}
            disabled={profiles.length >= MAX_SOCIAL_PROFILES}
            className="flex min-h-11 w-fit items-center gap-2 font-bold text-primary transition-colors hover:text-primary-hover disabled:cursor-not-allowed disabled:text-muted"
          >
            <Plus aria-hidden="true" className="size-5" />
            Añadir otra red
          </button>
        </div>
      </details>
      {error ? (
        <p id="socialNetworks-error" className="field-error mt-2 text-sm font-medium text-danger" role="alert">
          {error}
        </p>
      ) : null}
    </section>
  );
}

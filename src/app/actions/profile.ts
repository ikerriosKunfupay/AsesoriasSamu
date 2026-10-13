"use server";

import { revalidatePath } from "next/cache";
import type { ActionState } from "@/lib/forms/action-state";
import { fieldErrors, profileSettingsSchema } from "@/lib/forms/schemas";
import {
  requireAdmin,
  requireCompletedClient,
  type CurrentUser,
} from "@/lib/auth/current-user";
import { createClient } from "@/lib/supabase/server";

const AVATAR_BUCKET = "profile-avatars";
const MAX_AVATAR_SIZE = 2 * 1024 * 1024;
const AVATAR_TYPES = new Set(["image/jpeg", "image/png", "image/webp"]);

type ProfileSurface = "admin" | "client";

function revalidateProfileSurfaces(userId: string, surface: ProfileSurface) {
  if (surface === "admin") {
    revalidatePath("/admin", "layout");
    revalidatePath("/admin/perfil");
    return;
  }

  revalidatePath("/app", "layout");
  revalidatePath("/app/ajustes");
  revalidatePath(`/admin/clientes/${userId}`);
}

async function updateOwnProfile(
  user: CurrentUser,
  surface: ProfileSurface,
  formData: FormData,
): Promise<ActionState> {
  const supabase = await createClient();

  if (formData.get("intent") === "removeAvatar") {
    if (!user.avatarPath) {
      return { status: "success", message: "La foto de perfil ya estaba vacía." };
    }

    const { error: profileError } = await supabase
      .from("profiles")
      .update({ avatar_path: null })
      .eq("id", user.id);

    if (profileError) {
      return { status: "error", message: "No se pudo quitar la foto de perfil." };
    }

    await supabase.storage.from(AVATAR_BUCKET).remove([user.avatarPath]);
    revalidateProfileSurfaces(user.id, surface);

    return { status: "success", message: "Foto eliminada. Volvemos a mostrar tus iniciales." };
  }

  const parsed = profileSettingsSchema.safeParse({
    fullName: formData.get("fullName"),
    phone: formData.get("phone"),
  });

  if (!parsed.success) {
    return {
      status: "error",
      message: "Revisa los datos del perfil.",
      fieldErrors: fieldErrors(parsed.error),
    };
  }

  const avatar = formData.get("avatar");
  if (avatar instanceof File && avatar.size > 0) {
    if (!AVATAR_TYPES.has(avatar.type)) {
      return {
        status: "error",
        message: "La foto debe ser JPG, PNG o WebP.",
        fieldErrors: { avatar: ["Selecciona una imagen JPG, PNG o WebP."] },
      };
    }
    if (avatar.size > MAX_AVATAR_SIZE) {
      return {
        status: "error",
        message: "La foto supera el límite de 2 MB.",
        fieldErrors: { avatar: ["La imagen debe ocupar como máximo 2 MB."] },
      };
    }
  }

  let avatarPath: string | undefined;

  if (avatar instanceof File && avatar.size > 0) {
    avatarPath = `${user.id}/avatar`;
    const { error: uploadError } = await supabase.storage
      .from(AVATAR_BUCKET)
      .upload(avatarPath, avatar, {
        cacheControl: "3600",
        contentType: avatar.type,
        upsert: true,
      });

    if (uploadError) {
      return {
        status: "error",
        message: "No se pudo guardar la foto de perfil.",
        fieldErrors: { avatar: ["Prueba con otra imagen o inténtalo de nuevo."] },
      };
    }
  }

  const profileUpdate = {
    full_name: parsed.data.fullName,
    phone: parsed.data.phone || null,
    ...(avatarPath ? { avatar_path: avatarPath } : {}),
  };
  const { error: profileError } = await supabase
    .from("profiles")
    .update(profileUpdate)
    .eq("id", user.id);

  if (profileError) {
    return { status: "error", message: "No se pudieron guardar los datos del perfil." };
  }

  revalidateProfileSurfaces(user.id, surface);

  return { status: "success", message: "Perfil actualizado correctamente." };
}

export async function updateProfileAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireCompletedClient();
  return updateOwnProfile(user, "client", formData);
}

export async function updateAdminProfileAction(
  _previous: ActionState,
  formData: FormData,
): Promise<ActionState> {
  const user = await requireAdmin();
  return updateOwnProfile(user, "admin", formData);
}

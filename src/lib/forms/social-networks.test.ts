import { describe, expect, it } from "vitest";
import {
  getSocialProfileUrl,
  isValidSocialProfilesValue,
  parseSocialProfiles,
  sanitizeSocialUsername,
  serializeSocialProfiles,
} from "./social-networks";

describe("perfiles sociales", () => {
  it("serializa y recupera únicamente la red y el usuario", () => {
    const value = serializeSocialProfiles([
      { platform: "instagram", username: "team.ortega" },
      { platform: "x", username: "" },
    ]);

    expect(value).toBe('[{"platform":"instagram","username":"team.ortega"}]');
    expect(parseSocialProfiles(value)).toEqual([
      { platform: "instagram", username: "team.ortega" },
    ]);
    expect(isValidSocialProfilesValue(value)).toBe(true);
  });

  it("limpia el prefijo y los caracteres que no pertenecen a un usuario", () => {
    expect(sanitizeSocialUsername("@@team ortega/!")).toBe("teamortega");
  });

  it("construye una URL segura desde la plataforma conocida", () => {
    expect(getSocialProfileUrl({ platform: "snapchat", username: "team_ortega" }))
      .toBe("https://www.snapchat.com/add/team_ortega");
  });

  it("rechaza valores manipulados o plataformas desconocidas", () => {
    expect(isValidSocialProfilesValue("texto libre")).toBe(false);
    expect(isValidSocialProfilesValue('[{"platform":"otra","username":"usuario"}]'))
      .toBe(false);
  });
});

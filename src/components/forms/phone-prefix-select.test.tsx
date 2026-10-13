import { cleanup, fireEvent, render, screen } from "@testing-library/react";
import { afterEach, describe, expect, it, vi } from "vitest";
import { PhonePrefixSelect } from "./phone-prefix-select";
import { formatPhoneValue, formatStoredPhoneValue, splitPhoneValue } from "@/lib/forms/phone";

afterEach(cleanup);

describe("PhonePrefixSelect", () => {
  it("muestra los prefijos dentro de un listbox propio y permite elegirlos", () => {
    const onChange = vi.fn();
    render(<PhonePrefixSelect value="+34" onChange={onChange} />);

    fireEvent.click(screen.getByRole("button", { name: "Prefijo telefónico, ES +34" }));
    expect(screen.getByRole("listbox", { name: "Prefijos telefónicos" })).toBeVisible();

    fireEvent.click(screen.getByRole("option", { name: "PT +351" }));
    expect(onChange).toHaveBeenCalledWith("+351");
    expect(screen.queryByRole("listbox")).not.toBeInTheDocument();
  });

  it("separa números existentes y los vuelve a guardar con un único prefijo", () => {
    expect(splitPhoneValue("+351 912 345 678")).toEqual({
      prefix: "+351",
      phoneNumber: "912 345 678",
    });
    expect(splitPhoneValue("60224824")).toEqual({
      prefix: "+34",
      phoneNumber: "60224824",
    });
    expect(formatPhoneValue("+34", "602 248 248")).toBe("+34 602 248 248");
    expect(formatPhoneValue("+34", "")).toBe("");
    expect(formatStoredPhoneValue("60224824")).toBe("+34 60224824");
    expect(formatStoredPhoneValue("+351 912 345 678")).toBe("+351 912 345 678");
  });
});

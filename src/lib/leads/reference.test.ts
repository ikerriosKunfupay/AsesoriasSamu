import { describe, expect, it } from "vitest";
import { leadReference } from "./reference";

describe("leadReference", () => {
  it("genera una referencia breve y estable a partir del UUID", () => {
    expect(leadReference("550e8400-e29b-41d4-a716-446655440000")).toBe("550E8400");
  });
});

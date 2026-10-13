import { describe, expect, it } from "vitest";
import { emptyFeeFilters, filterFees, type AdminFee } from "./fees";

const fees: AdminFee[] = [
  { id: "1", clientId: "c1", clientName: "Iker Ríos", period: "2026-10", amountEur: 250, status: "paid", notes: "Transferencia" },
  { id: "2", clientId: "c2", clientName: "Álvaro Ruiz", period: "2026-09", amountEur: 80, status: "pending", notes: "Revisar" },
  { id: "3", clientId: "c3", clientName: "Lucía Pérez", period: "2026-10", amountEur: 120, status: "waived", notes: "" },
];

describe("filterFees", () => {
  it("filtra sin distinguir tildes y combina periodo, estado e importe", () => {
    expect(filterFees(fees, { ...emptyFeeFilters, query: "alvaro" })).toEqual([fees[1]]);
    expect(filterFees(fees, {
      ...emptyFeeFilters,
      period: "2026-10",
      status: "paid",
      minAmount: "200",
      maxAmount: "300",
    })).toEqual([fees[0]]);
  });

  it("permite localizar contenido de la nota", () => {
    expect(filterFees(fees, { ...emptyFeeFilters, query: "transferencia" })).toEqual([fees[0]]);
  });
});

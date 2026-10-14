import { describe, expect, it } from "vitest";
import { emptyFeeFilters, filterAndSortFees, nextFeeSort, type AdminFee } from "./fees";

const fees: AdminFee[] = [
  { id: "1", clientId: "c1", clientName: "Iker Ríos", period: "2026-10", amountEur: 250, status: "paid", notes: "Transferencia" },
  { id: "2", clientId: "c2", clientName: "Álvaro Ruiz", period: "2026-09", amountEur: 80, status: "pending", notes: "Revisar" },
  { id: "3", clientId: "c3", clientName: "Lucía Pérez", period: "2026-10", amountEur: 120, status: "waived", notes: "" },
];

describe("filterAndSortFees", () => {
  it("filtra sin distinguir tildes y combina periodo, estado e importe", () => {
    expect(filterAndSortFees(fees, { ...emptyFeeFilters, client: "alvaro" }, null)).toEqual([fees[1]]);
    expect(filterAndSortFees(fees, {
      ...emptyFeeFilters,
      period: "2026-10",
      status: "paid",
      minAmount: "200",
      maxAmount: "300",
    }, null)).toEqual([fees[0]]);
  });

  it("separa el filtro de cliente del contenido de la nota", () => {
    expect(filterAndSortFees(fees, { ...emptyFeeFilters, notes: "transferencia" }, null)).toEqual([fees[0]]);
    expect(filterAndSortFees(fees, { ...emptyFeeFilters, client: "transferencia" }, null)).toEqual([]);
  });

  it("ordena columnas en ambos sentidos y permite volver al orden original", () => {
    expect(filterAndSortFees(fees, emptyFeeFilters, { key: "amount", direction: "asc" }).map((fee) => fee.id)).toEqual(["2", "3", "1"]);
    expect(filterAndSortFees(fees, emptyFeeFilters, { key: "client", direction: "desc" }).map((fee) => fee.id)).toEqual(["3", "1", "2"]);
    const ascending = nextFeeSort(null, "period");
    const descending = nextFeeSort(ascending, "period");
    expect(ascending).toEqual({ key: "period", direction: "asc" });
    expect(descending).toEqual({ key: "period", direction: "desc" });
    expect(nextFeeSort(descending, "period")).toBeNull();
  });
});

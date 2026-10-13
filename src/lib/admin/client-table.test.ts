import { describe, expect, it } from "vitest";
import {
  filterAndSortClients,
  emptyClientTableFilters,
  nextClientTableSort,
  type ClientTableItem,
} from "./client-table";

const clients: ClientTableItem[] = [
  { id: "1", name: "Álvaro", status: "active", onboardingComplete: true, notes: "Llamar el viernes", modality: "in_person", pricingPlanId: "p1", pricingPlanName: "Mensual", billingCycle: "monthly", agreedAmountEur: 65 },
  { id: "2", name: "Bea", status: "archived", onboardingComplete: false, notes: "Prefiere las mañanas", modality: "online", pricingPlanId: "p2", pricingPlanName: "Semestral", billingCycle: "semiannual", agreedAmountEur: 300 },
  { id: "3", name: "Carlos", status: "active", onboardingComplete: false, notes: "", modality: null, pricingPlanId: null, pricingPlanName: "", billingCycle: null, agreedAmountEur: null },
];

describe("filtro y orden de clientes", () => {
  it("filtra cada columna de forma independiente", () => {
    expect(filterAndSortClients(clients, { ...emptyClientTableFilters, name: "alvaro" }, null).map((client) => client.id)).toEqual(["1"]);
    expect(filterAndSortClients(clients, { ...emptyClientTableFilters, status: "archived" }, null).map((client) => client.id)).toEqual(["2"]);
    expect(filterAndSortClients(clients, { ...emptyClientTableFilters, notes: "mananas" }, null).map((client) => client.id)).toEqual(["2"]);
    expect(filterAndSortClients(clients, { ...emptyClientTableFilters, modality: "in_person" }, null).map((client) => client.id)).toEqual(["1"]);
    expect(filterAndSortClients(clients, { ...emptyClientTableFilters, pricingPlanId: "p2" }, null).map((client) => client.id)).toEqual(["2"]);
    expect(filterAndSortClients(clients, { ...emptyClientTableFilters, minAmount: "100", maxAmount: "300" }, null).map((client) => client.id)).toEqual(["2"]);
    expect(filterAndSortClients(clients, { ...emptyClientTableFilters, questionnaire: "pending" }, null).map((client) => client.id)).toEqual(["2", "3"]);
  });

  it("ordena en ambos sentidos y conserva el orden original sin criterio", () => {
    expect(filterAndSortClients(clients, emptyClientTableFilters, { key: "name", direction: "desc" }).map((client) => client.id))
      .toEqual(["3", "2", "1"]);
    expect(filterAndSortClients(clients, emptyClientTableFilters, null).map((client) => client.id)).toEqual(["1", "2", "3"]);
    expect(filterAndSortClients(clients, emptyClientTableFilters, { key: "amount", direction: "desc" }).map((client) => client.id))
      .toEqual(["2", "1", "3"]);
  });

  it("recorre ascendente, descendente y orden original", () => {
    const ascending = nextClientTableSort(null, "notes");
    const descending = nextClientTableSort(ascending, "notes");

    expect(ascending).toEqual({ key: "notes", direction: "asc" });
    expect(descending).toEqual({ key: "notes", direction: "desc" });
    expect(nextClientTableSort(descending, "notes")).toBeNull();
  });
});

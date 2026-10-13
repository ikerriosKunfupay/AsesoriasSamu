import { describe, expect, it } from "vitest";
import {
  filterAndSortClients,
  nextClientTableSort,
  type ClientTableItem,
} from "./client-table";

const clients: ClientTableItem[] = [
  { id: "1", name: "Álvaro", status: "active", onboardingComplete: true, notes: "Llamar el viernes" },
  { id: "2", name: "Bea", status: "archived", onboardingComplete: false, notes: "Prefiere las mañanas" },
  { id: "3", name: "Carlos", status: "active", onboardingComplete: false, notes: "" },
];

describe("filtro y orden de clientes", () => {
  it("busca sin distinguir mayúsculas ni acentos en todas las columnas visibles", () => {
    expect(filterAndSortClients(clients, "alvaro", null).map((client) => client.id)).toEqual(["1"]);
    expect(filterAndSortClients(clients, "inactivo", null).map((client) => client.id)).toEqual(["2"]);
    expect(filterAndSortClients(clients, "mananas", null).map((client) => client.id)).toEqual(["2"]);
  });

  it("ordena en ambos sentidos y conserva el orden original sin criterio", () => {
    expect(filterAndSortClients(clients, "", { key: "name", direction: "desc" }).map((client) => client.id))
      .toEqual(["3", "2", "1"]);
    expect(filterAndSortClients(clients, "", null).map((client) => client.id)).toEqual(["1", "2", "3"]);
  });

  it("recorre ascendente, descendente y orden original", () => {
    const ascending = nextClientTableSort(null, "notes");
    const descending = nextClientTableSort(ascending, "notes");

    expect(ascending).toEqual({ key: "notes", direction: "asc" });
    expect(descending).toEqual({ key: "notes", direction: "desc" });
    expect(nextClientTableSort(descending, "notes")).toBeNull();
  });
});

import { createContext, useContext, useMemo, useState, type ReactNode } from "react";
import { locales, type Local } from "./demo-data";

type SelectionContextValue = {
  localId: string;
  local: Local;
  setLocalId: (id: string) => void;
};

const SelectionContext = createContext<SelectionContextValue | null>(null);

export function SelectionProvider({ children }: { children: ReactNode }) {
  const [localId, setLocalId] = useState(locales[0]!.id);

  const value = useMemo(
    () => ({
      localId,
      local: locales.find((l) => l.id === localId) ?? locales[0]!,
      setLocalId,
    }),
    [localId],
  );

  return <SelectionContext.Provider value={value}>{children}</SelectionContext.Provider>;
}

export function useSeleccion() {
  const ctx = useContext(SelectionContext);
  if (!ctx) throw new Error("useSeleccion debe usarse dentro de SelectionProvider");
  return ctx;
}

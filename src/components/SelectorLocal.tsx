import { MapPin } from "lucide-react";
import { locales, promedioLocal } from "@/lib/demo-data";
import { useSeleccion } from "@/lib/selection";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

export function SelectorLocal() {
  const { localId, local, setLocalId } = useSeleccion();


  return (
    <div className="flex min-w-0 items-center gap-2">
      <MapPin className="h-4 w-4 shrink-0 text-primary" aria-hidden />
      <Select value={localId} onValueChange={setLocalId}>
        <SelectTrigger
          className="w-[13.5rem] border-border bg-card text-sm shadow-suave"
          aria-label="Seleccionar local"
        >
          <SelectValue placeholder="Seleccionar local">
            {local.nombre} · {promedioLocal(local)}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {locales.map((l) => (
            <SelectItem key={l.id} value={l.id}>
              {l.nombre} · {promedioLocal(l)}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

"use client";

import { Check } from "lucide-react";
import { chipClass } from "@/components/ui/Chip";
import { ModuleIcon } from "@/components/ui/ModuleIcon";
import { erpModules, type ModuleId } from "@/lib/content";
import { industries, sortModules, suggestedModules, teamSizes, type Blueprint } from "@/lib/configurator";
import { setBlueprint } from "@/lib/blueprint-store";

/*
 * A legend normally sits on its fieldset's top border. Floating it at full
 * width puts it inside the padding instead; the group that follows clears it.
 */
const legend = "float-left mb-4 w-full text-caption font-semibold text-muted";
const group = "clear-both flex w-full flex-wrap gap-2";

function Chips<T extends string>({
  name,
  options,
  value,
  onChange,
}: {
  name: string;
  options: readonly { id: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className={group}>
      {options.map((o) => (
        <label key={o.id} className={chipClass}>
          <input
            type="radio"
            name={name}
            value={o.id}
            checked={value === o.id}
            onChange={() => onChange(o.id)}
            className="sr-only"
          />
          {o.label}
        </label>
      ))}
    </div>
  );
}

export function Controls({ bp }: { bp: Blueprint }) {
  const toggle = (id: ModuleId) =>
    setBlueprint((b) => ({
      ...b,
      modules: b.modules.includes(id) ? b.modules.filter((m) => m !== id) : sortModules([...b.modules, id]),
    }));

  return (
    <div className="rounded-md bg-white md:rounded-lg">
      <fieldset className="p-6">
        <legend className={legend}>Industry</legend>
        <Chips
          name="industry"
          options={industries}
          value={bp.industry}
          onChange={(industry) => setBlueprint((b) => ({ ...b, industry, modules: suggestedModules[industry] }))}
        />
      </fieldset>

      <fieldset className="border-t border-line p-6">
        <legend className={legend}>Modules</legend>
        {/* Compact wrapping pills below "xl", so the preview stays close; full rows beside the preview. */}
        <div className={`${group} xl:flex-col xl:flex-nowrap`}>
          {erpModules.map((m) => {
            const on = bp.modules.includes(m.id);
            return (
              <label key={m.id} className={`${chipClass} xl:w-full`}>
                <input type="checkbox" checked={on} onChange={() => toggle(m.id)} className="sr-only" />
                <ModuleIcon id={m.id} className="size-4 shrink-0" />
                <span className="flex-1">{m.name}</span>
                <Check
                  aria-hidden
                  strokeWidth={2.5}
                  className={`hidden size-4 shrink-0 xl:block ${on ? "opacity-100" : "opacity-0"}`}
                />
              </label>
            );
          })}
        </div>
      </fieldset>

      <fieldset className="border-t border-line p-6">
        <legend className={legend}>Team size</legend>
        <Chips
          name="size"
          options={teamSizes}
          value={bp.size}
          onChange={(size) => setBlueprint((b) => ({ ...b, size }))}
        />
      </fieldset>
    </div>
  );
}

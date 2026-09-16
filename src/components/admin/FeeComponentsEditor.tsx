import { Plus, Trash2, GripVertical } from 'lucide-react';

export type FeeComponent = {
  id: string;
  label: string;
  amount: number;
  description?: string;
  sort_order?: number;
};

export type FeeInstallment = {
  id: string;
  label: string;
  amount: string;
};

export type ProgramFees = {
  currency?: string;
  total?: string | null;
  cycle?: string;
  components?: FeeComponent[];
  installments?: FeeInstallment[];
  connectedFees?: string;
  labotech?: string;
  infirmary?: string;
  firstInstallment?: string;
  secondInstallment?: string;
  thirdInstallment?: string;
};

function newId() {
  if (typeof crypto !== 'undefined' && crypto.randomUUID) return crypto.randomUUID();
  return `fee-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`;
}

function formatTotal(components: FeeComponent[], currency: string) {
  const sum = components.reduce((s, c) => s + (Number(c.amount) || 0), 0);
  return `${sum.toLocaleString('fr-FR', { maximumFractionDigits: 2 })} ${currency}`.trim();
}

type Props = {
  value: ProgramFees | null | undefined;
  onChange: (fees: ProgramFees) => void;
};

export function FeeComponentsEditor({ value, onChange }: Props) {
  const currency = value?.currency || '$';
  const components = Array.isArray(value?.components) ? value!.components! : [];
  const installments = Array.isArray(value?.installments) ? value!.installments! : [];
  const total = formatTotal(components, currency);

  const emit = (next: Partial<ProgramFees> & { components?: FeeComponent[] }) => {
    const comps = next.components ?? components;
    onChange({
      currency,
      cycle: value?.cycle || '',
      ...value,
      ...next,
      components: comps,
      total: formatTotal(comps, next.currency || currency),
    });
  };

  const updateComponent = (id: string, patch: Partial<FeeComponent>) => {
    emit({
      components: components.map((c) => (c.id === id ? { ...c, ...patch } : c)),
    });
  };

  const addComponent = () => {
    emit({
      components: [
        ...components,
        { id: newId(), label: '', amount: 0, description: '', sort_order: components.length },
      ],
    });
  };

  const removeComponent = (id: string) => {
    emit({
      components: components
        .filter((c) => c.id !== id)
        .map((c, i) => ({ ...c, sort_order: i })),
    });
  };

  const moveComponent = (index: number, dir: -1 | 1) => {
    const target = index + dir;
    if (target < 0 || target >= components.length) return;
    const next = [...components];
    [next[index], next[target]] = [next[target], next[index]];
    emit({ components: next.map((c, i) => ({ ...c, sort_order: i })) });
  };

  const updateInstallment = (id: string, patch: Partial<FeeInstallment>) => {
    emit({
      installments: installments.map((i) => (i.id === id ? { ...i, ...patch } : i)),
    });
  };

  const addInstallment = () => {
    emit({
      installments: [
        ...installments,
        { id: newId(), label: `${installments.length + 1}ère tranche`, amount: '' },
      ],
    });
  };

  const removeInstallment = (id: string) => {
    emit({ installments: installments.filter((i) => i.id !== id) });
  };

  return (
    <div className="sm:col-span-2 space-y-4 rounded-2xl border border-border bg-card/60 p-4">
      <div className="flex flex-wrap items-end justify-between gap-3">
        <div>
          <h4 className="font-semibold text-sm">Composition du prix</h4>
          <p className="text-xs text-muted-foreground mt-0.5">
            Le total est calculé automatiquement à partir des composantes.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <label className="text-xs font-semibold text-muted-foreground">Devise</label>
          <input
            value={currency}
            onChange={(e) => emit({ currency: e.target.value.slice(0, 8) || '$' })}
            className="w-16 px-2 py-1.5 rounded-lg border border-border bg-background text-sm font-semibold"
          />
        </div>
      </div>

      <div className="space-y-3">
        {components.length === 0 && (
          <p className="text-xs text-muted-foreground rounded-xl border border-dashed border-border px-3 py-4 text-center">
            Aucune composante. Ajoutez par exemple : frais d&apos;inscription, formation, matériel…
          </p>
        )}
        {components.map((c, index) => (
          <div
            key={c.id}
            className="rounded-xl border border-border bg-background p-3 space-y-2"
          >
            <div className="flex items-start gap-2">
              <div className="flex flex-col gap-1 pt-1 shrink-0">
                <button
                  type="button"
                  aria-label="Monter"
                  disabled={index === 0}
                  onClick={() => moveComponent(index, -1)}
                  className="size-7 rounded-md border border-border text-muted-foreground disabled:opacity-30 hover:bg-surface"
                >
                  <GripVertical className="size-3.5 mx-auto rotate-90" />
                </button>
              </div>
              <div className="flex-1 min-w-0 grid sm:grid-cols-[1fr_120px] gap-2">
                <input
                  value={c.label}
                  onChange={(e) => updateComponent(c.id, { label: e.target.value })}
                  placeholder="Nom de la composante"
                  className="w-full min-w-0 px-3 py-2 rounded-lg border border-border bg-card text-sm"
                />
                <input
                  type="number"
                  min={0}
                  step="0.01"
                  value={Number.isFinite(c.amount) ? c.amount : 0}
                  onChange={(e) =>
                    updateComponent(c.id, { amount: Number.parseFloat(e.target.value) || 0 })
                  }
                  placeholder="Montant"
                  className="w-full px-3 py-2 rounded-lg border border-border bg-card text-sm"
                />
              </div>
              <button
                type="button"
                aria-label="Supprimer"
                onClick={() => removeComponent(c.id)}
                className="size-9 shrink-0 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10"
              >
                <Trash2 className="size-4 mx-auto" />
              </button>
            </div>
            <input
              value={c.description || ''}
              onChange={(e) => updateComponent(c.id, { description: e.target.value })}
              placeholder="Description (optionnelle)"
              className="w-full px-3 py-2 rounded-lg border border-border bg-card text-xs text-muted-foreground"
            />
          </div>
        ))}
      </div>

      <div className="flex flex-wrap items-center justify-between gap-3">
        <button
          type="button"
          onClick={addComponent}
          className="inline-flex items-center gap-1.5 px-3 py-2 rounded-xl border border-border text-xs font-semibold hover:bg-surface"
        >
          <Plus className="size-3.5" />
          Ajouter une composante
        </button>
        <div className="text-sm font-bold text-primary">
          TOTAL : {total}
        </div>
      </div>

      <div className="border-t border-border pt-4 space-y-3">
        <div className="flex items-center justify-between gap-2">
          <h4 className="font-semibold text-sm">Tranches de paiement (optionnel)</h4>
          <button
            type="button"
            onClick={addInstallment}
            className="inline-flex items-center gap-1 text-xs font-semibold text-primary"
          >
            <Plus className="size-3.5" /> Ajouter
          </button>
        </div>
        {installments.map((inst) => (
          <div key={inst.id} className="flex gap-2">
            <input
              value={inst.label}
              onChange={(e) => updateInstallment(inst.id, { label: e.target.value })}
              placeholder="Libellé"
              className="flex-1 min-w-0 px-3 py-2 rounded-lg border border-border bg-card text-sm"
            />
            <input
              value={inst.amount}
              onChange={(e) => updateInstallment(inst.id, { amount: e.target.value })}
              placeholder="Montant"
              className="w-28 px-3 py-2 rounded-lg border border-border bg-card text-sm"
            />
            <button
              type="button"
              aria-label="Supprimer la tranche"
              onClick={() => removeInstallment(inst.id)}
              className="size-9 shrink-0 rounded-lg border border-destructive/30 text-destructive hover:bg-destructive/10"
            >
              <Trash2 className="size-4 mx-auto" />
            </button>
          </div>
        ))}
      </div>

      <div>
        <label className="text-xs font-semibold uppercase text-muted-foreground">Cycle</label>
        <input
          value={value?.cycle || ''}
          onChange={(e) => emit({ cycle: e.target.value })}
          placeholder="Ex. Cycle complet"
          className="mt-1 w-full px-3 py-2 rounded-lg border border-border bg-card text-sm"
        />
      </div>
    </div>
  );
}

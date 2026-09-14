import { useEffect, useState } from 'react';
import { schoolService } from '@/features/school/school.service';
import type { Classe, Cycle, Domaine, Niveau, Option } from '@/api/types';

export interface ClassSelection {
  cycleId: number | null;
  domaineId: number | null;
  niveauId: number | null;
  optionId: number | null;
  classeId: number | null;
}

interface ClassSelectorProps {
  value: ClassSelection;
  onChange: (selection: ClassSelection, classe?: Classe) => void;
  disabled?: boolean;
}

export function ClassSelector({ value, onChange, disabled }: ClassSelectorProps) {
  const [cycles, setCycles] = useState<Cycle[]>([]);
  const [domaines, setDomaines] = useState<Domaine[]>([]);
  const [niveaux, setNiveaux] = useState<Niveau[]>([]);
  const [options, setOptions] = useState<Option[]>([]);
  const [classes, setClasses] = useState<Classe[]>([]);
  const [loading, setLoading] = useState({
    cycles: false,
    domaines: false,
    niveaux: false,
    options: false,
    classes: false,
  });

  useEffect(() => {
    setLoading((s) => ({ ...s, cycles: true }));
    schoolService
      .getCycles()
      .then(setCycles)
      .catch(() => setCycles([]))
      .finally(() => setLoading((s) => ({ ...s, cycles: false })));
  }, []);

  useEffect(() => {
    if (!value.cycleId) {
      setDomaines([]);
      return;
    }
    setLoading((s) => ({ ...s, domaines: true }));
    schoolService
      .getDomaines(value.cycleId)
      .then((d) => {
        setDomaines(d);
        if (d.length === 0) {
          schoolService
            .getNiveaux({ cycle: value.cycleId! })
            .then(setNiveaux)
            .finally(() => setLoading((s) => ({ ...s, niveaux: false })));
        }
      })
      .catch(() => setDomaines([]))
      .finally(() => setLoading((s) => ({ ...s, domaines: false })));
  }, [value.cycleId]);

  useEffect(() => {
    if (!value.cycleId) {
      setNiveaux([]);
      return;
    }
    if (domaines.length > 0 && !value.domaineId) {
      setNiveaux([]);
      return;
    }
    setLoading((s) => ({ ...s, niveaux: true }));
    schoolService
      .getNiveaux({
        cycle: value.cycleId,
        domaine: value.domaineId ?? undefined,
      })
      .then(setNiveaux)
      .catch(() => setNiveaux([]))
      .finally(() => setLoading((s) => ({ ...s, niveaux: false })));
  }, [value.cycleId, value.domaineId, domaines.length]);

  useEffect(() => {
    if (!value.niveauId) {
      setOptions([]);
      return;
    }
    setLoading((s) => ({ ...s, options: true }));
    schoolService
      .getOptions(value.niveauId)
      .then(setOptions)
      .catch(() => setOptions([]))
      .finally(() => setLoading((s) => ({ ...s, options: false })));
  }, [value.niveauId]);

  useEffect(() => {
    if (!value.niveauId) {
      setClasses([]);
      return;
    }
    if (options.length > 0 && !value.optionId) {
      setClasses([]);
      return;
    }
    setLoading((s) => ({ ...s, classes: true }));
    schoolService
      .getClasses({
        cycle: value.cycleId ?? undefined,
        domaine: value.domaineId ?? undefined,
        niveau: value.niveauId,
        option: value.optionId ?? undefined,
      })
      .then(setClasses)
      .catch(() => setClasses([]))
      .finally(() => setLoading((s) => ({ ...s, classes: false })));
  }, [value.cycleId, value.domaineId, value.niveauId, value.optionId, options.length]);

  const hasDomaines = domaines.length > 0;
  const hasOptions = options.length > 0;

  const update = (patch: Partial<ClassSelection>) => {
    const next = { ...value, ...patch };
    if (patch.cycleId !== undefined) {
      next.domaineId = null;
      next.niveauId = null;
      next.optionId = null;
      next.classeId = null;
    }
    if (patch.domaineId !== undefined) {
      next.niveauId = null;
      next.optionId = null;
      next.classeId = null;
    }
    if (patch.niveauId !== undefined) {
      next.optionId = null;
      next.classeId = null;
    }
    if (patch.optionId !== undefined) {
      next.classeId = null;
    }
    const classe = classes.find((c) => c.id === next.classeId);
    onChange(next, classe);
  };

  const selectClass = `
    select select-bordered w-full text-sm
    ${disabled ? 'select-disabled' : ''}
  `;

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
      <div className="form-control">
        <label className="label py-1">
          <span className="label-text font-medium">Cycle</span>
          {loading.cycles && <span className="loading loading-spinner loading-xs" />}
        </label>
        <select
          className={selectClass}
          value={value.cycleId ?? ''}
          disabled={disabled || loading.cycles}
          onChange={(e) =>
            update({ cycleId: e.target.value ? Number(e.target.value) : null })
          }
        >
          <option value="">Sélectionner un cycle</option>
          {cycles.map((c) => (
            <option key={c.id} value={c.id}>
              {c.libelle}
            </option>
          ))}
        </select>
      </div>

      {hasDomaines && (
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text font-medium">Domaine</span>
            {loading.domaines && <span className="loading loading-spinner loading-xs" />}
          </label>
          <select
            className={selectClass}
            value={value.domaineId ?? ''}
            disabled={disabled || !value.cycleId || loading.domaines}
            onChange={(e) =>
              update({ domaineId: e.target.value ? Number(e.target.value) : null })
            }
          >
            <option value="">Sélectionner un domaine</option>
            {domaines.map((d) => (
              <option key={d.id} value={d.id}>
                {d.libelle}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-control">
        <label className="label py-1">
          <span className="label-text font-medium">Niveau</span>
          {loading.niveaux && <span className="loading loading-spinner loading-xs" />}
        </label>
        <select
          className={selectClass}
          value={value.niveauId ?? ''}
          disabled={
            disabled ||
            !value.cycleId ||
            (hasDomaines && !value.domaineId) ||
            loading.niveaux
          }
          onChange={(e) =>
            update({ niveauId: e.target.value ? Number(e.target.value) : null })
          }
        >
          <option value="">Sélectionner un niveau</option>
          {niveaux.map((n) => (
            <option key={n.id} value={n.id}>
              {n.libelle}
            </option>
          ))}
        </select>
      </div>

      {hasOptions && (
        <div className="form-control">
          <label className="label py-1">
            <span className="label-text font-medium">Option</span>
            {loading.options && <span className="loading loading-spinner loading-xs" />}
          </label>
          <select
            className={selectClass}
            value={value.optionId ?? ''}
            disabled={disabled || !value.niveauId || loading.options}
            onChange={(e) =>
              update({ optionId: e.target.value ? Number(e.target.value) : null })
            }
          >
            <option value="">Sélectionner une option</option>
            {options.map((o) => (
              <option key={o.id} value={o.id}>
                {o.libelle}
              </option>
            ))}
          </select>
        </div>
      )}

      <div className="form-control sm:col-span-2 lg:col-span-1">
        <label className="label py-1">
          <span className="label-text font-medium">Classe</span>
          {loading.classes && <span className="loading loading-spinner loading-xs" />}
        </label>
        <select
          className={selectClass}
          value={value.classeId ?? ''}
          disabled={
            disabled ||
            !value.niveauId ||
            (hasOptions && !value.optionId) ||
            loading.classes
          }
          onChange={(e) =>
            update({ classeId: e.target.value ? Number(e.target.value) : null })
          }
        >
          <option value="">Sélectionner une classe</option>
          {classes.map((c) => (
            <option key={c.id} value={c.id}>
              {c.libelle}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

import { useEffect, useMemo, useState } from 'react';
import { cmsService } from '@/services/cms.service';
import type { ClassTree, SchoolClass } from '@/types/domain';
import { cn } from '@/lib/utils';

export interface ClassCascadeSelection {
  section: string;
  option: string;
  classId: string;
  classLabel: string;
}

interface ClassSelectorProps {
  value?: string;
  onChange: (classLabel: string, selection?: ClassCascadeSelection) => void;
  disabled?: boolean;
  className?: string;
}

const FALLBACK_TREE: ClassTree = {
  sections: [
    {
      name: 'Crèche',
      options: [
        {
          name: null,
          classes: [
            {
              id: 'creche',
              section: 'Crèche',
              class_name: 'Crèche (Pré-éveil)',
              label: 'Crèche (Pré-éveil & Garderie)',
            },
          ],
        },
      ],
    },
    {
      name: 'Maternelle',
      options: [
        {
          name: null,
          classes: [
            { id: 'm1', section: 'Maternelle', class_name: '1ère Maternelle', label: '1ère Maternelle (Petite Section)' },
            { id: 'm2', section: 'Maternelle', class_name: '2ème Maternelle', label: '2ème Maternelle (Moyenne Section)' },
            { id: 'm3', section: 'Maternelle', class_name: '3ème Maternelle', label: '3ème Maternelle (Grande Section)' },
          ],
        },
      ],
    },
    {
      name: 'Primaire',
      options: [
        {
          name: null,
          classes: [1, 2, 3, 4, 5, 6].map((n) => ({
            id: `p${n}`,
            section: 'Primaire',
            class_name: `${n}ème Primaire`.replace('1ème', '1ère'),
            label: `${n}ème Année Primaire`.replace('1ème', '1ère'),
          })),
        },
      ],
    },
  ],
};

export function ClassSelector({ value = '', onChange, disabled, className }: ClassSelectorProps) {
  const [tree, setTree] = useState<ClassTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [section, setSection] = useState('');
  const [option, setOption] = useState('');
  const [classId, setClassId] = useState('');

  useEffect(() => {
    let cancelled = false;
    setLoading(true);
    cmsService
      .getClassesTree()
      .then((res) => {
        if (cancelled) return;
        if (res.data?.sections?.length) setTree(res.data);
        else setTree(FALLBACK_TREE);
      })
      .catch(() => {
        if (!cancelled) setTree(FALLBACK_TREE);
      })
      .finally(() => {
        if (!cancelled) setLoading(false);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  const sections = tree?.sections ?? [];
  const currentSection = useMemo(
    () => sections.find((s) => s.name === section) ?? null,
    [sections, section],
  );
  const options = currentSection?.options ?? [];
  const hasNamedOptions = options.some((o) => !!o.name);
  const currentOption = useMemo(() => {
    if (!hasNamedOptions) return options[0] ?? null;
    return options.find((o) => (o.name || '') === option) ?? null;
  }, [options, option, hasNamedOptions]);
  const classes: SchoolClass[] = currentOption?.classes ?? [];

  useEffect(() => {
    if (!value || !tree) return;
    for (const sec of tree.sections) {
      for (const opt of sec.options) {
        const match = opt.classes.find(
          (c) => c.id === value || c.label === value || c.class_name === value,
        );
        if (match) {
          setSection(sec.name);
          setOption(opt.name || '');
          setClassId(String(match.id));
          return;
        }
      }
    }
  }, [value, tree]);

  const selectClass =
    'w-full mt-1.5 px-3 py-2.5 rounded-xl border border-border bg-background text-sm focus:border-primary focus:outline-none disabled:opacity-60';

  const emit = (nextClassId: string, cls?: SchoolClass) => {
    if (!cls) {
      onChange('');
      return;
    }
    const label = cls.label || cls.class_name;
    onChange(label, {
      section,
      option,
      classId: String(cls.id),
      classLabel: label,
    });
  };

  return (
    <div className={cn('grid grid-cols-1 sm:grid-cols-2 gap-3', className)}>
      <div>
        <label className="text-xs font-semibold uppercase text-muted-foreground">
          Section {loading && <span className="normal-case font-normal">…</span>}
        </label>
        <select
          className={selectClass}
          value={section}
          disabled={disabled || loading}
          onChange={(e) => {
            setSection(e.target.value);
            setOption('');
            setClassId('');
            onChange('');
          }}
        >
          <option value="">Choisir une section</option>
          {sections.map((s) => (
            <option key={s.name} value={s.name}>
              {s.name}
            </option>
          ))}
        </select>
      </div>

      {hasNamedOptions && (
        <div>
          <label className="text-xs font-semibold uppercase text-muted-foreground">Option</label>
          <select
            className={selectClass}
            value={option}
            disabled={disabled || !section || loading}
            onChange={(e) => {
              setOption(e.target.value);
              setClassId('');
              onChange('');
            }}
          >
            <option value="">Choisir une option</option>
            {options
              .filter((o) => o.name)
              .map((o) => (
                <option key={o.name!} value={o.name!}>
                  {o.name}
                </option>
              ))}
          </select>
        </div>
      )}

      <div className={hasNamedOptions ? 'sm:col-span-2' : ''}>
        <label className="text-xs font-semibold uppercase text-muted-foreground">Classe</label>
        <select
          className={selectClass}
          value={classId}
          disabled={
            disabled ||
            loading ||
            !section ||
            (hasNamedOptions && !option) ||
            classes.length === 0
          }
          onChange={(e) => {
            const id = e.target.value;
            setClassId(id);
            const cls = classes.find((c) => String(c.id) === id);
            emit(id, cls);
          }}
        >
          <option value="">Choisir une classe</option>
          {classes.map((c) => (
            <option key={String(c.id)} value={String(c.id)}>
              {c.label || c.class_name}
            </option>
          ))}
        </select>
      </div>
    </div>
  );
}

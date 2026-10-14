import { cn } from '@/lib/utils';

export type ProgramSchedule = {
  arrivalTime?: string;
  classStart?: string;
  morningBreak?: string;
  lunchTime?: string;
  middayBreak?: string;
  afternoonResume?: string;
  classEnd?: string;
  specialHours?: string;
};

const FIELDS: Array<{ key: keyof ProgramSchedule; label: string }> = [
  { key: 'arrivalTime', label: 'Arrivée' },
  { key: 'classStart', label: 'Début des cours' },
  { key: 'morningBreak', label: 'Pause du matin' },
  { key: 'lunchTime', label: 'Repas' },
  { key: 'middayBreak', label: 'Pause de midi' },
  { key: 'afternoonResume', label: 'Reprise' },
  { key: 'classEnd', label: 'Fin des cours' },
];

interface ScheduleEditorProps {
  value?: ProgramSchedule | null;
  onChange: (schedule: ProgramSchedule) => void;
  className?: string;
}

export function ScheduleEditor({ value, onChange, className }: ScheduleEditorProps) {
  const schedule = value || {};

  const set = (key: keyof ProgramSchedule, v: string) => {
    onChange({ ...schedule, [key]: v });
  };

  return (
    <div className={cn('sm:col-span-2 space-y-3 pt-2 border-t border-border', className)}>
      <div>
        <h4 className="text-sm font-bold font-display">Horaires de cours</h4>
        <p className="text-xs text-muted-foreground mt-0.5">
          Affichés dans la fiche détail de la formation.
        </p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {FIELDS.map(({ key, label }) => (
          <div key={key}>
            <label className="text-xs font-semibold uppercase text-muted-foreground">{label}</label>
            <input
              type="text"
              value={schedule[key] || ''}
              onChange={(e) => set(key, e.target.value)}
              placeholder="ex: 07h30"
              className="w-full mt-1.5 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:border-primary focus:outline-none"
            />
          </div>
        ))}
      </div>
      <div>
        <label className="text-xs font-semibold uppercase text-muted-foreground">
          Notes / horaires spéciaux
        </label>
        <textarea
          rows={2}
          value={schedule.specialHours || ''}
          onChange={(e) => set('specialHours', e.target.value)}
          placeholder="ex: Vendredi fin à 12h00"
          className="w-full mt-1.5 px-3 py-2 rounded-xl border border-border bg-background text-sm focus:border-primary focus:outline-none resize-none"
        />
      </div>
    </div>
  );
}

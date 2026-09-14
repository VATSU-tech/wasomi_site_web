import { useEffect, useState } from 'react';
import { teachingService } from '@/features/teachings/teaching.service';
import { gradingService } from '@/features/gradings/grading.service';
import { LoadingButton } from '@/components/ui/loading-button';
import { showToast } from '@/components/ui/app-toast';
import { SkeletonTable } from '@/components/ui/app-skeleton';
import type { Affectation, Evaluation, NoteEleve } from '@/api/types';

export function EvaluationsPage() {
  const [affectations, setAffectations] = useState<Affectation[]>([]);
  const [selectedAff, setSelectedAff] = useState<Affectation | null>(null);
  const [evaluations, setEvaluations] = useState<Evaluation[]>([]);
  const [selectedEval, setSelectedEval] = useState<Evaluation | null>(null);
  const [notes, setNotes] = useState<NoteEleve[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newEval, setNewEval] = useState({
    libelle: '',
    note_max: '20',
    date: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    teachingService
      .getMyAffectations()
      .then((aff) => {
        setAffectations(aff);
        if (aff[0]) setSelectedAff(aff[0]);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedAff) return;
    teachingService
      .listEvaluations(selectedAff.id)
      .then(setEvaluations)
      .catch(() => setEvaluations([]));
  }, [selectedAff]);

  useEffect(() => {
    if (!selectedEval) return;
    gradingService
      .getElevesForEvaluation(selectedEval.id)
      .then(setNotes)
      .catch(() => setNotes([]));
  }, [selectedEval]);

  const handleCreateEval = async () => {
    if (!selectedAff || !newEval.libelle) return;
    setSaving(true);
    try {
      const created = await teachingService.createEvaluation({
        affectation: selectedAff.id,
        periode: 1,
        libelle_evaluation: newEval.libelle,
        note_max: parseFloat(newEval.note_max),
        date_evaluation: newEval.date,
      });
      setEvaluations((prev) => [...prev, created]);
      setNewEval({ libelle: '', note_max: '20', date: newEval.date });
      showToast('Évaluation créée.', 'success');
    } catch {
      showToast('Erreur lors de la création.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleNoteChange = (index: number, value: string) => {
    const num = value === '' ? null : parseFloat(value);
    setNotes((prev) =>
      prev.map((n, i) => {
        if (i !== index) return n;
        if (num !== null && selectedEval && num > selectedEval.note_max) {
          showToast(`Note maximale : ${selectedEval.note_max}`, 'warning');
          return n;
        }
        return { ...n, note: num };
      }),
    );
  };

  const handleSaveNotes = async () => {
    if (!selectedEval) return;
    setSaving(true);
    try {
      await gradingService.saveNotes(
        notes.map((n) => ({
          evaluation: selectedEval.id,
          inscription: n.inscription,
          note: n.note,
          est_absent: n.est_absent,
        })),
      );
      showToast('Notes enregistrées.', 'success');
    } catch {
      showToast('Erreur lors de l\'enregistrement.', 'error');
    } finally {
      setSaving(false);
    }
  };

  if (loading) return <SkeletonTable rows={8} cols={3} />;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Évaluations & saisie des notes</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Créez des évaluations et saisissez les notes en grille
        </p>
      </div>

      <select
        className="select select-bordered select-sm max-w-xs"
        value={selectedAff?.id ?? ''}
        onChange={(e) => {
          const aff = affectations.find((a) => a.id === Number(e.target.value));
          setSelectedAff(aff ?? null);
          setSelectedEval(null);
        }}
      >
        {affectations.map((a) => (
          <option key={a.id} value={a.id}>
            {a.cours.libelle} — {a.classe.libelle}
          </option>
        ))}
      </select>

      <div className="card bg-base-100 border border-base-300">
        <div className="card-body">
          <h2 className="font-semibold text-sm mb-3">Nouvelle évaluation</h2>
          <div className="flex flex-wrap gap-2 items-end">
            <input
              type="text"
              className="input input-bordered input-sm"
              placeholder="Libellé (ex: Interro n°1)"
              value={newEval.libelle}
              onChange={(e) => setNewEval((p) => ({ ...p, libelle: e.target.value }))}
            />
            <input
              type="number"
              className="input input-bordered input-sm w-20"
              placeholder="/20"
              value={newEval.note_max}
              onChange={(e) => setNewEval((p) => ({ ...p, note_max: e.target.value }))}
            />
            <input
              type="date"
              className="input input-bordered input-sm"
              value={newEval.date}
              onChange={(e) => setNewEval((p) => ({ ...p, date: e.target.value }))}
            />
            <LoadingButton size="sm" loading={saving} onClick={handleCreateEval}>
              Créer
            </LoadingButton>
          </div>
        </div>
      </div>

      <div className="flex flex-wrap gap-2">
        {evaluations.map((ev) => (
          <button
            key={ev.id}
            type="button"
            className={`btn btn-sm ${
              selectedEval?.id === ev.id ? 'btn-primary' : 'btn-outline'
            }`}
            onClick={() => setSelectedEval(ev)}
          >
            {ev.libelle_evaluation} /{ev.note_max}
          </button>
        ))}
      </div>

      {selectedEval && (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-semibold">
                Saisie — {selectedEval.libelle_evaluation}
              </h2>
              <LoadingButton
                size="sm"
                loading={saving}
                loadingText="Enregistrement..."
                onClick={handleSaveNotes}
              >
                Enregistrer les notes
              </LoadingButton>
            </div>
            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>#</th>
                    <th>Élève</th>
                    <th>Note /{selectedEval.note_max}</th>
                  </tr>
                </thead>
                <tbody>
                  {notes.map((n, i) => (
                    <tr key={n.id}>
                      <td className="text-base-content/40">{i + 1}</td>
                      <td>{n.eleve.nom_complet}</td>
                      <td>
                        <input
                          type="number"
                          className="input input-bordered input-xs w-20 font-mono"
                          min="0"
                          max={selectedEval.note_max}
                          step="0.5"
                          value={n.note ?? ''}
                          onChange={(e) => handleNoteChange(i, e.target.value)}
                        />
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

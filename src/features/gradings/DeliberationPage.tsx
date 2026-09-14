import { useEffect, useState } from 'react';
import { Zap, FileDown } from 'lucide-react';
import { gradingService } from '@/features/gradings/grading.service';
import { schoolService } from '@/features/school/school.service';
import { LoadingButton } from '@/components/ui/loading-button';
import { showToast } from '@/components/ui/app-toast';
import { SkeletonTable } from '@/components/ui/app-skeleton';
import { PermissionGate } from '@/components/PermissionGate';
import type { Classe, Periode, ResultatsPeriode } from '@/api/types';

export function DeliberationPage() {
  const [classes, setClasses] = useState<Classe[]>([]);
  const [periodes, setPeriodes] = useState<Periode[]>([]);
  const [selectedClasse, setSelectedClasse] = useState<number | null>(null);
  const [selectedPeriode, setSelectedPeriode] = useState<number | null>(null);
  const [resultats, setResultats] = useState<ResultatsPeriode | null>(null);
  const [compiling, setCompiling] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    Promise.all([schoolService.getClasses({}), schoolService.getPeriodes()])
      .then(([cls, per]) => {
        setClasses(cls);
        setPeriodes(per);
        if (cls[0]) setSelectedClasse(cls[0].id);
        const active = per.find((p) => p.est_active) ?? per[0];
        if (active) setSelectedPeriode(active.id);
      })
      .finally(() => setLoading(false));
  }, []);

  const handleCompile = async () => {
    if (!selectedClasse || !selectedPeriode) return;
    setCompiling(true);
    setResultats(null);
    try {
      const res = await gradingService.compilePeriode(selectedClasse, selectedPeriode);
      setResultats(res);
      showToast('Résultats compilés avec succès.', 'success');
    } catch {
      try {
        const res = await gradingService.getResultatsPeriode(
          selectedClasse,
          selectedPeriode,
        );
        setResultats(res);
      } catch {
        showToast('Erreur lors de la compilation.', 'error');
      }
    } finally {
      setCompiling(false);
    }
  };

  const handleBulletin = async (inscriptionId: number) => {
    try {
      const bulletin = await gradingService.getBulletin(inscriptionId);
      const blob = new Blob([JSON.stringify(bulletin, null, 2)], {
        type: 'application/json',
      });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `bulletin-${inscriptionId}.json`;
      a.click();
      URL.revokeObjectURL(url);
      showToast('Bulletin généré.', 'success');
    } catch {
      showToast('Impossible de générer le bulletin.', 'error');
    }
  };

  if (loading) return <SkeletonTable rows={10} cols={6} />;

  const coursHeaders =
    resultats?.resultats[0]?.cours.map((c) => c.cours_libelle) ?? [];

  return (
    <PermissionGate
      roles={['titulaire', 'proviseur']}
      fallback={
        <div className="alert alert-warning">
          Accès réservé au titulaire de classe ou au Proviseur.
        </div>
      }
    >
      <div className="space-y-6">
        <div>
          <h1 className="text-xl font-bold">Délibération & synthèse</h1>
          <p className="text-sm text-base-content/60 mt-1">
            Compilez les notes de période et consultez les classements
          </p>
        </div>

        <div className="flex flex-wrap gap-3 items-end">
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs">Classe</span>
            </label>
            <select
              className="select select-bordered select-sm"
              value={selectedClasse ?? ''}
              onChange={(e) => setSelectedClasse(Number(e.target.value))}
            >
              {classes.map((c) => (
                <option key={c.id} value={c.id}>
                  {c.libelle}
                </option>
              ))}
            </select>
          </div>
          <div className="form-control">
            <label className="label py-1">
              <span className="label-text text-xs">Période</span>
            </label>
            <select
              className="select select-bordered select-sm"
              value={selectedPeriode ?? ''}
              onChange={(e) => setSelectedPeriode(Number(e.target.value))}
            >
              {periodes.map((p) => (
                <option key={p.id} value={p.id}>
                  {p.libelle}
                </option>
              ))}
            </select>
          </div>
          <LoadingButton
            loading={compiling}
            loadingText="Compilation en cours..."
            onClick={handleCompile}
            className="gap-2"
          >
            <Zap className="size-4" />
            Compiler les notes de la période
          </LoadingButton>
        </div>

        {compiling && (
          <div className="space-y-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <div key={i} className="skeleton h-8 w-full rounded" />
            ))}
          </div>
        )}

        {resultats && !compiling && (
          <div className="overflow-x-auto card bg-base-100 border border-base-300">
            <table className="table table-sm table-pin-rows">
              <thead>
                <tr>
                  <th>Rang</th>
                  <th>Élève</th>
                  {coursHeaders.map((h) => (
                    <th key={h} className="text-xs">
                      {h}
                    </th>
                  ))}
                  <th>Total</th>
                  <th>%</th>
                  <th>Mention</th>
                  <th></th>
                </tr>
              </thead>
              <tbody>
                {resultats.resultats.map((r) => (
                  <tr key={r.inscription_id}>
                    <td className="font-mono font-bold">{r.rang}</td>
                    <td className="whitespace-nowrap">{r.eleve.nom_complet}</td>
                    {r.cours.map((c) => (
                      <td key={c.cours_id} className="font-mono text-xs">
                        {c.note_obtenue}/{c.note_max}
                      </td>
                    ))}
                    <td className="font-mono text-xs">
                      {r.total_obtenu}/{r.total_max}
                    </td>
                    <td className="font-mono">{r.pourcentage.toFixed(1)}%</td>
                    <td>
                      <span
                        className={`badge badge-xs ${
                          r.mention === 'Échec'
                            ? 'badge-error'
                            : r.mention === 'Distinction'
                              ? 'badge-success'
                              : 'badge-ghost'
                        }`}
                      >
                        {r.mention}
                      </span>
                    </td>
                    <td>
                      <button
                        type="button"
                        className="btn btn-ghost btn-xs"
                        title="Télécharger le bulletin"
                        onClick={() => handleBulletin(r.inscription_id)}
                      >
                        <FileDown className="size-3" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </div>
    </PermissionGate>
  );
}

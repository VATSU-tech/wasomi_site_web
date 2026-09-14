import { useEffect, useState } from 'react';
import { teachingService } from '@/features/teachings/teaching.service';
import { schoolService } from '@/features/school/school.service';
import { LoadingButton } from '@/components/ui/loading-button';
import { ConfirmDialog } from '@/components/ui/confirm-dialog';
import { showToast } from '@/components/ui/app-toast';
import { SkeletonCard } from '@/components/ui/app-skeleton';
import type { Affectation, CategorieEvaluation, Periode } from '@/api/types';

export function TeachingsPage() {
  const [affectations, setAffectations] = useState<Affectation[]>([]);
  const [selectedAff, setSelectedAff] = useState<Affectation | null>(null);
  const [periodes, setPeriodes] = useState<Periode[]>([]);
  const [selectedPeriode, setSelectedPeriode] = useState<number | null>(null);
  const [categories, setCategories] = useState<CategorieEvaluation[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [newCat, setNewCat] = useState({ nom: '', poids: '', type_categorie: 'DC' as const });
  const [deleteId, setDeleteId] = useState<number | null>(null);

  useEffect(() => {
    Promise.all([
      teachingService.getMyAffectations(),
      schoolService.getPeriodes(),
    ])
      .then(([aff, per]) => {
        setAffectations(aff);
        setPeriodes(per);
        if (aff[0]) setSelectedAff(aff[0]);
        const active = per.find((p) => p.est_active) ?? per[0];
        if (active) setSelectedPeriode(active.id);
      })
      .finally(() => setLoading(false));
  }, []);

  useEffect(() => {
    if (!selectedAff || !selectedPeriode) return;
    teachingService
      .listCategories(selectedAff.id, selectedPeriode)
      .then(setCategories)
      .catch(() => setCategories([]));
  }, [selectedAff, selectedPeriode]);

  const totalPoids = categories.reduce((s, c) => s + Number(c.poids), 0);
  const isValidTotal = Math.abs(totalPoids - 100) < 0.01;

  const handleAddCategory = async () => {
    if (!selectedAff || !selectedPeriode || !newCat.nom || !newCat.poids) return;
    setSaving(true);
    try {
      await teachingService.createCategory({
        affectation: selectedAff.id,
        periode: selectedPeriode,
        nom: newCat.nom,
        poids: parseFloat(newCat.poids),
        type_categorie: newCat.type_categorie,
      });
      const updated = await teachingService.listCategories(
        selectedAff.id,
        selectedPeriode,
      );
      setCategories(updated);
      setNewCat({ nom: '', poids: '', type_categorie: 'DC' });
      showToast('Catégorie ajoutée.', 'success');
    } catch {
      showToast('Erreur lors de l\'ajout de la catégorie.', 'error');
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async () => {
    if (!deleteId || !selectedAff || !selectedPeriode) return;
    setSaving(true);
    try {
      await teachingService.deleteCategory(deleteId);
      const updated = await teachingService.listCategories(
        selectedAff.id,
        selectedPeriode,
      );
      setCategories(updated);
      showToast('Catégorie supprimée.', 'success');
    } catch {
      showToast('Erreur lors de la suppression.', 'error');
    } finally {
      setSaving(false);
      setDeleteId(null);
    }
  };

  if (loading) {
    return (
      <div className="grid sm:grid-cols-2 gap-4">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonCard key={i} />
        ))}
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-xl font-bold">Mes cours & pondérations</h1>
        <p className="text-sm text-base-content/60 mt-1">
          Configurez les barèmes d'évaluation par période (total = 100%)
        </p>
      </div>

      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3">
        {affectations.map((aff) => (
          <button
            key={aff.id}
            type="button"
            className={`card bg-base-100 border text-left transition-colors ${
              selectedAff?.id === aff.id
                ? 'border-primary shadow-sm'
                : 'border-base-300 hover:border-primary/30'
            }`}
            onClick={() => setSelectedAff(aff)}
          >
            <div className="card-body p-4">
              <p className="font-medium text-sm">{aff.cours.libelle}</p>
              <p className="text-xs text-base-content/60">{aff.classe.libelle}</p>
            </div>
          </button>
        ))}
      </div>

      {selectedAff && (
        <div className="card bg-base-100 border border-base-300">
          <div className="card-body">
            <div className="flex flex-wrap items-center justify-between gap-3 mb-4">
              <h2 className="font-semibold">
                Pondérations — {selectedAff.cours.libelle}
              </h2>
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

            <div
              className={`alert py-2 mb-4 text-sm ${
                isValidTotal ? 'alert-success' : 'alert-warning'
              }`}
            >
              Total : <strong>{totalPoids.toFixed(1)}%</strong>
              {isValidTotal
                ? ' — Configuration valide'
                : ' — La somme doit être exactement 100%'}
            </div>

            <div className="overflow-x-auto">
              <table className="table table-sm">
                <thead>
                  <tr>
                    <th>Catégorie</th>
                    <th>Type</th>
                    <th>Poids (%)</th>
                    <th></th>
                  </tr>
                </thead>
                <tbody>
                  {categories.map((cat) => (
                    <tr key={cat.id}>
                      <td>{cat.nom}</td>
                      <td>
                        <span className="badge badge-xs">
                          {cat.type_categorie === 'DC' ? 'Devoir' : 'Examen'}
                        </span>
                      </td>
                      <td className="font-mono">{cat.poids}%</td>
                      <td>
                        <button
                          type="button"
                          className="btn btn-ghost btn-xs text-error"
                          onClick={() => setDeleteId(cat.id)}
                        >
                          Supprimer
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="flex flex-wrap gap-2 mt-4 items-end">
              <input
                type="text"
                className="input input-bordered input-sm"
                placeholder="Nom (ex: Interrogations)"
                value={newCat.nom}
                onChange={(e) => setNewCat((p) => ({ ...p, nom: e.target.value }))}
              />
              <input
                type="number"
                className="input input-bordered input-sm w-24"
                placeholder="%"
                min="0"
                max="100"
                value={newCat.poids}
                onChange={(e) => setNewCat((p) => ({ ...p, poids: e.target.value }))}
              />
              <select
                className="select select-bordered select-sm"
                value={newCat.type_categorie}
                onChange={(e) =>
                  setNewCat((p) => ({
                    ...p,
                    type_categorie: e.target.value as 'DC' | 'EX',
                  }))
                }
              >
                <option value="DC">Devoir/Contrôle</option>
                <option value="EX">Examen</option>
              </select>
              <LoadingButton
                size="sm"
                loading={saving}
                onClick={handleAddCategory}
              >
                Ajouter
              </LoadingButton>
            </div>
          </div>
        </div>
      )}

      <ConfirmDialog
        open={deleteId !== null}
        title="Supprimer cette catégorie ?"
        description="Cette action est irréversible."
        variant="error"
        loading={saving}
        onConfirm={handleDelete}
        onCancel={() => setDeleteId(null)}
      />
    </div>
  );
}

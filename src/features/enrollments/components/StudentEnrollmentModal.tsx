import { useState, useEffect } from 'react';
import { Search, UserPlus, Check, X } from 'lucide-react';
import { ClassSelector, type ClassSelection } from '@/components/ClassSelector';
import { LoadingButton } from '@/components/ui/loading-button';
import { showToast } from '@/components/ui/app-toast';
import { enrollmentService } from '@/features/enrollments/enrollment.service';
import { schoolService } from '@/features/school/school.service';
import type {
  Eleve,
  Parent,
  RoleParental,
  InscriptionRequest,
  Sexe,
} from '@/api/types';

interface ParentEntry {
  parent: Parent | null;
  isNew: boolean;
  newData?: {
    nom: string;
    post_nom: string;
    prenom: string;
    telephone: string;
    email: string;
  };
  role_parental: RoleParental;
  est_tuteur_legal: boolean;
  est_responsable_financier: boolean;
}

interface StudentEnrollmentModalProps {
  open: boolean;
  onClose: () => void;
  onSuccess?: () => void;
}

const STEPS = [
  'Identification',
  'Classe',
  'Parents',
  'Confirmation',
] as const;

const emptyClassSelection: ClassSelection = {
  cycleId: null,
  domaineId: null,
  niveauId: null,
  optionId: null,
  classeId: null,
};

export function StudentEnrollmentModal({
  open,
  onClose,
  onSuccess,
}: StudentEnrollmentModalProps) {
  const [step, setStep] = useState(0);
  const [mode, setMode] = useState<'existing' | 'new'>('existing');
  const [matriculeSearch, setMatriculeSearch] = useState('');
  const [searching, setSearching] = useState(false);
  const [selectedEleve, setSelectedEleve] = useState<Eleve | null>(null);
  const [newEleve, setNewEleve] = useState({
    nom: '',
    post_nom: '',
    prenom: '',
    sexe: 'M' as Sexe,
    date_naissance: '',
    telephone: '',
    email: '',
  });
  const [classSelection, setClassSelection] = useState<ClassSelection>(emptyClassSelection);
  const [anneeId, setAnneeId] = useState<number | null>(null);
  const [anneeLabel, setAnneeLabel] = useState('');
  const [parentSearch, setParentSearch] = useState('');
  const [parentResults, setParentResults] = useState<Parent[]>([]);
  const [parents, setParents] = useState<ParentEntry[]>([]);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (open) {
      schoolService
        .getActiveAnnee()
        .then((annee) => {
          if (annee) {
            setAnneeId(annee.id);
            setAnneeLabel(annee.libelle);
          }
        })
        .catch(() => {});
    }
  }, [open]);

  if (!open) return null;

  const searchEleve = async () => {
    if (!matriculeSearch.trim()) return;
    setSearching(true);
    try {
      const query = matriculeSearch.replace(/^#/, '').trim();
      const results = await enrollmentService.searchEleves(query);
      if (results.length > 0) {
        setSelectedEleve(results[0]);
        showToast('Élève trouvé.', 'success');
      } else {
        const id = parseInt(query, 10);
        if (!isNaN(id)) {
          const eleve = await enrollmentService.getEleve(id);
          setSelectedEleve(eleve);
          showToast('Élève trouvé.', 'success');
        } else {
          showToast('Aucun élève trouvé pour ce matricule.', 'warning');
          setSelectedEleve(null);
        }
      }
    } catch {
      showToast('Élève introuvable.', 'error');
      setSelectedEleve(null);
    } finally {
      setSearching(false);
    }
  };

  const searchParents = async (query: string) => {
    setParentSearch(query);
    if (query.length < 2) {
      setParentResults([]);
      return;
    }
    try {
      const results = await enrollmentService.searchParents(query);
      setParentResults(results);
    } catch {
      setParentResults([]);
    }
  };

  const addParent = (parent: Parent) => {
    if (parents.some((p) => p.parent?.id === parent.id)) return;
    setParents((prev) => [
      ...prev,
      {
        parent,
        isNew: false,
        role_parental: 'Père',
        est_tuteur_legal: false,
        est_responsable_financier: false,
      },
    ]);
    setParentSearch('');
    setParentResults([]);
  };

  const addNewParent = () => {
    setParents((prev) => [
      ...prev,
      {
        parent: null,
        isNew: true,
        newData: { nom: '', post_nom: '', prenom: '', telephone: '', email: '' },
        role_parental: 'Tuteur légal',
        est_tuteur_legal: true,
        est_responsable_financier: true,
      },
    ]);
  };

  const removeParent = (index: number) => {
    setParents((prev) => prev.filter((_, i) => i !== index));
  };

  const updateParent = (index: number, patch: Partial<ParentEntry>) => {
    setParents((prev) =>
      prev.map((p, i) => (i === index ? { ...p, ...patch } : p)),
    );
  };

  const canProceedStep0 =
    mode === 'existing'
      ? !!selectedEleve
      : !!(newEleve.nom && newEleve.prenom && newEleve.date_naissance);

  const canProceedStep1 = !!classSelection.classeId && !!anneeId;

  const canProceedStep2 = parents.length > 0;

  const handleSubmit = async () => {
    if (!classSelection.classeId || !anneeId) return;
    setSubmitting(true);
    try {
      const payload: InscriptionRequest = {
        classe: classSelection.classeId,
        annee_scolaire: anneeId,
        parents: parents.map((p) => {
          if (p.isNew && p.newData) {
            return {
              nouveau_parent: {
                nom: p.newData.nom,
                post_nom: p.newData.post_nom || undefined,
                prenom: p.newData.prenom,
                telephone: p.newData.telephone,
                email: p.newData.email || undefined,
              },
              role_parental: p.role_parental,
              est_tuteur_legal: p.est_tuteur_legal,
              est_responsable_financier: p.est_responsable_financier,
            };
          }
          return {
            id: p.parent!.id,
            role_parental: p.role_parental,
            est_tuteur_legal: p.est_tuteur_legal,
            est_responsable_financier: p.est_responsable_financier,
          };
        }),
      };

      if (mode === 'existing' && selectedEleve) {
        payload.eleve = selectedEleve.id;
      } else {
        payload.nouvel_eleve = {
          nom: newEleve.nom,
          post_nom: newEleve.post_nom || undefined,
          prenom: newEleve.prenom,
          sexe: newEleve.sexe,
          date_naissance: newEleve.date_naissance,
          telephone: newEleve.telephone || undefined,
          email: newEleve.email || undefined,
        };
      }

      await enrollmentService.createInscription(payload);
      showToast('Inscription validée avec succès.', 'success');
      onSuccess?.();
      onClose();
      setStep(0);
      setSelectedEleve(null);
      setParents([]);
      setClassSelection(emptyClassSelection);
    } catch {
      showToast("Erreur lors de l'inscription. Vérifiez les données.", 'error');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <dialog className="modal modal-open">
      <div className="modal-box max-w-2xl w-full">
        <button
          type="button"
          className="btn btn-sm btn-circle btn-ghost absolute right-3 top-3"
          onClick={onClose}
          aria-label="Fermer"
        >
          <X className="size-4" />
        </button>

        <h3 className="font-bold text-lg mb-1">Inscription d'un élève</h3>
        <p className="text-sm text-base-content/60 mb-4">
          Étape {step + 1} sur {STEPS.length} — {STEPS[step]}
        </p>

        <ul className="steps steps-horizontal w-full mb-6 text-xs">
          {STEPS.map((s, i) => (
            <li key={s} className={`step ${i <= step ? 'step-primary' : ''}`}>
              {s}
            </li>
          ))}
        </ul>

        {step === 0 && (
          <div className="space-y-4">
            <div className="flex gap-4">
              <label className="label cursor-pointer gap-2">
                <input
                  type="radio"
                  className="radio radio-primary radio-sm"
                  checked={mode === 'existing'}
                  onChange={() => setMode('existing')}
                />
                <span className="label-text">Élève déjà enregistré</span>
              </label>
              <label className="label cursor-pointer gap-2">
                <input
                  type="radio"
                  className="radio radio-primary radio-sm"
                  checked={mode === 'new'}
                  onChange={() => setMode('new')}
                />
                <span className="label-text">Nouvel élève</span>
              </label>
            </div>

            {mode === 'existing' ? (
              <div className="space-y-3">
                <div className="flex gap-2">
                  <div className="relative flex-1">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
                    <input
                      type="text"
                      className="input input-bordered w-full pl-10"
                      placeholder="Matricule ou identifiant (ex: #4630)"
                      value={matriculeSearch}
                      onChange={(e) => setMatriculeSearch(e.target.value)}
                      onKeyDown={(e) => e.key === 'Enter' && searchEleve()}
                    />
                  </div>
                  <LoadingButton loading={searching} onClick={searchEleve}>
                    Vérifier
                  </LoadingButton>
                </div>

                {selectedEleve && (
                  <div className="card bg-base-200 border border-base-300">
                    <div className="card-body flex-row items-center gap-4 p-4">
                      <div className="avatar">
                        <div className="w-14 rounded-full bg-primary text-primary-content">
                          {selectedEleve.photo ? (
                            <img
                              src={selectedEleve.photo}
                              alt={`Photo de ${selectedEleve.prenom} ${selectedEleve.nom}`}
                            />
                          ) : (
                            <span className="text-lg">
                              {selectedEleve.prenom[0]}
                              {selectedEleve.nom[0]}
                            </span>
                          )}
                        </div>
                      </div>
                      <div>
                        <p className="font-semibold">
                          {selectedEleve.prenom} {selectedEleve.nom}{' '}
                          {selectedEleve.post_nom}
                        </p>
                        <p className="text-sm text-base-content/60">
                          Matricule : {selectedEleve.matricule}
                          {selectedEleve.age !== undefined && ` · ${selectedEleve.age} ans`}
                        </p>
                      </div>
                      <Check className="size-5 text-success ml-auto" />
                    </div>
                  </div>
                )}
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {(
                  [
                    ['nom', 'Nom', 'text'],
                    ['post_nom', 'Post-nom', 'text'],
                    ['prenom', 'Prénom', 'text'],
                    ['date_naissance', 'Date de naissance', 'date'],
                    ['telephone', 'Téléphone', 'tel'],
                    ['email', 'Email (optionnel)', 'email'],
                  ] as const
                ).map(([key, label, type]) => (
                  <div key={key} className="form-control">
                    <label className="label py-1">
                      <span className="label-text text-xs">{label}</span>
                    </label>
                    <input
                      type={type}
                      className="input input-bordered input-sm"
                      value={newEleve[key as keyof typeof newEleve] as string}
                      onChange={(e) =>
                        setNewEleve((prev) => ({ ...prev, [key]: e.target.value }))
                      }
                    />
                  </div>
                ))}
                <div className="form-control">
                  <label className="label py-1">
                    <span className="label-text text-xs">Sexe</span>
                  </label>
                  <select
                    className="select select-bordered select-sm"
                    value={newEleve.sexe}
                    onChange={(e) =>
                      setNewEleve((prev) => ({
                        ...prev,
                        sexe: e.target.value as Sexe,
                      }))
                    }
                  >
                    <option value="M">Masculin</option>
                    <option value="F">Féminin</option>
                  </select>
                </div>
              </div>
            )}
          </div>
        )}

        {step === 1 && (
          <div className="space-y-4">
            {anneeLabel && (
              <div className="alert alert-info text-sm py-2">
                Année scolaire active : <strong>{anneeLabel}</strong>
              </div>
            )}
            <ClassSelector
              value={classSelection}
              onChange={(sel) => setClassSelection(sel)}
            />
          </div>
        )}

        {step === 2 && (
          <div className="space-y-4">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 size-4 text-base-content/40" />
              <input
                type="text"
                className="input input-bordered w-full pl-10"
                placeholder="Rechercher un parent existant par son nom..."
                value={parentSearch}
                onChange={(e) => searchParents(e.target.value)}
              />
              {parentResults.length > 0 && (
                <ul className="menu bg-base-100 border border-base-300 rounded-box mt-1 shadow-lg absolute z-10 w-full">
                  {parentResults.map((p) => (
                    <li key={p.id}>
                      <button type="button" onClick={() => addParent(p)}>
                        {p.prenom} {p.nom} ({p.telephone})
                      </button>
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {parents.map((entry, index) => (
              <div
                key={index}
                className="card bg-base-200 border border-base-300"
              >
                <div className="card-body p-4 space-y-3">
                  <div className="flex items-center justify-between">
                    <p className="font-medium text-sm">
                      {entry.isNew
                        ? 'Nouveau parent'
                        : `${entry.parent?.prenom} ${entry.parent?.nom}`}
                    </p>
                    <button
                      type="button"
                      className="btn btn-ghost btn-xs"
                      onClick={() => removeParent(index)}
                      aria-label={`Retirer ${entry.isNew ? (entry.newData?.prenom ?? '') : (entry.parent?.prenom ?? '')} ${entry.isNew ? (entry.newData?.nom ?? '') : (entry.parent?.nom ?? '')}`}
                    >
                      <X className="size-3" />
                    </button>
                  </div>

                  {entry.isNew && entry.newData && (
                    <div className="grid grid-cols-2 gap-2">
                      {(['nom', 'prenom', 'telephone', 'email'] as const).map((field) => (
                        <input
                          key={field}
                          type="text"
                          className="input input-bordered input-xs"
                          placeholder={field}
                          value={entry.newData![field]}
                          onChange={(e) =>
                            updateParent(index, {
                              newData: { ...entry.newData!, [field]: e.target.value },
                            })
                          }
                        />
                      ))}
                    </div>
                  )}

                  <div className="flex flex-wrap gap-3 items-center">
                    <select
                      className="select select-bordered select-xs"
                      value={entry.role_parental}
                      onChange={(e) =>
                        updateParent(index, {
                          role_parental: e.target.value as RoleParental,
                        })
                      }
                    >
                      <option value="Père">Père</option>
                      <option value="Mère">Mère</option>
                      <option value="Tuteur légal">Tuteur légal</option>
                      <option value="Autre">Autre</option>
                    </select>
                    <label className="label cursor-pointer gap-1 py-0">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs checkbox-primary"
                        checked={entry.est_tuteur_legal}
                        onChange={(e) =>
                          updateParent(index, { est_tuteur_legal: e.target.checked })
                        }
                      />
                      <span className="label-text text-xs">Tuteur légal</span>
                    </label>
                    <label className="label cursor-pointer gap-1 py-0">
                      <input
                        type="checkbox"
                        className="checkbox checkbox-xs checkbox-primary"
                        checked={entry.est_responsable_financier}
                        onChange={(e) =>
                          updateParent(index, {
                            est_responsable_financier: e.target.checked,
                          })
                        }
                      />
                      <span className="label-text text-xs">Resp. financier</span>
                    </label>
                  </div>
                </div>
              </div>
            ))}

            <div className="flex gap-2">
              <button
                type="button"
                className="btn btn-outline btn-sm gap-1"
                onClick={addNewParent}
              >
                <UserPlus className="size-4" />
                Créer un nouveau parent
              </button>
            </div>
          </div>
        )}

        {step === 3 && (
          <div className="space-y-3 text-sm">
            <div className="card bg-base-200 p-4 rounded-box space-y-2">
              <p>
                <span className="text-base-content/60">Élève :</span>{' '}
                <strong>
                  {mode === 'existing' && selectedEleve
                    ? `${selectedEleve.prenom} ${selectedEleve.nom}`
                    : `${newEleve.prenom} ${newEleve.nom} (nouveau)`}
                </strong>
              </p>
              <p>
                <span className="text-base-content/60">Classe :</span>{' '}
                <strong>ID {classSelection.classeId}</strong>
              </p>
              <p>
                <span className="text-base-content/60">Année :</span>{' '}
                <strong>{anneeLabel}</strong>
              </p>
              <p>
                <span className="text-base-content/60">Parents :</span>{' '}
                <strong>{parents.length} associé(s)</strong>
              </p>
            </div>
          </div>
        )}

        <div className="modal-action mt-6">
          {step > 0 && (
            <button
              type="button"
              className="btn btn-ghost"
              onClick={() => setStep((s) => s - 1)}
            >
              Retour
            </button>
          )}
          {step < 3 ? (
            <LoadingButton
              disabled={
                (step === 0 && !canProceedStep0) ||
                (step === 1 && !canProceedStep1) ||
                (step === 2 && !canProceedStep2)
              }
              onClick={() => setStep((s) => s + 1)}
            >
              Suivant
            </LoadingButton>
          ) : (
            <LoadingButton
              loading={submitting}
              loadingText="Enregistrement en cours..."
              onClick={handleSubmit}
            >
              Valider l'inscription
            </LoadingButton>
          )}
        </div>
      </div>
      <form method="dialog" className="modal-backdrop">
        <button type="button" onClick={onClose}>
          fermer
        </button>
      </form>
    </dialog>
  );
}

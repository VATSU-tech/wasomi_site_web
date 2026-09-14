/** API v2 endpoint constants — Smart School Management */

const ACCOUNTS = '/accounts';
const ENROLLMENTS = '/enrollments';
const TEACHINGS = '/teachings';
const GRADINGS = '/gradings';
const SCHOOLS = '/schools';

export const endpoints = {
  auth: {
    login: `${ACCOUNTS}/auth/login/`,
    refresh: `${ACCOUNTS}/auth/refresh/`,
    logout: `${ACCOUNTS}/auth/logout/`,
    me: `${ACCOUNTS}/me/`,
    passwordVerifyOtp: `${ACCOUNTS}/auth/password/verify-otp/`,
    passwordConfirm: `${ACCOUNTS}/auth/password/confirm/`,
    passwordReset: `${ACCOUNTS}/auth/password/reset/`,
    activateValidate: `${ACCOUNTS}/auth/activate/validate/`,
    activate: `${ACCOUNTS}/auth/activate/`,
    emailChangeRequest: `${ACCOUNTS}/auth/email/change/request/`,
    emailChangeVerify: `${ACCOUNTS}/auth/email/change/verify/`,
    phoneChangeRequest: `${ACCOUNTS}/auth/phone/change/request/`,
    phoneChangeVerify: `${ACCOUNTS}/auth/phone/change/verify/`,
    preferencesChannel: `${ACCOUNTS}/auth/preferences/channel/`,
  },
  users: {
    enseignants: `${ACCOUNTS}/enseignants/`,
    enseignant: (id: number | string) => `${ACCOUNTS}/enseignants/${id}/`,
    suspend: (id: number | string) => `${ACCOUNTS}/users/${id}/suspend/`,
    reactivate: (id: number | string) => `${ACCOUNTS}/users/${id}/reactivate/`,
  },
  students: {
    accessActivate: (id: number | string) => `${ACCOUNTS}/students/${id}/access/activate/`,
    accessDisable: (id: number | string) => `${ACCOUNTS}/students/${id}/access/disable/`,
  },
  parent: {
    enfants: `${ENROLLMENTS}/me/enfants/`,
  },
  enrollments: {
    inscriptions: `${ENROLLMENTS}/inscriptions/`,
    parents: `${ENROLLMENTS}/parents/`,
    eleves: `${ENROLLMENTS}/eleves/`,
    eleve: (id: number | string) => `${ENROLLMENTS}/eleves/${id}/`,
  },
  teachings: {
    cours: `${TEACHINGS}/cours/`,
    coursDetail: (id: number | string) => `${TEACHINGS}/cours/${id}/`,
    affectations: `${TEACHINGS}/affectations/`,
    affectationsMe: `${TEACHINGS}/affectations/me/`,
    affectation: (id: number | string) => `${TEACHINGS}/affectations/${id}/`,
    categories: `${TEACHINGS}/categories/`,
    category: (id: number | string) => `${TEACHINGS}/categories/${id}/`,
    evaluations: `${TEACHINGS}/evaluations/`,
    evaluation: (id: number | string) => `${TEACHINGS}/evaluations/${id}/`,
  },
  gradings: {
    notes: `${GRADINGS}/notes/`,
    notesEleves: `${GRADINGS}/notes/eleves/`,
    resultatsPeriode: `${GRADINGS}/resultats/periode/`,
    resultatsSemestre: `${GRADINGS}/resultats/semestre/`,
    resultatsBulletin: `${GRADINGS}/resultats/bulletin/`,
    compiler: `${GRADINGS}/resultats/compiler/`,
  },
  schools: {
    school: `${SCHOOLS}/school`,
    annees: `${SCHOOLS}/annees/`,
    annee: (id: number | string) => `${SCHOOLS}/annees/${id}/`,
    classes: `${SCHOOLS}/classes/`,
    classe: (id: number | string) => `${SCHOOLS}/classes/${id}/`,
    cycles: `${SCHOOLS}/cycles/`,
    domaines: `${SCHOOLS}/domaines/`,
    niveaux: `${SCHOOLS}/niveaux/`,
    options: `${SCHOOLS}/options/`,
    periodes: `${SCHOOLS}/periodes/`,
    semestres: `${SCHOOLS}/semestres/`,
  },
} as const;

const context = 'http://localhost/';

export const environment = {
  production: true,
  context: context, // change for what the production environment would actually be

  assessment: {
    fetchByBatchIdByWeek: (batchId: number, week: number) => `${context}trainer/assessment/${batchId}/${week}`,
    save: () => `${context}trainer/assessment/create`,
    update: () => `${context}trainer/assessment/update`,
    delete: (assessmentId: number) => `${context}trainer/assessment/delete/${assessmentId}`,
  },

  batch: {
    fetchAllByTrainer: () => `${context}trainer/batch/all`,
    fetchAll: () => `${context}vp/batch/all`,
    save: () => `${context}all/batch/create`,
    update: () => `${context}all/batch/update`,
    delete: (batchId) => `${context}all/batch/delete/${batchId}`,
  },

  category: {
    fetchAll: () => `${context}vp/category`,
    fetchAllActive: () => `${context}category/all`,
    fetchById: (id: number) => `${context}category/${id}`,
    save: () => `${context}vp/category`,
    update: () => `${context}vp/category/update`,
  },

  location: {
    fetchAll: () => `${context}all/location/all/`,
    save: () => `${context}vp/location/create`,
    update: () => `${context}vp/location/update`,
  },

  note: {
    fetchQcBatchNotesByBatchIdByWeek: (batchId: number, week: number) => `${context}qc/note/batch/${batchId}/${week}`,
    fetchQcTraineeNotesByBatchIdByWeek: (batchId: number, week: number) => `${context}qc/note/trainee/${batchId}/${week}`,
    fetchBatchNotesByBatchIdByWeek: (batchId: number, week: number) => `${context}trainer/note/batch/${batchId}/${week}`,
    fetchTraineeNotesByBatchIdByWeek: (batchId: number, week: number) => `${context}trainer/note/trainee/${batchId}/${week}`,
    fetchTrainingNotesByTrainee: (traineeId: number) => `${context}all/notes/trainee/${traineeId}`,
    fetchQcNotesByTrainee: (traineeId: number) => `${context}qc/note/trainee/${traineeId}`,
    update: () => `${context}note/update`,
    save: () => `${context}note/create`,
    getAllQCTraineeNotes: (batchId: number, week: number) => `${context}qc/note/trainee/${batchId}/${week}`,
    findQCBatchNotes: (batchId: number, week: number) => `${context}qc/note/batch/${batchId}/${week}`,
  },

  panel: {
    fetchAll: () => `${context}panel/all`,
    fetchAllByTrainee: (traineeId) => `${context}panel/trainee/${traineeId}`,
    save: () => `${context}panel/create`,
    update: () => `${context}panel/update`,
    delete: (panelId: number) => `${context}panel/delete/${panelId}`,
  },

  grade: {
    fetchByBatchIdByWeek: (batchId, week) => `${context}all/grades/batch/${batchId}/week/${week}`,
    save: () => `${context}trainer/grade/create`,
    update: () => `${context}trainer/grade/update`,
  },

  qcStatus: {
    fetchAll: () => `${context}types/qcstatus/all`,
  },

  skill: {
    fetchAll: () => `${context}types/skill/all`,
  },

  trainee: {
    fetchAllByBatch: (batchId: number) => `${context}all/trainee?batchId=${batchId}`,
    save: () => `${context}all/trainee/create`,
    update: () => `${context}all/trainee/update`,
    delete: (traineeId: number) => `${context}all/trainee/delete/${traineeId}`,
  },

  trainer: {
    fetchByEmail: (email: string) => `${context}training/trainer/byemail/${email}`,
    fetchAll: () => `${context}all/trainer/all`,
    save: () => `${context}all/trainer/all`,
    update: () => `${context}vp/trainer/update`,
    getTitles: () => `${context}vp/trainer/titles`,
    getTiers: () => `${context}types/trainer/role/all`,
  },

  trainingType: {
    fetchAll: () => `${context}types/training/all`,
  },

  traineeStatus: {
    fetchAll: () => `${context}types/trainingstatus/all`,
  },

  // API calls for the VP functionality group
  addNewCategory: context + 'vp/category',
  getAllCategories: context + 'vp/category',
  editCurrentCategory: context + 'vp/category/update',

  // Location API calls
  editLocation: context + 'vp/location/update',
  deleteLocation: context + 'vp/location/delete',
  reactivateLocation: context + 'vp/location/reactivate',
  addLocation: context + 'vp/location/create',

  // Trainer API calls
  addNewTrainer: context + 'vp/trainer/create',
  deleteTrainer: context + 'vp/trainer/delete',
  getAllTitles: context + 'vp/trainer/titles/',
  getAllTiers: context + 'types/trainer/role/all',
  editTrainer: context + 'vp/trainer/update',

  // Reports Service API endpoints
  reportsStackedBarCurrentWeek: context + 'all/reports/batch/week/stacked-bar-current-week',
  reportsDashBoard: context + 'all/reports/dashboard',
  reportsBiWeeklyPanel: context + 'all/reports/biweeklyPanelResults',




  /* Evaluation Service API endpoints */
  apiAllQCTraineeOverallNotes: (traineeId: Number) =>
    environment.context + `qc/note/trainee/${traineeId}`,

  apiAllTraineeNotes: (traineeId: Number) =>
    environment.context + `all/notes/trainee/${traineeId}`,

  apiQCTraineeNote: (traineeId: Number, week: Number) =>
    environment.context + `/qc/note/trainee/${traineeId}/for/${week}`,

  apiTraineeNote: (traineeId: Number, week: Number) =>
    environment.context + `/trainer/note/trainee/${traineeId}/for/${week}`,

  /* Reporting service API endpoints */
  apiBatchComparisonAvgEndpoint: (skill: string, training: string, startDate) =>
    environment.context + `/all/reports/compare/skill/${skill}/training/${training}/date/${startDate}`,

  apifetchBatchWeekPieChart: (batchId: Number, weekId: Number) =>
    environment.context + `all/reports/batch/${batchId}/week/${weekId}/pie`,

  apiPieChartCurrentWeekQCStatus: (batchId: Number) =>
    environment.context + `all/reports/batch/{batchId}/chart`,

  apiAllBatchesCurrentWeekQCStackedBarChart: (batchId: Number, week: Number) =>
    environment.context + `all/reports/batch/${batchId}/week/${week}/bar-batch-week-avg`,

  apiBatchWeekAvgBarChart: (batchId: Number, week: Number) =>
    environment.context + `all/reports/batch/${batchId}/week/${week}/bar-batch-week-avg`,

  apiBatchWeekSortedBarChart: (batchId: Number, week: Number) =>
    environment.context + `all/reports/batch/${batchId}/week/${week}/bar-batch-weekly-sorted`,

  apiBatchOverallTraineeBarChart: (batchId: Number, traineeId: Number) =>
    environment.context + `all/reports/batch/${batchId}/overall/trainee/${traineeId}/bar-batch-overall-trainee`,

  apiBatchOverallBarChart: (batchId: Number) =>
    environment.context + `all/reports/batch/${batchId}/overall/bar-batch-overall`,

  apiBatchWeekTraineeBarChart: (batchId: Number, weekId: Number, traineeId: Number) =>
    environment.context + `all/reports/batch/${batchId}/week/${weekId}/trainee/${traineeId}/bar-batch-week-trainee`,

  apiTraineeUpToWeekLineChart: (batchId: Number, weekId: Number, traineeId: Number) =>
    environment.context + `all/reports/batch/${batchId}/week/${weekId}/trainee/${traineeId}/line-trainee-up-to-week`,

  apiTraineeOverallLineChart: (batchId: Number, traineeId: Number) =>
    environment.context + `all/reports/batch/${batchId}/overall/trainee/${traineeId}/line-trainee-overall`,

  apiBatchOverallLineChart: (batchId: Number) =>
    environment.context + `all/reports/batch/${batchId}/overall/line-batch-overall`,

  apiCurrentBatchesLineChart: this.context + 'all/reports/dashboard',
  apiCurrentPanelsLineChart: this.context + 'all/reports/biweeklyPanelResults',

  apiTraineeUpToWeekRadarChart: (week: Number, traineeId: Number) =>
    environment.context + `all/reports/week/${week}/trainee/${traineeId}/radar-trainee-up-to-week`,

  apiTraineeOverallRadarChart: (traineeId: Number) =>
    environment.context + `all/reports/trainee/${traineeId}/radar-trainee-overall`,

  apiBatchOverallRadarChart: (batchId: Number) =>
    environment.context + `all/reports/batch/${batchId}/overall/radar-batch-overall`,

  apiBatchAllTraineesRadarChart: (batchId: Number) =>
    environment.context + `all/reports/batch/${batchId}/radar-batch-all-trainees`,

  apiBatchWeekAverageValue: (batchId: Number, weekId: Number) =>
    environment.context + `all/assessments/average/${batchId}/${weekId}`,

  apiTechnologiesForTheWeek: (batchId: Number, weekId: Number) =>
    environment.context + `all/assessments/categories/batch/${batchId}/week/${weekId}`,

  apiPanelBatchAllTrainees: (batchId: Number) =>
    environment.context + `all/reports/batch/${batchId}/panel-batch-all-trainees`,

    /* Evaluation service API endpoints */
  apiFetchAllQCTraineeNotes: (batchId: Number, weekId: Number) =>
  environment.context + `qc/note/trainee/${batchId}/${weekId}`,

apiFetchAllQCBatchNotes: (batchId: Number, weekId: Number) =>
  environment.context + `qc/note/batch/${batchId}/${weekId}`,
};

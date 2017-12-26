// The file contents for the current environment will overwrite these during build.
// The build system defaults to the dev environment which uses `environment.ts`, but if you do
// `ng build --env=prod` then `environment.prod.ts` will be used instead.
// The list of which env maps to which file can be found in `.angular-cli.json`.

export const environment = {
  production: false,
  context: 'http://localhost:8080/',
  bootContext: 'http://localhost/',

  addNewCategory: 'http://localhost:8080/vp/category',
  getAllCategories: 'http://localhost:8080/vp/category',
  addNewTrainer: 'http://localhost:8080/vp/trainer/create',
  editCurrentCategory: 'http://localhost:8080/vp/category/update'
};

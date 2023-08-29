// This file can be replaced during build by using the `fileReplacements` array.
// `ng build --prod` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

// based on platform update either androidVersion or IOSVersion

export const environment = {
  // apiUrl: 'http://localhost:3000',
  // apiUrl: 'https://app-stg.mend.org.au',
  apiUrl: 'https://app.mend.org.au',
  production: false,
  version: '1.3.1',
  // androidVersion: 3
  IOSVersion: 3
};

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/dist/zone-error';  // Included with Angular CLI.

// This file can be replaced during build by using the `fileReplacements` array.
// `ng build` replaces `environment.ts` with `environment.prod.ts`.
// The list of file replacements can be found in `angular.json`.

const url = 'http://103.153.69.217:5059';
export const environment = {
    production: false,
    url: `${url}`,
    imageUrl: `${url}/api/files/images/`,
};

// const url = 'http://103.153.69.217:5055';
// const urlPro = 'http://103.153.69.217:5057';
// export const environment = {
//     production: false,
//     url: `${url}`,
//     imageUrlPro: `${urlPro}/api/files/images/`,
//     urlPro: `${urlPro}`,
// };

/*
 * For easier debugging in development mode, you can import the following file
 * to ignore zone related error stack frames such as `zone.run`, `zoneDelegate.invokeTask`.
 *
 * This import should be commented out in production mode because it will have a negative impact
 * on performance if an error is thrown.
 */
// import 'zone.js/plugins/zone-error';  // Included with Angular CLI.

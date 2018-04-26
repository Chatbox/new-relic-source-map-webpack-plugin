"use strict";
const {publishSourcemap} = require('@newrelic/publish-sourcemap');

module.exports = opts => item => {
   const {
      assets,
      staticAssetUrlBuilder,
      publicPath,
      applicationId,
      nrAdminKey,
      url,
      releaseName,
      releaseId,
      stats
   } = opts;

   const jsFileName = item.replace('.map', '');

   const mapFile = assets[item];
   if (mapFile === undefined || !mapFile.emitted) {
      console.log('could not find source map', sourceMap);
      return Promise.resolve();
   }

   const javascriptUrl = staticAssetUrlBuilder(url, publicPath, jsFileName, stats);
   return new Promise((resolve, reject) => {
      publishSourcemap({
                          sourcemapPath: mapFile.existsAt,
      javascriptUrl,
      applicationId,
      nrAdminKey,
      releaseName,
      releaseId
}, (err) => {
      if (err) {
         reject(err);
      }
      resolve(javascriptUrl);
   });
});
};

"use strict";
const uploadSourceMap = require('./src/uploadSourceMap');
const staticAssetUrlBuilder = require('./src/staticAssetUrlBuilder');
const enforceExists = require('./src/enforceExists');

class NewRelicPlugin {
    constructor(options) {
        if (options.noop) {
            this.apply = () => {};
            return;
        }
        this.applicationId = enforceExists(options, 'applicationId');
        this.nrAdminKey = enforceExists(options, 'nrAdminKey');
        this.staticAssetUrl = enforceExists(options, 'staticAssetUrl');
        this.staticAssetUrlBuilder = options.staticAssetUrlBuilder || staticAssetUrlBuilder;
       this.extensionRegex = options.extensionRegex || /\.js.map$/;
        this.releaseName = options.releaseName || null;
        this.releaseId = options.releaseId || null;
        this.errorCallback = options.errorCallback || this._getDefaultErrorCallback();
    }
    apply(compiler) {
        return compiler.plugin('done', (stats) => {
            return Promise.all(
                Object.keys(stats.compilation.assets)
                .filter(item => this.extensionRegex.test(item))
                .map(uploadSourceMap({
                    assets: stats.compilation.assets,
                    staticAssetUrlBuilder: this.staticAssetUrlBuilder,
                    url: this.staticAssetUrl,
                    publicPath: stats.compilation.outputOptions.publicPath,
                    nrAdminKey: this.nrAdminKey,
                    applicationId: this.applicationId,
                    releaseName: this.releaseName,
                    releaseId: this.releaseId,
                    stats
                }))
            ).then((values) => {
                values.forEach(v => console.log(`sourceMap for ${v} uploaded to newrelic`));
            }).catch((err) => {
                this.errorCallback(err);
            });
        });
    }
    _getDefaultErrorCallback() {
        return (err) => {
            console.warn(`New Relic sourcemap upload error: ${err}`);
        }
    }
};


module.exports = NewRelicPlugin;


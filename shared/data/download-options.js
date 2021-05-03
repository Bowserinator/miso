/* Download options */
const util = require('../shared.js');

/**
 * Options for downloading
 * @author Bowserinator
 */
class DownloadOptions {
    static _allowedKeys = ['downloadDir', 'chapterRange', 'convert', 'keepPostConversion', 'quality'];
    static _allowedConversion = ['pdf', 'cbz', 'none'];

    /**
     * Construct a download options instance. Data keys:
     *      downloadDir: '/path/to/download',
     *      chapterRange: [1, 100],
     *      convert: 'pdf|cbz|none' [default is 'none']
     *      keepPostConversion: false,
     *      quality: [unused for now]
     * 
     * @param {Object} data Data to download
     */
    constructor(data) {
        for (let key of Object.keys(data))
            util.assert(_allowedKeys.includes(key), `Key '${key}' is not allowed in data, did you misspell the key?`);

        // Defaults
        data.convert = data.convert | 'none';

        // Value checks
        util.assert(_allowedConversion.includes(data.sort), `data.convert must be of ${_allowedConversion.join('|')}, got '${data.sort}'`);

        for (let key of Object.keys(data))
            this[key] = data[key];
    }
}

module.exports = DownloadOptions;

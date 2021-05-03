const data = require('../shared/data/data.js');
const { program } = require('commander');

program.version(data.VERSION);

program
    .option('-v, --verbose', 'Output extra debugging info')
    .option('--sort', 'Sorting order in search')
    .option('--dir', 'Download directory for comics/manga/art')
    .option('-r, --range', 'Range of chapters to download (default: all, specify a range like --rn 1-100)')
    .option('-c, --convert', 'Format to convert to, supports cbz|pdf|none (default: none)', 'none')
    .option('--keep', 'Keep files post-conversion')
    .option('-q, --quality', 'Quality of conversion (Not yet implemented)');

    // TODO: --search, --language, --id, --info
    

/**
 * Process args & returns SearchParameter and DownloadOptions
 * @param {Array} args process.argv
 */
module.exports = (args) => {
    program.parse(args);

    // TODO
}

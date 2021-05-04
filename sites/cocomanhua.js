// https://www.cocomanhua.com/
const common = require('../shared/shared.js');
const path = require('path');

/**
 * CocoManhua ids follow this format: https://www.cocomanhua.com/[manhuaID]/[magic number]/[chapter].html
 * For example, https://www.cocomanhua.com/10264/1/467.html
 * 
 * It's unknown what the magic number is for (maybe language or version), so it's always set to 1
 * 
 * @param {String} manhuaId ID For the manhua
 * @param {String} chapter Chapter to download
 * @param {String} magicNumber='1' Unknown, probably language or version, leave as 1
 * @param {String} directory='./' Root directory to save to
 */
function download(manhuaId, chapter, magicNumber=1, directory='./') {
    const url = `https://www.cocomanhua.com/${manhuaId}/${magicNumber}/${chapter}.html`;
    common.pageEval(url, () => {
        let images = [...document.getElementsByClassName('mh_comicpic')];
        images = images.map(img => {
            return {
                page: img.attributes.p.value,
                url: img.getElementsByTagName('img')[0].src
            };
        });
        return images;
    },
    data => {
        for (let d of data)
            common.download(d.url, path.join(directory, d.page + '.png'));
    },
    {
        headless: false,
        delay: 5000,           // Images take some time to render (loaded from js?)
        autoscroll: true,      // Images won't be loaded until scrolled to, so scroll all the way down
        autoscrollTimeout: -1, // Not an infinite scrolling page
        autoscrollDelay: 100,
        autoscrollBy: 200
    });
}


download('10264', 467);

module.exports = (searchOpt, downloadOpt) => {

}
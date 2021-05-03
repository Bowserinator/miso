/** Shared method of passing search parameters */

const util = require('../util.js');

/**
 * Unified search parameters
 * @author Bowserinator
 */
class SearchParameters {
    static _allowedKeys = ['name', 'date', 'id', 'author', 'genreInclude', 'genreExclude', 'sort', 'status'];
    static _allowedSort = ['date', 'top', 'new', 'alpha'];
    static _allowedSortOrder = ['asc', 'dsc'];
    static _allowedStatus = ['ongoing', 'completed'];

    /**
     * Construct a parameter instance form a data.
     * 
     * Expected data configurations:
     *      name:    'Name of the manga'
     *      date:    { start: dateObject, end: dateObject } // Leave one null or undefined for open ranges
     *      id:      'Id of the manga'
     *      author:  'Name of the author'
     *      genreInclude: [ 'array of strings for genres to include' ]
     *      genreExclude: [ 'array og strings for genres to exclude' ]
     *      sort: 'date|top|new|alpha'        [default is 'date']
     *      sortOrder: 'asc|dsc'              [default is 'dsc']
     *      language: 'en'                    [default is 'en']
     *      status: ['ongoing', 'completed']  [default is this]
     * 
     * Note it's up to the site to handle these properties
     *      
     * @param {Array} sources Array of 'sites' to search
     * @param {Object} data An object containing all the data for the search parameter. 
     */ 
    constructor(sources, data){
        for (let key of Object.keys(data))
            util.assert(_allowedKeys.includes(key), `Key '${key}' is not allowed in data, did you misspell the key?`);

        // Defaults
        data.sort = data.sort || 'date';
        data.sortOrder = data.sortOrder || 'dsc';
        data.language = data.language || 'en';
        data.status = data.status || ['ongoing', 'completed'];

        // Value checks
        util.assert(_allowedSort.includes(data.sort), `data.sort must be of ${_allowedSort.join('|')}, got '${data.sort}'`);
        util.assert(_allowedSortOrder.includes(data.sortOrder), `data.sortOrder must be of ${_allowedSortOrder.join('|')}, got '${data.sortOrder}'`);
        util.assert(data.status.every(x => _allowedStatus.includes(x)), `data.status can only contain ${_allowedStatus}, got '${data.status}'`);

        this.sources = sources;
        
        for (let key of Object.keys(data))
            this[key] = data[key];
    }
}

module.exports = SearchParameters;

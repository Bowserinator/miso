/** Random util functions */

module.exports = {
    /**
     * Assert the true-ness of a condition
     * @param {String} condition Condition to check for true-ness
     * @param {String} errorMsg Error message to display on fail, defaults to 'Assert failed'
     */
    assert: (condition, errorMsg) => { if (!condition) throw new Error(errorMsg || 'Assert failed'); } 
};

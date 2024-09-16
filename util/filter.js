const Filter = require('bad-words');

/**
 * Creates and exports a customized instance of the bad-words filter.
 * @param {string} [placeholder='X'] - Character to replace profane words.
 * @returns {Filter} - Configured bad-words filter instance.
 */
const createFilter = (placeholder = '*') => {
  try {
    // Initialize filter with custom placeholder
    return new Filter({ placeHolder: placeholder });
  } catch (error) {
    // Handle errors if any issue occurs during initialization
    console.error('Failed to create filter:', error);
    throw error;
  }
};

const filter = createFilter();

module.exports = filter;

'use strict';

function CategoryTags(categoryID) {
    console.log('here')
    let category;
    
    if (categoryID === 1) {
        category = "ACCOUNT"
    }
    else if (categoryID === 2) {
        category = 'HARDWARE'
    }
    else {
        category = "SOFTWARE"
    };
    return category;
};

module.exports = CategoryTags;
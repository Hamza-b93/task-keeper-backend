'use strict';

function PlatformTags (platformID) {
    let platform;
    
    if (platformID === 1) {
        platform = "MOBILE"
    }
    else if (platformID === 2) {
        platform = 'PC'
    }
    else if (platformID === 3) {
        platform = "PLAYSTATION"
    }
    else {
        platform = 'XBOX'
    };
    return platform;
};

module.exports = PlatformTags;
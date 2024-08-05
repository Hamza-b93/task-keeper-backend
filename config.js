module.exports = {
  JWT_SECRET: "5845fc7ce32268e3fc5dee828c54c35577a25e903e9e32943b5cc84e269928887734554af6819df5c832395e7ca40d63a8fe1ec135b2652c2a88073f2f802cba",
  TEMPORARY_JWT_OPTIONS: {
    algorithm: 'HS512',
    audience: "GameTradesAudience",
    expiresIn: "900s",
    issuer: 'GameTrades.io',
    jwtid: "GTT-02",
    subject: 'Temporary JWT Token Issued By GameTrades.io'
  },
  PERMANENT_JWT_OPTIONS: {
    algorithm: 'HS512',
    // expiresIn: "900s",
    audience: "GameTradesAudience",
    issuer: 'GameTrades.io',
    jwtid: "GTT-01",
    subject: 'Token Issued By GameTrades.io'
  },
  TEMPORARY_JWT_VALIDATION_CONFIG_OPTIONS: {
    algorithms: ['HS512'],
    audience: "GameTradesAudience",
    clockTimestamp: Math.floor(Date.now() / 1000),
    clockTolerance: 30,
    issuer: 'GameTrades.io',
    ignoreExpiration: false,
    ignoreNotBefore: false,
    jwtid: "GTT-02",
    subject: 'Temporary JWT Token Issued By GameTrades.io'
  },
  PERMANENT_JWT_VALIDATION_CONFIG_OPTIONS: {
    algorithms: ['HS512'],
    audience: "GameTradesAudience",
    clockTimestamp: Math.floor(Date.now() / 1000),
    clockTolerance: 30,
    issuer: 'GameTrades.io',
    ignoreExpiration: false,
    ignoreNotBefore: false,
    jwtid: "GTT-01",
    subject: 'Token Issued By GameTrades.io'
  }
};

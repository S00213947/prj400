const { expressjwt: jwt } = require('express-jwt');
const jwksRsa = require('jwks-rsa');

// 🔐 Auth0 config — replace with your real values
const authConfig = {
  domain: 'dev-542njpw2o0b02kdk.us.auth0.com',      // dev-xyz123.us.auth0.com'
  audience: 'https://manager',  // https://your-api.com'
};

const checkJwt = jwt({
  secret: jwksRsa.expressJwtSecret({
    cache: true,
    rateLimit: true,
    jwksRequestsPerMinute: 5,
    jwksUri: `https://${authConfig.domain}/.well-known/jwks.json`,
  }),

  audience: authConfig.audience,
  issuer: `https://${authConfig.domain}/`,
  algorithms: ['RS256'],
});

module.exports = { checkJwt };

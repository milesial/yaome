const express = require('express')
const request = require('request')
const crypto = require('crypto')
const options = require('../options')

// TODO: twitter oauth1 (use package oauth ?)

let router = express.Router()

// Some endpoints are harcoded, some need to be fetched (google)
let endpoints = {}
function fetchEndpoints() {
  return new Promise((resolve , reject) => {
    if (endpoints.google)
      return resolve()

    endpoints.github = {
      code_url: 'https://github.com/login/oauth/authorize',
      token_url: 'https://github.com/login/oauth/access_token',
      profile_url: 'https://api.github.com/user',
    }
    endpoints.facebook = {
      code_url: 'https://www.facebook.com/v4.0/dialog/oauth',
      token_url: 'https://graph.facebook.com/v4.0/oauth/access_token',
      profile_url: 'https://graph.facebook.com/me'
    }
    endpoints.gitlab = {
      code_url: "https://gitlab.com/oauth/authorize",
      token_url: "https://gitlab.com/oauth/token",
      profile_url: 'https://gitlab.com/oauth/userinfo'
    }

    // google need to be fetched
    request.get('https://accounts.google.com/.well-known/openid-configuration',
      { json: true }, (err, res, body) => {
        if (err)
          return reject(err)

        endpoints.google = {
          code_url: body.authorization_endpoint,
          token_url: body.token_endpoint,
        }
        resolve()
      })
  })
}

function getOAuthToken(code, state, provider) {
  // get a token from a code
  return new Promise((resolve , reject) => {
    request.post(endpoints[provider].token_url,
      {
        json: {
          client_id: options.oauth[provider].id,
          client_secret: options.oauth[provider].secret,
          code,
          state,
          grant_type: 'authorization_code',
          redirect_uri: `${options.FRONT_URL}/oauth?provider=${provider}`
        }
      }, (err, res, body) => {
        if (err || res.statusCode != 200)
          reject('Authentification error: ' + err + res.statusCode)
        resolve(body)
      })
  })
}

function checkOAuth(req, res, next) {
  if (!req.oauth)
    return next()
  
  res.cookie('logged', 'true')
  res.cookie('name', req.oauth.name)
    res.redirect(options.FRONT_URL);
}

async function OAuthRedirect(req, res, next) {
  // figure out what step we are in the oauth process
  if (!req.query.provider || req.query.code)
    return next()

  // need to redirect to the provider endpoint
  await fetchEndpoints()

  let state = crypto.randomBytes(20).toString('hex')
  req.session.secret_state = state

  let prov = req.query.provider
  let callback = `${options.FRONT_URL}/oauth?provider=${prov}`
  let url = `${endpoints[prov].code_url}?client_id=${options.oauth[prov].id}&redirect_uri=${encodeURIComponent(callback)}&response_type=code&scope=${options.oauth[prov].scope}&state=${state}`
  res.redirect(url)
}

function OAuthGitlab(req, res, next) {
  if (req.query.provider != "gitlab")
    return next()

  if (req.query.state != req.session.secret_state)
    return next('Authentification error: state mismatch')

  getOAuthToken(req.query.code, req.query.state, 'gitlab')
    .then((body) => {
      // get usr name
      request.get({
        url: endpoints.gitlab.profile_url,
        auth: { bearer: body.access_token },
        json: true
      }, (err, res, body) => {
        if (err || res.statusCode != 200)
          return next('Authentification lookup error: ' + err + res.statusCode)

        req.oauth = {
          id: body.sub,
          name: body.nickname,
          provider: 'gitlab'
        }
        return next()
      })
    })
    .catch(next)
}

function OAuthFacebook(req, res, next) {
  if (req.query.provider != "facebook")
    return next()

  if (req.query.state != req.session.secret_state)
    return next('Authentification error: state mismatch')

  getOAuthToken(req.query.code, req.query.state, 'facebook')
    .then((body) => {
      // get user id and name
      request.get({
        url: endpoints.facebook.profile_url,
        qs: { fields: 'id, name',
          access_token: body.access_token},
        json: true
      }, (err, res, body) => {
        if (err || res.statusCode != 200)
          return next('Authentification lookup error: ' + err + res.statusCode)

        req.oauth = {
          id: body.id.toString(),
          name: body.name,
          provider: 'facebook'
        }
        return next()
      })
    })
    .catch(next)
}

function OAuthGoogle(req, res, next) {
  if (req.query.provider != "google")
    return next()

  if (req.query.state != req.session.secret_state)
    return next('Authentification error: state mismatch')

  getOAuthToken(req.query.code, req.query.state, 'google')
    .then((body) => {
      let jwt = JSON.parse(Buffer.from(body.id_token.split('.')[1], 'base64').toString('ascii'))
      
      req.oauth = {
	id: jwt.sub,
	name: jwt.name ? jwt.name : 'Anonymous',
	provider: 'google'
      }
      return next()
    })
    .catch(next)
}

function OAuthGithub(req, res, next) {
  if (req.query.provider != "github")
    return next()

  if (req.query.state != req.session.secret_state)
    return next('Authentification error: state mismatch')

  getOAuthToken(req.query.code, req.query.state, 'github')
    .then((body) => {
      // get user id and name
      request.get({
        url: endpoints.github.profile_url,
        headers: { 'User-Agent': 'milesial/yaome' },
        auth: { bearer: body.access_token },
        json: true
      }, (err, res, body) => {
        if (err || res.statusCode != 200)
          return next('Authentification lookup error: ' + err + res.statusCode)

        req.oauth = {
          id: body.id.toString(),
          name: body.login,
          provider: 'github'
        }
        return next()
      })
    })
    .catch(next)
}

router.use(OAuthRedirect, OAuthGithub, OAuthGoogle, OAuthFacebook, OAuthGitlab, checkOAuth)

module.exports = router

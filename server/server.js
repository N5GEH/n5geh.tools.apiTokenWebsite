const express = require('express');
const { auth } = require('express-openid-connect');
const path = require('path');
const MemoryStore = require('memorystore')(auth);
const cors = require('cors');
const { DateTime } = require('luxon');

require('dotenv').config();
const app = express();

const NODE_ENV = process.env.NODE_ENV
const HOST = process.env.HOST

app.use(cors())

app.use(express.static(path.join(__dirname, '../build')));

app.use(
    auth({
        issuerBaseURL: process.env.ISSUER_BASE_URL,
        baseURL: process.env.BASE_URL,
        clientID: process.env.CLIENT_ID,
        clientSecret: process.env.CLIENT_SECRET,
        secret: process.env.SECRET,
        authRequired: false,
        idpLogout: false,
        attemptSilentLogin: false,
        baseURL: NODE_ENV === 'production' ? HOST : 'http://localhost:3000',
        session: {
            store: new MemoryStore({
                checkPeriod: 24 * 60 * 1000,
            }),
        },

        authorizationParams: {
            response_type: 'code',
            audience: 'oauth2-tud-cluster-api',
            response_mode: 'form_post',
            scope: 'openid'
        },
        routes: {
            login: '/auth/login',
            callback: '/'
        }
    })
);
app.set('trust proxy', true);
app.get('/userinfo', async (req, res) => {
    if (req.oidc.accessToken == null || req.oidc.accessToken.token_type == null) {
        res.sendStatus(403)
        return
    }

    let { token_type, access_token, isExpired, refresh, expires_in } = req.oidc.accessToken;
    const expiration_date = DateTime.now().setZone('Europe/Berlin').plus({ seconds: expires_in }).toISO();
    if (isExpired()) {
        ({ access_token } = await refresh());
    }

    //let { token_type, access_token } = req.oidc.accessToken;
    //res.sendFile(path.join(__dirname, 'build', 'index.html'));
    //userInfo = req.oidc.fetchUserInfo();
    //console.log(JSON.stringify(userinfo));

    //res.send(`hello  ${req.oidc.user.name} Status of Authentication: ${req.oidc.isAuthenticated()} This Token expires in ${Math.floor(expires_in / 60)} Minutes and ${(expires_in % 60)} Seconds. Your Token is: ${token_type} ${access_token}`);
    res.json({ token_type, access_token, expires_in, expiration_date });
});

//app.get('/refresh', async (req, res) => {
//    let accessToken = req.oidc.accessToken;
//    accessToken = await accessToken.refresh();
//});

app.get('/', function (req, res) {
    res.sendFile(path.join(__dirname, '../build', 'index.html'));
});


app.listen(4000, () => console.log('listening at http://localhost:4000'))
module.exports = app;
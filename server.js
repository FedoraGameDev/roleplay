const express = require("express");
const routes = require("./src/routes");
const path = require("path");
const cors = require("cors");
const bodyparser = require("body-parser");
const firbaseadmin = require("firebase-admin");

const app = express();

if (process.env.NODE_ENV === "production")
{
    const serviceAccount = require("./serviceAccount.json");
    firbaseadmin.initializeApp({
        credential: firbaseadmin.credential.cert(serviceAccount),
        databaseURL: "https://roleplay-e19d6.firebaseio.com"
    });
}
else
{
    const serviceAccount = require("./serviceAccount_DEV.json");
    firbaseadmin.initializeApp({
        credential: firbaseadmin.credential.cert(serviceAccount),
        databaseURL: "https://roleplay-development.firebaseio.com"
    });
}

const allowedOrigins = [
    "http://localhost:3000",
    "http://localhost:3001",
    "http://50.39.111.27:3000",
    "http://simply-roleplay.herokuapp.com/",
    "*"
];

app.use(cors({
    origin: (origin, callback) =>
    {
        if (!origin) return callback(null, true);
        if (allowedOrigins.indexOf(origin) === -1)
        {
            msg = "The CORS policy for this site does not allow access from the specified Origin.";
            return callback(new Error(msg), false);
        }

        return callback(null, true);
    }
}));

app.use(bodyparser.urlencoded({ extended: true }));
app.use(express.json());

app.use("/api/user", routes.user);
app.use("/api/story", routes.story);
app.use("/api/character", routes.character);
app.use(express.static(path.join(__dirname, 'frontend/build')));
app.get('/*', function (req, res)
{
    res.sendFile(path.join(__dirname, 'frontend/build', 'index.html'));
});

let port = process.env.PORT || 3001;
app.listen(port, () =>
{
    console.log(`Listening on port ${port}...`);
});
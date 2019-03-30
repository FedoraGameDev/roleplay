const express = require("express");
const routes = require("./src/routes");
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
    "http://localhost:3000"
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

app.use("/api", routes.api);
app.use("/user", routes.user);
app.use("/story", routes.story);
app.use("/character", routes.character);

let port = process.env.PORT || 3001;
app.listen(port, () =>
{
    console.log(`Listening on port ${port}...`);
});
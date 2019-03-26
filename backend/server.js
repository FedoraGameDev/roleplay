const express = require("express");
const routes = require("./src/routes");
const cors = require("cors");

const app = express();

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

app.use("/api", routes.api);

let port = process.env.PORT || 3001;
app.listen(port, () =>
{
    console.log(`Listening on port ${port}...`);
});
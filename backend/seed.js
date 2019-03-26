const models = require("./src/models");
const db = require("./src/database");

console.log("Defining seed.");
async function seed()
{
    console.log("Checking Arguments...");
    var debug = false;

    process.argv.forEach((val, index) =>
    {
        if (val == "--debug" || val == "-d")
            debug = true;
    });

    console.log("Seeding...");
    try
    {
        if (debug) console.log("Removing all Users...");
        await models.User.deleteMany({});

        if (debug) console.log("Generating User Model...");
        await GenerateUser();
    }
    catch (err)
    {
        console.log(err);
        process.exit();
    }
};

async function GenerateUser()
{
    const person = new models.User({
        uuid: "ilkajhdsvoiuhnawerfiuhaonsklfhoiakwejnfiu23h4r98234",
        username: "New User",
        characters: []
    });

    try
    {
        await person.save();
        process.exit();
    }
    catch (err)
    {
        console.log(err);
        process.exit();
    }
}

console.log("Starting seed...");
seed();
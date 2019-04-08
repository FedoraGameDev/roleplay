const models = require("./src/models");
const db = require("./src/database");

console.log("Defining seed.");
async function seed()
{
    console.log("Checking Arguments...");

    console.log("Seeding...");
    try
    {
        console.log("Removing all Users...");
        await models.User.deleteMany({});

        console.log("Removing all Characters...");
        await models.Character.deleteMany({});

        console.log("Removing all Genres...");
        await models.Genre.deleteMany({});

        console.log("Removing all Stories...");
        await models.Story.deleteMany({});

        console.log("Generating User Model...");
        let user = await GenerateUser();

        console.log("Generating Character Model...");
        let character = await GenerateCharacter(user);

        console.log("Generating Genre Model...");
        let genre = await GenerateGenre();

        console.log("Generating Story Model...");
        await GenerateStory(genre, user, character);
    }
    catch (err)
    {
        console.log(err);
        process.exit();
    }
};

async function GenerateUser()
{
    const user = new models.User({
        uuid: "ilkajhdsvoiuhnawerfiuhaonsklfhoiakwejnfiu23h4r98234",
        username: "New User"
    });

    const fedora = new models.User({
        uuid: "gRJkIknSGXWpg9xqvJMRCK8OFDD3",
        username: "Fedora Dev",
        roles: ["Admin"]
    })

    try
    {
        await user.save();
        await fedora.save();
        return fedora;
    }
    catch (err)
    {
        console.log(err);
        process.exit();
    }
}

async function GenerateCharacter(user)
{
    const character = new models.Character({
        name: "New Character",
        user: user,
        appearance: {
            image: "https://res.cloudinary.com/dbfb8rwim/image/upload/v1554371198/w9ga5ite92psxuguw4im.png"
        }
    });

    try
    {
        await character.save();

        user.characters = [character];
        await user.save();

        return character;
    }
    catch (err)
    {
        console.log(err);
        process.exit();
    }
}

async function GenerateGenre()
{
    const genre = new models.Genre({
        name: "New_Genre"
    });

    try
    {
        await genre.save();
        return genre;
    }
    catch (err)
    {
        console.log(err);
        process.exit();
    }
}

async function GenerateStory(genre, user, character)
{
    const story = new models.Story({
        title: "The First Story",
        description: "The first story to be entered in the database.",
        characters: [character],
        genres: [genre],
        author: user,
        chapters: [{
            title: "Ch 1",
            description: "Some setup stuff and character introductions.",
            posts: [{
                author: user,
                description: "This character has xyz hair color, with some height and weight. He wears fassionable clothes, according to me."
            }]
        }],
        subscribers: [user]
    });

    try
    {
        await story.save();

        user.subscriptions = [story];
        user.notifications = [{
            title: story.title,
            description: `${story.title} has a new post!`,
            link: "localhost:3000/home"
        }]
        await user.save();

        character.stories = [story];
        await character.save();

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
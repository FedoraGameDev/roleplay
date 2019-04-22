const models = require("./src/models");
const db = require("./src/database"); //Required to initialize connection to DB
const axios = require("axios");
const ipsumShort = require("./ipsumShort");
const ipsumLong = require("./ipsumLong");

console.log("Defining seed.");
async function seed()
{
    console.log("Checking Arguments...");

    console.log("Seeding...");
    try
    {
        console.log("Getting Lorem Ipsum...");
        let ipsumLongArray = ipsumLong.ipsumLong.split("\n");
        let ipsumShortArray = ipsumShort.ipsumShort.split("\n");

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
        let quantityShort = 7;
        let startPos = Math.floor(Math.random() * (ipsumShortArray.length - quantityShort));
        let startLongPos = Math.floor(Math.random() * (ipsumLongArray.length - 1));
        let shortInput = [];
        let longInput = ipsumLongArray[startLongPos];
        for (let i = startPos; i < quantityShort; i++)
        {
            shortInput.splice(shortInput.length, 0, ipsumShortArray[i]);
        }
        let character = await GenerateCharacter(user, shortInput, longInput);

        console.log("Generating Genre Model...");
        let genres = await GenerateGenre();

        console.log("Generating Story Model...");
        await GenerateStory(genres, user, character, ipsumShortArray, ipsumLongArray);
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

async function GenerateCharacter(user, shortInput, longInput)
{
    const character = new models.Character({
        name: "Some Guy",
        user: user,
        basicinfo: {
            age: 39,
            gender: "Male",
            birthmonth: 4,
            birthday: 28,
            relationships: shortInput[6],
            backstory: longInput
        },
        appearance: {
            hair: "#c0c0c0",
            eyes: "#182bcf",
            description: shortInput[0],
            image: "https://res.cloudinary.com/dbfb8rwim/image/upload/v1554371198/w9ga5ite92psxuguw4im.png"
        },
        personality: {
            traits: shortInput[1],
            likes: shortInput[2],
            dislikes: shortInput[3],
            habits: shortInput[4],
            quirks: shortInput[5]
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

async function saveGenre(genre)
{
    await genre.save();
}

async function GenerateGenre()
{
    const genres = [
        new models.Genre({ name: "Fantasy" }),
        new models.Genre({ name: "Science Fiction" }),
        new models.Genre({ name: "Western" }),
        new models.Genre({ name: "Romance" }),
        new models.Genre({ name: "Thriller" }),
        new models.Genre({ name: "Mystery" }),
        new models.Genre({ name: "Detective" }),
        new models.Genre({ name: "Dystopia" })
    ];

    try
    {
        genres.forEach(saveGenre);

        return genres;
    }
    catch (err)
    {
        console.log(err);
        process.exit();
    }
}

async function GenerateStory(genres, user, character, ipsumShortArray, ipsumLongArray)
{
    let storyCount = 12;

    try
    {
        console.log(`Generating ${storyCount} stories...`);
        for (let i = 0; i < storyCount; i++)
        {
            const shortQty = 5;
            const longQty = 100;
            const shortIpsum = [];
            const longIpsum = [];
            const genre = genres[Math.floor(Math.random() * genres.length)];
            console.log("pulling short Ipsum...");
            for (let j = 0; j < shortQty; j++)
            {
                const index = Math.floor(Math.random() * (ipsumShortArray.length - 1));
                shortIpsum.splice(shortIpsum.length, 0, ipsumShortArray[index]);
            }
            console.log("pulling long Ipsum...");
            for (let j = 0; j < longQty; j++)
            {
                const index = Math.floor(Math.random() * (ipsumLongArray.length - 1));
                longIpsum.splice(longIpsum.length, 0, ipsumLongArray[index]);
            }

            console.log("Generating chapters...");
            let chapters = [];
            for (let j = 0; j < 4; j++)
            {
                console.log("Generating Posts...");
                let posts = [];
                let postQty = (j === 0) ? 20 : 5;
                let offset = (j === 0) ? 0 : (j === 1) ? 20 : 5 * j - 2;
                for (let k = 0; k < postQty; k++)
                {
                    let ipsumIndex = k + j + chapters.length + offset;
                    posts.splice(posts.length, 0, {
                        author: character,
                        description: longIpsum[ipsumIndex]
                    });
                }

                let ipsumIndex = j + chapters.length + posts.length + offset;
                chapters.splice(chapters.length, 0, {
                    title: `Chapter ${j + 1}`,
                    description: longIpsum[ipsumIndex],
                    posts: posts
                });
            }

            console.log("Fetching a random color...");
            const color = '#' + Math.floor(Math.random() * 16777215).toString(16);
            console.log(`Color: ${color}`);

            console.log("Creating story document...");
            const shortWordedIpsum = shortIpsum[Math.floor(Math.random() * shortIpsum.length)].split(" ");
            const storyTitleArray = [];
            for (let k = 0; k < Math.floor(Math.random() * 3) + 4; k++)
            {
                storyTitleArray.splice(storyTitleArray.length, 0, shortWordedIpsum[k]);
            }
            const storyTitle = storyTitleArray.join(" ");
            const story = new models.Story({
                title: storyTitle,
                description: longIpsum[Math.floor(Math.random() * longIpsum.length)],
                characters: [character],
                genres: [genre],
                author: user,
                chapters: chapters,
                date_created: Date.now(),
                replies: 4,
                subscribers: [user],
                color: color
            });

            console.log("Saving document...");
            await story.save();

            // console.log("Adding subscription...");
            // user.subscriptions = [story];
            // user.notifications = [{
            //     title: story.title,
            //     description: `${story.title} has a new post!`,
            //     link: "localhost:3000/home"
            // }]
            // await user.save();

            // character.stories = [story];
            // await character.save();
        }

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
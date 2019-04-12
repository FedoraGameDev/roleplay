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
        name: "Some Guy",
        user: user,
        basicinfo: {
            age: 39,
            gender: "Male",
            birthmonth: 4,
            birthday: 28,
            relationships: "Sed cras ornare arcu dui vivamus arcu felis bibendum ut. Pulvinar mattis nunc sed blandit libero volutpat sed cras. Condimentum mattis pellentesque id nibh tortor id aliquet lectus. Turpis egestas sed tempus urna. Ultrices dui sapien eget mi proin sed libero enim. Sed sed risus pretium quam vulputate dignissim. Ornare quam viverra orci sagittis eu volutpat odio facilisis mauris. Ullamcorper a lacus vestibulum sed arcu non odio euismod. Diam maecenas sed enim ut sem viverra aliquet eget. Vivamus at augue eget arcu dictum varius duis at. Diam vulputate ut pharetra sit.",
            backstory: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Tellus at urna condimentum mattis. Enim neque volutpat ac tincidunt vitae semper quis lectus. A diam maecenas sed enim ut. Tincidunt augue interdum velit euismod in pellentesque massa placerat. Risus quis varius quam quisque id diam. Semper eget duis at tellus at urna. Neque vitae tempus quam pellentesque. Integer enim neque volutpat ac tincidunt vitae. Amet aliquam id diam maecenas. Enim neque volutpat ac tincidunt. Nisl nunc mi ipsum faucibus vitae aliquet nec ullamcorper. Lobortis scelerisque fermentum dui faucibus in.

Sollicitudin nibh sit amet commodo. Aliquet bibendum enim facilisis gravida neque convallis a. At auctor urna nunc id cursus metus aliquam eleifend mi. Natoque penatibus et magnis dis parturient montes. Sit amet mauris commodo quis imperdiet. Viverra accumsan in nisl nisi scelerisque eu. Lorem dolor sed viverra ipsum nunc aliquet. Aliquet sagittis id consectetur purus ut. Dolor sit amet consectetur adipiscing elit duis tristique. Non diam phasellus vestibulum lorem sed risus ultricies.

Viverra nam libero justo laoreet. Non arcu risus quis varius quam quisque id. Lectus quam id leo in vitae turpis massa. Egestas integer eget aliquet nibh praesent tristique magna sit amet. Placerat duis ultricies lacus sed turpis tincidunt id aliquet risus. Etiam sit amet nisl purus in. Vivamus at augue eget arcu. Amet dictum sit amet justo donec enim diam. Elit ut aliquam purus sit amet luctus. Dignissim diam quis enim lobortis scelerisque fermentum dui. Neque ornare aenean euismod elementum. Netus et malesuada fames ac turpis egestas integer. Blandit cursus risus at ultrices mi. Cursus risus at ultrices mi tempus imperdiet nulla malesuada pellentesque. Augue ut lectus arcu bibendum at varius vel. Vitae semper quis lectus nulla at volutpat. Ac odio tempor orci dapibus ultrices in iaculis. Amet facilisis magna etiam tempor orci eu lobortis.

Cursus metus aliquam eleifend mi in nulla posuere. In iaculis nunc sed augue lacus. Ornare lectus sit amet est. Feugiat sed lectus vestibulum mattis ullamcorper velit sed ullamcorper morbi. Ultricies mi eget mauris pharetra et ultrices neque ornare aenean. Elementum curabitur vitae nunc sed velit. Sed vulputate odio ut enim blandit volutpat maecenas volutpat. Scelerisque fermentum dui faucibus in ornare quam viverra orci sagittis. Laoreet id donec ultrices tincidunt arcu non sodales. Nunc pulvinar sapien et ligula ullamcorper malesuada proin libero nunc. Ut placerat orci nulla pellentesque. Viverra ipsum nunc aliquet bibendum enim facilisis gravida. Leo in vitae turpis massa sed elementum tempus egestas sed. Felis eget nunc lobortis mattis aliquam faucibus purus. Auctor augue mauris augue neque gravida in fermentum et. Eget lorem dolor sed viverra ipsum nunc aliquet bibendum. Faucibus scelerisque eleifend donec pretium vulputate sapien nec sagittis.`
        },
        appearance: {
            hair: "#c0c0c0",
            eyes: "#182bcf",
            description: "Blandit aliquam etiam erat velit scelerisque in dictum. At ultrices mi tempus imperdiet nulla malesuada pellentesque elit. Feugiat nisl pretium fusce id velit ut tortor pretium viverra. Urna et pharetra pharetra massa massa ultricies mi. Quisque id diam vel quam elementum pulvinar etiam. Tempus egestas sed sed risus pretium quam vulputate dignissim. Sed cras ornare arcu dui. Sed velit dignissim sodales ut eu sem. Ut venenatis tellus in metus. Proin libero nunc consequat interdum varius sit. Elit ullamcorper dignissim cras tincidunt lobortis feugiat vivamus at. Nisi vitae suscipit tellus mauris a diam maecenas sed.",
            image: "https://res.cloudinary.com/dbfb8rwim/image/upload/v1554371198/w9ga5ite92psxuguw4im.png"
        },
        personality: {
            traits: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Massa tempor nec feugiat nisl pretium. Libero justo laoreet sit amet cursus sit amet dictum. Sit amet nulla facilisi morbi tempus iaculis urna id. Felis imperdiet proin fermentum leo vel. Aliquam id diam maecenas ultricies mi eget mauris pharetra. Sed ullamcorper morbi tincidunt ornare massa. At erat pellentesque adipiscing commodo elit.",
            likes: "Eu consequat ac felis donec et odio pellentesque. Amet consectetur adipiscing elit ut aliquam. Mollis nunc sed id semper risus in hendrerit gravida. Egestas pretium aenean pharetra magna ac placerat vestibulum. Odio ut enim blandit volutpat. Odio pellentesque diam volutpat commodo sed egestas egestas fringilla. Ullamcorper dignissim cras tincidunt lobortis. Leo duis ut diam quam nulla. Aliquet sagittis id consectetur purus ut faucibus pulvinar elementum integer. Sit amet consectetur adipiscing elit pellentesque habitant morbi. Sem et tortor consequat id porta nibh venenatis cras sed.",
            dislikes: "Quis commodo odio aenean sed adipiscing. Scelerisque felis imperdiet proin fermentum leo vel orci. Arcu cursus vitae congue mauris rhoncus aenean vel elit. Enim ut tellus elementum sagittis vitae et leo duis. Vitae et leo duis ut diam. Elit scelerisque mauris pellentesque pulvinar pellentesque habitant morbi.",
            habits: "Feugiat vivamus at augue eget arcu dictum varius duis. Tincidunt praesent semper feugiat nibh sed. Habitant morbi tristique senectus et netus et malesuada fames. Dignissim convallis aenean et tortor at risus viverra adipiscing. Magna eget est lorem ipsum dolor. Massa tincidunt dui ut ornare lectus sit amet.",
            quirks: "Tincidunt vitae semper quis lectus nulla. Viverra nibh cras pulvinar mattis nunc. Consequat id porta nibh venenatis cras sed felis eget velit. Fusce id velit ut tortor pretium viverra suspendisse potenti. Felis eget velit aliquet sagittis id consectetur purus ut. Vehicula ipsum a arcu cursus vitae congue. Ullamcorper eget nulla facilisi etiam dignissim diam quis enim lobortis."
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
    const fantasy = new models.Genre({ name: "Fantasy" });
    const scienceFiction = new models.Genre({ name: "Science Fiction" });
    const western = new models.Genre({ name: "Western" });
    const romance = new models.Genre({ name: "Romance" });
    const thriller = new models.Genre({ name: "Thriller" });
    const mystery = new models.Genre({ name: "Mystery" });
    const detective = new models.Genre({ name: "Detective" });
    const dystopia = new models.Genre({ name: "Dystopia" });

    try
    {
        await fantasy.save();
        await scienceFiction.save();
        await western.save();
        await romance.save();
        await thriller.save();
        await mystery.save();
        await detective.save();
        await dystopia.save();
        return fantasy;
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
        chapters: [
            {
                title: "Chapter 1",
                description: "Some setup stuff and character introductions.",
                posts: [{
                    author: character,
                    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Arcu ac tortor dignissim convallis aenean et. Nec feugiat nisl pretium fusce id velit ut tortor pretium. Sit amet luctus venenatis lectus magna fringilla. Tempor orci eu lobortis elementum. Ullamcorper sit amet risus nullam eget felis eget nunc lobortis. Id porta nibh venenatis cras sed felis eget velit aliquet. Quam elementum pulvinar etiam non quam lacus suspendisse faucibus interdum. Nulla porttitor massa id neque aliquam. Sagittis nisl rhoncus mattis rhoncus urna neque viverra justo nec. Dictum varius duis at consectetur lorem donec massa sapien faucibus.

Sed tempus urna et pharetra pharetra massa massa. Velit euismod in pellentesque massa placerat duis ultricies lacus sed. Felis eget nunc lobortis mattis aliquam faucibus. Tellus cras adipiscing enim eu turpis egestas pretium. Aliquet nec ullamcorper sit amet risus nullam eget felis. Cras ornare arcu dui vivamus arcu felis bibendum ut. Odio eu feugiat pretium nibh ipsum consequat nisl vel pretium. Est sit amet facilisis magna etiam tempor. Sed viverra tellus in hac. Sed risus ultricies tristique nulla aliquet. Eget gravida cum sociis natoque penatibus et magnis dis. Aliquet porttitor lacus luctus accumsan tortor posuere ac. Sit amet mauris commodo quis imperdiet massa tincidunt nunc pulvinar. Euismod elementum nisi quis eleifend quam adipiscing vitae proin sagittis. Diam ut venenatis tellus in metus.
                    `
                }]
            },
            {
                title: "Chapter 2",
                description: "The baddy introduces themselves as a familiar figure to the characters leading many to believe they are good.",
                posts: [{
                    author: character,
                    description: `Viverra suspendisse potenti nullam ac tortor. Nunc congue nisi vitae suscipit. Volutpat ac tincidunt vitae semper quis lectus. Tristique nulla aliquet enim tortor at auctor urna. Sit amet consectetur adipiscing elit ut aliquam purus. Dictum at tempor commodo ullamcorper a. Suspendisse sed nisi lacus sed viverra. Tortor vitae purus faucibus ornare. Neque ornare aenean euismod elementum nisi quis eleifend quam adipiscing. Eget gravida cum sociis natoque penatibus et magnis. Viverra nam libero justo laoreet. Molestie nunc non blandit massa enim. Vulputate mi sit amet mauris commodo quis imperdiet. Et ligula ullamcorper malesuada proin libero nunc consequat interdum. Cursus vitae congue mauris rhoncus aenean vel elit. Eget nulla facilisi etiam dignissim.

Nullam eget felis eget nunc lobortis mattis aliquam. Viverra accumsan in nisl nisi scelerisque eu ultrices vitae auctor. Ultricies leo integer malesuada nunc vel risus commodo viverra. Aliquet porttitor lacus luctus accumsan tortor posuere. Eu feugiat pretium nibh ipsum consequat nisl vel pretium. Nunc id cursus metus aliquam eleifend mi. Turpis nunc eget lorem dolor sed viverra ipsum. Amet risus nullam eget felis eget nunc lobortis mattis aliquam. Nulla facilisi morbi tempus iaculis urna. Blandit cursus risus at ultrices mi tempus imperdiet. Nunc lobortis mattis aliquam faucibus purus.`
                }]
            },
            {
                title: "Chapter 3",
                description: "Characters are pushed to fix some world problems that are caused by som mysterious force.",
                posts: [{
                    author: character,
                    description: `Vitae sapien pellentesque habitant morbi tristique senectus et. Euismod lacinia at quis risus sed vulputate odio ut. Ut consequat semper viverra nam libero justo laoreet sit. Nam libero justo laoreet sit. Vitae elementum curabitur vitae nunc. Donec ac odio tempor orci dapibus ultrices in iaculis nunc. Ultrices sagittis orci a scelerisque purus semper eget duis at. In hendrerit gravida rutrum quisque. A cras semper auctor neque vitae tempus quam. Elit scelerisque mauris pellentesque pulvinar. Eros in cursus turpis massa. Lacus sed turpis tincidunt id. Sit amet nisl purus in mollis nunc sed. Interdum varius sit amet mattis. Rhoncus mattis rhoncus urna neque. Pulvinar sapien et ligula ullamcorper malesuada. Dignissim diam quis enim lobortis scelerisque fermentum.`
                }]
            },
            {
                title: "Chapter 4",
                description: "Evil reveals itself as the familiar character from the past.",
                posts: [{
                    author: character,
                    description: `Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Eu facilisis sed odio morbi quis commodo odio. Rutrum quisque non tellus orci ac auctor augue. Vulputate ut pharetra sit amet aliquam. Amet mauris commodo quis imperdiet massa. Leo vel orci porta non pulvinar neque laoreet. At urna condimentum mattis pellentesque id. Varius quam quisque id diam vel. Mauris rhoncus aenean vel elit scelerisque mauris. In ante metus dictum at tempor commodo ullamcorper a lacus. Convallis posuere morbi leo urna molestie at elementum eu. Enim blandit volutpat maecenas volutpat blandit aliquam. Id volutpat lacus laoreet non curabitur. Vel orci porta non pulvinar neque laoreet suspendisse interdum.

Sem nulla pharetra diam sit amet nisl suscipit adipiscing. Et magnis dis parturient montes. Iaculis at erat pellentesque adipiscing commodo elit. Aliquam etiam erat velit scelerisque in dictum. Hendrerit gravida rutrum quisque non. Magna fringilla urna porttitor rhoncus dolor purus non enim praesent. Etiam erat velit scelerisque in dictum. Ultricies lacus sed turpis tincidunt id. Bibendum neque egestas congue quisque egestas diam in arcu. Turpis in eu mi bibendum neque egestas congue. Bibendum est ultricies integer quis auctor elit sed vulputate mi. Justo donec enim diam vulputate ut pharetra sit amet aliquam. Metus dictum at tempor commodo ullamcorper a lacus vestibulum sed. Lectus nulla at volutpat diam ut venenatis. Placerat vestibulum lectus mauris ultrices. Imperdiet sed euismod nisi porta lorem. Etiam non quam lacus suspendisse faucibus.

Mauris augue neque gravida in. Habitasse platea dictumst vestibulum rhoncus est pellentesque elit ullamcorper. Feugiat nibh sed pulvinar proin gravida hendrerit lectus a. Scelerisque mauris pellentesque pulvinar pellentesque. Blandit aliquam etiam erat velit scelerisque in dictum non consectetur. At risus viverra adipiscing at in tellus integer. Eleifend quam adipiscing vitae proin sagittis nisl rhoncus. Sagittis purus sit amet volutpat consequat mauris nunc congue nisi. Mauris pharetra et ultrices neque ornare aenean euismod elementum. Lectus mauris ultrices eros in cursus. Elit sed vulputate mi sit amet mauris commodo quis imperdiet. Vitae aliquet nec ullamcorper sit. Aliquet porttitor lacus luctus accumsan tortor posuere. Aliquam vestibulum morbi blandit cursus risus at. Nulla facilisi cras fermentum odio eu feugiat pretium nibh ipsum. Sagittis aliquam malesuada bibendum arcu. Nibh venenatis cras sed felis eget. Tempus iaculis urna id volutpat lacus laoreet non curabitur gravida. Ultrices vitae auctor eu augue ut lectus arcu bibendum.`
                }]
            }
        ],
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
const gql = require('graphql');
const fs = require('fs');
const scalars = require('@looop/graphql-scalars');
const json = JSON.parse(fs.readFileSync('./data.json.db'));

function push() {
    console.log(json);
    fs.writeFileSync('./data.json.db', JSON.stringify(json, undefined, 4));
}

new gql.GraphQLScalarType({
    name: 'Version',
    description: 'A version string',
    serialize(value) {
        return value;
    },
    parseValue(value) {
        return value;
    },
    parseLiteral(ast) {
        return ast.value;
    },
});
const version = new scalars.RegularExpression('Version', /^v\d+\.\d+\.\d+$/, {
    errorMessage: (regex, value) => {
        return `Value: "${value}" is not a valid Version, should follow: ${regex}`;
    },
});

const app = new gql.GraphQLObjectType({
    name: 'App',
    fields: {
        name: {
            type: new gql.GraphQLNonNull(gql.GraphQLString),
            description: "The app's name",
            args: {
                name: { type: gql.GraphQLString },
            },
            resolve: (_, args) => {
                if (args.name) {
                    _.name = args.name;
                    push();
                }
                return _.name;
            },
        },
        id: {
            type: new gql.GraphQLNonNull(gql.GraphQLInt),
            description: "The app's id",
            resolve: (_) => {
                return _.id;
            },
        },
        description: {
            type: gql.GraphQLString,
            description: "The app's description",
            args: {
                description: { type: gql.GraphQLString },
            },
            resolve: (_, args) => {
                if (args.description) {
                    _.description = args.description;
                    push();
                }
                return _.description;
            },
        },
        version: {
            type: gql.GraphQLNonNull(version),
            description: "The app's version",
            args: {
                version: { type: version },
            },
            resolve: (_, args) => {
                if (args.version) {
                    _.version = args.version;
                    push();
                }
                return _.version;
            },
        },
        url: {
            type: new gql.GraphQLNonNull(scalars.URL),
            description: "The app's url",
            args: {
                url: { type: scalars.URL },
            },
            resolve: (_, args) => {
                if (args.url) {
                    _.url = args.url;
                    push();
                }
                return _.url;
            },
        },
        delete: {
            type: gql.GraphQLString,
            description: 'Delete the user',
            resolve: (_) => {
                for (var u in json.users) {
                    if (json.users[u].id == _.id) {
                        json.users.splice(u, 1);
                        push();
                        return;
                    }
                }
            },
        },
        author: {
            type: new gql.GraphQLNonNull(gql.GraphQLInt),
            description: "The author's id",
            resolve: (_) => {
                return _.author;
            },
        },
    },
});

const user = new gql.GraphQLObjectType({
    name: 'User',
    fields: {
        id: {
            type: new gql.GraphQLNonNull(gql.GraphQLInt),
            description: "The user's id",
            resolve: (_) => {
                return _.id;
            },
        },
        name: {
            type: new gql.GraphQLNonNull(gql.GraphQLString),
            description: "The user's name",
            args: {
                name: { type: gql.GraphQLString },
            },
            resolve: (_, args) => {
                if (args.name) {
                    _.name = args.name;
                    push();
                }
                return _.name;
            },
        },
        delete: {
            type: gql.GraphQLString,
            description: 'Delete the user',
            resolve: (_) => {
                for (var u in json.users) {
                    if (json.users[u].id == _.id) {
                        json.users.splice(u, 1);
                        push();
                        return;
                    }
                }
            },
        },
        apps: {
            type: new gql.GraphQLNonNull(new gql.GraphQLList(app)),
            description: 'The apps the user has published.',
            resolve: (_) => {
                var as = [];
                for (var a of json.apps) {
                    if (a.author == _.id) {
                        as.push(a);
                    }
                }
                return as;
            },
        },
    },
});

const schema = new gql.GraphQLSchema({
    query: new gql.GraphQLObjectType({
        name: 'Query',
        fields: {
            getUserById: {
                type: user,
                description: 'Returns a single user based on their id.',
                args: {
                    id: { type: new gql.GraphQLNonNull(gql.GraphQLInt) },
                },
                resolve: (_, args) => {
                    for (var u of json.users) {
                        if (u.id == args.id) {
                            return u;
                        }
                    }
                },
            },
            getUsersByName: {
                type: new gql.GraphQLNonNull(new gql.GraphQLList(user)),
                description: 'Returns users based on their name.',
                args: {
                    name: { type: new gql.GraphQLNonNull(gql.GraphQLString) },
                },
                resolve: (_, args) => {
                    var us = [];
                    for (var u of json.users) {
                        if (u.name == args.name) {
                            us.push(u);
                        }
                    }
                    return us;
                },
            },
            getAppById: {
                type: app,
                description: 'Returns a single app based on their id.',
                args: {
                    id: { type: new gql.GraphQLNonNull(gql.GraphQLInt) },
                },
                resolve: (_, args) => {
                    for (var u of json.apps) {
                        if (u.id == args.id) {
                            return u;
                        }
                    }
                },
            },
            searchApps: {
                type: new gql.GraphQLNonNull(new gql.GraphQLList(app)),
                description: 'Returns apps based on their name.',
                args: {
                    search: { type: new gql.GraphQLNonNull(gql.GraphQLString) },
                },
                resolve: (_, args) => {
                    var us = [];
                    for (var u of json.apps) {
                        if (
                            u.name
                                .toLowerCase()
                                .indexOf(args.search.toLowerCase()) > -1
                        ) {
                            us.push(u);
                        }
                    }
                    return us;
                },
            },
            createUser: {
                type: user,
                description:
                    'Creates a user appends it to the data and returns it.',
                args: {
                    name: { type: new gql.GraphQLNonNull(gql.GraphQLString) },
                },
                resolve: (_, args) => {
                    var id = 1;
                    var idex = true;
                    while (idex) {
                        idex = false;
                        for (var u of json.users) {
                            if (u.id == id) {
                                idex = true;
                                id++;
                            }
                        }
                    }
                    var n = {
                        id: id,
                        name: args.name,
                    };
                    json.users.push(n);
                    push();
                    return n;
                },
            },
            createApp: {
                type: app,
                description:
                    'Creates an app appends it to the data and returns it.',
                args: {
                    name: { type: new gql.GraphQLNonNull(gql.GraphQLString) },
                    url: { type: new gql.GraphQLNonNull(gql.GraphQLString) },
                    author: { type: new gql.GraphQLNonNull(gql.GraphQLInt) },
                    description: { type: gql.GraphQLString },
                },
                resolve: (_, args) => {
                    var id = 1;
                    var idex = true;
                    while (idex) {
                        idex = false;
                        for (var u of json.apps) {
                            if (u.id == id) {
                                idex = true;
                                id++;
                            }
                        }
                    }
                    var n = {
                        id: id,
                        name: args.name,
                        author: args.author,
                        url: args.url,
                        description: args.description,
                    };
                    json.apps.push(n);
                    push();
                    return n;
                },
            },
            users: {
                type: new gql.GraphQLNonNull(new gql.GraphQLList(user)),
                description: 'Returns all users.',
                resolve: () => {
                    return json.users;
                },
            },
            apps: {
                type: new gql.GraphQLNonNull(new gql.GraphQLList(app)),
                description: 'Returns all apps.',
                resolve: () => {
                    return json.apps;
                },
            },
        },
    }),
});

const s = gql
    .printSchema(schema, {
        commentDescriptions: true,
    })
    .replace(/\ \ /g, '    ');
console.log(s);
fs.writeFileSync('./schema.gql', s);

module.exports = { schema, s };

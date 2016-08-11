var sections = [
    {
        "tag": "h1",
        "html": "Overview"
    },
    {
        "tag": "p",
        "html": "The <span class='routing-js'></span> framework is one that is designed to be simple &mdash; a framework you can learn front to back in a single day. In the creation of this MVC-style framework I've taken the great parts of Angular and other frameworks and distilled them to simple concepts."
    },
    {
        "tag": "p",
        "html": "If you are looking for a framework that takes care of every step, this isn't it. A good portion of your project will still be decoupled from this framework however <span class='routing-js'></span> does aim to accomplish a total reduction of event listeners and element creation by way of node building in JavaScript."
    },
    {
        "tag": "p",
        "html": "There are a few major goals that this framework seeks to accomplish:"
    },
    {
        "tag": "ol",
        "data": [
            {
                "tag": "li",
                "value": "Framework that can be learned and used to its full extent within a day."
            },
            {
                "tag": "li",
                "value": "Simple mechanism for repeating HTML dynamically."
            },
            {
                "tag": "li",
                "value": "Reversed event-listener system that efficiently binds and queues callbacks."
            },
            {
                "tag": "li",
                "value": "View-based data storage."
            }
        ]
    },
    {
        "tag": "p",
        "html": "Let's continue below to &ldquo;Getting Started&rdquo; to find out more."
    },
    {
        "tag": "h1",
        "html": "Getting Started"
    },
    {
        "tag": "p",
        "html": "The <span class='routing-js'></span> framework works by creating a view element in the <span class='code'>&lt;body&gt;</span> of your code, and then filling it dynamically with content based off of routes that you specify."
    },
    {
        "tag": "h3",
        "html": "A New RouteConfig Instance"
    },
    {
        "tag": "JSCode",
        "html": "var route = new RouteConfig(\"#view\");"
    },
    {
        "tag": "p",
        "html": "The first thing you need to do is create a new instance of the <span class='code'>RouteConfig</span> class."
    },
    {
        "tag": "argumentTable",
        "data": {
            "head": [
                {
                    "value": ""
                },
                {
                    "value": ""
                },
                {
                    "value": ""
                }
            ],
            "body": [
                {
                    "row": [
                        {
                            "value": "selector",
                            "class": "name"
                        },
                        {
                            "value": "String",
                            "class": "type"
                        },
                        {
                            "value": "The selector of the node to be tied to the view.",
                            "class": "description"
                        }
                    ]
                }
            ]
        }
    },
    {
        "tag": "h1",
        "html": "Routes"
    },
    {
        "tag": "p",
        "html": "Think of routes like webpages. The only difference is that instead of loading a new page, the hash is changed."
    },
    {
        "tag": "h3",
        "html": "route.add"
    },
    {
        "tag": "JSCode",
        "html": "var route = new RouteConfig(\"#view\");\n// attach a 'RouteConfig' to '#view'.\nroute.add(\"home\", \"path/to/home.html\", \"path/to/home.js\");"
    },
    {
        "tag": "p",
        "html": "You can add a route with the <span class='code'>route.add</span> functionality — specify a route name, path to html, and path to js to complete a route!"
    },
    {
        "tag": "argumentTable",
        "data": {
            "head": [
                {
                    "value": ""
                },
                {
                    "value": ""
                },
                {
                    "value": ""
                }
            ],
            "body": [
                {
                    "row": [
                        {
                            "value": "route_name",
                            "class": "name"
                        },
                        {
                            "value": "String",
                            "class": "type"
                        },
                        {
                            "value": "The name of the route. This will appear in the hash of the browser's address bar when the view loads.",
                            "class": "description"
                        }
                    ]
                },
                {
                    "row": [
                        {
                            "value": "html",
                            "class": "name"
                        },
                        {
                            "value": "String",
                            "class": "type"
                        },
                        {
                            "value": "A link to the HTML template you want to import.",
                            "class": "description"
                        }
                    ]
                },
                {
                    "row": [
                        {
                            "value": "js",
                            "class": "name"
                        },
                        {
                            "value": "String",
                            "class": "type"
                        },
                        {
                            "value": "A link to the JavaScript template.",
                            "class": "description"
                        }
                    ]
                }
            ]
        }
    },
    {
        "tag": "h3",
        "html": "route.config"
    },
    {
        "tag": "p",
        "html": "The <span class='code'>config</span> option allows you to set preferences for the routing system. Currently this only supports <span class='code'>cache</span> which is a <span class='code'>Boolean</span> that defaults to <span class='code'>true</span>."
    },
    {
        "tag": "argumentTable",
        "data": {
            "head": [
                {
                    "value": ""
                },
                {
                    "value": ""
                },
                {
                    "value": ""
                }
            ],
            "body": [
                {
                    "row": [
                        {
                            "value": "config",
                            "class": "name"
                        },
                        {
                            "value": "Object",
                            "class": "type"
                        },
                        {
                            "value": "An object of configuration properties for the route.",
                            "class": "description"
                        }
                    ]
                }
            ]
        }
    },
    {
        "tag": "h3",
        "html": "route.template"
    },
    {
        "tag": "p",
        "html": "The <span class='code'>template</span> option allows you to add a sheet full of dynamic templates to use at a later time. Go to the section on Templating to find out more about how to construct a template."
    },
    {
        "tag": "argumentTable",
        "data": {
            "head": [
                {
                    "value": ""
                },
                {
                    "value": ""
                },
                {
                    "value": ""
                }
            ],
            "body": [
                {
                    "row": [
                        {
                            "value": "path",
                            "class": "name"
                        },
                        {
                            "value": "String",
                            "class": "type"
                        },
                        {
                            "value": "The path of where the template can be found.",
                            "class": "description"
                        }
                    ]
                }
            ]
        }
    },
    {
        "tag": "h3",
        "html": "route.deploy"
    },
    {
        "tag": "p",
        "html": "The <span class='code'>deploy</span> feature sends a user to the route and renders the view of the <span class='code'>name</span> parameter."
    },
    {
        "tag": "argumentTable",
        "data": {
            "head": [
                {
                    "value": ""
                },
                {
                    "value": ""
                },
                {
                    "value": ""
                }
            ],
            "body": [
                {
                    "row": [
                        {
                            "value": "name",
                            "class": "name"
                        },
                        {
                            "value": "String",
                            "class": "type"
                        },
                        {
                            "value": "The name of the route to deploy to the view.",
                            "class": "description"
                        }
                    ]
                }
            ]
        }
    },
    {
        "tag": "p",
        "html": "If the route does not exist, it will <span class='code'>console.warn</span> and remain at the same route. In other cases, the controller runs a transition that can be defined by the user and then navigates to the new view."
    },
    {
        "tag": "h3",
        "html": "route.controller"
    },
    {
        "tag": "p",
        "html": "The <span class='code'>controller</span> feature allows for a view-specific controller. In here, you have access to the <span class='code'>$scope</span> of the view which will be populated with event listeners, <span class='code'>b-repeats</span>, and other custom objects. The <span class='code'>$data</span> argument is where you are free to store any data you find necessary to be attached to the particular view. This data can be saved and stored between browser sessions. Lastly, the <span class='code'>view</span> argument is an object of essential information such as the container the view is held in and the previous view."
    },
    {
        "tag": "p",
        "html": "The callback is where you'll be deploying most of your code. All the features of this library such as <span class='code'>$scope.repeat</span>, JS Templating, and event listener adding can only be deployed to a specific view <span class='code'>$scope</span> inside of the callback."
    }
]
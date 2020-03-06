import { Atom } from "@thi.ng/atom";
import { start } from "@thi.ng/hdom";
import { setIn } from "@thi.ng/paths";
import type { Path } from "@thi.ng/api";

// central immutable app state
const db = new Atom({ state: "login" });

// define views for different state values
const appState = db.addView<string>("state");
const error = db.addView<string>("error");
// specify a view transformer for the username value
const user = db.addView<string>("user.name", (x) =>
    x ? x.charAt(0).toUpperCase() + x.substr(1) : null
);

// state update functions
const setValue = (path: Path, val: any) =>
    db.swap((state) => setIn(state, path, val));
const setState = (s: any) => setValue(appState.path, s);
const setError = (err: string | null) => setValue(error.path, err);
const setUser = (e: Event) => setValue(user.path, (<any>e.target).value);
const loginUser = () => {
    if (user.deref() && user.deref()!.toLowerCase() === "admin") {
        setError(null);
        setState("main");
    } else {
        setError("sorry, wrong username (try 'admin')");
    }
};
const logoutUser = () => {
    setValue(user.path, null);
    setState("logout");
};

// components for different app states
// note how the value views are used here
const uiViews: any = {
    // dummy login form
    login: () => [
        "div#login",
        ["h1", "Login"],
        error.deref() ? ["div.error", error] : undefined,
        ["input", { type: "text", onchange: setUser }],
        ["button", { onclick: loginUser }, "Login"]
    ],
    logout: () => [
        "div#logout",
        ["h1", "Good bye"],
        "You've been logged out. ",
        ["a", { href: "#", onclick: () => setState("login") }, "Log back in?"]
    ],
    main: () => [
        "div#main",
        ["h1", `Welcome, ${user.deref()}!`],
        ["div", "Current app state:"],
        [
            "div",
            [
                "textarea",
                { cols: 40, rows: 10 },
                JSON.stringify(db.deref(), null, 2)
            ]
        ],
        ["button", { onclick: logoutUser }, "Logout"]
    ]
};

// finally define another derived view for the app state value
// including a transformer, which maps the current app state value
// to its correct UI component (incl. a fallback for illegal app states)
const currView = db.addView(
    appState.path,
    (state) =>
        uiViews[state] || ["div", ["h1", `No component for state: ${state}`]]
);

// app root component
const app = () => [
    "div",
    currView,
    ["footer", "Made with @thi.ng/atom and @thi.ng/hdom"]
];

start(app);

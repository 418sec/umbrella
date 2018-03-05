import { IAtom } from "@thi.ng/atom/api";
import { Atom } from "@thi.ng/atom/atom";
import { Cursor } from "@thi.ng/atom/cursor";
import { start } from "@thi.ng/hdom";

type CardFn = (state: IAtom<any>) => any;

// counter for untitled cards
let CARD_ID = 1;

/**
 * Inspired by Bruce Haumann's Devcards project:
 * https://github.com/bhauman/devcards/
 *
 * This function takes a component initializer function, an optional
 * pre-initialized state atom, card title and DOM parent element.
 * It then initializes any missing args and kicks off a new hdom
 * render loop to run as self-contained app.
 *
 * If no state is given, a new atom is created automatically.
 * The supplied component function should accept this state as sole argument,
 * do any necessary initialization of sub-components and then return
 * the actual root component (or function) for this app.
 *
 * As with the original Devcards, the client root component is wrapped
 * in a card container, which too displays the app state in JSON format.
 *
 * @param card
 * @param state
 * @param title
 * @param parent
 */
function defcard(card: CardFn, state?: IAtom<any>, title?: string, parent?: string | Element) {
    state = state || new Atom({});
    title = title || `devcard-${CARD_ID++}`;

    // create new parent element if not provided
    if (!parent) {
        parent = document.createElement("div");
        document.body.appendChild(parent);
    }

    // Create a derived view for entire atom (using empty path `[]`)
    // this updates the JSON body only when state has changed
    const json = state.addView([], (state) => JSON.stringify(state, null, 2));

    // instantiate the component with supplied state
    const root = card(state);

    // kick off hdom renderloop
    start(parent, () => ["div.card", ["h3", title], ["div.body", root, ["pre", json.deref()]]]);
}

/**
 * Value slider component options (see function below)
 */
interface SliderOpts {
    min: number;
    max: number;
    step?: number;
    label: (val) => any;
    onchange?: (e) => void;
}

/**
 * Standalone slider component.
 * Takes an IAtom instance (here usually a Cursor)
 * and slider options, returns component function.
 * When the slider value is changed, automatically
 * resets cursor's value and calls user `onchange`
 * function (if provided).
 *
 * @param state
 * @param opts
 */
function slider(state: IAtom<any>, opts: SliderOpts) {
    // prep attribs to avoid extra work during render
    const attribs = {
        ...opts,
        type: "range",
        oninput: (e) => {
            state.reset(e.target.value);
            opts.onchange && opts.onchange(e);
        }
    };
    return () =>
        ["div",
            ["div", opts.label(state.deref())],
            ["input", { ...attribs, value: state.deref() }]];
}

/**
 * This function is a self contained app to be used with
 * the above `defcard()` factory. It receives a state atom
 * for storing its internal state, initializes the different
 * slider components used and finally return a component
 * function to be shown in the card wrapper.
 *
 * @param state
 */
function bmi(state: IAtom<any>) {
    // state update function
    // computes new BMI value (if weight was changed) or
    // new weight value (if BMI was changed by user)
    const calc = (updateWeight = false) => {
        let { height, weight, bmi } = <any>(state.deref() || {});
        height *= 0.01;
        if (updateWeight) {
            state.resetIn("weight", bmi * height * height);
        } else {
            state.resetIn("bmi", weight / (height * height));
        }
    };
    // derived view of bmi value to translate it into english
    const bmiClass = state.addView(
        "bmi",
        (bmi: number) =>
            bmi < 18.5 ? "underweight" :
                bmi < 25 ? "normal" :
                    bmi < 30 ? "overweight" : "obese"
    );
    // define slider components
    // note how each uses a cursor to their respective
    // target values in the app state
    const height = slider(
        new Cursor(state, "height"),
        {
            min: 100, max: 220,
            label: (v) => `Height: ${~~v}cm`,
            onchange: () => calc()
        }
    );
    const weight = slider(
        new Cursor(state, "weight"),
        {
            min: 10, max: 200,
            label: (v) => `Weight: ${~~v}kg`,
            onchange: () => calc()
        }
    );
    const bmi = slider(
        new Cursor(state, "bmi"),
        {
            min: 10, max: 50,
            label: (v) => ["span", { class: bmiClass.deref() }, `BMI: ${~~v} (${bmiClass.deref()})`],
            onchange: () => calc(true)
        }
    );

    // perform initial calculation
    calc();

    return () => ["div", height, weight, bmi];
}

/**
 * All what's left to do here is to instantiate a bunch of cards (apps):
 *
 * Option 1: Two defcard() instances, each with their own, individual state atom
 */
defcard(bmi, new Atom({ weight: 75, height: 194 }), "BMI calculator");
defcard(bmi);


defcard(() => "The cards below are all attached to the same atom, but use cursors to subscribe to different branches within the nested state.");

/**
 * Option 2: defcard() instances using shared central state
 */
const db = new Atom({ card1: { weight: 75, height: 194 } });

defcard(bmi, new Cursor(db, "card1"), "BMI calculator (shared)");
defcard(bmi, new Cursor(db, "card2"));

defcard(() => {
    // just some random task to populate another part of the app state
    setInterval(() => db.resetIn("stats.now", new Date().toISOString()), 1000);
    return ["div", "The full shared state:"];
}, db);

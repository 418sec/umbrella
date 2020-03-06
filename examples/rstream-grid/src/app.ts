import { Atom, Cursor, History } from "@thi.ng/atom";
import { isArray } from "@thi.ng/checks";
import { start } from "@thi.ng/hdom";
import { EventBus } from "@thi.ng/interceptors";
import { initDataflow } from "./dataflow";
import * as ev from "./events";
import { PARAM_BASE } from "./paths";
import type { IObjectOf } from "@thi.ng/api";
import type {
    AppConfig,
    AppContext,
    AppViews,
    ViewSpec
} from "./api";

/**
 * The app does not much more than:
 *
 * - initialize state, undo history, event bus, dataflow graph
 * - attach derived views
 * - start hdom render & event bus loop
 */
export class App {
    config: AppConfig;
    ctx: AppContext;
    state: Atom<any>;
    history: History<any>;

    constructor(config: AppConfig) {
        this.config = config;
        this.state = new Atom(config.initialState || {});
        // note: the undo history only records the `PARAM_BASE` branch
        // in the app state atom. this is so we don't include the generated
        // SVG in the history and therefore save a lot of RAM
        // furthermore, the param changes trigger updates in the dataflow graph
        // (see `init()` method below) and will regenerate the SVG anyway
        this.history = new History<any>(
            new Cursor<any>(this.state, PARAM_BASE),
            1000
        );
        // define context object passed to all UI component functions
        this.ctx = {
            bus: new EventBus(this.state, config.events, config.effects),
            views: <AppViews>{},
            ui: config.ui
        };
        // initialize derived views
        this.addViews(<any>this.config.views);
    }

    /**
     * Initializes given derived view specs and attaches them to app
     * state atom.
     *
     * @param specs
     */
    addViews(specs: IObjectOf<ViewSpec>) {
        const views = this.ctx.views;
        for (let id in specs) {
            const spec = specs[id];
            if (isArray(spec)) {
                (<any>views)[id] = this.state.addView(spec[0], spec[1]);
            } else {
                (<any>views)[id] = this.state.addView(spec);
            }
        }
    }

    /**
     * Calls `init()` and kicks off hdom render loop, including batched
     * event processing and fast fail check if DOM updates are necessary
     * (assumes ALL state is held in the app state atom). So if there
     * weren't any events causing a state change since last frame,
     * re-rendering is skipped without even attempting to diff DOM
     * tree).
     */
    start() {
        this.init();
        // assume main root component is a higher order function
        // call it here to pre-initialize
        const root = this.config.rootComponent(this.ctx);
        let firstFrame = true;
        start(
            () => {
                if (
                    this.ctx.bus.processQueue({ history: this.history }) ||
                    firstFrame
                ) {
                    firstFrame = false;
                    return root();
                }
            },
            { root: this.config.domRoot, ctx: this.ctx }
        );
    }

    /**
     * User initialization hook.
     * Automatically called from `start()`
     */
    init() {
        // initialize dataflow graph
        initDataflow(this.ctx.bus);

        // initialize key event handlers for undo/redo
        document.addEventListener("keypress", (e) => {
            if (e.ctrlKey) {
                if (e.key === "z") {
                    this.ctx.bus.dispatch([ev.UNDO]);
                } else if (e.key === "y") {
                    this.ctx.bus.dispatch([ev.REDO]);
                }
            }
        });

        // record snapshot of initial state
        this.history.record();
    }
}

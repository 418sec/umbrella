import * as api from "../api";
import { mixin } from "../mixin";

export function inotify_dispatch(listeners: any[][], e: api.Event) {
    if (listeners) {
        const n = listeners.length;
        for (let i = 0; i < n; i++) {
            const l = listeners[i];
            l[0].call(l[1], e);
            if (e.canceled) {
                return;
            }
        }
    }
}

/**
 * Mixin class decorator, injects INotify default implementation,
 * incl. a lazily instantiated `_listeners` property object, storing
 * registered listeners in ES6 sets (one set per event type).
 */
// tslint:disable-next-line
export const INotify = mixin(
    <api.INotify>{
        addListener(id: PropertyKey, fn: api.Listener, scope?: any) {
            this._listeners = this._listeners || {};
            let l = this._listeners[id];
            if (!l) {
                l = this._listeners[id] = [];
            }
            if (this.__listener(l, fn, scope) === -1) {
                l.push([fn, scope]);
            }
        },
        removeListener(id: PropertyKey, fn: api.Listener, scope?: any) {
            this._listeners = this._listeners || {};
            const l: any[][] = this._listeners[id];
            if (l) {
                const idx = this.__listener(l, fn, scope);
                if (idx === -1) {
                    console.log(`attempt to remove unknown listener for "${id}": ${fn}`);
                } else {
                    l.splice(idx, 1);
                    console.log(`removed listener for "${id}": ${fn}`);
                }
            }
        },
        notify(e: api.Event) {
            this._listeners = this._listeners || {};
            if (e.target === undefined) {
                e.target = this;
            }
            inotify_dispatch(this._listeners[e.id], e);
            inotify_dispatch(this._listeners[api.EVENT_ALL], e);
        },
        __listener(listeners: any[][], f: api.Listener, scope: any) {
            let i = listeners.length;
            while (--i >= 0) {
                const l = listeners[i];
                if (l[0] === f && l[1] === scope) {
                    break;
                }
            }
            return i;
        },
    });

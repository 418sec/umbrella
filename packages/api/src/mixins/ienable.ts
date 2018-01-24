import * as api from "../api";
import { mixin } from "../mixin";

/**
 * Mixin class decorator, injects IEnable default implementation,
 * incl. a `_enabled` property. If the target also implements the
 * `INotify` interface, `enable()` and `disable()` will automatically
 * the respective emit events.
 */
// tslint:disable-next-line
export const IEnable = mixin(
    <api.IEnable>{
        _enabled: true,
        isEnabled() {
            return this._enabled;
        },
        enable() {
            this._enabled = true;
            if (this.notify) {
                this.notify(<api.Event>{ id: api.EVENT_ENABLE, target: this });
            }
        },
        disable() {
            this._enabled = false;
            if (this.notify) {
                this.notify(<api.Event>{ id: api.EVENT_DISABLE, target: this });
            }
        },
        toggle() {
            this._enabled ? this.disable() : this.enable();
        },
    });

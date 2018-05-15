import { Path } from "@thi.ng/api/api";
import { IView } from "@thi.ng/atom/api";
import { getIn } from "@thi.ng/paths";

export interface InputArgs {
    state: IView<any>;
    orig: IView<any>;
    attribs: any;
    placeholder: string;
    oninput: EventListener;
    oncancel: EventListener;
    onconfirm: EventListener;
    onblur: EventListener;
}

export function cancelableInput(themeCtxPath: Path) {
    return {
        init: (el: HTMLElement) => (<HTMLElement>el.firstChild).focus(),
        render: (ctx, args: InputArgs) =>
            ["span.relative",
                ["input",
                    {
                        ...getIn(ctx, themeCtxPath),
                        ...args.attribs,
                        type: "text",
                        oninput: args.oninput,
                        onblur: args.onblur,
                        onkeydown: (e: KeyboardEvent) => {
                            switch (e.key) {
                                case "Escape":
                                    args.oncancel && args.oncancel(e);
                                    (<HTMLElement>e.target).blur();
                                    break;
                                case "Enter":
                                    // case "Tab":
                                    args.onconfirm && args.onconfirm(e);
                                    (<HTMLInputElement>e.target).blur();
                                    break;
                                default:
                            }
                        },
                        placeholder: args.placeholder,
                        value: args.state
                    },
                ],
                ["i.absolute.fas.fa-times-circle.gray.f7",
                    { style: { right: "0.5rem", top: "0.25rem" } }]
            ]
    };
}

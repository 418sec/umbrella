import { Fn2 } from "@thi.ng/api";
import {
    FloatSym,
    IntSym,
    ScopeBody,
    Vec2Sym
} from "@thi.ng/shader-ast";
import { GLSLTarget } from "@thi.ng/shader-ast-glsl";
import { ITexture, ModelSpec, UniformDecl } from "@thi.ng/webgl";

export type MainImageFn<U extends ShaderToyUniforms> = Fn2<
    GLSLTarget,
    U,
    ScopeBody
>;

export interface ShaderToyUniforms {
    resolution: Vec2Sym;
    mouse: Vec2Sym;
    mouseButtons: IntSym;
    time: FloatSym;
}

export interface ShaderToyOpts<U extends ShaderToyUniforms> {
    canvas: HTMLCanvasElement;
    gl: WebGLRenderingContext;
    /**
     * Main user shader function
     */
    main: MainImageFn<U>;
    /**
     * Optional additional uniforms
     */
    uniforms?: Partial<Record<keyof U, UniformDecl>>;
    /**
     * Optional textures to bind
     */
    textures?: ITexture[];
}

export interface ShaderToy<U extends ShaderToyUniforms> {
    start(): void;
    stop(): void;
    update(time?: number): void;
    recompile(main: MainImageFn<U>): void;
    model: ModelSpec;
}

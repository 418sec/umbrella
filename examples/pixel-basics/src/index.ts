import {
    ARGB4444,
    canvas2d,
    GRAY8,
    imagePromise,
    PackedBuffer,
    RGB565
} from "@thi.ng/pixel";
import { SRC_OVER_I } from "@thi.ng/porter-duff";
import IMG from "../assets/haystack.jpg";
import LOGO from "../assets/logo-64.png";

Promise.all([IMG, LOGO].map(imagePromise)).then(([img, logo]) => {
    // init 16bit packed RGB pixel buffer from image (resized to 256x256)
    const buf = PackedBuffer.fromImage(img, RGB565, 256, 256);
    // use Porter-Duff operator to blend logo into main image
    PackedBuffer.fromImage(logo, ARGB4444).blend(SRC_OVER_I, buf, {
        dx: 10,
        dy: 10
    });

    // extract sub-image
    const region = buf.getRegion(32, 96, 128, 64);
    // copy region back at new position
    region.blit(buf, { dx: 96, dy: 32 });

    // or alternatively blit buf into itself
    // buf.blit(buf, { dx: 96, dy: 32, sx: 32, sy: 96, w: 128, h: 64 });

    // create html canvas
    // (returns obj of canvas & 2d context)
    const ctx = canvas2d(buf.width, buf.height * 3);

    // write pixel buffer to canvas
    buf.blitCanvas(ctx.canvas);

    // manipulate single color channel
    const id = 0;
    const ch = buf.getChannel(id).invert();
    for (let y = 0; y < ch.height; y += 2) {
        for (let x = (y >> 1) & 1; x < ch.width; x += 2) {
            ch.setAt(x, y, 0xff);
        }
    }
    // replace original channel
    buf.setChannel(id, ch);
    // write pixel buffer to new position
    buf.blitCanvas(ctx.canvas, 0, buf.height);
    // create & write grayscale version
    buf.as(GRAY8).blitCanvas(ctx.canvas, 0, buf.height * 2);

    document.body.appendChild(ctx.canvas);
});

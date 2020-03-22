import { IObjectOf } from "@thi.ng/api";
import { bytes } from "@thi.ng/strings";
import { readdirSync } from "fs";
import { META_FIELD, Package, RE_PKG } from "../api";
import { CONFIG } from "../config";
import { readJSON } from "../io";
import { link } from "./link";
import { list } from "./list";

export const shortName = (name: string) => name.split("/")[1];

export const pkgLink = (name: string) =>
    link(name, `${CONFIG.branchURL}/packages/${shortName(name)}`);

export const packageList = (pkgShortNames: string[], title: string) => {
    const items = [];
    for (let p of pkgShortNames) {
        try {
            const pkg = readJSON(`../${p}/package.json`);
            items.push(
                pkgLink(pkg.name) +
                    " - " +
                    pkg.description.replace(RE_PKG, pkgLink)
            );
        } catch (_) {
            console.log(`error reading support pkg: ${p}`);
        }
    }
    return items.length > 0 ? `### ${title}\n\n${list(items)}` : "";
};

export const supportPackages = (pkgName: string) => {
    const pkgShortName = shortName(pkgName);
    return packageList(
        readdirSync("../").filter((x) => x.startsWith(pkgShortName + "-")),
        "Support packages"
    );
};

export const relatedPackages = (pkgShortNames: string[] = []) =>
    packageList(pkgShortNames, "Related packages");

export const packageDesc = (pkg: Package) => {
    const desc = pkg.description.replace(RE_PKG, pkgLink) + ".";
    const parent = (pkg[META_FIELD] || {}).parent;
    return parent && desc.indexOf(parent) == -1
        ? `${desc} This is a support package for ${pkgLink(parent)}.`
        : desc;
};

export const packageDeps = (pkg: Package) => {
    const deps = Object.keys(pkg.dependencies || {})
        .sort()
        .map(pkgLink);
    return deps.length ? list(deps) : "None";
};

export const packageStatus = (id = "stable") => {
    const status = CONFIG.statuses[id];
    return [
        "### Status",
        "",
        `**${id.toUpperCase()}**${status ? " - " + status : ""}`
    ].join("\n");
};

export const packageSize = () => {
    try {
        const meta = readJSON("./.meta/size.json");
        const res = [];
        for (let id in meta) {
            res.push(`${id.toUpperCase()}: ${bytes(meta[id].gzip)}`);
        }
        return "Package sizes (gzipped): " + res.join(" / ");
    } catch (_) {
        return "";
    }
};

export const packageBanner = (name: string) =>
    `![${name}](${CONFIG.bannerURL}${shortName(name)}.svg?${(Date.now() /
        1000) |
        0})`;

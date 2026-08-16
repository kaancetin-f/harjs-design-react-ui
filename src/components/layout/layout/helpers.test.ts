import assert from "node:assert/strict";
import { test } from "node:test";
import { createElement, Fragment } from "react";
import {
  cssVars,
  getSiderStorageKey,
  hasDescendantSider,
  hasDirectSider,
  LAYOUT_SLOT,
  parseStoredPinned,
  pickTheme,
  toCssSize,
} from "./helpers.ts";

test("toCssSize: number becomes px, string passes through", () => {
  assert.equal(toCssSize(280), "280px");
  assert.equal(toCssSize("4.85rem"), "4.85rem");
  assert.equal(toCssSize(undefined), undefined);
});

test("parseStoredPinned: boolean json, string flags, invalid", () => {
  assert.equal(parseStoredPinned("true"), true);
  assert.equal(parseStoredPinned("false"), false);
  assert.equal(parseStoredPinned("null"), null);
  assert.equal(parseStoredPinned(null), null);
});

test("storage key: default enum vs named instance", () => {
  assert.equal(getSiderStorageKey(undefined, "/app"), "is-menu-locked");
  assert.equal(getSiderStorageKey("shell", "/app"), "/app::shell::sider-pinned");
});

test("pickTheme prefers specific then fallback", () => {
  assert.equal(pickTheme("red", "blue"), "red");
  assert.equal(pickTheme(undefined, "blue"), "blue");
});

test("cssVars drops empty values", () => {
  const style = cssVars({ "--a": "1px", "--b": undefined });
  assert.equal(style["--a"], "1px");
  assert.equal(style["--b"], undefined);
});

test("hasDirectSider only matches a sider sibling", () => {
  const Sider = Object.assign((props: { children?: unknown }) => createElement("aside", props), {
    displayName: LAYOUT_SLOT.Sider,
  });
  const Content = Object.assign((props: { children?: unknown }) => createElement("main", props), {
    displayName: LAYOUT_SLOT.Content,
  });
  assert.equal(hasDirectSider(createElement(Sider)), true);
  assert.equal(hasDirectSider(createElement(Content, null, createElement(Sider))), false);
  assert.equal(
    hasDirectSider(createElement(Fragment, null, createElement(Sider), createElement(Content))),
    true,
  );
});

test("hasDescendantSider walks nested layout children", () => {
  const Sider = Object.assign((props: { children?: unknown }) => createElement("aside", props), {
    displayName: LAYOUT_SLOT.Sider,
  });
  const Nested = Object.assign((props: { children?: unknown }) => createElement("div", props), {
    displayName: "Layout",
  });
  assert.equal(hasDescendantSider(createElement(Nested, null, createElement(Sider))), true);
  assert.equal(hasDescendantSider(createElement(Nested, null, createElement("span"))), false);
});

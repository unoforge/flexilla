const K = (r, e) => {
  r.setState((t) => {
    const n = t.items.findIndex((l) => l.value === e.value), u = n >= 0 ? t.items.map((l, i) => i === n ? { ...l, ...e } : l) : [...t.items, { ...e }], d = t.highlightedIndex;
    return { ...t, items: u, highlightedIndex: d };
  });
}, W = (r, e) => {
  r.setState((t) => {
    const n = t.items.findIndex((i) => i.value === e);
    if (n === -1) return t;
    const u = t.items.filter((i, f) => f !== n), d = t.selectedValues.filter((i) => i !== e);
    let l = t.highlightedIndex;
    return l !== null && (l === n ? l = null : l > n && (l -= 1)), { ...t, items: u, selectedValues: d, highlightedIndex: l };
  });
}, H = (r, e, t) => {
  if (r.length === 0) return null;
  let n = 0, u = e;
  const d = r.length;
  for (; n < d; ) {
    u = (u + t + d) % d;
    const l = r[u];
    if (!(l != null && l.disabled)) return u;
    n += 1;
  }
  return null;
}, z = (r, e) => {
  r.setState((t) => e === null ? { ...t, highlightedIndex: null } : e < 0 || e >= t.items.length ? { ...t, highlightedIndex: null } : t.items[e].disabled ? { ...t, highlightedIndex: null } : { ...t, highlightedIndex: e });
}, J = (r) => {
  r.setState((e) => {
    const t = e.highlightedIndex ?? -1, n = H(e.items, t, 1);
    return { ...e, highlightedIndex: n };
  });
}, Q = (r) => {
  r.setState((e) => {
    const t = e.highlightedIndex ?? 0, n = H(e.items, t, -1);
    return { ...e, highlightedIndex: n };
  });
}, M = (r, e) => {
  const t = r.items.find((n) => n.value === e);
  return !!t && !(t != null && t.disabled);
}, X = (r, e, t) => {
  r.setState((n) => M(n, e) ? t ? n.selectedValues.includes(e) ? n : { ...n, selectedValues: [...n.selectedValues, e] } : { ...n, selectedValues: [e] } : n);
}, Y = (r, e) => {
  r.setState((t) => t.selectedValues.includes(e) ? { ...t, selectedValues: t.selectedValues.filter((n) => n !== e) } : t);
}, Z = (r, e, t) => {
  r.setState((n) => {
    if (!M(n, e)) return n;
    if (n.selectedValues.includes(e)) {
      const d = n.selectedValues.filter((l) => l !== e);
      return { ...n, selectedValues: d };
    }
    return t ? { ...n, selectedValues: [...n.selectedValues, e] } : { ...n, selectedValues: [e] };
  });
}, w = (r) => ({
  ...r,
  items: [...r.items],
  selectedValues: [...r.selectedValues]
}), ee = (r, e) => {
  if (r.open !== e.open || r.highlightedIndex !== e.highlightedIndex || r.search !== e.search || r.items.length !== e.items.length || r.selectedValues.length !== e.selectedValues.length)
    return !1;
  for (let t = 0; t < r.items.length; t += 1) {
    const n = r.items[t], u = e.items[t];
    if (!u || n.value !== u.value || n.label !== u.label || !!n.disabled != !!u.disabled)
      return !1;
  }
  for (let t = 0; t < r.selectedValues.length; t += 1)
    if (r.selectedValues[t] !== e.selectedValues[t]) return !1;
  return !0;
}, te = (r) => {
  let e = w(r);
  const t = /* @__PURE__ */ new Set(), n = () => w(e);
  return {
    getState: n,
    setState: (l) => {
      const i = w(l(n()));
      ee(e, i) || (e = w(i), t.forEach((f) => f(n())));
    },
    subscribe: (l) => (t.add(l), l(n()), () => t.delete(l))
  };
}, le = (r, e) => {
  r.setState((t) => t.search === e ? t : { ...t, search: e });
}, ne = (r, e) => r.subscribe(e), re = (r = {}) => {
  const e = r.multiple ?? !1, t = te({
    open: !1,
    highlightedIndex: null,
    selectedValues: [],
    search: "",
    items: []
  });
  return {
    open: () => t.setState((l) => l.open ? l : { ...l, open: !0 }),
    close: () => t.setState((l) => l.open ? { ...l, open: !1 } : l),
    toggle: () => t.setState((l) => ({ ...l, open: !l.open })),
    select: (l) => X(t, l, e),
    unselect: (l) => Y(t, l),
    toggleValue: (l) => Z(t, l, e),
    highlightNext: () => J(t),
    highlightPrev: () => Q(t),
    highlight: (l) => z(t, l),
    setSearch: (l) => le(t, l),
    registerItem: (l) => K(t, l),
    unregisterItem: (l) => W(t, l),
    getState: t.getState,
    subscribe: (l) => ne(t, l)
  };
}, N = "[data-select-trigger]", B = "[data-select-content]", se = "[data-select-item]", P = "[data-select-input]", _ = "[data-selected-value]", ie = (r, e) => r ? `${e.label ?? e.value}`.toLowerCase().includes(r.toLowerCase()) : !0, ce = (r = {}) => {
  const e = re({ multiple: r.multiple }), t = r.filter ?? ie;
  let n = null, u = null, d = null, l = null, i = null, f = null, E = [], x = [], I = "Select", b = null;
  const m = [];
  let v = /* @__PURE__ */ new Set(), y = e.getState().search, p = [];
  const L = /* @__PURE__ */ new WeakSet(), V = () => {
    const s = e.getState();
    if (s.highlightedIndex !== null) return;
    const a = s.items.findIndex((o) => !o.disabled);
    a >= 0 && e.highlight(a);
  }, k = () => {
    if (!n) return;
    const a = (l ? [l] : [n]).flatMap((o) => Array.from(o.querySelectorAll(se)));
    a.length && (p = a.map((o) => {
      const c = o.dataset.selectItem;
      if (!c) return null;
      const h = (o.getAttribute("data-label") || o.textContent || "").trim() || c, g = o.getAttribute("aria-disabled") === "true" || o.hasAttribute("data-disabled");
      return { item: { value: c, label: h, disabled: g }, el: o };
    }).filter((o) => !!o).filter((o) => {
      const c = o.el.getAttribute("data-select-id");
      return !c || c === u;
    }), p.forEach(({ el: o, item: c }) => {
      o.setAttribute("role", "option"), c.disabled && o.setAttribute("aria-disabled", "true");
    }));
  }, C = () => {
    v.forEach((s) => e.unregisterItem(s)), E = [], v = /* @__PURE__ */ new Set();
  }, A = (s) => {
    p.length || k();
    const a = p.filter(({ item: c }) => t(s, c)), o = new Set(a.map(({ item: c }) => c.value));
    v.forEach((c) => {
      o.has(c) || e.unregisterItem(c);
    }), C(), a.forEach(({ item: c, el: h }) => {
      if (h.removeAttribute("hidden"), !L.has(h)) {
        const g = (j) => {
          if (j.preventDefault(), c.disabled) return;
          e.toggleValue(c.value);
          const $ = E.indexOf(h);
          $ >= 0 && e.highlight($), r.multiple || e.close();
        };
        h.addEventListener("click", g), m.push(() => h.removeEventListener("click", g)), L.add(h);
      }
      E.push(h), v.add(c.value), e.registerItem(c);
    }), p.forEach(({ item: c, el: h }) => {
      o.has(c.value) || h.setAttribute("hidden", "");
    }), V(), a.length || e.highlight(null);
  }, U = (s) => {
    d && (d.setAttribute("aria-haspopup", "listbox"), d.setAttribute("aria-expanded", String(s.open))), l && (l.setAttribute("role", "listbox"), s.open ? l.removeAttribute("hidden") : l.setAttribute("hidden", ""));
  }, F = (s) => {
    E.forEach((a, o) => {
      const c = a.dataset.selectItem, h = s.highlightedIndex === o, g = !!(c && s.selectedValues.includes(c));
      h ? a.setAttribute("data-select-highlighted", "true") : a.removeAttribute("data-select-highlighted"), a.setAttribute("aria-selected", String(g));
    });
  }, G = (s) => {
    const a = s.selectedValues.map((c) => {
      var h;
      return ((h = s.items.find((g) => g.value === c)) == null ? void 0 : h.label) ?? c;
    }).filter(Boolean), o = a.length ? a.join(", ") : I;
    x.forEach((c) => {
      c.textContent = o;
    }), i && !s.open && !r.multiple && a.length === 1 && (i.value = a[0]);
  }, S = (s) => {
    switch (s.key) {
      case "ArrowDown": {
        s.preventDefault(), e.open(), V(), e.highlightNext();
        break;
      }
      case "ArrowUp": {
        s.preventDefault(), e.open(), V(), e.highlightPrev();
        break;
      }
      case "Enter": {
        const a = e.getState();
        if (a.highlightedIndex !== null) {
          const o = a.items[a.highlightedIndex];
          o != null && o.disabled || (e.toggleValue(o.value), r.multiple || e.close());
        }
        break;
      }
      case "Escape": {
        e.close(), i && i.blur();
        break;
      }
    }
  }, q = (s) => {
    s.preventDefault(), e.toggle(), V();
  }, T = (s) => {
    const o = s.target.value || "";
    e.setSearch(o), e.open(), A(o);
  }, O = () => {
    if (!n || !u) return;
    if (d = document.querySelector(`${N}[data-autocomplete-id="${u}"]`) || n.querySelector(N), l = document.querySelector(`${B}[data-select-id="${u}"]`) || n.querySelector(B), i = document.querySelector(`${P}[data-autocomplete-id="${u}"]`) || n.querySelector(P), f = l, x = Array.from(document.querySelectorAll(`${_}[data-select-id="${u}"]`)), x.length || (x = Array.from(n.querySelectorAll(_))), I = (i == null ? void 0 : i.getAttribute("data-placeholder")) || (i == null ? void 0 : i.getAttribute("placeholder")) || I || I, !l) throw new Error("[autocomplete] data-select-content is required");
    if (!f) throw new Error("[autocomplete] items container not found");
    if (!i) throw new Error("[autocomplete] input element with data-autocomplete-id is required");
    d && (d.addEventListener("click", q), d.addEventListener("keydown", S), m.push(() => d == null ? void 0 : d.removeEventListener("click", q)), m.push(() => d == null ? void 0 : d.removeEventListener("keydown", S))), l && (l.addEventListener("keydown", S), m.push(() => l == null ? void 0 : l.removeEventListener("keydown", S))), i && (i.addEventListener("input", T), i.addEventListener("keydown", S), i.addEventListener("focus", () => e.open()), m.push(() => i == null ? void 0 : i.removeEventListener("input", T)), m.push(() => i == null ? void 0 : i.removeEventListener("keydown", S))), p.length || k(), A(e.getState().search);
  }, D = (s) => {
    s.search !== y && (y = s.search, A(s.search)), U(s), F(s), G(s);
  }, R = () => {
    m.splice(0).forEach((s) => s()), b && b(), C(), n = null, d = null, l = null, i = null, f = null;
  };
  return {
    ...e,
    connect: ({ root: s }) => {
      if (n = s, u = n.id || null, !u) throw new Error("[autocomplete] root element requires an id attribute");
      return O(), b && b(), b = e.subscribe(D), D(e.getState()), { destroy: R };
    }
  };
};
export {
  ce as createAutocomplete
};

const P = (r, t) => {
  r.setState((e) => {
    const n = e.items.findIndex((l) => l.value === t.value), o = n >= 0 ? e.items.map((l, u) => u === n ? { ...l, ...t } : l) : [...e.items, { ...t }], d = e.highlightedIndex;
    return { ...e, items: o, highlightedIndex: d };
  });
}, _ = (r, t) => {
  r.setState((e) => {
    const n = e.items.findIndex((u) => u.value === t);
    if (n === -1) return e;
    const o = e.items.filter((u, h) => h !== n), d = e.selectedValues.filter((u) => u !== t);
    let l = e.highlightedIndex;
    return l !== null && (l === n ? l = null : l > n && (l -= 1)), { ...e, items: o, selectedValues: d, highlightedIndex: l };
  });
}, w = (r, t, e) => {
  if (r.length === 0) return null;
  let n = 0, o = t;
  const d = r.length;
  for (; n < d; ) {
    o = (o + e + d) % d;
    const l = r[o];
    if (!(l != null && l.disabled)) return o;
    n += 1;
  }
  return null;
}, H = (r, t) => {
  r.setState((e) => t === null ? { ...e, highlightedIndex: null } : t < 0 || t >= e.items.length ? { ...e, highlightedIndex: null } : e.items[t].disabled ? { ...e, highlightedIndex: null } : { ...e, highlightedIndex: t });
}, R = (r) => {
  r.setState((t) => {
    const e = t.highlightedIndex ?? -1, n = w(t.items, e, 1);
    return { ...t, highlightedIndex: n };
  });
}, U = (r) => {
  r.setState((t) => {
    const e = t.highlightedIndex ?? 0, n = w(t.items, e, -1);
    return { ...t, highlightedIndex: n };
  });
}, T = (r, t) => {
  const e = r.items.find((n) => n.value === t);
  return !!e && !(e != null && e.disabled);
}, G = (r, t, e) => {
  r.setState((n) => T(n, t) ? e ? n.selectedValues.includes(t) ? n : { ...n, selectedValues: [...n.selectedValues, t] } : { ...n, selectedValues: [t] } : n);
}, M = (r, t) => {
  r.setState((e) => e.selectedValues.includes(t) ? { ...e, selectedValues: e.selectedValues.filter((n) => n !== t) } : e);
}, O = (r, t, e) => {
  r.setState((n) => {
    if (!T(n, t)) return n;
    if (n.selectedValues.includes(t)) {
      const d = n.selectedValues.filter((l) => l !== t);
      return { ...n, selectedValues: d };
    }
    return e ? { ...n, selectedValues: [...n.selectedValues, t] } : { ...n, selectedValues: [t] };
  });
}, E = (r) => ({
  ...r,
  items: [...r.items],
  selectedValues: [...r.selectedValues]
}), j = (r, t) => {
  if (r.open !== t.open || r.highlightedIndex !== t.highlightedIndex || r.search !== t.search || r.items.length !== t.items.length || r.selectedValues.length !== t.selectedValues.length)
    return !1;
  for (let e = 0; e < r.items.length; e += 1) {
    const n = r.items[e], o = t.items[e];
    if (!o || n.value !== o.value || n.label !== o.label || !!n.disabled != !!o.disabled)
      return !1;
  }
  for (let e = 0; e < r.selectedValues.length; e += 1)
    if (r.selectedValues[e] !== t.selectedValues[e]) return !1;
  return !0;
}, K = (r) => {
  let t = E(r);
  const e = /* @__PURE__ */ new Set(), n = () => E(t);
  return {
    getState: n,
    setState: (l) => {
      const u = E(l(n()));
      j(t, u) || (t = E(u), e.forEach((h) => h(n())));
    },
    subscribe: (l) => (e.add(l), l(n()), () => e.delete(l))
  };
}, z = (r, t) => {
  r.setState((e) => e.search === t ? e : { ...e, search: t });
}, F = (r, t) => r.subscribe(t), J = (r = {}) => {
  const t = r.multiple ?? !1, e = K({
    open: !1,
    highlightedIndex: null,
    selectedValues: [],
    search: "",
    items: []
  });
  return {
    open: () => e.setState((l) => l.open ? l : { ...l, open: !0 }),
    close: () => e.setState((l) => l.open ? { ...l, open: !1 } : l),
    toggle: () => e.setState((l) => ({ ...l, open: !l.open })),
    select: (l) => G(e, l, t),
    unselect: (l) => M(e, l),
    toggleValue: (l) => O(e, l, t),
    highlightNext: () => R(e),
    highlightPrev: () => U(e),
    highlight: (l) => H(e, l),
    setSearch: (l) => z(e, l),
    registerItem: (l) => P(e, l),
    unregisterItem: (l) => _(e, l),
    getState: e.getState,
    subscribe: (l) => F(e, l)
  };
}, v = "[data-select-trigger]", y = "[data-select-content]", Q = "[data-select-item]", L = "[data-select-input]", k = "[data-selected-value]", W = (r) => {
  const t = r.dataset.selectItem;
  if (!t) return null;
  const e = (r.getAttribute("data-label") || r.textContent || "").trim() || t, n = r.getAttribute("aria-disabled") === "true" || r.hasAttribute("data-disabled");
  return { value: t, label: e, disabled: n };
}, Y = (r = {}) => {
  const t = J({ multiple: r.multiple });
  let e = null, n = null, o = [], d = [], l = null, u = [], h = [];
  const g = [];
  let p = null, b = "Select";
  const I = () => {
    const s = t.getState();
    if (s.highlightedIndex !== null) return;
    const i = s.items.findIndex((c) => !c.disabled);
    i >= 0 && t.highlight(i);
  }, C = () => {
    if (!e || !n) return;
    u = (d.length ? d : [e]).flatMap((i) => Array.from(i.querySelectorAll(Q))), u = u.filter((i) => {
      const c = i.getAttribute("data-select-id");
      return !c || c === n;
    }), u.forEach((i) => {
      const c = W(i);
      if (!c) return;
      t.registerItem(c), i.setAttribute("role", "option"), c.disabled && i.setAttribute("aria-disabled", "true");
      const a = (m) => {
        if (m.preventDefault(), c.disabled) return;
        t.toggleValue(c.value);
        const S = u.indexOf(i);
        S >= 0 && t.highlight(S), r.multiple || t.close();
      };
      i.addEventListener("click", a), g.push(() => i.removeEventListener("click", a));
    });
  }, q = (s) => {
    o.forEach((i) => {
      i.setAttribute("aria-haspopup", "listbox"), i.setAttribute("aria-expanded", String(s.open));
    }), d.forEach((i) => {
      i.setAttribute("role", "listbox"), s.open ? i.removeAttribute("hidden") : i.setAttribute("hidden", "");
    });
  }, D = (s) => {
    const i = s.selectedValues.map((a) => {
      var m;
      return ((m = s.items.find((S) => S.value === a)) == null ? void 0 : m.label) ?? a;
    }).filter(Boolean), c = i.length ? i.join(", ") : b;
    h.forEach((a) => {
      a.textContent = c;
    });
  }, $ = (s) => {
    u.forEach((i, c) => {
      const a = i.dataset.selectItem, m = s.highlightedIndex === c, S = !!(a && s.selectedValues.includes(a));
      m ? i.setAttribute("data-select-highlighted", "true") : i.removeAttribute("data-select-highlighted"), i.setAttribute("aria-selected", String(S));
    });
  }, f = (s) => {
    switch (s.key) {
      case "ArrowDown": {
        s.preventDefault(), t.open(), I(), t.highlightNext();
        break;
      }
      case "ArrowUp": {
        s.preventDefault(), t.open(), I(), t.highlightPrev();
        break;
      }
      case "Enter": {
        const i = t.getState();
        if (i.highlightedIndex !== null) {
          const c = i.items[i.highlightedIndex];
          c != null && c.disabled || (t.toggleValue(c.value), r.multiple || t.close());
        }
        break;
      }
      case "Escape": {
        t.close(), o[0] && o[0].focus();
        break;
      }
    }
  }, x = (s) => {
    s.preventDefault(), t.toggle(), I();
  }, V = (s) => {
    const i = s.target;
    t.setSearch(i.value || "");
  }, N = () => {
    var i;
    if (!e || !n) return;
    if (o = Array.from(document.querySelectorAll(`${v}[data-select-id="${n}"]`)), o.length || (o = Array.from(e.querySelectorAll(v))), d = Array.from(document.querySelectorAll(`${y}[data-select-id="${n}"]`)), !d.length) {
      const c = e.querySelector(y);
      c && (d = [c]);
    }
    l = document.querySelector(`${L}[data-select-id="${n}"]`) || e.querySelector(L), h = Array.from(document.querySelectorAll(`${k}[data-select-id="${n}"]`)), h.length || (h = Array.from(e.querySelectorAll(k)));
    const s = o[0];
    s && (b = s.getAttribute("data-placeholder") || ((i = s.textContent) == null ? void 0 : i.trim()) || b || b), o.forEach((c) => {
      c.addEventListener("click", x), c.addEventListener("keydown", f), g.push(() => c.removeEventListener("click", x)), g.push(() => c.removeEventListener("keydown", f));
    }), d.forEach((c) => {
      c.addEventListener("keydown", f), g.push(() => c.removeEventListener("keydown", f));
    }), l && (l.addEventListener("input", V), l.addEventListener("keydown", f), g.push(() => l == null ? void 0 : l.removeEventListener("input", V)), g.push(() => l == null ? void 0 : l.removeEventListener("keydown", f))), C();
  }, A = (s) => {
    q(s), $(s), D(s);
  }, B = () => {
    u.map((s) => s.dataset.selectItem).filter((s) => !!s).forEach((s) => t.unregisterItem(s)), g.splice(0).forEach((s) => s()), p && p(), e = null, n = null, o = [], d = [], l = null, u = [], h = [];
  };
  return {
    ...t,
    connect: ({ root: s }) => {
      if (e = s, n = e.id || null, !n) throw new Error("[select] root element requires an id attribute");
      return N(), p && p(), p = t.subscribe(A), A(t.getState()), { destroy: B };
    }
  };
};
export {
  Y as createSelect
};

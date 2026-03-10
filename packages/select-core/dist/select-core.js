const g = (s, t) => {
  s.setState((e) => {
    const n = e.items.findIndex((l) => l.value === t.value), r = n >= 0 ? e.items.map((l, c) => c === n ? { ...l, ...t } : l) : [...e.items, { ...t }], i = e.highlightedIndex;
    return { ...e, items: r, highlightedIndex: i };
  });
}, f = (s, t) => {
  s.setState((e) => {
    const n = e.items.findIndex((c) => c.value === t);
    if (n === -1) return e;
    const r = e.items.filter((c, h) => h !== n), i = e.selectedValues.filter((c) => c !== t);
    let l = e.highlightedIndex;
    return l !== null && (l === n ? l = null : l > n && (l -= 1)), { ...e, items: r, selectedValues: i, highlightedIndex: l };
  });
}, d = (s, t, e) => {
  if (s.length === 0) return null;
  let n = 0, r = t;
  const i = s.length;
  for (; n < i; ) {
    r = (r + e + i) % i;
    const l = s[r];
    if (!(l != null && l.disabled)) return r;
    n += 1;
  }
  return null;
}, a = (s, t) => {
  s.setState((e) => t === null ? { ...e, highlightedIndex: null } : t < 0 || t >= e.items.length ? { ...e, highlightedIndex: null } : e.items[t].disabled ? { ...e, highlightedIndex: null } : { ...e, highlightedIndex: t });
}, S = (s) => {
  s.setState((t) => {
    const e = t.highlightedIndex ?? -1, n = d(t.items, e, 1);
    return { ...t, highlightedIndex: n };
  });
}, V = (s) => {
  s.setState((t) => {
    const e = t.highlightedIndex ?? 0, n = d(t.items, e, -1);
    return { ...t, highlightedIndex: n };
  });
}, o = (s, t) => {
  const e = s.items.find((n) => n.value === t);
  return !!e && !(e != null && e.disabled);
}, x = (s, t, e) => {
  s.setState((n) => o(n, t) ? e ? n.selectedValues.includes(t) ? n : { ...n, selectedValues: [...n.selectedValues, t] } : { ...n, selectedValues: [t] } : n);
}, m = (s, t) => {
  s.setState((e) => e.selectedValues.includes(t) ? { ...e, selectedValues: e.selectedValues.filter((n) => n !== t) } : e);
}, I = (s, t, e) => {
  s.setState((n) => {
    if (!o(n, t)) return n;
    if (n.selectedValues.includes(t)) {
      const i = n.selectedValues.filter((l) => l !== t);
      return { ...n, selectedValues: i };
    }
    return e ? { ...n, selectedValues: [...n.selectedValues, t] } : { ...n, selectedValues: [t] };
  });
}, u = (s) => ({
  ...s,
  items: [...s.items],
  selectedValues: [...s.selectedValues]
}), p = (s, t) => {
  if (s.open !== t.open || s.highlightedIndex !== t.highlightedIndex || s.search !== t.search || s.items.length !== t.items.length || s.selectedValues.length !== t.selectedValues.length)
    return !1;
  for (let e = 0; e < s.items.length; e += 1) {
    const n = s.items[e], r = t.items[e];
    if (!r || n.value !== r.value || n.label !== r.label || !!n.disabled != !!r.disabled)
      return !1;
  }
  for (let e = 0; e < s.selectedValues.length; e += 1)
    if (s.selectedValues[e] !== t.selectedValues[e]) return !1;
  return !0;
}, b = (s) => {
  let t = u(s);
  const e = /* @__PURE__ */ new Set(), n = () => u(t);
  return {
    getState: n,
    setState: (l) => {
      const c = u(l(n()));
      p(t, c) || (t = u(c), e.forEach((h) => h(n())));
    },
    subscribe: (l) => (e.add(l), l(n()), () => e.delete(l))
  };
}, B = (s, t) => {
  s.setState((e) => e.search === t ? e : { ...e, search: t });
}, E = (s, t) => s.subscribe(t), N = (s = {}) => {
  const t = s.multiple ?? !1, e = b({
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
    select: (l) => x(e, l, t),
    unselect: (l) => m(e, l),
    toggleValue: (l) => I(e, l, t),
    highlightNext: () => S(e),
    highlightPrev: () => V(e),
    highlight: (l) => a(e, l),
    setSearch: (l) => B(e, l),
    registerItem: (l) => g(e, l),
    unregisterItem: (l) => f(e, l),
    getState: e.getState,
    subscribe: (l) => E(e, l)
  };
};
export {
  N as createSelectCore
};

/*
 * JS Engine Lab — frontend system design, as code: the building blocks interviewers ask about in
 * "design a search box / a feed / a like button" rounds. Each is a ✍️ write-it task (see write-it.js).
 */
window.JS_INTERVIEW.push(
  {
    id: 'sd-typeahead', cat: 'Frontend system design', title: 'Design a type-ahead search', level: 'Hard', ask: 'Write createSearch: debounce, cache, and ignore stale answers.',
    why: 'The three classic problems of a search box: (1) <b>debounce</b> so typing "react" does not send 5 requests; (2) a <b>cache</b> so going back to a query is instant; (3) <b>race conditions</b>: answers can arrive out of order ("re" is slow, "rea" is fast), so each request gets an id and only the latest one may update the screen. In a real app you would also cancel the old request with <code>AbortController</code>, show loading and error states, and limit the cache size.',
    code: `function createSearch(fetchResults, delay) {
  let timer = null, latest = 0;
  const cache = new Map();
  return function search(query, onResults) {
    clearTimeout(timer);
    timer = setTimeout(async () => {
      if (cache.has(query)) { onResults(query, cache.get(query), "cache"); return; }
      const id = ++latest;
      const results = await fetchResults(query);
      cache.set(query, results);
      if (id === latest) onResults(query, results, "network"); // an older request finished late: ignore it
    }, delay);
  };
}
// a fake server: "re" is slow, "rea" is fast
const calls = [];
const slowness = { re: 50, rea: 10 };
function fetchResults(q) { calls.push(q); return new Promise(r => setTimeout(() => r([q + "1", q + "2"]), slowness[q] || 10)); }
const search = createSearch(fetchResults, 10);
const show = (q, list, from) => console.log(q, "→", list.join(","), "(" + from + ")");
search("r", show);
setTimeout(() => search("re", show), 5);    // typed quickly: "r" is never searched
setTimeout(() => search("rea", show), 30);  // "rea" answers before "re"
setTimeout(() => search("re", show), 100);  // back to "re": from the cache
setTimeout(() => console.log("requests:", calls.join(" ")), 200);`,
  },
  {
    id: 'sd-pagination', cat: 'Frontend system design', title: 'Design an infinite feed: cursor pagination', level: 'Medium', ask: 'Write createFeed: load page after page without duplicates.',
    why: 'Feeds use <b>cursor</b> pagination ("give me what comes after X") rather than page numbers, because new posts arriving at the top would shift numbered pages and repeat items. Even so, items can appear twice across pages, so the client <b>de-duplicates by id</b>, stops when the cursor is <code>null</code>, and (in a real app) prevents two loads at once while scrolling, and virtualises long lists.',
    code: `function createFeed(fetchPage) {
  const items = [], seen = new Set();
  let cursor = null, done = false;
  return {
    async loadMore() {
      if (done) return items.length;
      const page = await fetchPage(cursor);
      for (const item of page.items) if (!seen.has(item.id)) { seen.add(item.id); items.push(item); }
      cursor = page.next;
      done = page.next === null;
      return items.length;
    },
    list() { return items.map(x => x.id).join(","); },
  };
}
const pages = {
  start: { items: [{ id: 1 }, { id: 2 }], next: "p2" },
  p2: { items: [{ id: 2 }, { id: 3 }], next: "p3" },   // id 2 again: a new post pushed it down
  p3: { items: [{ id: 4 }], next: null },
};
const feed = createFeed(async cursor => pages[cursor || "start"]);
(async () => {
  console.log(await feed.loadMore(), await feed.loadMore(), await feed.loadMore(), await feed.loadMore());
  console.log(feed.list());
})();`,
  },
  {
    id: 'sd-normalize', cat: 'Frontend system design', title: 'Design the client state: normalise API data', level: 'Medium', ask: 'Write normalize: store each user once and refer to it by id.',
    why: 'API responses repeat data (the same author in every post). Kept as-is, one update must be applied in many places and the copies drift apart. <b>Normalising</b> stores each entity once, in a table by id, and replaces nested objects with ids, so one update is seen everywhere. Redux Toolkit\'s <code>createEntityAdapter</code>, Apollo and React Query\'s cache all build on this idea.',
    code: `function normalize(posts) {
  const users = {}, byId = {};
  for (const post of posts) {
    users[post.author.id] = { ...post.author };
    byId[post.id] = { id: post.id, title: post.title, author: post.author.id };
  }
  return { posts: byId, users };
}
const response = [
  { id: "p1", title: "Hello", author: { id: "u1", name: "Ada" } },
  { id: "p2", title: "Again", author: { id: "u1", name: "Ada" } },
];
const store = normalize(response);
store.users.u1.name = "Ada L.";                       // one update…
console.log(Object.keys(store.users).length, Object.keys(store.posts).join(","));
console.log(Object.values(store.posts).map(p => store.users[p.author].name).join(" / ")); // …seen everywhere
console.log(response[0].author.name);                 // the original response is untouched`,
  },
  {
    id: 'sd-optimistic', cat: 'Frontend system design', title: 'Design a like button: optimistic update', level: 'Medium', ask: 'Write createLikes: show the like at once, roll back if the server fails.',
    why: 'Waiting for the server makes a like button feel slow. An <b>optimistic update</b> changes the UI immediately, sends the request, then either confirms the server\'s value or <b>rolls back</b> and tells the user. React 19\'s <code>useOptimistic</code> and React Query\'s <code>onMutate</code>/<code>onError</code> implement the same pattern.',
    code: `function createLikes(sendToServer) {
  let likes = 0;
  return {
    async like(render) {
      likes++;
      render(likes, "optimistic");           // show it at once
      try {
        likes = await sendToServer(likes);
        render(likes, "confirmed");
      } catch (e) {
        likes--;                               // undo
        render(likes, "rolled back: " + e.message);
      }
    },
  };
}
let offline = false;
const server = async n => { await new Promise(r => setTimeout(r, 10)); if (offline) throw new Error("offline"); return n; };
const likes = createLikes(server);
const render = (n, why) => console.log(n, why);
(async () => {
  await likes.like(render);
  offline = true;
  await likes.like(render);
})();`,
  },
  {
    id: 'sd-swr', cat: 'Frontend system design', title: 'Design the data layer: stale-while-revalidate', level: 'Medium', ask: 'Write createSWR: show cached data at once, then refresh it.',
    why: '<b>Stale-while-revalidate</b>: return the cached (possibly old) data immediately so the screen is never empty, fetch fresh data in the background, then update. It is the core of SWR and React Query, and also an HTTP header (<code>Cache-Control: stale-while-revalidate</code>). Real libraries add request de-duplication, refetch on focus, and cache expiry.',
    code: `function createSWR(fetcher) {
  const cache = new Map();
  return async function get(key, onData) {
    if (cache.has(key)) onData(cache.get(key), "stale, shown instantly");
    const fresh = await fetcher(key);
    cache.set(key, fresh);
    onData(fresh, "fresh");
  };
}
let version = 1;
const fetcher = async key => { await new Promise(r => setTimeout(r, 10)); return key + " v" + version++; };
const get = createSWR(fetcher);
const show = (data, why) => console.log(data, "-", why);
(async () => {
  await get("/user", show);
  await get("/user", show);
})();`,
  },
);

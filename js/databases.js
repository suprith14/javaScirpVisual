/*
 * JS Engine Lab — 🗄️ Databases: which kinds exist, what each is for, and how one real app uses several.
 *   1 the types → 2 which one? (practice) → 3 one app, many databases → 4 words you will hear
 */
(function () {
  'use strict';
  const $ = id => document.getElementById(id);
  const L = (...lines) => lines.join('\n');
  const esc = s => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' })[c]);

  const TYPES = [
    { id: 'sql', icon: '🧮', name: 'Relational (SQL)', start: true,
      shape: 'users:  id | name | email\n        1  | Ada  | ada@x\norders: id | user_id | total\n        7  | 1       | 89.00',
      use: 'Most app data: users, orders, payments, stock. Anything that must stay correct.',
      how: 'Tables linked by keys, queried with SQL (JOINs). Transactions: a change is saved completely or not at all.',
      ex: 'PostgreSQL, MySQL, SQLite, SQL Server · hosted: Supabase, Neon, PlanetScale' },
    { id: 'document', icon: '📄', name: 'Document',
      shape: '{ "_id": 7, "title": "Trail X2",\n  "sizes": [40, 41, 42],\n  "specs": { "drop": "6mm" } }',
      use: 'Data with varying or nested fields read as a whole: catalogs, CMS content, profiles.',
      how: 'Stores JSON-like documents; no fixed schema; joins are weak, so related data is often copied in.',
      ex: 'MongoDB, Firestore, CouchDB' },
    { id: 'kv', icon: '🔑', name: 'Key-value (cache)',
      shape: 'session:9f2c      → { userId: 1 }\ncache:/products   → [ …JSON… ]\nrate:1.2.3.4      → 57',
      use: 'Caching, login sessions, rate limits, queues, leaderboards.',
      how: 'Get / set by key, usually in memory: answers in under a millisecond. Values can expire (TTL).',
      ex: 'Redis / Valkey, Memcached, DynamoDB, Cloudflare KV, Upstash' },
    { id: 'search', icon: '🔎', name: 'Search engine',
      shape: 'word    → documents\n"trail" → 3, 9\n"shoe"  → 3, 7, 9',
      use: 'Search boxes: typo tolerance ("iphnoe"), filters (brand, price), ranking by relevance.',
      how: 'An inverted index from words to documents, filled from your main database.',
      ex: 'Elasticsearch / OpenSearch, Algolia, Meilisearch, Typesense' },
    { id: 'wide', icon: '🧱', name: 'Wide-column',
      shape: 'partition room#42\n  12:00:01  Ada: hi\n  12:00:05  Bob: hey',
      use: 'Huge write volumes spread over many servers: chat history, feeds, IoT, logs.',
      how: 'Rows grouped by a partition key and sorted; scales by adding machines; you design tables around your queries.',
      ex: 'Cassandra, ScyllaDB, Bigtable, HBase' },
    { id: 'graph', icon: '🕸️', name: 'Graph',
      shape: '(Ada)-[:FOLLOWS]->(Bob)\n(Bob)-[:FOLLOWS]->(Cleo)\n(Cleo)-[:LIKES]->(Trail X2)',
      use: 'Relationships many steps deep: "people you may know", recommendations, fraud rings.',
      how: 'Nodes and edges; following a relationship is cheap however big the data is.',
      ex: 'Neo4j, Amazon Neptune, ArangoDB' },
    { id: 'time', icon: '📈', name: 'Time-series',
      shape: 'time  | page  | lcp_ms\n12:00 | /home | 2140\n12:01 | /home | 1980',
      use: 'Values over time: metrics, monitoring, sensors, prices.',
      how: 'Optimised for appending by time, summarising ("average per hour") and deleting old data.',
      ex: 'InfluxDB, TimescaleDB, Prometheus' },
    { id: 'vector', icon: '🧭', name: 'Vector',
      shape: '"waterproof trail shoe"\n  → [0.12, -0.88, 0.47, …]  (an embedding)',
      use: 'AI features: search by meaning, "similar items", chat with your docs (RAG).',
      how: 'Stores embeddings from an AI model and finds the nearest ones.',
      ex: 'pgvector (in PostgreSQL), Pinecone, Qdrant, Weaviate' },
    { id: 'warehouse', icon: '🏭', name: 'Analytics warehouse',
      shape: 'stored by column:\ncountry[ … 2 billion … ]\nrevenue[ … 2 billion … ]',
      use: 'Reports and dashboards over billions of rows: revenue by country by month.',
      how: 'Column storage makes big scans and sums fast; slow for single-row updates. Filled from the app\'s data.',
      ex: 'BigQuery, Snowflake, ClickHouse, Redshift, DuckDB' },
    { id: 'browser', icon: '🌐', name: 'In the browser',
      shape: 'IndexedDB  store "drafts"\n  { id: 1, text: "…", synced: false }',
      use: 'Offline apps, drafts, cached API data on the user\'s device.',
      how: 'Lives in the user\'s browser, per site; you sync it with the server yourself.',
      ex: 'IndexedDB (with idb or Dexie), localStorage (small strings), SQLite in WebAssembly' },
  ];
  const T = id => TYPES.find(t => t.id === id);

  const QUESTIONS = [
    { q: 'Shop: orders and payments. An order must never be half-saved, and you need reports per customer.', a: 'sql', why: 'Money needs transactions (all or nothing) and relations (customer → orders → items): a relational database.' },
    { q: 'The search box must find "iphnoe" and filter by brand and price.', a: 'search', why: 'Typo tolerance, filters and relevance ranking are what search engines do; SQL LIKE cannot.', also: 'PostgreSQL full-text search is fine for small sites.' },
    { q: 'Keep 1 million logged-in sessions, and cache the popular-products list for 60 seconds.', a: 'kv', why: 'Lookups by key in under a millisecond, with expiry (TTL): Redis.' },
    { q: '"People you may know": friends of your friends who are not your friends yet.', a: 'graph', why: 'Walking relationships two or three steps deep is what graph databases are built for.' },
    { q: 'Chat app: billions of messages, 50,000 new ones per second; load the latest messages of a room.', a: 'wide', why: 'Massive writes spread over many servers, read by a partition key (the room): wide-column (Discord uses ScyllaDB).' },
    { q: 'Dashboard: page load times every minute for a year, shown as an hourly chart.', a: 'time', why: 'Appending values by time and summarising them per hour: a time-series database.' },
    { q: 'An AI help bot that finds the right passages in your docs by meaning, not by exact words.', a: 'vector', why: 'Embeddings + nearest-neighbour search: a vector database (often pgvector next to your PostgreSQL data).' },
    { q: 'Management report: revenue by country by month over 3 years of 2 billion events.', a: 'warehouse', why: 'Big scans and sums over billions of rows: an analytics warehouse, kept separate from the app database.' },
    { q: 'A notes app must work on a plane with no connection and sync later.', a: 'browser', why: 'The data has to live on the device: IndexedDB, synced to the server when back online.' },
    { q: 'A CMS: blog posts made of different blocks (text, video, gallery, quote), always read as a whole.', a: 'document', why: 'Nested data with varying fields, read as one piece: a document database.', also: 'PostgreSQL with a JSONB column works well too.' },
    { q: 'A new side project or startup MVP: you are not sure yet what the data will look like.', a: 'sql', why: 'Start with PostgreSQL (e.g. Supabase or Neon): it handles relations, JSON (JSONB), full-text search and vectors (pgvector). Add others only when a real need appears.' },
  ];

  // the same questions as 🏋️ Practice tasks (they open in the Web lab window, with the reason as the steps)
  const PRACTICE = [
    ['db-orders', 'Orders and payments', 'Checkout project: you are designing where orders and payments are stored.'],
    ['db-search', 'A search box with typos', 'Shop project: customers complain the search box finds nothing when they make a typo.'],
    ['db-cache', 'Sessions and a cache', 'Shop project: the product list is slow under load, and logins need to be checked on every request.'],
    ['db-graph', 'People you may know', 'Social feature: the product team wants a "people you may know" box.'],
    ['db-chat', 'Billions of chat messages', 'Chat project: the app is a hit and the message table is growing by millions a day.'],
    ['db-metrics', 'Load times every minute', 'Performance project: you want to keep every page\'s load time per minute and chart it.'],
    ['db-ai', 'An AI help chat', 'Shop project: an AI "help me choose" chat should answer from your product guides.'],
    ['db-report', 'Revenue reports', 'Dashboard project: management wants yearly revenue reports, and the app database slows down when they run.'],
    ['db-offline', 'Works offline', 'A notes or field-work app that must keep working without signal.'],
    ['db-cms', 'CMS content blocks', 'Marketing site: editors build pages from different content blocks.'],
    ['db-mvp', 'A brand-new project', 'Day one of a new project: you have to pick a database before you know everything.'],
  ];
  if (window.WebLab) window.WebLab.extend('db', s => ({ answer: s.a, steps: [{ ok: true, text: esc(s.why) }].concat(s.also ? [{ ok: true, text: 'Also OK: ' + esc(s.also) }] : []) }),
    (s, e) => `<div class="wl-card"><small>the situation</small><pre>${e(s.q)}</pre></div>`);
  (window.WEB_TASKS = window.WEB_TASKS || []).push(...QUESTIONS.map((x, i) => ({
    id: PRACTICE[i][0], cat: 'Databases', kind: 'rule', solver: 'db', icon: '🗄️', kindLabel: 'pick the database',
    title: 'Which database? ' + PRACTICE[i][1], ask: 'Which kind of database fits best?',
    scene: PRACTICE[i][2], choices: TYPES.map(t => t.id), labels: Object.fromEntries(TYPES.map(t => [t.id, t.icon + ' ' + t.name])),
    hint: 'What does the data look like, and what is the hard part: correctness, speed, search, scale, relationships, time, meaning, reports or offline?',
    why: `${esc(x.why)} See the 🗄️ Databases tab for all the types.`, scenario: { q: x.q, a: x.a, why: x.why, also: x.also },
  })));

  const WORDS = [
    ['SQL vs NoSQL', 'SQL = relational tables with a fixed schema; NoSQL = everything else (document, key-value, wide-column, graph).'],
    ['Schema and migrations', 'The shape of your tables; a migration is a versioned script that changes it (Prisma Migrate, Drizzle Kit).'],
    ['Index', 'A lookup structure that makes queries on a column fast (like a book index); makes writes a little slower.'],
    ['Transaction (ACID)', 'Several changes saved all together or not at all, even if the server crashes halfway.'],
    ['JOIN', 'Combining rows from related tables in one query (orders with their customer).'],
    ['Normalise / denormalise', 'Store each fact once (no copies) vs copy data to make reads faster.'],
    ['ORM / query builder', 'Use the database from TypeScript with types: Prisma, Drizzle, Kysely.'],
    ['N+1 queries', 'One query for a list, then one more per item: 101 queries instead of 1–2. A classic slowdown.'],
    ['Replication', 'Copies of the database on other servers: read replicas share the load and survive failures.'],
    ['Sharding', 'Splitting one big dataset across servers by a key (user id, region).'],
    ['Connection pooling', 'Reusing database connections; essential with serverless functions (PgBouncer, Supavisor).'],
    ['Eventual consistency (CAP)', 'In distributed databases a write may take a moment to appear everywhere.'],
    ['Row-level security', 'Rules in the database that decide which rows each user may see (used by Supabase).'],
    ['Object storage', 'Not a database: where files go (images, videos, uploads): S3, Cloudflare R2. The database stores the file\'s URL.'],
  ];

  // ------------------------------------------------------------ SQL in a few queries (results computed from these sample tables)
  const DATA = {
    users: [{ id: 1, name: 'Ada', email: 'ada@x.com', country: 'UK' }, { id: 2, name: 'Bob', email: 'bob@x.com', country: 'US' }, { id: 3, name: 'Cleo', email: 'cleo@x.com', country: 'UK' }, { id: 4, name: 'Dan', email: 'dan@x.com', country: 'DE' }],
    orders: [{ id: 7, user_id: 1, total_cents: 8900, status: 'paid', created_at: '2026-11-01' }, { id: 8, user_id: 1, total_cents: 2550, status: 'paid', created_at: '2026-11-03' }, { id: 9, user_id: 2, total_cents: 12000, status: 'pending', created_at: '2026-11-04' }, { id: 10, user_id: 3, total_cents: 4200, status: 'paid', created_at: '2026-11-05' }],
  };
  const userOf = o => DATA.users.find(u => u.id === o.user_id);
  const SQL = [
    { t: 'Read rows: SELECT … WHERE', b: 'Choose the columns, filter the rows.', sql: "SELECT name, email\nFROM users\nWHERE country = 'UK';", run: () => DATA.users.filter(u => u.country === 'UK').map(u => ({ name: u.name, email: u.email })) },
    { t: 'Sort and limit', b: 'The 2 newest orders: this is how lists and pages are loaded.', sql: 'SELECT id, total_cents, created_at\nFROM orders\nORDER BY created_at DESC\nLIMIT 2;', run: () => [...DATA.orders].sort((a, b) => b.created_at.localeCompare(a.created_at)).slice(0, 2).map(o => ({ id: o.id, total_cents: o.total_cents, created_at: o.created_at })) },
    { t: 'JOIN: combine tables', b: 'Each order with its customer\'s name, matched by user_id.', sql: 'SELECT o.id, u.name, o.total_cents\nFROM orders o\nJOIN users u ON u.id = o.user_id;', run: () => DATA.orders.map(o => ({ id: o.id, name: userOf(o).name, total_cents: o.total_cents })) },
    { t: 'GROUP BY: totals per group', b: 'How much each customer spent: the base of every report and dashboard.', sql: 'SELECT u.name, COUNT(*) AS orders, SUM(o.total_cents) AS spent\nFROM orders o\nJOIN users u ON u.id = o.user_id\nGROUP BY u.name\nORDER BY spent DESC;',
      run: () => Object.values(DATA.orders.reduce((m, o) => { const n = userOf(o).name; m[n] = m[n] || { name: n, orders: 0, spent: 0 }; m[n].orders++; m[n].spent += o.total_cents; return m; }, {})).sort((a, b) => b.spent - a.spent) },
    { t: 'LEFT JOIN: keep rows without a match', b: 'Every user, even those with no orders (Dan): a plain JOIN would drop him.', sql: 'SELECT u.name, COUNT(o.id) AS orders\nFROM users u\nLEFT JOIN orders o ON o.user_id = u.id\nGROUP BY u.name;', run: () => DATA.users.map(u => ({ name: u.name, orders: DATA.orders.filter(o => o.user_id === u.id).length })) },
    { t: 'Change data: INSERT, UPDATE, DELETE', b: 'Always put a WHERE on UPDATE and DELETE, or every row changes.', sql: "INSERT INTO users (name, email, country) VALUES ('Eve', 'eve@x.com', 'FR');\nUPDATE orders SET status = 'paid' WHERE id = 9;\nDELETE FROM orders WHERE id = 10;", result: '1 row inserted · 1 row updated · 1 row deleted' },
    { t: 'Transaction: all or nothing', b: 'Take stock and create the order together: if one fails, neither happens.', sql: "BEGIN;\nUPDATE products SET stock = stock - 1 WHERE id = 3 AND stock > 0;\nINSERT INTO orders (user_id, total_cents, status) VALUES (1, 8900, 'paid');\nCOMMIT;   -- or ROLLBACK; if anything went wrong", result: 'both changes saved together (or neither)' },
    { t: 'Index: make a lookup fast', b: 'Without an index the database reads every row; with one it jumps to the matches.', sql: 'CREATE INDEX orders_user_id_idx ON orders (user_id);\n\nEXPLAIN ANALYZE SELECT * FROM orders WHERE user_id = 1;', result: 'before: Seq Scan on orders (reads all rows) · after: Index Scan using orders_user_id_idx' },
  ];

  // ------------------------------------------------------------ designing the shop's tables
  const SCHEMA = [
    ['users', ['id  PK', 'email  UNIQUE', 'name', 'created_at']],
    ['products', ['id  PK', 'name', 'price_cents', 'stock']],
    ['orders', ['id  PK', 'user_id  FK → users', 'total_cents', 'status', 'created_at']],
    ['order_items', ['id  PK', 'order_id  FK → orders', 'product_id  FK → products', 'quantity', 'price_cents']],
    ['categories', ['id  PK', 'name']],
    ['product_categories', ['product_id  FK', 'category_id  FK', 'PK (both)']],
  ];
  const RELATIONS = [
    ['one-to-many', 'a user has many orders (orders.user_id)'],
    ['one-to-many', 'an order has many order_items'],
    ['many-to-one', 'many order_items point at one product'],
    ['many-to-many', 'products ↔ categories, through the join table product_categories'],
  ];
  const RULES = [
    'Every table gets a primary key (id). A foreign key (user_id) links rows and stops broken links.',
    'Money as integer cents (8900) or NUMERIC, never floating point (0.1 + 0.2 ≠ 0.3).',
    'Copy the price into order_items when buying: product prices change later, past orders must not.',
    'Index foreign keys and the columns you filter or sort by.',
    'NOT NULL and UNIQUE where they apply; created_at / updated_at timestamps on everything.',
  ];
  const SCHEMA_SQL = L(
    'CREATE TABLE users (',
    '  id          BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,',
    '  email       TEXT NOT NULL UNIQUE,',
    '  name        TEXT NOT NULL,',
    '  created_at  TIMESTAMPTZ NOT NULL DEFAULT now()',
    ');',
    'CREATE TABLE orders (',
    '  id           BIGINT GENERATED ALWAYS AS IDENTITY PRIMARY KEY,',
    '  user_id      BIGINT NOT NULL REFERENCES users(id),',
    '  total_cents  INTEGER NOT NULL CHECK (total_cents >= 0),',
    "  status       TEXT NOT NULL DEFAULT 'pending',",
    '  created_at   TIMESTAMPTZ NOT NULL DEFAULT now()',
    ');',
    'CREATE INDEX orders_user_id_idx ON orders (user_id);',
    'CREATE TABLE order_items (',
    '  order_id     BIGINT NOT NULL REFERENCES orders(id) ON DELETE CASCADE,',
    '  product_id   BIGINT NOT NULL REFERENCES products(id),',
    '  quantity     INTEGER NOT NULL CHECK (quantity > 0),',
    '  price_cents  INTEGER NOT NULL,       -- the price at the time of purchase',
    '  PRIMARY KEY (order_id, product_id)',
    ');');

  // ------------------------------------------------------------ from React to the database
  const PATH = ['⚛️ React component', 'fetch("/api/orders")', '🖥️ API route (server)', '🔒 check login + validate input', '🧩 ORM / query', '🧮 PostgreSQL', '📦 JSON back to React'];
  const PATH_RULES = [
    { t: 'Never connect from the browser', b: 'The browser calls your API; only the server holds the database password.', d: 'Exception: Supabase / Firebase let the browser query directly, but only with row-level security rules that limit each user to their own rows.',
      code: L('-- Supabase: each user only sees their own orders', 'ALTER TABLE orders ENABLE ROW LEVEL SECURITY;', 'CREATE POLICY "own orders" ON orders', '  FOR SELECT USING (auth.uid() = user_id);') },
    { t: 'An API route with an ORM', b: 'The server checks who is asking, then queries with type-safe code.', d: 'Prisma or Drizzle generate TypeScript types from your schema, so a typo in a column name is a compile error.',
      code: L('// app/api/orders/route.ts (Next.js)', 'import { prisma } from "@/lib/db";', 'import { getUser } from "@/lib/auth";', '', 'export async function GET() {', '  const user = await getUser();', '  if (!user) return new Response("Unauthorized", { status: 401 });', '  const orders = await prisma.order.findMany({', '    where: { userId: user.id },', '    orderBy: { createdAt: "desc" },', '    take: 20,', '  });', '  return Response.json(orders);', '}') },
    { t: 'SQL injection: always use parameters', b: 'Never glue user input into SQL text; pass it as a parameter.', d: 'With string building, the input 1 OR 1=1 returns every user\'s orders, and worse inputs can delete tables. ORMs and parameterized queries make the input data, never SQL.',
      code: L('// ❌ the input becomes part of the SQL', 'db.query("SELECT * FROM orders WHERE user_id = " + req.query.id);', '', '// ✅ the input is sent separately, as data', 'db.query("SELECT * FROM orders WHERE user_id = $1", [req.query.id]);') },
    { t: 'Validate on the server', b: 'Check every input on the server too (zod); the browser can be bypassed.', d: 'Frontend validation is for user experience; server validation is for safety. Share one zod schema between both.',
      code: L('const NewOrder = z.object({', '  productId: z.number().int().positive(),', '  quantity: z.number().int().min(1).max(10),', '});', 'const input = NewOrder.parse(await req.json());   // throws on bad input') },
    { t: 'The N+1 problem', b: 'One query for a list, then one more per row: 21 queries instead of 1–2.', d: 'It hides in loops and in components that each fetch their own data. Load related data in one query (a JOIN or the ORM\'s include) or in a batch (DataLoader).',
      code: L('// ❌ 1 query for orders + 1 per order = N+1', 'const orders = await prisma.order.findMany();', 'for (const o of orders) o.user = await prisma.user.findUnique({ where: { id: o.userId } });', '', '// ✅ 1 query (a JOIN under the hood)', 'const orders = await prisma.order.findMany({ include: { user: true } });') },
    { t: 'Pagination', b: 'Load pages with a cursor ("after id 41") rather than OFFSET for long, changing lists.', d: 'OFFSET 10000 still reads and skips 10,000 rows, and rows shift when new ones arrive. A cursor uses the index and stays stable (see the cursor pagination task).',
      code: L('SELECT id, total_cents, created_at', 'FROM orders', 'WHERE user_id = $1 AND id < $2      -- $2 = the last id the client has', 'ORDER BY id DESC', 'LIMIT 20;') },
  ];

  // ------------------------------------------------------------ running a database in production
  const OPS = [
    { t: 'Find slow queries', b: 'EXPLAIN ANALYZE shows how a query runs; the slow query log shows which ones hurt.', d: 'Look for "Seq Scan" on big tables and add the missing index. pg_stat_statements lists the queries that use the most time in total.' },
    { t: 'Indexes have a cost', b: 'Each index speeds up reads but slows down writes and uses space.', d: 'Index what you filter, join and sort by; drop indexes nobody uses. A composite index (user_id, created_at) serves "this user\'s newest orders".' },
    { t: 'Connection pooling', b: 'Databases allow few connections; a pool shares them. Essential with serverless functions.', d: 'Hundreds of Lambda / Vercel functions can each open a connection and exhaust the database. Use a pooler: PgBouncer, RDS Proxy, Supabase Supavisor, Neon\'s pooled URL.' },
    { t: 'Read replicas', b: 'Copies of the database that serve reads, so the main one handles writes.', d: 'Replicas lag slightly behind (eventual consistency): right after saving, read your own write from the main database.' },
    { t: 'Caching', b: 'Keep hot results in Redis or the CDN; the hard part is clearing them when data changes.', d: 'Strategies: cache with a short TTL, delete the key on write, or tag-based revalidation (Next.js revalidateTag).' },
    { t: 'Backups and restore', b: 'Automatic daily backups plus point-in-time recovery; test a restore before you need it.', d: 'Managed databases (RDS, Supabase, Neon) do backups; you still decide retention and practise restoring to a new database.' },
    { t: 'Migrations', b: 'Versioned schema changes, run in CI before the new code goes live.', d: 'Prisma Migrate / Drizzle Kit / Flyway. Use expand → migrate → contract so old and new code both work during a deploy. Never edit production tables by hand.' },
    { t: 'Scaling further', b: 'Bigger machine first; then replicas, caching, partitioning; sharding last.', d: 'Partitioning splits a huge table (by month); sharding splits data across servers (by customer). Most apps never need sharding.' },
    { t: 'Security and privacy', b: 'Least-privilege database users, encryption, and care with personal data (GDPR).', d: 'The app user cannot drop tables; encrypt at rest and in transit; store only the personal data you need; support deleting a user\'s data on request.' },
  ];

  // ------------------------------------------------------------ the same database types in each cloud
  const CLOUD_DB = [
    ['Relational (SQL)', 'RDS, Aurora', 'Cloud SQL, AlloyDB, Spanner', 'Azure SQL, Azure Database for PostgreSQL', 'Supabase, Neon, PlanetScale, Turso'],
    ['Document', 'DynamoDB, DocumentDB', 'Firestore', 'Cosmos DB', 'MongoDB Atlas, Firebase'],
    ['Key-value / cache', 'ElastiCache, MemoryDB', 'Memorystore', 'Azure Cache for Redis', 'Upstash, Redis Cloud'],
    ['Search', 'OpenSearch', 'Vertex AI Search', 'Azure AI Search', 'Algolia, Meilisearch Cloud, Elastic Cloud'],
    ['Wide-column', 'Keyspaces', 'Bigtable', 'Cosmos DB (Cassandra API)', 'ScyllaDB Cloud, DataStax Astra'],
    ['Graph', 'Neptune', 'Spanner Graph', 'Cosmos DB (Gremlin)', 'Neo4j Aura'],
    ['Time-series', 'Timestream', 'Bigtable, BigQuery', 'Azure Data Explorer', 'InfluxDB Cloud, Timescale Cloud'],
    ['Vector', 'Aurora / RDS + pgvector, OpenSearch', 'AlloyDB, Vertex AI Vector Search', 'Azure AI Search, Cosmos DB', 'Pinecone, Qdrant Cloud, Supabase'],
    ['Analytics warehouse', 'Redshift', 'BigQuery', 'Fabric / Synapse', 'Snowflake, ClickHouse Cloud, MotherDuck'],
    ['Files (not a database)', 'S3', 'Cloud Storage', 'Blob Storage', 'Cloudflare R2, Supabase Storage'],
  ];

  const STAGES = [
    { key: 'types', name: 'The types', title: 'The kinds of database', say: 'About ten kinds. Each one is very good at one kind of job.' },
    { key: 'sql', name: 'SQL basics', title: 'SQL in eight queries', say: 'The queries behind almost every app screen. The results come from the sample tables below.' },
    { key: 'schema', name: 'Design tables', title: 'Designing the shop\'s tables', say: 'How data is split into tables and linked: the skill behind every backend.' },
    { key: 'path', name: 'React → DB', title: 'From a React component to the database', say: 'The path a request takes, and the mistakes to avoid on the way.' },
    { key: 'ops', name: 'In production', title: 'Running a database in production', say: 'What keeps a database fast, safe and recoverable.' },
    { key: 'cloud', name: 'In the cloud', title: 'Where each kind runs: AWS, Google Cloud, Azure', say: 'The same kinds of database under different names. "Managed" means backups, updates and failover are done for you.' },
    { key: 'quiz', name: 'Which one?', title: 'Which database?', say: 'Pick the best fit for each real situation.' },
    { key: 'app', name: 'One app', title: 'One real app, several databases', say: 'Real apps combine them: one main database, plus helpers for jobs it is bad at.' },
    { key: 'words', name: 'Words', title: 'Words you will hear', say: 'One line each, so you recognise them in meetings and job posts.' },
  ];
  const UI = { stage: 0, answers: {}, detail: false };

  const rowsTable = rows => (rows.length ? `<table class="iv-diff db-result"><thead><tr>${Object.keys(rows[0]).map(k => `<th>${esc(k)}</th>`).join('')}</tr></thead><tbody>${rows.map(r => `<tr>${Object.values(r).map(v => `<td>${esc(v)}</td>`).join('')}</tr>`).join('')}</tbody></table>` : '<p class="cl-note">(no rows)</p>');
  const cardList = list => `<div class="db-grid dp-must">${list.map(x => `<div class="db-card"><div class="db-h"><b>${esc(x.t)}</b></div><p>${esc(x.b)}</p>${UI.detail ? `<p class="db-how">${esc(x.d)}</p>${x.code ? `<pre>${esc(x.code)}</pre>` : ''}` : ''}</div>`).join('')}</div>`;
  const VIEWS = {
    sql: () => `${UI.detail ? `<p><b>The sample tables</b></p><div class="db-two">${rowsTable(DATA.users)}${rowsTable(DATA.orders)}</div>` : '<p class="cl-note">Sample tables: users (Ada, Bob, Cleo, Dan) and orders. "+ Show details" shows them in full.</p>'}
      ${SQL.map((x, i) => `<div class="db-sql"><p><b>${i + 1}. ${esc(x.t)}</b> <small>${esc(x.b)}</small></p><div class="db-two"><pre>${esc(x.sql)}</pre>${x.run ? rowsTable(x.run()) : `<p class="db-res">→ ${esc(x.result)}</p>`}</div></div>`).join('')}`,
    schema: () => `<div class="db-schema">${SCHEMA.map(([n, cols]) => `<div class="db-table"><b>${esc(n)}</b>${cols.map(c => `<span class="${/PK/.test(c) ? 'pk' : /FK/.test(c) ? 'fk' : ''}">${esc(c)}</span>`).join('')}</div>`).join('')}</div>
      <ul class="db-rel">${RELATIONS.map(([k, d]) => `<li><b>${esc(k)}</b>: ${esc(d)}</li>`).join('')}</ul>
      <p><b>The rules</b></p><ul class="db-rel">${RULES.map(r => `<li>${esc(r)}</li>`).join('')}</ul>
      ${UI.detail ? `<p><b>The SQL that creates them</b> (PostgreSQL)</p><pre class="px-src">${esc(SCHEMA_SQL)}</pre>` : ''}`,
    path: () => `<div class="dp-chain">${PATH.map(p => `<span>${esc(p)}</span>`).join('<i>→</i>')}</div>${cardList(PATH_RULES)}`,
    ops: () => cardList(OPS),
    cloud: () => `<table class="iv-diff db-words db-cloud"><thead><tr><th>kind</th><th>AWS</th><th>Google Cloud</th><th>Azure</th><th>developer-friendly hosted</th></tr></thead><tbody>${CLOUD_DB.map(r => `<tr>${r.map((c, i) => `<td>${i ? esc(c) : `<b>${esc(c)}</b>`}</td>`).join('')}</tr>`).join('')}</tbody></table>
      ${UI.detail ? `<ul class="db-rel"><li><b>Managed</b> databases (RDS, Cloud SQL, Supabase…) handle backups, security updates, replicas and failover; you still own the schema, indexes and queries.</li>
        <li><b>Serverless</b> databases (Aurora Serverless v2, Neon, PlanetScale, DynamoDB on-demand) scale up and down with traffic; Neon can make a database branch per pull request.</li>
        <li><b>Costs</b> to watch: always-on instances, storage growth, data transfer out (egress), and read/write units on DynamoDB-style pricing. Set a budget alert.</li>
        <li><b>Where to start</b>: Supabase or Neon (PostgreSQL) for side projects; in a company, whatever the team already runs (often RDS / Aurora on AWS).</li></ul>` : ''}`,
    types: () => `<div class="db-grid">${TYPES.map(t => `<div class="db-card${t.start ? ' start' : ''}"><div class="db-h">${t.icon} <b>${esc(t.name)}</b>${t.start ? ' <span class="db-tag">start here</span>' : ''}</div>
        <pre class="dt">${esc(t.shape)}</pre><p>${esc(t.use)}</p><p class="db-how dt">${esc(t.how)}</p><p class="db-ex">${esc(t.ex)}</p></div>`).join('')}</div>
      <p class="cl-note">Rule of thumb: start with PostgreSQL. Add Redis when you need a cache, a search engine when you need a real search box, and the others only for a specific need.</p>`,
    quiz: () => QUESTIONS.map((x, i) => {
      const got = UI.answers[i], done = got != null, ok = got === x.a;
      return `<div class="db-q${done ? (ok ? ' ok' : ' no') : ''}"><p><b>${i + 1}.</b> ${esc(x.q)}</p>
        <div class="cl-choices">${TYPES.map(t => `<button class="btn small cl-choice${got === t.id ? ' on' : ''}${done && t.id === x.a ? ' right' : ''}" data-dbq="${i}" data-dba="${t.id}">${t.icon} ${esc(t.name)}</button>`).join('')}</div>
        ${done ? `<p class="db-ans">${ok ? '✅ Right' : `❌ Best fit: <b>${esc(T(x.a).name)}</b>`}: ${esc(x.why)}${x.also ? ` <i>Also OK: ${esc(x.also)}</i>` : ''}</p>` : ''}</div>`;
    }).join(''),
    app: () => `<p><b>An online shop</b> (like the 🚀 Next.js shop project):</p>
      <div class="db-arch">
        <div class="db-box web">🌐 <b>Browser</b><small>IndexedDB: the cart and drafts, offline</small></div>
        <div class="db-arrow">⇅ API calls</div>
        <div class="db-box api">🖥️ <b>Your server / API</b><small>Next.js routes, Node, serverless functions</small></div>
        <div class="db-arrow">⇅</div>
        <div class="db-row">
          <div class="db-box main">🧮 <b>PostgreSQL</b><small>users, products, orders, payments, stock: the source of truth</small></div>
          <div class="db-box">🔑 <b>Redis</b><small>sessions, cached product pages, rate limits</small></div>
          <div class="db-box">🔎 <b>Meilisearch</b><small>the product search box</small></div>
          <div class="db-box">🧭 <b>pgvector</b><small>the AI "help me choose" chat</small></div>
          <div class="db-box">🏭 <b>BigQuery / ClickHouse</b><small>sales reports from click and order events</small></div>
          <div class="db-box files">🗂️ <b>S3 / R2</b><small>product images (files, not a database)</small></div>
        </div>
      </div>
      <p><b>One order, step by step</b></p>
      <ol class="db-flow"><li>The user types "trail shoe": the <b>search engine</b> answers.</li>
        <li>The product page: <b>Redis</b> has a cached copy; on a miss, <b>PostgreSQL</b>, then it is cached for 60s.</li>
        <li>Checkout: one <b>PostgreSQL transaction</b> creates the order, takes the payment record and reduces stock.</li>
        <li>An "order placed" event goes to the <b>warehouse</b> for the reports.</li>
        <li>Stock changed, so the <b>search index</b> is updated from PostgreSQL (the main database stays the source of truth).</li></ol>`,
    words: () => `<table class="iv-diff db-words"><tbody>${WORDS.map(([w, d]) => `<tr><td><b>${esc(w)}</b></td><td>${esc(d)}</td></tr>`).join('')}</tbody></table>`,
  };

  function ensure() {
    let m = $('dbLab');
    if (m) return m;
    m = document.createElement('div');
    m.id = 'dbLab';
    m.className = 'modal hidden';
    m.setAttribute('role', 'dialog');
    m.setAttribute('aria-label', 'Databases');
    m.innerHTML = `<div class="modal-card wide cl-lab px-card">
      <button class="close" data-dbclose aria-label="Close">✕</button>
      <div class="cl-head"><h2 class="modal-title">🗄️ Databases</h2><span class="cl-note">what kinds exist and which to use for what</span></div>
      <div class="px-rail" id="dbRail"></div>
      <div class="px-main db-main"><div class="px-view"><h3 id="dbTitle"></h3><p class="px-say" id="dbSay"></p><button class="btn small dp-detail" id="dbDetail" data-dbdetail></button><div id="dbBody"></div></div></div>
      <div class="px-controls"><button class="btn small" id="dbPrev">◀ Back</button><button class="btn small primary" id="dbNext">Next ▶</button></div>
    </div>`;
    document.body.appendChild(m);
    return m;
  }
  function draw() {
    const s = STAGES[UI.stage];
    $('dbRail').innerHTML = STAGES.map((x, i) => `<button class="px-step${i === UI.stage ? ' now' : i < UI.stage ? ' done' : ''}" data-dbstage="${i}"><span>${i + 1}</span>${esc(x.name)}</button>`).join('<i>→</i>');
    $('dbTitle').textContent = `${UI.stage + 1} · ${s.title}`;
    $('dbSay').textContent = s.say;
    $('dbBody').innerHTML = VIEWS[s.key]();
    $('dbLab').classList.toggle('is-brief', !UI.detail);
    $('dbDetail').textContent = UI.detail ? '− Brief view' : '+ Show details';
    $('dbDetail').classList.toggle('hidden', ['quiz', 'words', 'app'].includes(s.key));
    $('dbPrev').disabled = UI.stage === 0;
    $('dbNext').disabled = UI.stage === STAGES.length - 1;
  }
  function open(stage) {
    const m = ensure();
    if (window.JSLabAPI) window.JSLabAPI.closeModals();
    ['practiceList', 'frontendMap'].forEach(id => { const x = $(id); if (x) x.classList.add('hidden'); });
    UI.stage = stage || 0;
    m.classList.remove('hidden');
    draw();
  }
  function close() { const m = $('dbLab'); if (m) m.classList.add('hidden'); }
  document.addEventListener('click', e => {
    const t = e.target;
    if (t.closest('#btnDb') || t.closest('[data-fmdb]')) { open(); return; }
    if (!$('dbLab') || $('dbLab').classList.contains('hidden')) return;
    const st = t.closest('[data-dbstage]');
    if (st) { UI.stage = +st.dataset.dbstage; draw(); return; }
    const a = t.closest('[data-dbq]');
    if (a) { UI.answers[+a.dataset.dbq] = a.dataset.dba; const y = $('dbBody').closest('.px-main').scrollTop; draw(); $('dbBody').closest('.px-main').scrollTop = y; return; }
    if (t.closest('[data-dbdetail]')) { UI.detail = !UI.detail; draw(); return; }
    if (t.closest('#dbPrev')) { UI.stage = Math.max(0, UI.stage - 1); draw(); return; }
    if (t.closest('#dbNext')) { UI.stage = Math.min(STAGES.length - 1, UI.stage + 1); draw(); return; }
    if (t.closest('[data-dbclose]')) close();
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && $('dbLab') && !$('dbLab').classList.contains('hidden')) close(); });

  window.DatabaseLab = { open, close, go: i => { UI.stage = i; draw(); }, goKey: k => { UI.stage = STAGES.findIndex(s => s.key === k); draw(); }, sql: SQL, types: TYPES, questions: QUESTIONS, answer: (i, id) => { UI.answers[i] = id; draw(); } };
})();

export interface Env {}

interface MirrorConfig {
  upstream: string;
  description: string;
  homepage?: string;
}

const MIRRORS: Record<string, MirrorConfig> = {
  ubuntu: {
    upstream: 'http://archive.ubuntu.com/ubuntu',
    description: 'Ubuntu',
    homepage: 'https://www.ubuntu.com',
  },
  'ubuntu-ports': {
    upstream: 'http://ports.ubuntu.com/ubuntu-ports',
    description: 'Ubuntu Ports (ARM/RISC-V)',
    homepage: 'https://www.ubuntu.com',
  },
  debian: {
    upstream: 'http://deb.debian.org/debian',
    description: 'Debian',
    homepage: 'https://www.debian.org',
  },
  'debian-security': {
    upstream: 'http://security.debian.org/debian-security',
    description: 'Debian Security',
    homepage: 'https://www.debian.org',
  },
  alpine: {
    upstream: 'http://dl-cdn.alpinelinux.org/alpine',
    description: 'Alpine Linux',
    homepage: 'https://www.alpinelinux.org',
  },
  centos: {
    upstream: 'http://vault.centos.org/centos',
    description: 'CentOS (Vault)',
    homepage: 'https://centos.org',
  },
  epel: {
    upstream: 'https://dl.fedoraproject.org/pub/epel',
    description: 'EPEL (Fedora Extra Packages)',
    homepage: 'https://fedoraproject.org/wiki/EPEL',
  },
  rockylinux: {
    upstream: 'https://dl.rockylinux.org/pub/rocky',
    description: 'Rocky Linux',
    homepage: 'https://rockylinux.org',
  },
  almalinux: {
    upstream: 'https://repo.almalinux.org/almalinux',
    description: 'AlmaLinux',
    homepage: 'https://almalinux.org',
  },
  nginx: {
    upstream: 'http://nginx.org/packages',
    description: 'NGINX',
    homepage: 'https://nginx.org',
  },
  nodejs: {
    upstream: 'https://nodejs.org/dist',
    description: 'Node.js',
    homepage: 'https://nodejs.org',
  },
  python: {
    upstream: 'https://www.python.org/ftp/python',
    description: 'Python',
    homepage: 'https://www.python.org',
  },
  ceph: {
    upstream: 'https://download.ceph.com/ceph',
    description: 'Ceph',
    homepage: 'https://ceph.io',
  },
};

// Headers from the client that should NOT be forwarded upstream
const BLOCKED_REQUEST_HEADERS = new Set([
  'cookie',
  'authorization',
  'host',
  'x-forwarded-for',
  'x-real-ip',
  'cf-ray',
  'cf-connecting-ip',
  'cf-ipcountry',
  'cf-visitor',
  'cf-worker',
  'x-forwarded-proto',
  'x-forwarded-host',
]);

// Headers from upstream that should NOT be forwarded to the client
const BLOCKED_RESPONSE_HEADERS = new Set([
  'set-cookie',
  'transfer-encoding',
  'connection',
  'keep-alive',
  'upgrade',
]);

// Headers to additionally strip when we transform the response body (HTML rewrite)
const TRANSFORMED_DROP_HEADERS = new Set([
  'content-length',
  'etag',
  'content-encoding',
  'accept-ranges',
]);

function parseUpstream(upstream: string): { origin: string; basePath: string } {
  const u = new URL(upstream);
  return {
    origin: u.origin,
    basePath: u.pathname === '/' ? '' : u.pathname.replace(/\/$/, ''),
  };
}

// Rewrite a URL or path from upstream context to our proxy context.
// Returns the rewritten value, or the original if it doesn't belong to this mirror.
function rewriteUpstreamRef(
  value: string,
  mirrorName: string,
  origin: string,
  basePath: string,
): string {
  if (!value) return value;

  // Skip fragment-only, query-only, javascript:, data:, mailto: values
  if (value.startsWith('#') || value.startsWith('?') || value.includes(':') && !value.startsWith('http') && !value.startsWith('/')) {
    return value;
  }

  // Full URL on the upstream origin
  if (value.startsWith(origin + '/') || value === origin) {
    const path = value === origin ? '/' : value.slice(origin.length);
    return rewriteAbsPath(path, mirrorName, basePath);
  }

  // Absolute path on our domain
  if (value.startsWith('/') && !value.startsWith('//')) {
    return rewriteAbsPath(value, mirrorName, basePath);
  }

  return value;
}

// Rewrite an absolute path (starts with '/') from upstream to our mirror path.
// Only rewrites paths under the upstream's basePath; leaves others unchanged.
function rewriteAbsPath(path: string, mirrorName: string, basePath: string): string {
  const prefix = '/' + mirrorName;

  if (basePath === '') {
    // Upstream is at the root — all absolute paths belong to this mirror
    return prefix + path;
  }

  if (path === basePath) {
    return prefix + '/';
  }

  if (path.startsWith(basePath + '/')) {
    return prefix + path.slice(basePath.length);
  }

  // Not under basePath (e.g. /icons/, /styles/) — leave as-is
  return path;
}

class LinkRewriter {
  constructor(
    private mirrorName: string,
    private origin: string,
    private basePath: string,
  ) {}

  element(element: Element): void {
    for (const attr of ['href', 'src', 'action', 'data-href']) {
      const val = element.getAttribute(attr);
      if (val != null) {
        const rewritten = rewriteUpstreamRef(val, this.mirrorName, this.origin, this.basePath);
        if (rewritten !== val) {
          element.setAttribute(attr, rewritten);
        }
      }
    }
  }
}

function buildUpstreamRequest(request: Request, targetUrl: string): Request {
  const headers = new Headers();
  for (const [key, value] of request.headers) {
    if (!BLOCKED_REQUEST_HEADERS.has(key.toLowerCase())) {
      headers.set(key, value);
    }
  }
  headers.set('User-Agent', 'Mozilla/5.0 (compatible; cf-mirror-proxy/1.0)');

  return new Request(targetUrl, {
    method: request.method,
    headers,
    body: request.method === 'GET' || request.method === 'HEAD' ? undefined : request.body,
    redirect: 'manual',
  });
}

function copyHeaders(
  from: Headers,
  dropExtra?: Set<string>,
): Headers {
  const out = new Headers();
  for (const [k, v] of from) {
    const lower = k.toLowerCase();
    if (BLOCKED_RESPONSE_HEADERS.has(lower)) continue;
    if (dropExtra?.has(lower)) continue;
    out.set(k, v);
  }
  out.set('Access-Control-Allow-Origin', '*');
  return out;
}

function handleIndex(): Response {
  const rows = Object.entries(MIRRORS)
    .map(
      ([name, cfg]) =>
        `<tr><td><a href="/${name}/">${name}</a></td><td>${cfg.description}</td>` +
        `<td><code>/${name}/</code></td></tr>`,
    )
    .join('\n');

  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>lihongjie.cn Mirror</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:900px;margin:40px auto;padding:0 20px;color:#333}
    h1{font-size:1.8em;margin-bottom:4px}
    p{color:#666;margin-top:4px}
    table{border-collapse:collapse;width:100%;margin-top:20px}
    th,td{text-align:left;padding:10px 14px;border-bottom:1px solid #eee}
    th{background:#f8f8f8;font-weight:600}
    a{color:#0366d6;text-decoration:none}
    a:hover{text-decoration:underline}
    code{background:#f3f3f3;padding:2px 6px;border-radius:3px;font-size:.88em;font-family:monospace}
    footer{margin-top:40px;color:#aaa;font-size:.85em}
  </style>
</head>
<body>
  <h1>🪞 lihongjie.cn Mirror</h1>
  <p>开源软件镜像代理站 · Open source software mirror proxy</p>
  <table>
    <thead><tr><th>镜像名</th><th>描述</th><th>路径</th></tr></thead>
    <tbody>${rows}</tbody>
  </table>
  <footer>Powered by Cloudflare Workers · <a href="https://github.com/lihongjie0209/cf-mirror-proxy">Source</a></footer>
</body>
</html>`;

  return new Response(html, {
    headers: { 'Content-Type': 'text/html; charset=utf-8' },
  });
}

export default {
  async fetch(request: Request, _env: Env, _ctx: ExecutionContext): Promise<Response> {
    const url = new URL(request.url);
    const pathname = url.pathname;

    // Landing page
    if (pathname === '/' || pathname === '') {
      return handleIndex();
    }

    // OPTIONS preflight
    if (request.method === 'OPTIONS') {
      return new Response(null, {
        headers: {
          'Access-Control-Allow-Origin': '*',
          'Access-Control-Allow-Methods': 'GET, HEAD, OPTIONS',
          'Access-Control-Max-Age': '86400',
        },
      });
    }

    // Extract mirror name (first non-empty path segment)
    const parts = pathname.split('/').filter(Boolean);
    const mirrorName = parts[0];
    const config = MIRRORS[mirrorName];

    if (!config) {
      return new Response(
        `Mirror "${mirrorName}" not found.\n\nAvailable mirrors: ${Object.keys(MIRRORS).join(', ')}`,
        { status: 404, headers: { 'Content-Type': 'text/plain' } },
      );
    }

    const { origin, basePath } = parseUpstream(config.upstream);

    // Build upstream path: strip /<mirrorName>, prepend basePath
    const subPath = pathname.slice(mirrorName.length + 1); // preserves leading '/'
    const targetPath = basePath + (subPath || '/');
    const targetUrl = origin + targetPath + url.search;

    const upstreamReq = buildUpstreamRequest(request, targetUrl);

    let upstreamRes: Response;
    try {
      upstreamRes = await fetch(upstreamReq);
    } catch (err) {
      return new Response(`Upstream fetch failed: ${err}`, {
        status: 502,
        headers: { 'Content-Type': 'text/plain' },
      });
    }

    const status = upstreamRes.status;

    // Handle redirects: rewrite Location header
    if (status >= 300 && status < 400) {
      const location = upstreamRes.headers.get('Location');
      const headers = copyHeaders(upstreamRes.headers);
      if (location) {
        headers.set('Location', rewriteUpstreamRef(location, mirrorName, origin, basePath));
      }
      return new Response(null, { status, headers });
    }

    const contentType = upstreamRes.headers.get('Content-Type') ?? '';

    // Rewrite HTML responses to fix absolute links
    if (contentType.includes('text/html')) {
      const headers = copyHeaders(upstreamRes.headers, TRANSFORMED_DROP_HEADERS);
      const rewriter = new LinkRewriter(mirrorName, origin, basePath);
      const transformed = new Response(upstreamRes.body, { status, headers });
      return new HTMLRewriter()
        .on('a', rewriter)
        .on('link', rewriter)
        .on('script', rewriter)
        .on('img', rewriter)
        .on('form', rewriter)
        .transform(transformed);
    }

    // All other responses (packages, text, etc.) — stream directly
    return new Response(upstreamRes.body, {
      status,
      headers: copyHeaders(upstreamRes.headers),
    });
  },
};

export interface Env {}

interface MirrorConfig {
  upstream: string; // Full HTTP/HTTPS base URL (may include a subpath)
  description: string;
}

// Mirror names match TUNA's tunasync.json "name" field exactly (case-sensitive).
// Upstream is the HTTP base URL; our proxy strips the mirror-name prefix and
// prepends the upstream basePath automatically.
const MIRRORS: Record<string, MirrorConfig> = {
  // ── Ubuntu ───────────────────────────────────────────────────────────────
  ubuntu: {
    upstream: 'http://archive.ubuntu.com/ubuntu',
    description: 'Ubuntu (amd64/i386)',
  },
  'ubuntu-ports': {
    upstream: 'http://ports.ubuntu.com/ubuntu-ports',
    description: 'Ubuntu Ports (ARM / RISC-V)',
  },
  'ubuntu-releases': {
    upstream: 'http://releases.ubuntu.com',
    description: 'Ubuntu Releases (ISO)',
  },
  'ubuntu-cloud-images': {
    upstream: 'https://cloud-images.ubuntu.com',
    description: 'Ubuntu Cloud Images',
  },
  ubuntukylin: {
    upstream: 'http://archive.ubuntukylin.com/ubuntukylin',
    description: 'Ubuntu Kylin',
  },

  // ── Debian ───────────────────────────────────────────────────────────────
  debian: {
    upstream: 'http://deb.debian.org/debian',
    description: 'Debian',
  },
  'debian-security': {
    upstream: 'http://security.debian.org/debian-security',
    description: 'Debian Security',
  },
  'debian-cd': {
    upstream: 'https://cdimage.debian.org/debian-cd',
    description: 'Debian CD/DVD Images',
  },
  'debian-elts': {
    upstream: 'https://deb.freexian.com/extended-lts',
    description: 'Debian ELTS (Freexian Extended LTS)',
  },
  xanmod: {
    upstream: 'https://deb.xanmod.org',
    description: 'XanMod Kernel',
  },

  // ── Raspberry Pi / Raspbian ──────────────────────────────────────────────
  raspbian: {
    upstream: 'http://raspbian.raspberrypi.org/raspbian',
    description: 'Raspbian',
  },
  raspberrypi: {
    upstream: 'http://archive.raspberrypi.org/debian',
    description: 'Raspberry Pi OS packages',
  },
  'raspberry-pi-os-images': {
    upstream: 'https://downloads.raspberrypi.org',
    description: 'Raspberry Pi OS Images',
  },

  // ── Kali Linux ───────────────────────────────────────────────────────────
  kali: {
    upstream: 'http://kali.download/kali',
    description: 'Kali Linux',
  },

  // ── Other Debian-based ───────────────────────────────────────────────────
  linuxmint: {
    upstream: 'https://packages.linuxmint.com',
    description: 'Linux Mint',
  },
  deepin: {
    upstream: 'https://community-packages.deepin.com/deepin',
    description: 'Deepin',
  },
  neurodebian: {
    upstream: 'http://neuro.debian.net',
    description: 'NeuroDebian',
  },
  OpenMediaVault: {
    upstream: 'https://packages.openmediavault.org/public',
    description: 'OpenMediaVault',
  },
  termux: {
    upstream: 'https://packages-cf.termux.dev',
    description: 'Termux',
  },

  // ── CentOS / Fedora ───────────────────────────────────────────────────────
  'centos-vault': {
    upstream: 'https://vault.centos.org',
    description: 'CentOS Vault (legacy releases)',
  },
  'centos-stream': {
    upstream: 'https://mirror.stream.centos.org',
    description: 'CentOS Stream',
  },
  fedora: {
    upstream: 'https://dl.fedoraproject.org/pub/fedora/linux',
    description: 'Fedora Linux',
  },
  'fedora-altarch': {
    upstream: 'https://dl.fedoraproject.org/pub/fedora-secondary',
    description: 'Fedora Alternate Architectures',
  },
  epel: {
    upstream: 'https://dl.fedoraproject.org/pub/epel',
    description: 'EPEL (Extra Packages for Enterprise Linux)',
  },
  elrepo: {
    upstream: 'https://elrepo.org/linux',
    description: 'ELRepo',
  },
  rpmfusion: {
    upstream: 'https://download1.rpmfusion.org/rpmfusion',
    description: 'RPM Fusion',
  },

  // ── Rocky / Alma (not in TUNA, added for completeness) ──────────────────
  rockylinux: {
    upstream: 'https://dl.rockylinux.org/pub/rocky',
    description: 'Rocky Linux',
  },
  almalinux: {
    upstream: 'https://repo.almalinux.org/almalinux',
    description: 'AlmaLinux',
  },

  // ── openSUSE ─────────────────────────────────────────────────────────────
  opensuse: {
    upstream: 'https://download.opensuse.org',
    description: 'openSUSE',
  },

  // ── openEuler ────────────────────────────────────────────────────────────
  openeuler: {
    upstream: 'https://repo.openeuler.org',
    description: 'openEuler',
  },

  // ── Alpine Linux ─────────────────────────────────────────────────────────
  alpine: {
    upstream: 'http://dl-cdn.alpinelinux.org/alpine',
    description: 'Alpine Linux',
  },

  // ── Arch Linux ───────────────────────────────────────────────────────────
  archlinux: {
    upstream: 'https://geo.mirror.pkgbuild.com',
    description: 'Arch Linux',
  },
  archlinuxcn: {
    upstream: 'https://repo.archlinuxcn.org',
    description: 'Arch Linux CN',
  },
  archlinuxarm: {
    upstream: 'http://os.archlinuxarm.org',
    description: 'Arch Linux ARM',
  },
  msys2: {
    upstream: 'https://repo.msys2.org/builds',
    description: 'MSYS2 (Windows)',
  },

  // ── Armbian / OpenWrt ────────────────────────────────────────────────────
  armbian: {
    upstream: 'https://apt.armbian.com',
    description: 'Armbian',
  },
  openwrt: {
    upstream: 'https://downloads.openwrt.org',
    description: 'OpenWrt',
  },

  // ── Databases ────────────────────────────────────────────────────────────
  mongodb: {
    upstream: 'https://repo.mongodb.org',
    description: 'MongoDB',
  },
  mysql: {
    upstream: 'https://repo.mysql.com',
    description: 'MySQL',
  },
  mariadb: {
    upstream: 'https://ftp.osuosl.org/pub/mariadb',
    description: 'MariaDB',
  },
  influxdata: {
    upstream: 'https://repos.influxdata.com',
    description: 'InfluxData (InfluxDB / Telegraf)',
  },

  // ── Docker / Kubernetes / DevOps ─────────────────────────────────────────
  'docker-ce': {
    upstream: 'https://download.docker.com',
    description: 'Docker CE',
  },
  proxmox: {
    upstream: 'http://download.proxmox.com',
    description: 'Proxmox VE',
  },
  ceph: {
    upstream: 'https://download.ceph.com/ceph',
    description: 'Ceph',
  },
  zabbix: {
    upstream: 'https://repo.zabbix.com/zabbix',
    description: 'Zabbix',
  },

  // ── Monitoring / Observability ───────────────────────────────────────────
  grafana: {
    upstream: 'https://apt.grafana.com',
    description: 'Grafana',
  },
  elasticstack: {
    upstream: 'https://artifacts.elastic.co',
    description: 'Elastic Stack',
  },

  // ── Languages / Runtimes ─────────────────────────────────────────────────
  python: {
    upstream: 'https://www.python.org/ftp/python',
    description: 'Python',
  },
  'nodejs-release': {
    upstream: 'https://nodejs.org/dist',
    description: 'Node.js',
  },
  Adoptium: {
    upstream: 'https://packages.adoptium.net/artifactory',
    description: 'Eclipse Adoptium (JDK / JRE)',
  },
  'erlang-solutions': {
    upstream: 'https://binaries2.erlang-solutions.com',
    description: 'Erlang Solutions',
  },

  // ── CI / CD ──────────────────────────────────────────────────────────────
  jenkins: {
    upstream: 'https://pkg.jenkins.io',
    description: 'Jenkins',
  },
  'gitlab-ce': {
    upstream: 'https://packages.gitlab.com/gitlab/gitlab-ce',
    description: 'GitLab CE',
  },
  'gitlab-runner': {
    upstream: 'https://packages.gitlab.com/runner/gitlab-runner',
    description: 'GitLab Runner',
  },

  // ── Web servers / System tools ───────────────────────────────────────────
  nginx: {
    upstream: 'http://nginx.org/packages',
    description: 'NGINX',
  },
  virtualbox: {
    upstream: 'http://download.virtualbox.org/virtualbox',
    description: 'VirtualBox',
  },
  'wine-builds': {
    upstream: 'https://dl.winehq.org/wine-builds',
    description: 'WineHQ',
  },
  'llvm-apt': {
    upstream: 'https://apt.llvm.org',
    description: 'LLVM / Clang',
  },
  mozilla: {
    upstream: 'https://packages.mozilla.org',
    description: 'Mozilla (Firefox / Thunderbird)',
  },
  'bazel-apt': {
    upstream: 'https://storage.googleapis.com/bazel-apt',
    description: 'Bazel',
  },
  'ros2': {
    upstream: 'http://packages.ros.org/ros2',
    description: 'ROS 2',
  },
  rudder: {
    upstream: 'https://repository.rudder.io',
    description: 'Rudder',
  },

  // ── GNU / Open source ────────────────────────────────────────────────────
  gnu: {
    upstream: 'https://ftp.gnu.org/gnu',
    description: 'GNU Software',
  },
  kernel: {
    upstream: 'https://www.kernel.org/pub/linux/kernel',
    description: 'Linux Kernel',
  },
  apache: {
    upstream: 'https://downloads.apache.org',
    description: 'Apache Software Foundation',
  },
  eclipse: {
    upstream: 'https://download.eclipse.org',
    description: 'Eclipse IDE',
  },
  qt: {
    upstream: 'https://download.qt.io',
    description: 'Qt',
  },
  libreoffice: {
    upstream: 'https://download.documentfoundation.org/libreoffice',
    description: 'LibreOffice',
  },
  blender: {
    upstream: 'https://download.blender.org',
    description: 'Blender',
  },
  CTAN: {
    upstream: 'https://mirrors.ctan.org',
    description: 'CTAN (TeX / LaTeX)',
  },
  'videolan-ftp': {
    upstream: 'https://download.videolan.org/pub',
    description: 'VideoLAN (VLC)',
  },
  wireshark: {
    upstream: 'https://www.wireshark.org/download',
    description: 'Wireshark',
  },
  putty: {
    upstream: 'https://the.earth.li/~sgtatham/putty/latest',
    description: 'PuTTY',
  },
  postmarketOS: {
    upstream: 'https://mirror.postmarketos.org/postmarketos',
    description: 'postmarketOS',
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

const MIRROR_CATEGORIES: Array<{ title: string; names: string[] }> = [
  {
    title: 'Ubuntu',
    names: ['ubuntu', 'ubuntu-ports', 'ubuntu-releases', 'ubuntu-cloud-images', 'ubuntukylin'],
  },
  {
    title: 'Debian & 衍生发行版',
    names: [
      'debian', 'debian-security', 'debian-cd', 'debian-elts', 'xanmod',
      'raspbian', 'raspberrypi', 'raspberry-pi-os-images',
      'kali', 'linuxmint', 'deepin', 'neurodebian', 'OpenMediaVault', 'termux',
    ],
  },
  {
    title: 'RPM 系发行版',
    names: [
      'centos-vault', 'centos-stream', 'fedora', 'fedora-altarch',
      'epel', 'elrepo', 'rpmfusion', 'rockylinux', 'almalinux',
    ],
  },
  {
    title: '其他发行版',
    names: [
      'opensuse', 'openeuler', 'alpine', 'archlinux', 'archlinuxcn', 'archlinuxarm',
      'msys2', 'armbian', 'openwrt', 'postmarketOS',
    ],
  },
  {
    title: '数据库',
    names: ['mongodb', 'mysql', 'mariadb', 'influxdata'],
  },
  {
    title: 'DevOps / 容器',
    names: ['docker-ce', 'proxmox', 'ceph', 'zabbix', 'grafana', 'elasticstack'],
  },
  {
    title: '编程语言 / 运行时',
    names: ['python', 'nodejs-release', 'Adoptium', 'erlang-solutions'],
  },
  {
    title: 'CI/CD',
    names: ['jenkins', 'gitlab-ce', 'gitlab-runner'],
  },
  {
    title: '系统工具 / 应用',
    names: [
      'nginx', 'virtualbox', 'wine-builds', 'llvm-apt', 'mozilla',
      'bazel-apt', 'ros2', 'rudder',
    ],
  },
  {
    title: '开源软件 / 桌面应用',
    names: [
      'gnu', 'kernel', 'apache', 'eclipse', 'qt', 'libreoffice',
      'blender', 'CTAN', 'videolan-ftp', 'wireshark', 'putty',
    ],
  },
];

function handleIndex(): Response {
  const allCategorized = new Set(MIRROR_CATEGORIES.flatMap(c => c.names));
  const uncategorized = Object.keys(MIRRORS).filter(n => !allCategorized.has(n));

  const sectionHtml = (category: { title: string; names: string[] }) => {
    const rows = category.names
      .filter(n => MIRRORS[n])
      .map(
        name =>
          `<tr><td><a href="/${name}/">${name}</a></td>` +
          `<td>${MIRRORS[name].description}</td></tr>`,
      )
      .join('');
    if (!rows) return '';
    return `<h2>${category.title}</h2><table>
<thead><tr><th>镜像名</th><th>描述</th></tr></thead>
<tbody>${rows}</tbody></table>`;
  };

  const sectionsHtml = MIRROR_CATEGORIES.map(sectionHtml).join('\n');
  const extraRows = uncategorized
    .map(n => `<tr><td><a href="/${n}/">${n}</a></td><td>${MIRRORS[n].description}</td></tr>`)
    .join('');
  const extraSection = extraRows
    ? `<h2>其他</h2><table><thead><tr><th>镜像名</th><th>描述</th></tr></thead><tbody>${extraRows}</tbody></table>`
    : '';

  const html = `<!DOCTYPE html>
<html lang="zh">
<head>
  <meta charset="utf-8">
  <meta name="viewport" content="width=device-width,initial-scale=1">
  <title>lihongjie.cn Mirror</title>
  <style>
    *{box-sizing:border-box}
    body{font-family:-apple-system,BlinkMacSystemFont,"Segoe UI",sans-serif;max-width:960px;margin:40px auto;padding:0 20px;color:#333}
    h1{font-size:1.8em;margin-bottom:4px}
    h2{font-size:1.1em;margin:28px 0 8px;color:#555;border-left:4px solid #0366d6;padding-left:10px}
    p{color:#666;margin-top:4px}
    table{border-collapse:collapse;width:100%;margin-bottom:8px}
    th,td{text-align:left;padding:8px 12px;border-bottom:1px solid #eee}
    th{background:#f8f8f8;font-weight:600}
    a{color:#0366d6;text-decoration:none}
    a:hover{text-decoration:underline}
    code{background:#f3f3f3;padding:2px 6px;border-radius:3px;font-size:.88em;font-family:monospace}
    footer{margin-top:40px;color:#aaa;font-size:.85em}
  </style>
</head>
<body>
  <h1>🪞 lihongjie.cn Mirror</h1>
  <p>开源软件镜像代理站，命名规范与 <a href="https://mirrors.tuna.tsinghua.edu.cn">TUNA</a> 保持一致。<br>
     访问方式：<code>https://mirror.lihongjie.cn/&lt;镜像名&gt;/</code>（国际）&nbsp; &nbsp;
     <code>https://mirror.cn.lihongjie.cn/&lt;镜像名&gt;/</code>（国内优选）</p>
  ${sectionsHtml}
  ${extraSection}
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

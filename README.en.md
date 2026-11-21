# ds-fenggu-pill · DeepSeek peak & off-peak price

**English** | [中文](README.md)

A DeepSeek Harness plugin that shows whether the DeepSeek API is currently billed at peak (full price) or off-peak (half price), placed right after the Edit menu in the Windows caption strip, with a live countdown to the next switch.

<p align="left"><img src="icon.svg" width="36" height="36" alt="ds-fenggu-pill icon"></p>

## Features

- **Ambient pill**: state dot, the local nickname (Liang Wengu / Liang Wenfeng), and a per-second countdown to the next switch.
- **Click to expand**: current tier, next switch time (Beijing time), progress through the current segment, billing rule, data source, and update time.
- **State colors**: amber for peak (full price), green for off-peak (half price), red for data errors; theme tokens only, light and dark themes both supported.
- **Network states**: syncing, offline, and update-failed (keeps the last data); the panel has a manual refresh action.
- **Bilingual**: copy follows the Harness language setting; the English UI does not print Chinese names coming from the server.

## Placement

- Windows desktop: positioned right after the caption Edit menu (`shell.overlay` slot; the desktop chrome menu host `[data-windows-menu]` is measured and the pill is aligned 10px to its right).
- Environments without that menu bar (plain web GUI, non-Windows) or before the menu host mounts: the pill falls back to the top center of the window.

## Installation

Requires a working DeepSeek Harness installation (Web UI). This is a plain JavaScript bundle with no build step and no third-party dependencies.

### Option 1: install from GitHub (recommended)

In Harness, open **Plugins**, choose **Add plugin**, and enter:

```text
github:<your-github-user>/ds-fenggu-pill
```

A version can be pinned too:

```text
github:<your-github-user>/ds-fenggu-pill#v1.0.0
```

Confirm the plugin row is enabled after installation. Refresh the page or restart Harness so the client bundle loads for the first time.

### Option 2: install from a local directory

1. Clone this repository:

   ```bash
   git clone https://github.com/<your-github-user>/ds-fenggu-pill.git
   ```

2. In **Plugins**, choose **Add plugin** and select the repository root (the directory containing `package.json`).
3. Refresh the page or restart Harness.

### Option 3: add the profile patch manually (not recommended)

Append the row below to `$DSH_HOME/profiles/<profile>/cordis.patch.yml` and make sure the package is installed where that profile can resolve it:

```yaml
- insert:
    - id: ds-fenggu-pill
      name: 'ds-fenggu-pill'
```

## Usage

- Idle state: `Off-peak · half price to peak 2d 11:32:06` or `Peak · full price to off-peak 03:12:45` in English, or the Chinese equivalents.
- Click the pill to expand the details. Click it again, click outside, or press `Esc` to close; focus returns to the pill.
- The refresh button in the panel fetches immediately. Opening the panel refreshes data older than 30 seconds.

## Data and network

- Endpoint: `GET https://dsfgz.xinwkx.top/v1/fenggu` (public, no authentication, CORS enabled).
- Requests: once on load, then every 60 seconds, when the page becomes visible again, and after the switch boundary is crossed. Each request times out after 12 seconds.
- Only the web page makes the request: nothing enters the model context or the session log, no local files or credentials are uploaded, and the response stays in page memory.
- Peak/off-peak rule (from the official pricing page): **09:00–12:00 and 14:00–18:00 Beijing time, Monday to Friday, excluding Chinese statutory holidays** are peak (full price); all other hours, the lunch break, nights, weekends, and statutory holidays are off-peak at half price. [Official pricing](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)
- The plugin only displays the state and times returned by the endpoint. It does not compute holidays itself and takes no part in actual billing.

## Compatibility

- Developed and verified on DeepSeek Harness `0.2.2-rc.5` Desktop (Windows) with the Web UI.
- Depends on the Harness `shell.overlay` slot (declared by `@deepseek-ai/dsh-client-ui-layout`) and the client locale service.
- Other Harness versions are untested; changes to `dsh.client.inject` or `shell.overlay` may require adaptation.

## Limitations

- The data comes from a third-party public endpoint. When that endpoint is unavailable or its fields change, the pill shows offline/update-failed states instead of computing the schedule locally.
- Non-Windows desktop and plain web GUI have no caption menu bar, so the pill falls back to the top center and may cover part of the page.
- In very narrow windows the pill truncates its text instead of running under the window caption buttons.

## Repository layout

```text
ds-fenggu-pill/
├─ package.json          # bundle and client manifest (dsh.bundle / dsh.client)
├─ cordis.patch.yml      # inserts the Host row
├─ index.js              # Host half (empty)
├─ client.js             # browser bundle: render, polling, countdown, placement
├─ locale/
│  ├─ zh.json            # Plugins page title/description (Chinese)
│  └─ en.json            # Plugins page title/description (English)
├─ icon.svg              # plugin icon
├─ README.md             # Chinese documentation
├─ README.en.md          # this file
├─ CHANGELOG.md
└─ LICENSE
```

## Development

- `client.js` is a DSH client-module browser bundle: it calls `window.__ModuleLoader__.load({ id: '<package name>', factory(require) { ... } })`, and the factory may `require('react')` and other baseline modules.
- No dependencies and no build step. A local-directory install reloads live; refresh the page or restart Harness when needed.
- Syntax check:

  ```bash
  node --check client.js
  ```

- If you rename or fork the package, keep these three names identical:
  1. `name` in `package.json`
  2. the `id` in `window.__ModuleLoader__.load` in `client.js`
  3. the `name` of the inserted row in `cordis.patch.yml` (plus the host package in `dsh.client.inject`)

## Troubleshooting

- **The pill does not appear**: confirm the plugin is enabled; refresh the page or restart Harness; check whether another `shell.overlay` entry covers it.
- **It is not beside the Edit menu**: the current environment has no Windows caption menu bar, so the top-center fallback is expected.
- **It always shows offline**: check the network or whether `https://dsfgz.xinwkx.top/v1/fenggu` is reachable; the plugin does not compute the schedule locally.
- **How to turn it off**: disable or remove `ds-fenggu-pill` in **Plugins**; the pill and its polling stop immediately.

## License

[MIT](LICENSE)

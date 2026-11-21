# ds-fenggu-pill · DeepSeek 峰谷价

[English](README.en.md) | **中文**

DeepSeek Harness 插件：在 Windows 窗口顶部「编辑」菜单右侧显示 DeepSeek API 当前处于高峰全价还是空闲半价，并实时倒计时到下一次切换。

<p align="left"><img src="icon.svg" width="36" height="36" alt="ds-fenggu-pill icon"></p>

## 功能

- **常驻胶囊**：状态点 + 梁文峰/梁文谷 + 距下次切换的倒计时，每秒更新。
- **点击展开详情**：当前时段、下次切换时刻（北京时间）、本段区间进度、计费规则、数据来源与更新时间。
- **状态颜色**：高峰期琥珀色（全价）、空闲期绿色（半价）、数据异常红色；只用 DSH 主题令牌，跟随明暗主题。
- **网络状态**：同步中、离线、更新失败（保留上次数据）分别显示；详情面板内可手动刷新。
- **中英双语**：文案跟随 Harness 语言设置；英文界面不输出服务端中文名称。

## 界面位置

- Windows 桌面端：胶囊定位在窗口标题条「编辑」菜单右侧（`shell.overlay` 槽位，读取桌面壳菜单条 `[data-windows-menu]` 的位置后对齐，间隔 10px）。
- 没有该菜单条的环境（纯网页端、非 Windows）或菜单条尚未挂载：回退到窗口顶部居中。

## 安装

需要已安装 DeepSeek Harness（Web UI 可用）。本插件是纯 JavaScript bundle，无构建步骤、无第三方依赖。

### 方式一：从 GitHub 安装（推荐）

在 Harness 的 **插件** 页选择 **添加插件**，输入：

```text
github:<你的GitHub用户名>/ds-fenggu-pill
```

也可以固定版本：

```text
github:<你的GitHub用户名>/ds-fenggu-pill#v1.0.0
```

安装完成后确认插件行为启用状态。首次安装后刷新页面或重启 Harness 使客户端 bundle 加载。

### 方式二：本地目录安装

1. 克隆本仓库到本地：

   ```bash
   git clone https://github.com/<你的GitHub用户名>/ds-fenggu-pill.git
   ```

2. 在 **插件** 页选择 **添加插件**，选择克隆后的仓库根目录（包含 `package.json` 的目录）。
3. 刷新页面或重启 Harness。

### 方式三：写入 profile patch（不推荐，需手动管理依赖）

把下面一行插入 `$DSH_HOME/profiles/<profile>/cordis.patch.yml`，并确保包已安装到该 profile 可解析的位置：

```yaml
- insert:
    - id: ds-fenggu-pill
      name: 'ds-fenggu-pill'
```

## 使用

- 默认显示：「梁文谷 · 半价 距峰 2 天 11:32:06」或「梁文峰 · 全价 距谷 03:12:45」。
- 点击胶囊展开详情；再次点击、点击面板外部或按 `Esc` 关闭，关闭后焦点回到胶囊。
- 面板内的刷新按钮立即重新获取数据；打开面板时若数据超过 30 秒会自动刷新。

## 数据与网络

- 数据接口：`GET https://dsfgz.xinwkx.top/v1/fenggu`（公开接口，无需鉴权，CORS 开放）。
- 请求时机：加载时一次；之后每 60 秒一次；页面重新可见时一次；跨过切换时刻后自动重取。单次请求 12 秒超时。
- 只由网页端发起网络请求：不写入模型上下文、不写入会话记录、不上传本地文件或凭据，接口响应只保存在页面内存中。
- 高峰/空闲规则来自官方定价页：北京时间**周一至周五（不含中国法定节假日）09:00–12:00、14:00–18:00** 为高峰全价；其余时段、午休、夜间、周末与法定节假日全天为空闲半价，空闲价 = 高峰价的一半。[官方定价页](https://api-docs.deepseek.com/zh-cn/quick_start/pricing)
- 插件只展示接口返回的状态与时间，不自行推算节假日，也不参与实际计费。

## 兼容性

- 开发与验证环境：DeepSeek Harness `0.2.2-rc.5` Desktop（Windows）+ Web UI。
- 依赖 Harness 的 `shell.overlay` 插槽（由 `@deepseek-ai/dsh-client-ui-layout` 声明）和客户端 locale 服务。
- 其他 Harness 版本未验证；`dsh.client.inject` 与 `shell.overlay` 行为变化时可能需要适配。

## 限制

- 数据依赖第三方公开接口；接口地址、字段或不可用时，胶囊会显示离线/更新失败，不会本地推算。
- 非 Windows 桌面或纯网页端没有标题条菜单条，胶囊只能回退到窗口顶部居中，可能覆盖部分页面内容。
- 极窄窗口下胶囊文字会省略，避免压住窗口控制按钮。

## 目录结构

```text
ds-fenggu-pill/
├─ package.json          # bundle 与客户端清单（dsh.bundle / dsh.client）
├─ cordis.patch.yml      # 插入 Host row
├─ index.js              # Host half（空实现）
├─ client.js             # 浏览器 bundle：渲染、轮询、倒计时、定位
├─ locale/
│  ├─ zh.json            # 插件页标题/描述（中文）
│  └─ en.json            # 插件页标题/描述（英文）
├─ icon.svg              # 插件图标
├─ README.md             # 中文说明
├─ README.en.md          # 英文说明
├─ CHANGELOG.md
└─ LICENSE
```

## 开发

- `client.js` 是 DSH 客户端模块格式的浏览器 bundle：调用 `window.__ModuleLoader__.load({ id: '<包名>', factory(require) { ... } })`，`factory` 内可 `require('react')` 等基线模块。
- 无依赖、无构建；修改后本地目录安装即可热更新（必要时刷新页面或重启）。
- 语法检查：

  ```bash
  node --check client.js
  ```

- 重命名或 fork 时，以下三处名称必须保持一致：
  1. `package.json` 的 `name`
  2. `client.js` 中 `window.__ModuleLoader__.load` 的 `id`
  3. `cordis.patch.yml` 插入行的 `name`（以及 `dsh.client.inject` 的宿主包名）

## 常见问题

- **安装后没有出现**：确认插件为启用状态；刷新页面或重启 Harness；检查是否被其他插件的 `shell.overlay` 条目遮挡。
- **位置不在「编辑」右侧**：说明当前环境没有 Windows 桌面标题条菜单条，胶囊回退到顶部居中，这是预期行为。
- **一直显示离线**：检查网络或 `https://dsfgz.xinwkx.top/v1/fenggu` 是否可访问；接口不可用时插件不做本地推算。
- **如何关闭**：在 **插件** 页停用或移除 `ds-fenggu-pill`，胶囊与定时请求随即停止。

## 许可证

[MIT](LICENSE)

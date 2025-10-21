# AI Makeup Mirror

AI Makeup Mirror is an Expo + React Native demo that showcases the MVP experience for a virtual makeup mirror tailored to female users who care about skincare, makeup, and selfie experiences.

## Features

- **启动与权限**：启动页提示并申请前置摄像头权限。
- **镜子页**：实时前置摄像头预览，支持亮度、缩放调节与画面冻结（捕捉当前帧）。
- **AI 功能菜单**：柔粉 Material 3 风格的浮层，展示肤质检测、妆容顾问、虚拟试妆等入口（当前为 UI 占位）。
- **底部工具栏**：主拍照按钮、亮度/缩放快捷控制以及状态条展示。
- **报告页**：静态肤质趋势图与推荐建议示例。
- **设置页**：切换主题立即作用于全局色板，并提供通知开关与隐私选项示例。
- **订阅弹窗**：粉色渐变主题的会员升级弹窗，包含月度与年度套餐。

## Getting Started

```bash
cd Makeup-Mirror
npm install
npm run start
# 在 Android 模拟器/真实设备上直接运行原生包
npm run android:app
```

在 Expo Dev Tools 中选择对应的运行平台（Android/iOS/Web）。
如果需要直接在 Android 模拟器或连接的设备上安装原生调试包，可执行 `npm run android:app`，这会触发 `expo run:android` 生成并安装开发构建。确保当前终端路径位于项目根目录（包含 `package.json` 的文件夹），否则会出现 `ENOENT: no such file or directory, open '.../package.json'` 的错误。

## Tech Stack

- Expo（React Native）
- Material 3 灵感的自定义柔粉主题
- Animated API 构建淡入、缩放与滑入动画

## Roadmap

| 版本 | 范围 | 目标 |
| --- | --- | --- |
| 1.0 MVP | 实时预览 + 冻结 + 亮度/缩放 + 假 AI 菜单 + 订阅弹窗 | 初版 Demo，体验验证 |
| 1.1 Beta | 接入 AI 肤质检测模型 + 报告页图表 | 功能内测与 AI 准确性验证 |
| 1.5 Release | 全功能上线 + 订阅支付 | Google Play 正式发布 |

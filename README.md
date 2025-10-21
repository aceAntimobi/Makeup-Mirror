# AI Makeup Mirror (Android)

原生 Android 项目，使用 Kotlin 与 Jetpack Compose 构建柔粉主题的 AI 美妆镜 Demo。项目遵循 Material You 设计语言，聚焦以下功能体验：

- **镜子页**：模拟前置摄像头预览、亮度/缩放调节、冻结画面、AI 菜单、辅助底部菜单。
- **报告页**：静态展示肤质趋势卡片，预留未来对接 AI 分析结果的空间。
- **设置页**：提供主题、通知、隐私等常用配置项的交互骨架。
- **订阅弹窗**：演示高级会员权益与价格方案。

> 说明：当前版本专注界面展示，并未整合真实摄像头画面与 AI 能力，后续迭代可在现有结构上扩展。

## 运行要求

- Android Studio Giraffe (或更新版本) / IntelliJ IDEA 带 Android 插件
- JDK 17
- Android SDK 34（可由 Android Studio 自动安装）

## 快速开始

1. 克隆仓库后，在项目根目录执行一次 Gradle Wrapper 引导脚本，自动下载 `gradle-wrapper.jar`：
   ```bash
   ./gradlew tasks
   ```
   如果网络受限，可手动下载 `https://repo.gradle.org/gradle/libs-releases-local/org/gradle/gradle-wrapper/8.4/gradle-wrapper-8.4.jar` 保存到 `gradle/wrapper/`。

2. 使用 Android Studio 打开项目，等待 Gradle 同步完成。

3. 运行应用：
   - 连接 Android 模拟器或真机
   - 点击 **Run 'app'**，或使用命令行：
     ```bash
     ./gradlew installDebug
     ```

## 模块概览

| 模块 | 关键体验 | 说明 |
| ---- | -------- | ---- |
| 启动与权限 | 自动申请摄像头权限 | `MainActivity` 初始化阶段处理权限请求 |
| 镜像预览 | 冻结画面、亮度/缩放调节 | `MirrorScreen` 通过 Compose 状态模拟交互 |
| AI 功能菜单 | 肤质检测、妆容顾问等入口 | `AIMenu` 组件提供 4 项占位功能说明 |
| 底部导航 | 镜子 / 报告 / 设置 | `MakeupMirrorApp` 使用 `NavigationBar` 管理 Tab |
| 报告页 | 趋势列表与建议 | `ReportScreen` 展示静态评分与建议卡片 |
| 设置页 | 主题、通知、隐私 | `SettingsScreen` 包含切换与信息卡片 |
| 订阅模块 | 弹出对话框 | `SubscriptionDialog` 展示价格与权益 |

## 目录结构

```
Makeup-Mirror/
├── app/
│   ├── build.gradle.kts
│   └── src/main/
│       ├── AndroidManifest.xml
│       ├── java/com/example/makeupmirror/MainActivity.kt
│       └── res/
│           ├── drawable/
│           ├── mipmap-*/
│           └── values/
├── build.gradle.kts
├── gradlew / gradlew.bat
├── settings.gradle.kts
└── README.md
```

## 后续规划

- 接入 CameraX 提供真实前置摄像头预览
- 构建 AI 肤质检测与报告数据模型
- 集成 Google Play Billing 完成订阅流程
- 增强动效表现，支持 60fps 体验优化

欢迎根据产品路线继续扩展原生 Android 版本。

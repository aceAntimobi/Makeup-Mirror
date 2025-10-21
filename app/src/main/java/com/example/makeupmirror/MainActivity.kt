package com.example.makeupmirror

import android.Manifest
import android.os.Bundle
import androidx.activity.ComponentActivity
import androidx.activity.compose.setContent
import androidx.activity.result.contract.ActivityResultContracts
import androidx.compose.animation.AnimatedVisibility
import androidx.compose.animation.fadeIn
import androidx.compose.animation.fadeOut
import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.layout.fillMaxSize
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.offset
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.layout.size
import androidx.compose.foundation.lazy.LazyColumn
import androidx.compose.foundation.lazy.items
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.AutoAwesome
import androidx.compose.material.icons.filled.BarChart
import androidx.compose.material.icons.filled.Brightness6
import androidx.compose.material.icons.filled.Camera
import androidx.compose.material.icons.filled.Cameraswitch
import androidx.compose.material.icons.filled.Close
import androidx.compose.material.icons.filled.MoreVert
import androidx.compose.material.icons.filled.Paid
import androidx.compose.material.icons.filled.Settings
import androidx.compose.material3.AlertDialog
import androidx.compose.material3.Button
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.material3.ExperimentalMaterial3Api
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.lightColorScheme
import androidx.compose.material3.ModalBottomSheet
import androidx.compose.material3.NavigationBar
import androidx.compose.material3.NavigationBarItem
import androidx.compose.material3.Scaffold
import androidx.compose.material3.Slider
import androidx.compose.material3.Surface
import androidx.compose.material3.Text
import androidx.compose.material3.TextButton
import androidx.compose.material3.rememberModalBottomSheetState
import androidx.compose.runtime.Composable
import androidx.compose.runtime.LaunchedEffect
import androidx.compose.runtime.getValue
import androidx.compose.runtime.mutableStateOf
import androidx.compose.runtime.remember
import androidx.compose.runtime.rememberCoroutineScope
import androidx.compose.runtime.setValue
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.graphics.Brush
import androidx.compose.ui.graphics.Color
import androidx.compose.ui.graphics.luminance
import androidx.compose.ui.graphics.vector.ImageVector
import androidx.compose.ui.text.font.FontFamily
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import androidx.compose.ui.unit.sp
import androidx.navigation.NavGraph.Companion.findStartDestination
import androidx.navigation.compose.NavHost
import androidx.navigation.compose.composable
import androidx.navigation.compose.currentBackStackEntryAsState
import androidx.navigation.compose.rememberNavController
import com.google.accompanist.systemuicontroller.rememberSystemUiController
import kotlinx.coroutines.launch

class MainActivity : ComponentActivity() {

    private val permissionLauncher =
        registerForActivityResult(ActivityResultContracts.RequestPermission()) { /* no-op */ }

    override fun onCreate(savedInstanceState: Bundle?) {
        super.onCreate(savedInstanceState)
        permissionLauncher.launch(Manifest.permission.CAMERA)

        setContent {
            MakeupMirrorTheme {
                val systemUi = rememberSystemUiController()
                val useDarkIcons = MaterialTheme.colorScheme.background.luminance() > 0.5f
                LaunchedEffect(systemUi, useDarkIcons) {
                    systemUi.setSystemBarsColor(
                        color = Color.Transparent,
                        darkIcons = useDarkIcons
                    )
                }
                Surface(modifier = Modifier.fillMaxSize(), color = MaterialTheme.colorScheme.background) {
                    MakeupMirrorApp()
                }
            }
        }
    }
}

data class BottomDestination(
    val route: String,
    val title: String,
    val icon: ImageVector
)

private val bottomDestinations = listOf(
    BottomDestination("mirror", "镜子", Icons.Default.Camera),
    BottomDestination("report", "报告", Icons.Default.BarChart),
    BottomDestination("settings", "设置", Icons.Default.Settings)
)

@Composable
fun MakeupMirrorApp() {
    val navController = rememberNavController()
    val navBackStackEntry by navController.currentBackStackEntryAsState()
    val currentDestination = navBackStackEntry?.destination?.route ?: bottomDestinations.first().route

    Scaffold(
        bottomBar = {
            NavigationBar(containerColor = MaterialTheme.colorScheme.surface, tonalElevation = 6.dp) {
                bottomDestinations.forEach { destination ->
                    val selected = currentDestination == destination.route
                    NavigationBarItem(
                        selected = selected,
                        onClick = {
                            navController.navigate(destination.route) {
                                popUpTo(navController.graph.findStartDestination().id) {
                                    saveState = true
                                }
                                launchSingleTop = true
                                restoreState = true
                            }
                        },
                        icon = {
                            Icon(
                                imageVector = destination.icon,
                                contentDescription = destination.title
                            )
                        },
                        label = { Text(destination.title) }
                    )
                }
            }
        }
    ) { paddingValues ->
        NavHost(
            navController = navController,
            startDestination = bottomDestinations.first().route,
            modifier = Modifier.padding(paddingValues)
        ) {
            composable("mirror") { MirrorScreen() }
            composable("report") { ReportScreen() }
            composable("settings") { SettingsScreen() }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun MirrorScreen() {
    var brightness by remember { mutableStateOf(1f) }
    var zoom by remember { mutableStateOf(1f) }
    var isFrozen by remember { mutableStateOf(false) }
    var showAiMenu by remember { mutableStateOf(false) }
    var showBottomSheet by remember { mutableStateOf(false) }
    var showSubscription by remember { mutableStateOf(false) }

    val sheetState = rememberModalBottomSheetState(skipPartiallyExpanded = true)
    val coroutineScope = rememberCoroutineScope()

    Box(modifier = Modifier.fillMaxSize()) {
        Column(
            modifier = Modifier
                .fillMaxSize()
                .background(
                    Brush.verticalGradient(
                        colors = listOf(
                            Color(0xFFFFF7FB),
                            Color(0xFFFED7E2)
                        )
                    )
                )
                .padding(horizontal = 20.dp, vertical = 24.dp),
            verticalArrangement = Arrangement.SpaceBetween
        ) {
            Column(
                modifier = Modifier.fillMaxWidth(),
                horizontalAlignment = Alignment.CenterHorizontally
            ) {
                Text(
                    text = if (isFrozen) "冻结画面" else "实时镜像预览",
                    style = MaterialTheme.typography.titleMedium,
                    color = MaterialTheme.colorScheme.onBackground,
                    modifier = Modifier.padding(bottom = 16.dp)
                )
                Box(
                    modifier = Modifier
                        .fillMaxWidth()
                        .aspectRatio(3f / 4f)
                        .background(
                            if (isFrozen) Color(0xFFFECDD3) else Color(0xFFEFE7FF),
                            shape = MaterialTheme.shapes.large
                        ),
                    contentAlignment = Alignment.Center
                ) {
                    Text(
                        text = if (isFrozen) "静态帧已冻结" else "相机预览占位",
                        color = if (isFrozen) Color(0xFF511F2D) else MaterialTheme.colorScheme.primary,
                        style = MaterialTheme.typography.bodyMedium,
                        textAlign = TextAlign.Center
                    )
                }

                Spacer(modifier = Modifier.height(24.dp))

                StatusRow(brightness = brightness, zoom = zoom)
            }

            BottomToolbar(
                isFrozen = isFrozen,
                brightness = brightness,
                onBrightnessChange = { brightness = it },
                zoom = zoom,
                onZoomChange = { zoom = it },
                onCaptureClick = { isFrozen = !isFrozen },
                onAuxiliaryMenuClick = { showBottomSheet = true }
            )
        }

        IconButton(
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(12.dp),
            onClick = { showAiMenu = !showAiMenu }
        ) {
            Icon(imageVector = Icons.Default.AutoAwesome, contentDescription = "AI 菜单")
        }

        IconButton(
            modifier = Modifier
                .align(Alignment.TopStart)
                .padding(12.dp),
            onClick = { showSubscription = true }
        ) {
            Icon(imageVector = Icons.Default.Paid, contentDescription = "订阅")
        }

        IconButton(
            modifier = Modifier
                .align(Alignment.BottomEnd)
                .offset(x = (-12).dp, y = (-96).dp),
            onClick = { showBottomSheet = true }
        ) {
            Icon(imageVector = Icons.Default.MoreVert, contentDescription = "更多")
        }

        AnimatedVisibility(
            visible = showAiMenu,
            enter = fadeIn(),
            exit = fadeOut(),
            modifier = Modifier
                .align(Alignment.TopEnd)
                .padding(top = 64.dp, end = 16.dp)
        ) {
            AIMenu(onDismiss = { showAiMenu = false })
        }

        if (showSubscription) {
            SubscriptionDialog(onDismiss = { showSubscription = false })
        }

        if (showBottomSheet) {
            ModalBottomSheet(
                onDismissRequest = { showBottomSheet = false },
                sheetState = sheetState
            ) {
                BottomSheetMenu(onDismiss = {
                    coroutineScope.launch { sheetState.hide() }.invokeOnCompletion {
                        showBottomSheet = false
                    }
                })
            }
        }
    }
}

@Composable
fun StatusRow(brightness: Float, zoom: Float) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.7f)),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(horizontal = 16.dp, vertical = 12.dp),
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column {
                Text(text = "亮度", style = MaterialTheme.typography.labelMedium)
                Text(text = "${(brightness * 100).toInt()}%", fontWeight = FontWeight.Bold)
            }
            Column(horizontalAlignment = Alignment.End) {
                Text(text = "缩放", style = MaterialTheme.typography.labelMedium)
                Text(text = "${String.format("%.1f", zoom)}x", fontWeight = FontWeight.Bold)
            }
        }
    }
}

@OptIn(ExperimentalMaterial3Api::class)
@Composable
fun BottomToolbar(
    isFrozen: Boolean,
    brightness: Float,
    onBrightnessChange: (Float) -> Unit,
    zoom: Float,
    onZoomChange: (Float) -> Unit,
    onCaptureClick: () -> Unit,
    onAuxiliaryMenuClick: () -> Unit
) {
    Card(
        modifier = Modifier.fillMaxWidth(),
        colors = CardDefaults.cardColors(containerColor = MaterialTheme.colorScheme.surface),
        elevation = CardDefaults.cardElevation(defaultElevation = 8.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp), horizontalAlignment = Alignment.CenterHorizontally) {
            Row(
                modifier = Modifier.fillMaxWidth(),
                verticalAlignment = Alignment.CenterVertically,
                horizontalArrangement = Arrangement.SpaceBetween
            ) {
                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    IconButton(onClick = {
                        val next = (brightness + 0.2f).coerceAtMost(1.5f)
                        onBrightnessChange(next)
                    }) {
                        Icon(imageVector = Icons.Default.Brightness6, contentDescription = "调整亮度")
                    }
                    Text(text = "亮度", style = MaterialTheme.typography.labelSmall)
                }

                Button(
                    onClick = onCaptureClick,
                    shape = MaterialTheme.shapes.large
                ) {
                    Icon(
                        imageVector = if (isFrozen) Icons.Default.Close else Icons.Default.Camera,
                        contentDescription = "拍照或解冻",
                        modifier = Modifier.size(28.dp)
                    )
                    Text(
                        text = if (isFrozen) "解冻" else "冻结",
                        modifier = Modifier.padding(start = 8.dp)
                    )
                }

                Column(horizontalAlignment = Alignment.CenterHorizontally) {
                    IconButton(onClick = {
                        val next = (zoom + 0.2f).coerceAtMost(3f)
                        onZoomChange(next)
                    }) {
                        Icon(imageVector = Icons.Default.Cameraswitch, contentDescription = "调整缩放")
                    }
                    Text(text = "缩放", style = MaterialTheme.typography.labelSmall)
                }
            }

            Spacer(modifier = Modifier.height(12.dp))

            TextButton(onClick = onAuxiliaryMenuClick) {
                Icon(imageVector = Icons.Default.MoreVert, contentDescription = null)
                Text(text = "辅助菜单", modifier = Modifier.padding(start = 4.dp))
            }

            Spacer(modifier = Modifier.height(12.dp))

            Column(modifier = Modifier.fillMaxWidth()) {
                Text(text = "亮度调节", style = MaterialTheme.typography.labelSmall)
                Slider(
                    value = brightness,
                    valueRange = 0.3f..1.5f,
                    onValueChange = onBrightnessChange
                )
                Text(text = "缩放调节", style = MaterialTheme.typography.labelSmall)
                Slider(
                    value = zoom,
                    valueRange = 1f..3f,
                    onValueChange = onZoomChange
                )
            }
        }
    }
}

@Composable
fun AIMenu(onDismiss: () -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.95f)),
        elevation = CardDefaults.cardElevation(6.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = "AI 功能", style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(12.dp))
            listOf(
                "肤质检测" to "分析油脂/水分/瑕疵状况",
                "妆容顾问" to "推荐适配妆容方案",
                "虚拟试妆" to "预览柔焦腮红、口红等",
                "美妆日志" to "记录每日护肤心得"
            ).forEach { (title, description) ->
                Column(modifier = Modifier.padding(vertical = 6.dp)) {
                    Text(text = title, fontWeight = FontWeight.SemiBold)
                    Text(text = description, style = MaterialTheme.typography.bodySmall)
                }
            }
            Spacer(modifier = Modifier.height(12.dp))
            TextButton(onClick = onDismiss, modifier = Modifier.align(Alignment.End)) {
                Text(text = "关闭")
            }
        }
    }
}

@Composable
fun BottomSheetMenu(onDismiss: () -> Unit) {
    Column(
        modifier = Modifier
            .fillMaxWidth()
            .padding(horizontal = 24.dp, vertical = 16.dp)
    ) {
        Text(text = "辅助菜单", style = MaterialTheme.typography.titleMedium)
        Spacer(modifier = Modifier.height(12.dp))
        val options = listOf(
            "镜像翻转" to "开启左右翻转查看妆面细节",
            "屏幕补光" to "提升暗光环境亮度",
            "主题配色" to "切换柔粉/暮夜主题",
            "帮助与反馈" to "联系客服或提交建议"
        )
        options.forEach { (title, description) ->
            Column(modifier = Modifier.padding(vertical = 8.dp)) {
                Text(text = title, fontWeight = FontWeight.Medium)
                Text(text = description, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            }
        }
        Spacer(modifier = Modifier.height(12.dp))
        Button(onClick = onDismiss, modifier = Modifier.align(Alignment.End)) {
            Text(text = "完成")
        }
    }
}

@Composable
fun SubscriptionDialog(onDismiss: () -> Unit) {
    AlertDialog(
        onDismissRequest = onDismiss,
        confirmButton = {
            Button(onClick = onDismiss) {
                Text(text = "稍后再说")
            }
        },
        title = { Text(text = "升级高级会员") },
        icon = { Icon(imageVector = Icons.Default.Paid, contentDescription = null) },
        text = {
            Column {
                Text(text = "高级会员解锁 AI 肤质检测、妆容顾问与去广告体验。")
                Spacer(modifier = Modifier.height(12.dp))
                Text(text = "$4.99/月 或 $39.99/年", fontWeight = FontWeight.Bold)
            }
        }
    )
}

@Composable
fun ReportScreen() {
    val trends = remember {
        listOf(
            TrendItem("本周油脂平衡", 82, "保持控油与补水平衡"),
            TrendItem("毛孔细腻度", 76, "毛孔细腻，继续每日清洁"),
            TrendItem("肤色均匀度", 88, "维持高防晒系数"),
            TrendItem("水分保持", 73, "补水面膜每周 2 次")
        )
    }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFFF7FB))
            .padding(20.dp)
    ) {
        item {
            Text(text = "肤质趋势", style = MaterialTheme.typography.titleLarge)
            Text(
                text = "静态演示：可视化周/月趋势图占位",
                style = MaterialTheme.typography.bodySmall,
                color = Color.Gray
            )
            Spacer(modifier = Modifier.height(24.dp))
        }
        items(trends) { trend ->
            TrendCard(trend)
            Spacer(modifier = Modifier.height(16.dp))
        }
    }
}

data class TrendItem(val title: String, val score: Int, val recommendation: String)

@Composable
fun TrendCard(trendItem: TrendItem) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.9f)),
        elevation = CardDefaults.cardElevation(defaultElevation = 4.dp)
    ) {
        Column(modifier = Modifier.padding(16.dp)) {
            Text(text = trendItem.title, style = MaterialTheme.typography.titleMedium)
            Spacer(modifier = Modifier.height(8.dp))
            Text(text = "AI 评分：${trendItem.score}", fontWeight = FontWeight.Bold)
            Spacer(modifier = Modifier.height(4.dp))
            Text(text = trendItem.recommendation, style = MaterialTheme.typography.bodySmall)
        }
    }
}

@Composable
fun SettingsScreen() {
    var darkTheme by remember { mutableStateOf(false) }
    var notificationsEnabled by remember { mutableStateOf(true) }

    LazyColumn(
        modifier = Modifier
            .fillMaxSize()
            .background(Color(0xFFFFF7FB))
            .padding(20.dp)
    ) {
        item {
            Text(text = "偏好设置", style = MaterialTheme.typography.titleLarge)
            Spacer(modifier = Modifier.height(20.dp))
        }
        item {
            SettingToggle(
                title = "暗色主题",
                description = "切换柔粉/暮夜配色",
                checked = darkTheme,
                onToggle = { darkTheme = it }
            )
        }
        item {
            Spacer(modifier = Modifier.height(12.dp))
            SettingToggle(
                title = "通知提醒",
                description = "获取订阅与肤质提醒",
                checked = notificationsEnabled,
                onToggle = { notificationsEnabled = it }
            )
        }
        item {
            Spacer(modifier = Modifier.height(12.dp))
            Card {
                Column(modifier = Modifier.padding(16.dp)) {
                    Text(text = "隐私与数据")
                    Text(
                        text = "导出或删除历史肤质记录",
                        style = MaterialTheme.typography.bodySmall,
                        color = Color.Gray
                    )
                    Spacer(modifier = Modifier.height(12.dp))
                    Button(onClick = { /* no-op demo */ }) {
                        Text(text = "管理数据")
                    }
                }
            }
        }
        item {
            Spacer(modifier = Modifier.height(24.dp))
            Text(text = "应用版本 1.0.0", style = MaterialTheme.typography.bodySmall, color = Color.Gray)
        }
    }
}

@Composable
fun SettingToggle(title: String, description: String, checked: Boolean, onToggle: (Boolean) -> Unit) {
    Card(
        colors = CardDefaults.cardColors(containerColor = Color.White.copy(alpha = 0.9f)),
        elevation = CardDefaults.cardElevation(defaultElevation = 2.dp)
    ) {
        Row(
            modifier = Modifier
                .fillMaxWidth()
                .padding(16.dp),
            verticalAlignment = Alignment.CenterVertically,
            horizontalArrangement = Arrangement.SpaceBetween
        ) {
            Column(modifier = Modifier.weight(1f)) {
                Text(text = title, fontWeight = FontWeight.SemiBold)
                Text(text = description, style = MaterialTheme.typography.bodySmall, color = Color.Gray)
            }
            androidx.compose.material3.Switch(checked = checked, onCheckedChange = onToggle)
        }
    }
}

@Composable
fun MakeupMirrorTheme(content: @Composable () -> Unit) {
    val colorScheme = lightColorScheme(
        primary = Color(0xFFFECDD3),
        onPrimary = Color(0xFF511F2D),
        secondary = Color(0xFFF9A8D4),
        onSecondary = Color(0xFF4A1D2B),
        background = Color(0xFFFFF7FB),
        onBackground = Color(0xFF511F2D),
        surface = Color(0xFFFFF7FB),
        onSurface = Color(0xFF511F2D)
    )

    MaterialTheme(
        colorScheme = colorScheme,
        typography = MaterialTheme.typography.copy(
            titleLarge = MaterialTheme.typography.titleLarge.copy(fontFamily = FontFamily.SansSerif),
            titleMedium = MaterialTheme.typography.titleMedium.copy(fontFamily = FontFamily.SansSerif),
            bodyMedium = MaterialTheme.typography.bodyMedium.copy(fontFamily = FontFamily.SansSerif)
        ),
        shapes = MaterialTheme.shapes,
        content = content
    )
}

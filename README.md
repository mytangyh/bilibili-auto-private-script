# bilibili-auto-private-script



### **脚本名称**  
Bilibili稿件自动设置仅自己可见  
[点击安装](https://github.com/mytangyh/bilibili-auto-private-script/raw/main/slowscript.user.js) 

### **脚本简介**  
本脚本用于自动将 Bilibili 稿件管理中心中的所有稿件设置为“仅自己可见”。它通过模拟用户操作，简化了手动点击设置的流程，大幅提升操作效率。脚本支持以下功能：  
- 自动检测稿件是否已设置为“仅自己可见”，并跳过已设置的稿件。  
- 支持自动翻页处理，确保所有页面的稿件均可完成设置。  
- 提供手动控制开关按钮，可随时开始或停止脚本的执行。  
- 并发处理稿件操作，加快执行速度。  

### **脚本功能说明**  
1. **操作范围说明**  
   - 脚本仅在以下 URL 范围内运行：  
     ```
     https://member.bilibili.com/platform/upload-manager/article*
     https://member.bilibili.com/platform/upload/video/frame*
     ```
   - 脚本不会对其他页面执行任何操作。

2. **脚本的具体行为**  
   - 在用户点击按钮后，脚本会自动遍历当前页面的稿件列表。
   - 对于未设置为“仅自己可见”的稿件，脚本会模拟点击操作，将其状态改为“仅自己可见”。
   - 已设置为“仅自己可见”的稿件将被跳过，无需重复操作。
   - 如果当前页面操作完成，脚本会自动翻页继续操作，直到所有页面的稿件处理完毕或用户手动停止脚本。

3. **用户交互**  
   - 页面右上角提供一个控制按钮，用户可以通过点击按钮开始或停止脚本。
   - 按钮状态会根据脚本执行状态自动变更（开始执行/停止执行）。

### **代码说明**  
- **无混淆或最小化**：脚本代码清晰易读，变量命名规范，方便用户在安装前进行审查。
- **非侵入性设计**：脚本仅对用户明确授权的页面生效，不会修改非目标页面的内容或功能。
- **性能优化**：脚本采用并发执行和最小化等待时间的方式，保证执行效率的同时降低对页面性能的影响。

### **版权与引用**  
- 本脚本为原创开发，所有代码均符合版权规范。
- 若脚本使用第三方库或工具，会在代码中提供来源和版本信息。
- 脚本通过 `@license` 标签声明授权协议。

### **使用限制**  
1. **安全性与隐私**  
   - 脚本不会收集用户的任何数据，不含追踪、广告或挖矿等功能。  
   - 不会实现超出功能描述范围的任何行为。

2. **兼容性**  
   - 建议在 Tampermonkey 环境下运行脚本，其他用户脚本管理器可能存在兼容性问题。

3. **限制操作频率**  
   - 脚本不会频繁请求服务器，仅在必要时执行操作，符合 Greasy Fork 的更新检测频率限制。

### **特别声明**  
- **不支持重复功能的脚本**：本脚本为原创开发，功能与现有脚本有显著差异，未重复提交已有功能。
- **无不相关关键字**：脚本描述与关键字准确对应，未包含不相关的内容以优化搜索排名。


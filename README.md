

#### 设计概要

##### 1.功能模块

主页展示、视频播放、注册登录、个人信息管理、视频上传管理、评论互动（新加了其他功能，懒得说明了）

##### 2.特色

SPA



#### 日志

3.25
> 数据库的基本设计

3.26
> 首页的简单视频展示与点击进入详情页播放的功能；  
> 解决了由AngularJS表达式引起的简单视频播放问题；  
> 构建了简单的登录页面以及相关简单路由

3.27
> 摸了  
> 构想：使用ng-if实现页面对于登录前后不同的展示  
> 注册页面走常规流程  
> 登录功能仍有待考虑  

4.6
> 更新了视频上传功能  
> 已知BUG：上传返回主页，仍然在进行数据请求  

2019.5.4
> 重写了上传功能。采用ng-file-upload库重写了上传功能，不会再出现此前上传后的无限等待问题，现在上传完成后，返回首页可以直接看到更新后的视频。  
> 后续会更新新的通知形式，可能不再采用alert弹窗。  

2019.5.5
> 添加了视频上传后的缓存清理；  
> 使用sweetalert作为新的弹窗提醒；  
> 添加了视频上传模块的表单验证  
> 预期：注册以及登录页面的表单验证、视频删除功能  

2019.5.8
> 重构了注册和登录的代码，将一部分验证转移到了后端进行  
> 更大范围内使用了sweetalert  

2019.5.10
> 新增了关注功能（可取消关注）；  
> 新增了视频删除功能；  
> 开始编写动态功能；  
> 修正了时间bug，使用toLocaleString()方法；  

#### How to use
1. 确保正确安装Node.js、MongoDB，并运行其对应服务  
2. 工程所需的js库已经包含在public文件夹下，无须再次引用  
3. 将工程clone到本地目录  
4. 在目录下执行`npm install`命令（国内推荐使用cnpm），安装完所有需要的组件之后，执行`npm start`命令执行工程
5. 打开浏览器，输入`localhost:3000`即可进入网站
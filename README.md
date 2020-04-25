#   **TodoList**

### *前端练手项目之一 —— 原生 javascript 实现 TodoList*

---

##  **技术栈**

-   HTML

-   CSS

-   javascript

-   python3

-   jinja2

-   JSON

-   webserver

***

##  **GUI 设计**

界面截图
![index](https://github.com/realRichard/TodoList/blob/master/pictures/1.png "index")

细节截图
![detail](https://github.com/realRichard/TodoList/blob/master/pictures/2.png "detail")

---

##  **功能说明**

-   输入待办事项, 点击添加按钮添加 task 

-   checkbox 打钩, 改变 task 完成状态 

-   删除 task

-   展示以及修改 task 详情, 整个 Todo App 阴影, 单独操作某一确定 task, 进行 task 细节描述

---

##  **前后端实现及数据处理**

-   用户对 todo 的所有增删改查操作都是使用的 ajax, 避免了每次操作后刷新界面长时间的等待, 体验好, 更像是 SPA

-   前后端没有使用任何第三方框架和库, 后端是自己用 socket 写的一个 mvc micro webserver

-   数据是 JSON 格式, 保存在文件, 对于小应用来说很方便， 有缩进, 格式也挺好看的

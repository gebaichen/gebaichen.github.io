---
date: 2023.8.22
title: Flask蓝图
tags:
  - flask
  - web
  - python
description: flask，可以使用蓝图进行模块化分，
link: /flask/flask-blueprint.html
---

# Flask蓝图

## 蓝图

在一个Flask 应用项目中，如果业务视图过多，可否将以某种方式划分出的业务单元单独维护，将每个单元用到的视图、静态文件、模板文件等独立分开？

例如从业务角度上，可将整个应用划分为用户模块单元、商品模块单元、订单模块单元，如何分别开发这些不同单元，并最终整合到一个项目应用中？

在Flask中，使用蓝图`Blueprint`来分模块组织管理。

蓝图实际可以理解为是一个存储一组视图方法的容器对象，其具有如下特点：

- 一个应用可以具有多个`Blueprint`
- 可以将一个`Blueprint`注册到任何一个未使用的URL下比如 `“/user”`、`“/student”`
- Blueprint可以单独具有自己的模板、静态文件或者其它的通用操作方法，它并不是必须要实现应用的视图和函数的
- 在一个应用初始化时，就应该要注册需要使用的Blueprint
- 蓝图可以自己注册独立的插件，应用，使用自己的ORM

但是一个`Blueprint`并不是一个完整的应用，它不能独立于应用运行，而必须要注册到某一个应用中。

正是因为蓝图出现，flask也能在一个项目中像Django那样注册好几个app

## 介绍

### 优点

1.方便管理，尤其是在做大型项目代码很多不能只丢在`app.py`里面

2.做成包结构更加让人好管理，好书写，出现问题好排查，
不用担心文件大而打不开的情况（把所有的代码都丢入`app.py`
只会导致文件越来愈大不好管理）

3.自定义自己的视图，模板，插件命令....
自由性，很强，更好的与外界隔离，不用担心问题

4.蓝图像一个小app，比如django那样一个项目好几个app,很好管理，
为了解决此问题flask出了蓝图管理模块

### 缺点

1.不能单独运行，不能有自己独立的session,和cookie等储存数据

2.但一旦蓝图多起来就难管理，这样就需要多层蓝图嵌套（一个蓝图里有好几个蓝图）
这样更加好管理

3.但多层蓝图嵌套不适用于大中型项目（曲奇论坛，曲奇文档、知乎、豆瓣、猫眼）
大型项目则适合（华为，阿里，腾讯，谷歌，feedback）多层蓝图嵌套
但是这些项目未必是用python开发的


## 使用方式

使用蓝图可以分为三个步骤

1. 创建一个蓝图对象

   ```python
   # 定义一个变量，第一个参数传蓝图的名字，第二个是固定的传__name__
   passport_bp = Blueprint('passport', __name__)
   
   ```

2. 在这个蓝图对象上进行操作,注册路由,指定静态文件夹,注册模版过滤器

   ```python
   # 与app.route功能是一样的
   @passport_bp.route('/login')
   def login():
       return 'login success'
   
   ```

3. 在应用对象上注册这个蓝图对象

   ```python
   # 用app对象注册
   app.register_blueprint(passport_bp)
   
   ```

## 单文件蓝图

可以将创建蓝图对象与定义视图放到一个文件中 。

**目录（包）蓝图**

对于一个打算包含多个文件的蓝图，通常将创建蓝图对象放到Python包的`__init__.py`文件中

```shell
--- project # 工程目录
  |------ __init__.py # 启动文件
  |------ passport  #用户蓝图
  |  |--- __init__.py  # 此处创建蓝图对象
  |  |--- passport.py  
  |  |--- profile.py
  |  |--- ...
  |
  |------ students # 学生信息蓝图
  |  |--- __init__.py
  |  |--- ...
  |...
--- ...其他配置文件
```

用这种方式可以更好的管理项目不用所有的文件都放在`app.py`里面了

## 扩展用法

### 1 指定蓝图的url前缀

在应用中注册蓝图时使用`url_prefix`参数指定

注：不建议这么用，如果想达到这样的效果，可以在`xxx_bp.route('/xxx/yyy')`这样实现

```python
dashboard_bp = Blueprint('dashboard', __name__)


@dashboard_bp.route('/user')
def user_profile():
    return '用户后台页面'


# 给路由添加前缀
app.register_blueprint(dashboard_bp, url_prefix='/dashboard')

```

### 2 蓝图内部静态文件

和应用对象不同，蓝图对象创建时不会默认注册静态目录的路由。需要我们在创建时指定 static_folder 参数。

下面的示例将蓝图所在目录下的static_dashboard目录设置为静态目录

```python
dashboard_bp = Blueprint("dashboard", __name__, static_folder='static_dashboard')
app.register_blueprint(dashboard_bp, url_prefix='/dashboard')

```

现在就可以使用`/dashboard/static_dashboard/`访问`static_dashboard`目录下的静态文件了。

也可通过`static_url_path`改变访问路径

这就可以看出蓝图也可以作为一个小型的flask app来使用

```python
dashboard = Blueprint("dashboard",__name__,static_folder='static_dashboard',static_url_path='/lib')
app.register_blueprint(dashboard,url_prefix='/dashboard')

```

### 3 蓝图内部模板目录

蓝图对象默认的模板目录为系统的模版目录，可以在创建蓝图对象时使用 template_folder 关键字参数设置模板目录

```python
dashboard_bp = Blueprint('dashboard', __name__, template_folder='my_templates')

```

URL是指向⽹络上资源的地址。在Flask中，我们需要让请求的URL匹配对应的视图函数，视图函数返回值就是URL对应的资源。

### 路由匹配

为了便于将请求分发到对应的视图函数，程序实例中存储了一个路由表（app.url_map），其中定义了URL规则和视图函数的映射关系。当请求发来后，Flask会根据请求报文中的URL（path部分）来尝试与这个表中的
所有URL规则进行匹配，调用匹配成功的视图函数。如果没有找到匹配的 URL规则，Flask会自动返回 404错误响应（Not Found，表示资源未找到）。

使用flask routes命令可以查看程序中定义的所有路由，这 个列表由app.url_map解析得到：

```shell-vue
(venv)  C:\Users\dashboard\istrator\Desktop\helloflask>flask routes
Endpoint  Methods  Rule
--------  -------  -----------------------
index     GET      /
static    GET      /static/<path:filename>

```

在输出的文本中，我们可以看到每个路由对应的端点（Endpoint）、 HTTP方法（Methods）和URL规则（Rule），其中static端点是Flask添加的
特殊路由，用来访问静态文件。

## 静态文件配置

一个完整的⽹站当然不能只返回用户一句“Hello，Flask！”，我们需要模板（template）和静态文件（static file）来生成更加丰富的⽹页。

**模板** 即包含程序页面的HTML文件，**静态文件** 则是需要在HTML文件中加载的 CSS 和 JavaScript 文件，以及图⽚、字体文件等资源文件。

默认情况下，模板文件存放在项目根目录中的 templates 文件夹中，静态文件存放在 static 文
件夹下，这两个文件夹需要和包含程序实例的模块处于同一个目录下，对应的项目结构示例如下所示：

```
flask-project/
	- templates/ 
	- static/ 
	- app.py

```

## 初始化参数

Flask 程序实例在创建的时候，需要默认传入当前 Flask 程序所指定的包(模块)，接下来就来详细查看一下 Flask
应用程序在创建的时候一些需要我们关注的参数：

- import_name
    - Flask程序所在的包(模块)，传 `__name__` 就可以
    - 其可以决定 Flask 在访问静态文件时查找的路径
- static_folder
    - 静态文件存储的文件夹，可以不传，默认为 `static`
- template_folder
    - 模板文件存储的文件夹，可以不传，默认为 `templates`

```python
# 初始化 Flask 应用程序，并指定当前程序所处于的包名
from flask import current_app, Flask, render_template

app = Flask(__name__,
            static_folder='static',  # 静态文件所在的文件夹名，默认为 static
            template_folder='templates',  # 模板文件所在的文件夹名，默认为 templates
		)

```

## 程序配置加载

在 Flask 程序运行的时候，可以给 Flask 设置相关配置，比如：配置数据库连接地址等等，设置 Flask 配置有以下四种方式：

-
    1. 从配置对象中加载(常用)

app.config.form_object()

-
    2. 从配置文件中加载

app.config.form_pyfile()

-
    3. 从环境变量中加载(了解)

app.config.from_envvar()

下面演示如何从对象中加载配置文件

```
class TestConfig:
    SECRET_KEY = "测试秘钥"
    

# app.secret_key = '使用app对象进行配置秘钥'
# app.config['SECRET_KEY'] = '使用配置文件进行配置秘钥'
# app.config.from_object(TestConfig)
app.config.from_pyfile('config.py')

```

## Flask与MVC架构

MVC架构最初是用来设计桌面程序的，后来也被用于Web程序，应用 了这种架构的 Web 框架有 Django、Ruby on Rails等。

在 MVC 架构中，程序被分为三个组件：数据处理（Model）、用户界面（View）、交互逻辑 （Controller）。
严格来说，Flask并不是MVC架构的框架，因为它没有内置数据模型⽀持。为了方便表述，在本教程中，使用了
app.route（）装饰器的函数仍被称为视图函数，同时会使用“<函数名>视图”（比如index视图）的形式来代指某个视图函数。

如果想要使用 Flask 来编写一个MVC架构的程序，那么视图函数可以作为控制器（Controller），视图（View）则是将要学习的使用 Jinja2
渲染的 HTML 模板，而模型（Model）可以使用其他库来实现，用 SQLAlchemy 来创建数据库模型。

## 自定义Flask命令

可以参考[Flask命令行使用](/flask/flask.cli.commmad.html)

## 总结

蓝图简直太好用了，相当于一个小app

注册时方便，易使用，可定义自己的模板、插件、视图等

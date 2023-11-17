---
date: 2023.8.24
title: Flask Web大型项目创建结构
tags:
  - python
  - web
  - flask
description: 介绍了，如何Flask web大型项目创建结构
---

# {{ $frontmatter.title }}

## 前端

前端可以尝试用原生的，或者是MVVM框架的

- 原生``layui``,``bootstrap``,``jquery``

- MVVM框架的``vue``,``vite``,``pinia``,``vue-router``,``elements-plus``、``vitepress``,``vuepress``

## 后端

```shell
--- flaskproject # 工程目录
  |------ app # app包
  |   |------views
  |   |   |------ __init__.py # 启动文件
  |   |   |------ passport  # 蓝图
  |   |   |  |--- __init__.py  # 此处创建蓝图对象
  |   |   |  |--- passport.py  
  |   |   |  |--- profile.py
  |   |   |  |--- ...
  |   |   |
  |   |   |------ students # 学生信息蓝图
  |   |   |  |--- __init__.py
  |   |   |  |--- ...
  |   |------ models 
  |   |   |------ __init__.py # 启动文件
  |   |   |------ ...
  |   |------ extensions
  |   |   |------ __init__.py # 启动文件
  |   |------ common
  |   |   |------ utils
  |   |   |   |------ set_logs.py # log
  |   |------ api
  |   |   |------ v1
  |   |   |   |------ __init__.py
  |   |   |   |   |------ passport
  |   |   |   |   |   |------ apis.py
  |   |   |   |   |   |------ __init__.py
  |   |   |------ __init__.py # 启动文件
  |------ logs # log文件
  |   |------ log.log # log文件
  |   |------ .gitkeep # git 站位文件
  |------ static # 静态文件
  |------ templates # 模板文件
  |------ .env # 秘钥
  |------ .flaskenv # flask运行配置
  |------ .gitignore # git不提交内容列表
  |------ flask_config.py # flask配置内容
  |------ command.py # flask 自定义命令
```

### 使用 GIT 管理源代码

初始化 git

```
$ cd [项目目录]
$ git init
```

配置当前项目git提交信息(可省略此步，如不配置则使用全局配置)

```bash
git config user.name XXX
git config user.email XXX@xxx.com
```

添加忽略文件

```bash
$ touch .gitignore
```

设置忽略文件内容(后续根据需要再添加)

```bash
.idea
*.py[cod]
*.log
```

添加所有文件到暂存区

```bash
$ git add .
```

提交到本地仓库并填写注释

```bash
$ git commit -m 'init'
```

让 Pycharm 管理当前项目的 git

### 创建虚拟环境

> 建议使用[poetry](https://python-poetry.org/)

### 项目基本配置

#### 使用类组织配置文件

在实际需求中，往往需要不同的配置组合。

例如，开发用的配置，测试用的配置，生产环境用的配置。为了能方便地在这些配置中切换，可以把配置文件升级为包，然后为这些使用场景分别创建不同的配置文件，但是最方便的做法是在单个配置文件中使用
Python 类来组织多个不同类别的配置。

现在它包含一个基本配置类（BaseConfig），还有其他特定的配置类，即测试配置类（TestingConfig）、开发配置类（DevelopmentConfig）和生产配置类（ProductionConfig），这些特定配置类都继承自基本配置类。

> configs.py：使用 Python 类组织配置

```python
# filename:flask_configs.py
import datetime
import logging
import os

from dotenv import load_dotenv

from quqi.extensions import redis_store

basedir = os.path.abspath(os.path.dirname(__name__))

dot_env_path = os.path.join(basedir, ".env")
flask_env_path = os.path.join(basedir, ".flaskenv")

if os.path.exists(dot_env_path):
    load_dotenv(dot_env_path)

if os.path.exists(flask_env_path):
    load_dotenv(flask_env_path)
root_path = os.path.abspath(os.path.dirname(__file__))


class BaseConfig:
    SECRET_KEY = os.getenv("SECRET_KEY", "dev key")
    # mysql 数据库的配置信息
    mysql_host = os.getenv("mysql-host", "127.0.0.1")
    mysql_password = os.getenv("mysql-password", "123456")
    mysql_port = os.getenv("mysql-port", 3306)
    mysql_user = os.getenv("mysql-user", "root")
    SQLALCHEMY_DATABASE_URI = (
        f"mysql+pymysql://{mysql_user}:{mysql_password}@{mysql_host}:{mysql_port}/数据库名字"
    )
    # redis配置
    redis_host = os.getenv("redis-host", "127.0.0.1")
    redis_port = os.getenv("redis-port", 6379)
    # redis密码如果有就配置
    redis_password = os.getenv("redis-password", None)
    REDIS_HOST = redis_host
    REDIS_PORT = redis_port
    REDIS_PASSWORD = redis_password
    # 配置logging级别
    LOG_LEVEL = logging.DEBUG
    # 配置邮箱
    # Session保存配置
    SESSION_TYPE = "redis"
    # 开启session签名
    SESSION_USE_SIGNER = True
    # 指定 Session 保存的 redis
    SESSION_REDIS = redis_store.strict_redis
    # 设置需要过期
    SESSION_PERMANENT = False
    # 设置过期时间
    PERMANENT_SESSION_LIFETIME = datetime.timedelta(days=10)
    
    # 配置jsonify返回json的编码支持中文
    JSON_AS_ASCII = False

# 里面的配置需要根据开发需要进行使用
class DevelopmentConfig(BaseConfig):
    """开发配置"""
   pass


class TestingConfig(BaseConfig):
    """测试配置"""
    SQLALCHEMY_DATABASE_URI = "sqlite:///:memory:"  # 内存数据库


class ProductionConfig(BaseConfig):
    """生成环境配置"""
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    LOG_LEVEL = logging.ERROR


config = {
    "development": DevelopmentConfig,
    "testing": TestingConfig,
    "production": ProductionConfig,
}

```

在环境的配置中，为不同的使用场景设置了不同的数据库 URL，避免互相干扰。

#### 从命令行启动项目

**注意**：使用 `.flaskenv` 需要先安装 `python-dotenv`

```
pip install python-dotenv
```

相关命令参考：https://flask.palletsprojects.com/en/1.1.x/cli/

使用 `python-dotenv` 管理环境变量

> 从 `.env` 读取键值对，并将其添加到环境变量。

这个值可以在 `.flaskenv` 文件中设置，如果没有获取到，则使用默认值 `development`，对应的配置类即` DevelopmentConfig`。

在项目根目录下分别创建两个文件：

- `.env` 存储敏感信息的环境变量，比如用来配置Email服务器的账户名与密码
- `.flaskenv`存储公开环境变量，比如 FLASK_APP。

`.flaskenv` 文件

```
FLASK_APP=app.py
FLASK_ENV=development
FLASK_RUN_HOST='127.0.0.1'
FLASK_DEBUG=True
FLASK_RUN_PORT=5050
```

FLASK_APP：项目启动的app对象所在的文件（可以是模块、包）

FLASK_ENV：项目运行的环境，开发者（development）环境会启动调试模式（Debug）

FLASK_DEBUG=True:相当于FLASK_ENV=development

FLASK_RUN_HOST：项目运行的ip地址

FLASK_RUN_PORT：项目运行的端口

#### 启动程序

当使用 flask run 命令启动程序时，Flask 的自动发现程序实例机制还包含另一种行为：Flask 会自动从环境变量 FLASK_APP
的值定义的模块中寻找名为 create_app() 或 make_app() 的工厂函数，自动调用工厂函数创建程序实例并运行。因为我们已经在.
flaskenv 文件中将 FLASK_APP 设为 blog，所以不需要更改任何设置，继续使用 flask run 命令即可运行程序：

```
$ flask run
```

如果你想设置特定的配置名称，最简单的方式是通过环境变量 FLASK_CONFIG 设置。另外，你也可以使用 FLASK_APP 显式地指定工厂函数并传入参数：

```
FLASK_APP="app:create_app('development')"
```

app：包名

create_app：方法名

### 工厂函数创建程序实例

在 OOP（Object-Oriented Programming，面向对象编程）中，工厂（factory）是指创建其他对象的对象，通常是一个返回其他类的对象的函数或方法。在
playblog 程序的新版本中，程序实例在工厂函数中创建，这个函数返回程序实例 app。按照惯例，这个函数被命名为 create_app() 或
make_app()。我们把这个工厂函数称为程序工厂（Application Factory）——即 “生产程序的工厂”，使用它可以在任何地方创建程序实例。

工厂函数使得测试和部署更加方便。不必将加载的配置写死在某处，而是直接在不同的地方按照需要的配置创建程序实例。通过⽀持创建多个程序实例，工厂函数提供了很大的灵活性。

#### 1. 新建项目包

整个项目的内容会比较多，最好是把项目的内容单独放在一个包里面单独处理。

```python
# filename: app/__init__.py
import os

from flask import Flask

from config import config
from extensions import db
from utils import setup_log
from app.extensions import register_extensions

def create_app(config_name=None):
    app = Flask('项目名字')

    if not config_name:
        # 没有没有传入配置文件，则从本地文件读取
        config_name = os.getenv('FLASK_CONFIG', 'development')
    setup_log(config_name)
    app.config.from_object(config[config_name])

    # 注册插件
    register_extensions(app)

    return app


```

除了扩展初始化操作，还有很多处理函数要注册到程序上，比如错误处理函数、上下文处理函数等。虽然蓝图也可以注册全局的处理函数，但是为了便于管理，除了蓝图特定的处理函数，这些处理函数一般都放到工厂函数中注册。

为了避免把工厂函数弄得太长太复杂，我们可以根据类别把这些代码分离成多个函数，这些函数接收程序实例 app
作为参数，分别用来为程序实例初始化扩展、注册蓝图、注册错误处理函数、注册上下文处理函数等一系列操作

工厂函数接收配置名作为参数，返回创建好的程序实例。如果没有传入配置名，我们会从 FLASK_ENV 环境变量获取，如果没有获取到则使用默认值
development。

#### 2. 通用组件文件夹

在项目中我们会自己写一个通用的方法、类、常量之类的通用内容。当项目变得越来越大时，通用的内容就会越来越多，这些内容可以放在同一个文件下方便管理。

在项目的根目录下创建一个 `common` 文件夹，在里面新建一个包`utils` 然后把 `set_logs.py` 拖过去。

#### 初始化扩展

在后面我们会用到数据库之类的第三方拓展，为了方便管理这些拓展，可以将所有的第三方库放在一个文件里面进行导入创建。

为了方便管理所有的第三方库，我们可以所有的库放在 `extensions.py` 文件中实例化一个数据库对象 db

使用数据库的时候，需要安装flask-sqlalchemy拓展数据库的安装，

```
pip install  flask-sqlalchemy
```

```python
# filename: app/extensions/__init__.py
from .init_db import init_db

def register_extensions(app):
    init_db(app)
```

```python
# filename: app/extensions/init_db.py
from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

def init_db(app):
    db.init_app(app)
```

大部分扩展都提供了一个 init_app() 方法来⽀持分离扩展的实例化和初始化操作。

现在我们仍然像往常一样初始化扩展类，但是并不传入程序实例。这时扩展类实例化的工作可以集中放到 extensions.py 脚本中

```python
# filename: app/__init__.py

from app.extensions import register_extensions

def create_app(config_name=None):

    ...
    
    # 注册蓝图
    register_extensions(app)

    return app


```

由于后面我们还会绑定更多的拓展库，到时候可以使用同样的方法进行注册

### 使用蓝图模块化程序

当某一个模块包含太多代码时，常见的做法是将单一模块升级为包， 然后把原模块的内容分离成多个模块。

接来下来我们学习使用蓝图进行模块划分，在进行模块划分之前，我们先来了解一下蓝图的使用

Flask 提供的 Blueprint 类就创建一个蓝图实例。像程序实例一
样，我们可以为蓝图实例注册路由、错误处理函数、上下文处理函数，请求处理函数，甚至是单独的静态文件文件夹和模板文件夹。在使用上，它和程序实例也很相似。比如，蓝图实例同样拥有一个
route() 装饰器，可以用来注册路由，但实际上蓝图对象和程序对象却有一些不一样。

在实例化 Blueprint 类时，除了传入构造函数的第一个参数是蓝图名称之外，创建蓝图实例和使用 Flask
对象创建程序实例的代码基本相同。例如，下面的代码创建了一个 auth 蓝图：

```
from flask import Blueprint

auth_bp = Blueprint('auth', __name__)
```

使用蓝图不仅仅是对视图函数分类，而是将程序某一部分的所有操作组织在一起。这个蓝图实例以及一系列注册在蓝图实例上的操作的集合被称为一个蓝图。只有当你把它注册到程序上时，它才会把物体相应的部分印刻出来 ——
把蓝图中的操作附加到程序上。

使用蓝图可以将程序模块化（modular）。一个程序可以注册多个蓝图，我们可以把程序按照功能分离成不同的组件，然后使用蓝图来组织这些组件。蓝图不仅仅是在代码层面上的组织程序，还可以在程序层面上定义属性，具体的形式即为蓝图下的所有路由设置不同的
URL 前缀或子域名。

#### 1. 创建蓝图

在views包里面管理蓝图

```python
# filename: app/views/__init__.py
from .passport import register_passport_bp

def register_blueprint(app):
    register_passport_bp(app)
```

蓝图一般在⼦包中创建，比如创建一个 blog ⼦包，然后在构造文件中创建蓝图实例，使用包管理蓝图允许你设置蓝图独有的静态文件和模板，
并在蓝图内对各类函数分模块存储。

蓝图实例 passport_bp 在 `__init__.py` 脚本顶端创建实例对象

```python
# filename: app/views/passport/__init__.py
from flask import Blueprint,Flask

passport_bp = Blueprint('passport', __name__)

# 最后导入视图内容
from . import views

def register_passport_bp(app: Flask):
    app.register_blueprint(passport_bp)
```

在上面的代码中，从 Flask 导入 Blueprint
类，实例化这个类就获得了蓝图对象。构造方法中的第一个参数是蓝图的名称；第二个参数是包或模块的名称，可以使用 `__name__`
变量。Blueprint 类的构造函数还接收其他参数来定义蓝图。

然后单独创建一个文件写视图函数代码

```python
# filename: app/views/passport/view.py

from . import passport_bp


@passport_bp.route('/')
def index():
    return 'hello flask !'

```

视图函数与蓝图对象分开写的原因是一个项目中可能会存在很多的视图，如果写在一个文件里面，到后期维护会变得非常麻烦。最后还要在 `__init__.py`
文件中导入一下视图文件，将创建的视图方法挂载到蓝图对象上面。

#### 2. 注册蓝图

我们在本章开始曾把蓝图比喻成模⼦，为了让这些模⼦发挥作用，我们需要把蓝图注册到程序实例上：

蓝图使用 Flask.register_blueprint() 方法注册，必须传入的参数是我们在上面创建的蓝图对象。其他的参数可以用来控制蓝图的行为。比如，我们使用
url_prefix 参数为 auth 蓝图下的所有视图 URL 附加一个 URL 前缀；

```python
from app.views import register_blueprint

register_blueprint(app)

```

最终代码：

```python
# filename: app/__init__.py

from app.views import register_blueprint

def create_app(config_name=None):

    ...
    
    # 注册蓝图
    register_blueprint(app)

    return app


```

### 集成日志

在 `config.py` 文件中在不同的环境的配置下添加日志级别

```python
class Config(object):
    ...

    # 默认日志等级
    LOG_LEVEL = logging.DEBUG


class ProductionConfig(Config):
    """生产模式下的配置"""
    LOG_LEVEL = logging.ERROR
```

在项目录下的 `set_logs.py` 文件中添加日志配置的相关方法。

在整个项目中后面还会有大量工具函数或者工具类，可以专门用一个文件放在一起管理。

```python
def setup_log(config_name):
    """配置日志"""

    # 设置日志的记录等级
    logging.basicConfig(level=config[config_name].LOG_LEVEL)  # 调试debug级
    # 创建日志记录器，指明日志保存的路径、每个日志文件的最大大小、保存的日志文件个数上限
    file_log_handler = RotatingFileHandler("logs/log.log", maxBytes=1024 * 1024 * 100, backupCount=10)
    # 创建日志记录的格式 日志等级 输入日志信息的文件名 行数 日志信息
    formatter = logging.Formatter('%(levelname)s %(filename)s:%(lineno)d %(message)s')
    # 为刚创建的日志记录器设置日志记录格式
    file_log_handler.setFormatter(formatter)
    # 为全局的日志工具对象（flask app使用的）添加日志记录器
    logging.getLogger().addHandler(file_log_handler)
```

在 `create_app` 方法中调用上一步创建的方法，并传入 `config_name`


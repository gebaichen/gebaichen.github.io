---
date: 2023.8.20
title: Flask命令行使用
tags:
  - flask
  - web
  - python
description: 介绍了，flask中command命令行的使用，和click模块的基本使用
link: /flask/flask.cli.commmad.html
---

# Flask命令行使用

详细可以阅读官网

https://dormousehole.readthedocs.io/en/latest/cli.html

## 1.使用flask命令

在虚拟环境中安装 Flask 时会同时安装 flask 脚本，这是一个 Click 命令行接口。在终端中执行该脚本可以操作内建的、扩展的和应用定义的命令。
关于命令的更多信息和选择可以通过使用 --help 参数查看。

### 运行开发服务器

可以在在flask项目下 输入 flask run运行

```shell
$ flask --app hello run
 * Serving Flask app "hello"
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
```

**--app** 可以自定义app的名字

```shell
$ flask run --app src/hello
# 设置当前工作文件夹为 src 然后导入 hello 

$ flask run --app hello.web
# 导入路径 hello.web 

$ flask run --app hello:app2
# 使用 hello 中的 app2 Flask 实例

$ flask run --app 'hello:create_app("dev")'
# 调用 hello 中的 create_app 工厂,把 'dev' 作为参数
```

### 调试模式

在调试模式下， flask run 命令会默认启用交互调试器和重载器，以方便发 现错误并进行调试。使用 --debug 选项可以启用调试模式。

```shell
$ flask --app hello run --debug
 * Serving Flask app "hello"
 * Debug mode: on
 * Running on http://127.0.0.1:5000/ (Press CTRL+C to quit)
 * Restarting with inotify reloader
 * Debugger is active!
 * Debugger PIN: 223-456-919
```

--debug 选项也可以在任何命令中被传递给顶层的 flask 命令。以下两 个命令是等价的。

```shell
$ flask --app hello --debug run
$ flask --app hello run --debug
```

### 使用重载器监视文件、排除文件

在调试模式下，当你的 Python 代码或者导入的模块发生变动时会触发重载器。 使用 --extra-files
参数可以添加额外的文件，多个文件路径使用 : 分隔，在 Windwos 下使用 ; 分隔。

```shell
$ flask run --extra-files file1:dirA/file2:dirB/
 * Running on http://127.0.0.1:8000/
 * Detected change in '/path/to/file1', reloading
```

重载器也可以排除监视文件，使用 --exclude-patterns 可以排除文件，这 个参数使用 fnmatch 模式。，多个文件路径使用 : 分隔，在
Windwos 下使用 ; 分隔。

### 通过 dotenv 设置环境变量

flask 支持使用环境变量来进行设置任何参数。变量的命名方式类似 FLASK_OPTION 或者 FLASK_COMMAND_OPTION ，例如 FLASK_APP 或者
FLASK_RUN_PORT 。

与其每次运行命令时传递参数或者环境变量，不如使用 Flask 的 dotenv 支持功 能自动设置环境变量。

如果 python-dotenv 已安装，那么运行 flask 命令就会根据 .env 和 .flaskenv 文件中定义的内容来设置环境变量。你也可以使用
--env-file 参数来载入其他包含配置的文件。 Dotenv 文件可以避免手动设 置 --app 或者 FLASK_APP ，并且使用环境类似于一些开发部署工作。

命令行设置的变量会重载 .env 中的变量， .env 中的变量会 重载 .flaskenv 中的变量。 .flaskenv 应当用于公共变量， 如 FLASK_APP
而 .env 则应用用于私有变量，并且不提交到储存库。

为了找到定位文件，将会从运行 flask 的文件夹向上扫描文件夹。

这些文件只能由``flask``命令或调用 run() 加载。如果想在生产 环境加载这些文件，你应该手动调用 load_dotenv() 。

#### 设置命令参数

Click 被配置为根据环境变量为命令选项载入缺省值。变量使用 FLASK_COMMAND_OPTION 模式。例如，要为运行命令设置端口，不使用 flask
run --port 8000 ，而是使用:

:::code-group

```shell[bash]
$ export FLASK_RUN_PORT=8000
$ flask run
 * Running on http://127.0.0.1:8000/
```

```shell[fish]
$ set -x FLASK_RUN_PORT 8000
$ flask run
 * Running on http://127.0.0.1:8000/
```

```shell[cmd]
> set FLASK_RUN_PORT=8000
> flask run
 * Running on http://127.0.0.1:8000/
```

```shell[powershell]
> $env:FLASK_RUN_PORT = 8000
> flask run
 * Running on http://127.0.0.1:8000/
```

:::

## 自定义命令

flask 命令使用 Click 来实现。如何编写命令的完整信息参见该项目的 文档。

以下示例添加了 create-user 命令，带有 name 参数。

```python
import click
from flask import Flask

app = Flask(__name__)


@app.cli.command("create-user")
@click.argument("name")
def create_user(name):
    pass
```

```shell
$ flask create-user admin
```

以下示例也添加了同样功能的命令，但是以命令组的方式添加的，名为 user create 。这样做有助于组织一组相关的命令。

```python
import click
from flask import Flask
from flask.cli import AppGroup

app = Flask(__name__)
user_cli = AppGroup('user')


@user_cli.command('create')
@click.argument('name')
def create_user(name):
    pass


app.cli.add_command(user_cli)
```

```shell
$ flask user create demo
```

### 应用情境

使用 Flask 应用的 cli 或者 FlaskGroup command() 装饰器添加的命令会在执行时压入应用情境，这样命令和扩展就可以访问应用和
应用的配置。with_appcontext() 装饰器可以达到同样的效果，但多 数情况下是没有必要的。

```python
import click
from flask.cli import with_appcontext


@click.command
@with_appcontext
def do_work():
    ...


app.cli.add_command(do_work)
```

### 插件

Flask 会自动载入在 flask.commands entry point 定义的命令。这样有 助于扩展在安装时添加命令。入口点在 pyproject.toml 中定义：

```toml
[project.entry-points."flask.commands"]
my-command = "my_extension.commands:cli"
```

在 my_extension/commands.py 内可以导出一个 Click 对象:

```python
import click


@click.command()
def cli():
    ...
```

### 自定义脚本

当使用应用工厂方案时，自定义 Click 脚本会更方便。这样可以创建自己的 Click 对象并导出它作为一个 console script 入口点，而不是使用
--app 并让 Flask 裁入应用。

创建一个 FlaskGroup 的实例并传递给工厂:

:::code-group

```python[command.py]
import click
from flask import Flask
from flask.cli import FlaskGroup

def create_app():
    app = Flask('wiki')
    # other setup
    return app

@click.group(cls=FlaskGroup, create_app=create_app)
def cli():
    """Management script for the Wiki application."""
```

```toml[pyporject.toml]
[project.scripts]
wiki = "wiki:cli"
```

```shell
# 在 virtualenv 中以可编辑模式安装应用，自定义脚本可用。注意，不需要设置 --app 。
$ pip install -e .
$ wiki run
```

:::

## 更多

关于自定义命令更多的设置和功能请参考Click的官方文档 ：https://click.palletsprojects.com/en/6.x/
---
date: 2023.8.21
title: Flask基本操作
tags:
  - flask
  - web
  - python
description: 介绍flask基本使用，方法
link: /flask/flask-basic.html
---

# Flask基本操作

> https://dormousehole.readthedocs.io/en/latest/
>

## 安装

::: code-group

```shell[pip]
$ pip install Flask
```

```shell[poetry]
$ poetry add Flask
```

:::

## 快速上手

本文会给您好好介绍如何上手 Flask 。

### 一个最小的应用

```python
from flask import Flask

app = Flask(__name__)

@app.route("/")
def hello_world():
    return "<p>Hello, World!</p>"
```

#### 以上代码的意义
- 1.首先我们导入了 Flask 类。该类的实例将会成为我们的 WSGI 应用。

- 2.接着我们创建一个该类的实例。第一个参数是应用模块或者包的名称。 ``__name__`` 是一个适用于大多数情况的快捷方式。有了这个参数， Flask 才能知道在哪里可以找到模板和静态文件等东西。

- 3.然后我们使用 `route()` 装饰器来告诉 `Flask` 触发函 数的 URL 。

- 4.函数返回需要在用户浏览器中显示的信息。默认的内容类型是 HTML ，因此 字符串中的 HTML 会被浏览器渲染。

#### 注意！！！
把它保存为 `hello.py` 或其他类似名称。请不要使用 `flask.py` 作为应用名称，这会与 Flask 本身发生冲突。

可以使用 `flask` 命令或者 `python -m flask `来运行这个应 用。你需要使用 `--app` 选项告诉 Flask 哪里可以找到应用。详见 [命令行接口](/flask/flask.cli.commmad.html) 。

### 应用

这样就启动了一个非常简单的内建的服务器。这个服务器用于测试应该是足够 了，但是用于生产可能是不够的。关于部署的有关内容参见[生产部署](/flask/flask-bushu.html) 。

现在在浏览器中打开 http://127.0.0.1:5000/ ，应该可以看到 Hello World! 字样。

如果其他程序已经占用了 5000 端口，那么在尝试启动服务器时会看到 OSError: [Errno 98] 或者 OSError: [WinError 10013], 地址已被占用。


## 调试模式

`flask run `命令不只可以启动开发服务器。如果您打开调试模式，那么服 务器会在修改应用代码之后自动重启，并且当请求过程中发生错误时还会在浏 览器中提供一个交互调试器。

如果要打开调试模式，请使用 --debug 选项。

```shell
$ flask --app hello run --debug
 * Serving Flask app 'hello'
 * Debug mode: on
 * Running on http://127.0.0.1:5000 (Press CTRL+C to quit)
 * Restarting with stat
 * Debugger is active!
 * Debugger PIN: nnn-nnn-nnn
```

另见：

- [开发服务器](/flask/flask-bushu.html) 和 [命令行接口](/flask/flask-cli.commmad.html) 包含有关调试模式运行的内容。

## HTML 转义
当返回 HTML （ Flask 中的默认响应类型）时，为了防止注入攻击，所有用户 提供的值在输出渲染前必须被转义。使用 Jinja （这个稍后会介绍）渲染的 HTML 模板会自动执行此操作。

在下面展示的 `escape()` 可以手动转义。因为保持简洁的 原因，在多数示例中它被省略了，但您应该始终留心处理不可信的数据。

```python-vue
from markupsafe import escape

@app.route("/<name>")
def hello(name):
    return f"Hello, {escape(name)}!"
```
如果一个用户想要提交其名称为 ```<script>alert("bad")</script>``` ，那么 宁可转义为文本，也好过在浏览器中执行脚本。

路由中的 `<name>` 从 URL 中捕获值并将其传递给视图函数。这些变量规则 见下文。


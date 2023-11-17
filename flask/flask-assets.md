---
date: 2023.9.1
title: Flask-Assets
tags:
  - flask
  - flask-assets
  - python
  - web
  - flask插件
description: 使用Flask-Assets实行JavaScript、css代码打包
link: /flask/flask-assets.html
---

# Flask-Assets

将 Web 资产库与 Flask 集成，增加了对合并、缩小和编译 CSS 和 Javascript 文件的支持。
> https://flask-assets.readthedocs.io/en/latest/

## 使用的目的

在项目部署完成运行的时候，并发高了，可能就会把你的小服务器内存整崩了
为了优化项目，所以我们要把js、css合并缩小编译，可以让文件内存变小，让前端爬虫
看不懂js代码，从而做到反爬功能

## 安装

::: code-group

```shell[pip]
pip install Flask-Assets
pip install cssmin
pip install jsmin
```

```shell[poetry]
poetry add Flask-Assets
poetry add cssmin
poetry add jsmin
```

:::

## 使用

您可以通过创建 Environment 实例并以所谓的捆绑包的形式向其注册资产来初始化应用程序

```python
from flask import Flask
from flask_assets import Environment, Bundle

app = Flask(__name__)
assets = Environment(app)

js = Bundle('jquery.js', 'base.js', 'widgets.js',
            filters='jsmin', output='dist/packed.js')
assets.register('js_all', js)
```
分发包由任意数量的源文件（也可能包含其他嵌套分发包）、输出目标和要应用的过滤器列表组成。

所有路径都相对于应用的静态目录或 Flask 蓝图的静态目录。

如果您愿意，当然也可以在外部配置文件中定义您的资产，并从那里读取它们。 webassets 包括一些流行格式（如 YAML）的许多帮助程序类。

与 Flask 扩展的常见情况一样，Flask-Asssets 实例可以通过调用初始化 `init_app` 来与多个应用程序一起使用，而不是传递固定的应用程序对象：

```python
app = Flask(__name__)
assets = flask_assets.Environment()
assets.init_app(app)
```

## 使用捆绑包

现在，正确定义完成后，您希望合并和缩小它们，并在网页中包含指向压缩结果的链接：

```html
{% assets "js_all" %}
    <script type="text/javascript" src="{{ ASSET_URL }}"></script>
{% endassets %}
```

就是这样，真的。Flask-Assets 将在首次渲染模板时自动合并和压缩捆绑包的源文件，并在每次源文件更改时自动更新压缩文件。如果在应用配置中设置为 `ASSETS_DEBUG=True` ，则每个源文件将单独输出。

在开发模式中可以设置`ASSETS_DEBUG=True`，**因为在实际开发中，我们要不断的修改css、
js文件**

```python
app.config['ASSETS_DEBUG'] = True
```

---
date: 2024.2.20
title: Flask使用uwsgi进行部署
tags:
  - python
  - flask
  - linux
description: Flask使用uwsgi进行部署到Linux服务器
---

# {{ $frontmatter.title }}

## 前言

::: warning
正常运行flask app后会发出警告`WARNING:This is a developnent server. Do not use it in a production deploynent，`
:::

Flask 是一个 WSGI *应用* 。一个 WSGI *服务器* 被用来运行应用，将传入的 HTTP 请求转换为标准的 WSGI 响应，并将流出的 WSGI
响应转换为 HTTP 响应

要在生产环境中运行你的项目，你应该使用一个专门的WSGI服务器，例如Gunicorn、uWSGI或者mod_wsgi（对于Apache服务器）。这些服务器能够更好地处理并发请求、提供更好的性能，并且更适合长时间运行的生产环境

## UWSGI基础知识

### uWSGI、uwsgi、WSGI

> - **WSGI** web应用程序之间的接口。它的作用就像是桥梁，连接在web服务器和web应用框架之间。*
    *它是一个Web服务器（uWSGI等服务器）与web应用（如用Django/Flask框架写的程序)通信的一种协议。**
> - **uwsgi** 是一种传输协议，用于定义传输信息的类型，**常用于在uWSGI服务器与其他网络服务器的数据通信。**
> - **uWSGI** 是实现了uwsgi协议WSGI的web服务器

![uWSGI、uwsgi与WSGI.jpg](/assets/2024.2.19/uWSGI、uwsgi与WSGI.jpg)

## uWSGI服务器安装

uWSGI全称Web Server Gateway
Interface，是一个用于将Web应用程序和Web服务器之间进行通信的协议和软件实现。它不仅仅是一个应用服务器，还可以充当应用容器，提供了一种将Web应用程序与Web服务器解耦的方式。uWSGI
以其强大的性能而闻名，能够有效地处理大量并发请求。它采用多种性能优化策略，使其在高负载环境下表现出色。

也有不少人会用Gunicorn或Waitress去进行Flask的部署，相对于uWSGI而言，它们会更简单和易操作。但是在性能和并发上来说，都不及uWSGI，包括以后我们学习Django也可以用uWSGI去进行部署，并支持容器化部署，可以和Doker良好集成，这些都是十分方便的。

::: code-group

```shell[pip]
pip install uwsgi

```

```shell[poetry]
poetry add uwsgi
```

:::

## uWSGI配置启动

- windows下新建 `uwsgi.ini` 输入如下配置

```
[uwsgi]
module = manage:app
home = /root/miniconda3/envs/blog
master = true
processes = 4
http-socket = 0.0.0.0:5000
threads = 2
```

- 配置文件解释

```python
# module = manage:app
"""
指定了包含应用程序的 Python 模块和应用程序实例。
在这个例子中，manage 是模块的名称，
app 是 Flask 应用程序实例的名称
"""
# home = /root/miniconda3/envs/blog
"""
指定了虚拟环境的路径。uWSGI 将使用这个虚拟环境来运行你的应用程序，
确保应用程序可以访问所需的 Python 包
"""
# master = true
"""
启用主进程。uWSGI 可以以主进程和工作进程的模式运行，
其中主进程负责管理工作进程。设置为 true 表示启用主进程
"""
# processes = 4
"""
指定启动的工作进程数量。在这个例子中，设置为 4，
表示将启动 4 个工作进程来处理请求
"""
# http-socket = 0.0.0.0:5000
"""
指定 uWSGI 监听的 HTTP 地址和端口。在这个例子中，
uWSGI 将监听所有可用的网络接口 (0.0.0.0) 的 5000 端口
"""

# threads = 2
"""
指定每个工作进程启动2条线程，
指定线程的目的是因为项目开了Flask APScheduler，需要开启线程支持，
默认不开启多线程
"""
```

我们是用工厂模式编写的Flask项目，暴露的app对象在 `manage.py`
中，当你使用这个配置启动uWSGI时，它将利用你miniconda的虚拟环境加载你的Flask应用程序的`app` 并处理传入的请求

- uwsgi.ini 上传（可以将此配置文件丢到项目根目录下）

- 启动uWSGI（在你的uwsgi.ini文件目录下）

```
uwsgi --ini uwsgi.ini
```

- 浏览器输入公网IP+端口号进行访问，例如我的公网IP为8.111.222.55，则在浏览器中输入 `8.111.222.55:5000`

- 访问即可看到此时已经启动4条进程且通过uWSGI服务器通过工厂模式启动了Flask项目，且能看到清晰的路由访问

![uwsgi2.png](/assets/2024.2.19/uwsgi2.png)

可以自行测试API的响应速度可以发现部分资源加载还是比较慢

> 使用 uWSGI 单独是不足以使外网浏览器访问你的应用程序的，因为 uWSGI 本身只是一个应用服务器，负责运行 WSGI 应用程序。虽然WSGI
> 服务器包含内置的 HTTP 服务器。但是专业的 HTTP 服务器会可能更快，为了从外部访问你的应用程序，你还需要在 WSGI 服务器前面设置一个
> HTTP 服务器，也就是反向代理服务器



---
date: 2023.8.20
title: Flask-Limiter实现限制访问的功能
tags:
  - flask
  - flask-limiter
  - python
  - web
  - flask插件
description: Flask-Limiter实现限制访问的功能，可以控制大多数爬虫并封ip
link: /flask/flask-limiter.html
---

# Flask-Limiter

<blockquote>
<p>
<a href="https://flask-limiter.readthedocs.io/">https://flask-limiter.readthedocs.io/</a>
</p>
</blockquote> 



Flask- limiter为Flask应用添加了速率限制。

通过将扩展添加到flask应用中，你可以在不同级别配置不同的速率限制(例如，应用范围、每个蓝本、路由、资源等)。

我们可以配置Flask-Limiter，通过limits库将速率限制状态持久化到许多常用的存储后端。

让我们开始吧!

## 下载

```shell
pip install Flask-Limiter
```

## 快速开始

### 速率表示

有两种方式表示速率限制：

"100 per day"、"20 per hour"、"5 per minute"、"1 per second"
"100/day"、"20/hour"、"5/minute"、"1/second"

这两种形式可以互相转化

### 全局配置

速率限制可以设置全局配置，
针对所有接口进行限制；
也可以通过装饰器进行局部限制；
对于不想限制的接口，可以通过装饰器`@limiter.exempt`进行解除限制.

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import Flask

app = Flask(__name__)

# 该配置为全局配置、适用于所有接口
limiter = Limiter(app, key_func=get_remote_address, default_limits=["100 per day", "10 per hour"])


# @limiter.limit: 将覆盖全局limiter配置
@app.get("/override")
@limiter.limit("1 per day")
def override():
    return "override"


# override_defaults: 表示该limiter是否覆盖全局limiter限制，默认为True
@app.get("/no-override")
@limiter.limit("1 per second", override_defaults=False)
def no_override():
    return "other"


# 完整继承全局limiter配置
@app.get("/index")
def fast():
    return "index"


# @limiter.exempt: 被装饰的视图不受全局速率限制
@app.get("/dashboard")
@limiter.exempt
def dashboard():
    return "dashboard"

```

### 使用装饰器限制视图

限制视图的方式：

- 1.单个修饰：限制视图的字符串可以是单个，也可以是定界符分隔的字符串来进行限制视图。

```python
@app.get("....")
@limiter.limit("100 per day;10 per hour;1 per minute")
def index_app_get():
    pass
    ...
```

- 2.多个修饰:限制视图的字符串可以是单个，也可以是定界符分隔的字符串来进行限制视图，还可以多个组合

```python
@app.get("....")
@limiter.limit("100 per day")
@limiter.limit("10 per hour")
@limiter.limit("1 per minute")
def index_app_get():
    pass
    ...
```

这个代码与以上代码是划等号的。

- 3.自定义修饰：默认情况下，根据Limiter实例初始化时所使用的关键功能来应用速率限制视图。我们可以实现自己想要的的功能。

```python
def my_limit_func():
    ...


@app.get("...")
@limiter.limit("1 per day", my_limit_func)
def my_limit_func_route():
    ...
```

## 缓存数据库

**注意：所装饰的路由上每个请求都会调用提供的可调用对象，对于昂贵的检索，请考虑缓存响应。**
**如果是高并发的网站，除非你的服务器内存超级大，你一定要把用数据库来缓存数据**

- 记录IP访问次数，用于判断该IP访问次数是否达到限制。Limiter默认使用内存作为储存后端，但是在实际开发中，可能会涉及到多进程资源不共享、服务器内存消耗等问题，一般是使用redis作为储存后端。

- 需要redis服务器的位置，以及可选的数据库号。 redis://localhost:6379或redis://localhost:6379/n（对于数据库n）。

- 如果redis服务器正在通过unix域套接字监听，则可以使用redis+unix:///path/to/sock 或redis+unix:
  ///path/to/socket?db=n（对于数据库n）。

- 如果数据库受密码保护，则可以在URL中提供密码，例如， redis://:foobared@localhost:6379或者redis+unix//:
  foobered/path/to/socket。

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import Flask

limiter = Limiter(
    key_func=get_remote_address,
    # 每天200次，一小时50次
    default_limits=["4800 per day", "200 per hour", "50 per minute", "5 per second"],
    # 在这里编写redis缓存的内容
    storage_uri=f"redis:redis_password//@redis_host:redis_port/1",
)


def register_limiter(app: Flask):
    limiter.init_app(app)
```

## 限制域

**注意：在真实开发中，大部分项目都配置了Nginx，如果直接使用``get_remote_address``
，获取到的是Nginx服务器的地址，相当于来自该Nginx服务器的所有请求会被当做同一个IP访问**

因此解决办法如下：

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import Flask, request


def limit_key_func():
    return str(request.headers.get("X-Forwarded-For", '127.0.0.1'))


limiter = Limiter(
    key_func=limit_key_func,
    # 每天200次，一小时50次
    default_limits=["4800 per day", "200 per hour", "50 per minute", "5 per second"],
    # 在这里编写redis缓存的内容
    storage_uri=f"redis:redis_password//@redis_host:redis_port/1",
)


def register_limiter(app: Flask):
    limiter.init_app(app)
```

## 自定义错误返回内容

`Limit()`和`shared_limit()`可以提供一个error_message参数，以覆盖返回给调用客户端的默认n per
x错误消息。error_message参数可以是一个简单的字符串，也可以是一个返回字符串的可调用对象。

```python
app = Flask(__name__)
limiter = Limiter(get_remote_address, app=app)

def error_handler():
    return app.config.get("DEFAULT_ERROR_MESSAGE")

@app.route("/")
@limiter.limit("1/second", error_message='chill!')
def index():
    ....

@app.route("/ping")
@limiter.limit("10/second", error_message=error_handler)
def ping():
    ....
```

或者

```python
app = Limiter(
    key_func=...,
    default_limits=["100/minute"],
    on_breach=default_error_responder
)

def index_ratelimit_error_responder(request_limit: RequestLimit):
    return jsonify({"error": "rate_limit_exceeded"})

@app.route("/")
@limiter.limit("10/minute", on_breach=index_ratelimit_error_responder)
def index():
    ...
    
@app.errorhandler(429)
def careful_ratelimit_handler(error):
    return error.get_response() or make_response(
      jsonify(
          error=f"ratelimit exceeded {e.description}"
      ),
      429
    )
```

## 总结

希望这篇文章能帮助大多数开发者
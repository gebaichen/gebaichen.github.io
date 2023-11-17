---
date: 2023.8.20
title: Flask项目部署
tags:
  - flask
  - web
  - python
description: Flask项目部署的方式方法
link: /flask/flask-bushu.html
---

# Flask项目部署

生产部署我建议用Gunicorn

## 使用 Gunicorn 运行程序

在开发时，我们使用 flask run
命令启动的开发服务器是由Werkzeug提供的。细分的话，Werkzeug提供的这个开发服务器应该被称为WSGI服务器，而不是单纯意义上的Web服务器。在生产环境中，我们需要一个更强健、性能更高的WSGI服务器。这些WSGI服务器也被称为独立WSGI容器（Standalone
WSGI
Container），因为它们可以承载我们编写的WSGI程序，然后处理HTTP请求和响应。这通常有很多选择，比如[Gunicorn](http://gunicorn.org/)、[uWSGI](http://uwsgi-docs.readthedocs.io/en/latest/ )、[Gevent](http://www.gevent.org/ )
等。

通常我们会根据程序的特点来选，主流的选择是使用Gunicorn和uWSGI。在这里我们将使用Gunicorn（意为Green
Unicorn），它使用起来相对简单，容易配置，而且性能优秀。我们先在远程主机中使用Pip安装它：

```{.ziti3}
$ pip install gunicorn
```

为了方便进行测试，我们可以临时设置防火墙以允许对8000端口的访问：

```{.ziti3}
$ sudo ufw allow 8000
```

Gunicorn使用下面的命令模式来运行一个WGSI程序：

```{.ziti3}
$ gunicorn [OPTIONS] 模块名: 变量名
```

这里的变量名即要运行的 WSGI 可调用对象，也就是我们使用Flask创建的程序实例，而模块名即包含程序实例的模块。在准备环节，我们已经在项目根目录下创建了一个包含生产环境下的程序实例的wsgi.py模块

```python
# filename:wsgi.py
from flask import Flask
app = Flask(__name__)

@app.route('/')
def hello_world():
    return 'Hello, World!'
```

使用下面的命令即可运行程序：

```{.ziti3}
$ gunicorn --workers=4 wsgi:app
```

在上面的命令中，我们使用--workers选项来定义worker（即工作线程）的数量。这里的数量并不是越多越好，事实上，Gunicorn只需要4～12个worker进程就可以每秒处理成百上千个请求。通常来说，worker的数量建议为（2×CPU核心数）+1。

<span style='color:red;font-size:24px'>提示</span>

默认的 worker 类型为同步 worker，作为替代，你也可以使用异步 worker。要使用异步 worker，你首先要安装其他异步处理库，然后在命令中通过-k选项设置对应的
worker 类，比如 gunicorn-k gevent。通常情况下，有两种情况需要使用异步worker：

第一，单独使用Gunicorn运行程序时，你的程序需要处理大量并发请求。

第二，当使用Web服务器作为代理运行在Gunicorn前面时，这时的并发数量并不是关键，使用同步worker即可，除非你有大量的耗时计算需要处理。

Gunicorn默认监听本地机的8000端口，这里的本地机指的是远程主机。为了能够在外部访问，我们可以使用--bind选项来设置程序运行的主机地址和端口，比如：

```{.ziti3}
$ gunicorn --workers=4 --bind=0.0.0.0:8000 wsgi:app
```

上面的命令等同于：

```{.ziti3}
$ gunicorn -w 4 -b 0.0.0.0:8000 app:app
```

如果默认的质量不能使用

```
venv/bin/gunicorn --workers=4 --bind=0.0.0.0:8000 wsgi:app
```

### Gunicorn使用详解

使用gunicorn监听请求，运行以下命令

```
gunicorn -w 2 -b 0.0.0.0:8000 wsgi:app
```

-w: 指定fork的worker进程数
-b: 指定绑定的端口
test: 模块名, python文件名
application: 变量名，python文件中可调用的wsgi接口名称（app对象）

#### gunicorn相关参数

指定一个配置文件（py文件）

-c CONFIG,--config=CONFIG

与指定socket进行绑定

-b BIND,--bind=BIND

后台进程方式运行gunicorn进程

-D,--daemon

工作进程的数量

-w WORKERS,--workers=WORKERS

工作进程类型，包括sync（默认）,eventlet,gevent,tornado,gthread,gaiohttp

-k WORKERCLASS,--worker-class=WORKERCLASS

最大挂起的连接数

--backlog INT

日志输出等级

--log-level LEVEL

访问日志输出文件

--access-logfile FILE

错误日志输出文件

--error-logfile FILE

### Gunicorn配置

Gunicorn从三个不同的地方读取配置信息。

第一个: 从framework定义的配置信息中读取,目前只对 Paster 框架有效。

第二个: 在命令行中定义,命令行中定义的配置信息将会覆盖掉框架中定义的相同的参数名的值。

第三个: 将所有的参数信息,放到一个文件中,只要是在命令行中可以定义的参数中,在配置文件中都可以定义。(
是一个Python源文件,所以你就像在写Python代码一样)

第一个地方不不介绍了,不实用。重点介绍第二种和第三种,其实这两种方式都是相同的。

#### gunicorn 参数配置文件

-c CONFIG,--config=CONFIG 指定一个配置文件（py文件）
gunicorn可以写在配置文件中，下面举列说明配置文件的写法,gunicorn.conf.py

```
bind = "0.0.0.0:8000"
workers = 2
```

运行以下命令:

```
gunicorn -c gunicorn.conf.py wsgi:app
```

运行结果和使用命令行参数，结果一样。

gunicorn 配置文件是一个 python 文件，因此可以实现更复杂的逻辑，如下：

```
# filename: gunicorn.conf.py
import os
import multiprocessing

bind = '127.0.0.1:8000'  # 绑定ip和端口号
backlog = 512  # 监听队列
chdir = os.path.dirname(os.path.abspath(__file__))  # gunicorn要切换到的目的工作目录
timeout = 30  # 超时
worker_class = 'sync'  # 使用gevent模式，还可以使用sync 模式，默认的是sync模式

workers = multiprocessing.cpu_count() * 2 + 1  # 进程数
threads = 2  # 指定每个进程开启的线程数
loglevel = 'info'  # 日志级别，这个日志级别指的是错误日志的级别，而访问日志的级别无法设置
access_log_format = '%(t)s %(p)s %(h)s "%(r)s" %(s)s %(L)s %(b)s %(f)s" "%(a)s"'  # 设置gunicorn访问日志格式，错误日志无法设置

"""
其每个选项的含义如下：
h          remote address
l          '-'
u          currently '-', may be user name in future releases
t          date of the request
r          status line (e.g. ``GET / HTTP/1.1``)
s          status
b          response length or '-'
f          referer
a          user agent
T          request time in seconds
D          request time in microseconds
L          request time in decimal seconds
p          process ID
"""
accesslog = os.path.join(chdir, "log/gunicorn_access.log")  # 访问日志文件
errorlog = os.path.join(chdir, "log/gunicorn_error.log")  # 访问日志文件

```

使用配置文件启动Gunicorn

```
gunicorn --config=gunicorn.conf.py wsgi:app
```

和上面用命令行配置的效果完全一样，当然两者还可以结合起来用:

```
gunicorn --config=gunicorn.conf.py --worker-class=eventlet wsgi:app
```

worker-class默认是sync(同步),我们也可以配置成了 eventlet(并发的)

#### 第二种并发方式（多线程）

Gunicorn 还允许每个 worker 拥有多个线程。在这种场景下，Python 应用程序每个 worker 都会加载一次，同一个 worker
生成的每个线程共享相同的内存空间。

为了在 Gunicorn 中使用多线程。我们使用了 `threads` 模式。每一次我们使用 `threads` 模式，worker 的类就会是 `gthread`：

```
gunicorn --workers=5 --threads=2 main:app
```

上一条命令等同于：

```
gunicorn --workers=5 --threads=2 --worker-class=gthread main:app
```

在我们的例子里面最大的并发请求数就是 `worker * 线程`，也就是10。

在使用 worker 和多线程模式时建议的最大并发数量仍然是 <span style="color:red">(2*CPU)+1</span> 。

因此如果我们使用四核（4 个 CPU）机器并且我们想使用 workers 和多线程模式，我们可以使用 3 个 worker 和 3 个线程来得到最大为 9
的并发请求数量。

```
gunicorn --workers=3 --threads=3 main:app
```

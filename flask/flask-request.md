---
date: 2023.8.22
title: Flask请求
tags:
  - flask
  - web
  - python
description: flask请求方式和方法
link: /flask/flask-request.html
---

<script setup>
const init = '__init__';
</script>

# Flask请求

## 什么是请求？

请求就是客户端浏览器，向服务器端索要数据

### 协议

HTTP HTTPS UDP(微信、qq) TPC（有服务器端，和客户端 socket网络编程）

网站、api接口一般都是HTTP/HTTPS协议的

但是HTTP没有HTTPS安全，HTTPS比HTTP部署时多了（ssl证书）

### HTTP

> [http请求](https://zhuanlan.zhihu.com/p/533284035)

HTTP 协议的全称是(HyperText Transfer Protocol)，翻译过来就是超文本(html)传输协议。

#### HTTP请求方式

大致常用的请求方式：

| 请求方式   | 一般作用   |
|:-------|:-------|
| GET    | 请求获取数据 |
| POST   | 新增数据   | 
| PUT    | 修改数据   |  
| DELETE | 删除数据   |    
| PATCH  | 刷新数据   |    

**http请求方式https也有用**

##### 例如

部署服务器：
在电脑windows\mac系统写完网站代码。他的协议是HTTP
然后部署到linux系统，用Nginx反向代理添加ssl，协议为HTTPS

目的：更加安全

restful api 格式
> [restful api格式详细见](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

### HTTPS

https底层是基于http的，所以http有的https也有

HTTP没有HTTPS安全，HTTPS比HTTP部署时多了（ssl证书）
fast api、flask、django HTTP协议的

## URL

### 1. URL的概念

URL的英文全拼是(Uniform Resoure Locator),表达的意思是统一资源定位符，通俗理解就是网络资源地址，也就是我们常说的网址。

### 2. URL的组成

URL的样子:

https://news.163.com/18/1122/10/E178J2O4000189FH.html
URL的组成部分:

- 协议部分: https://、http://、ftp://
- 域名部分: news.163.com
    - 域名部分：名称 + "." + 后缀
- 资源路径部分: /18/1122/10/E178J2O4000189FH.html

域名:

域名就是IP地址的别名，它是用点进行分割使用英文字母和数字组成的名字，使用域名目的就是方便的记住某台主机IP地址。

URL的扩展：https://news.163.com/hello.html?page=1&count=10

查询参数部分: ?page=1&count=10

参数说明：? 后面的 page 表示第一个参数，后面的参数都使用 & 进行连接

### URL 构建

`url_for()` 函数用于构建指定函数的 URL。它把函数名称作为第 一个参数。它可以接受任意个关键字参数，每个关键字参数对应 URL
中的变量。 未知变量将添加到 URL 中作为查询参数。

为什么不在把 URL 写死在模板中，而要使用反转函数 `url_for()` 动态构建？

反转通常比硬编码 URL 的描述性更好。

您可以只在一个地方改变 URL ，而不用到处乱找。

URL 创建会为您处理特殊字符的转义，比较直观。

生产的路径总是绝对路径，可以避免相对路径产生副作用。

如果您的应用是放在 URL 根路径之外的地方（如在 /myapplication 中，不在 / 中）， `url_for()` 会为您妥善处理。

例如，这里我们使用 `test_request_context()` 方法来尝 试使用 `url_for()` 。 `test_request_context()` 告诉 Flask 正在处理一个请求，
而实际上也许我们正处在交互 Python shell 之中，并没有真正的请求。参见 本地环境 。

```python
from flask import url_for

app = Flask(__name__)

@app.route('/')
def index():
    return 'index'

@app.route('/login')
def login():
    return 'login'

@app.route('/user/<username>')
def profile(username):
    return f'{username}\'s profile'

with app.test_request_context():
    print(url_for('index'))
    print(url_for('login'))
    print(url_for('login', next='/'))
    print(url_for('profile', username='John Doe'))
```

- /
- /login
- /login?next=/
- /user/John%20Doe

## HTTP 方法

Web 应用使用不同的 HTTP 方法处理 URL 。当您使用 Flask 时，应当熟悉 HTTP 方法。缺省情况下，一个路由只回应 GET 请求。可以使用
route() 装饰器的 methods 参数来处理不同的 HTTP 方法。

```python
from flask import request

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        return do_the_login()
    else:
        return show_the_login_form()
```

上例中把路由的所有方法都放在同一个函数中，当每个方法都使用一些共同的 数据时，这样是有用的。

你也可以把不同方法所对应的视图分别放在独立的函数中。 Flask 为每个常用 的 HTTP 方法提供了捷径，如 `get() 、 post()` 等等。

```python
@app.get('/login')
def login_get():
    return show_the_login_form()

@app.post('/login')
def login_post():
    return do_the_login()
```

如果当前使用了 GET 方法， Flask 会自动添加 HEAD 方法支持，并 且同时还会按照 HTTP RFC 来处理 HEAD 请求。同样， OPTIONS
也会自动实现。

## 静态文件

动态的 web 应用也需要静态文件，一般是 CSS 和 JavaScript 文件。理想情 况下您的服务器已经配置好了为您的提供静态文件的服务。但是在开发过程中，
Flask 也能做好这项工作。只要在您的包或模块旁边创建一个名为 static 的文件夹就行了。静态文件位于应用的 /static 中。

使用特定的 `'static'` 端点就可以生成相应的 URL

`url_for('static', filename='style.css')`
这个静态文件在文件系统中的位置应该是 static/style.css 。

## 渲染模板

在 Python 内部生成 HTML 不好玩，且相当笨拙。因为您必须自己负责 HTML 转义，以确保应用的安全。因此， Flask 自动为您配置 Jinja2
模板引擎。

模板可被用于生成任何类型的文本文件。对于 web 应用来说，主要用于生成 HTML 页面，但是也可以生成 markdown 、用于电子邮件的纯文本等等。

HTML 、 CSS 和其他 web API ，请参阅 MDN Web 文档 。

使用 `render_template()` 方法可以渲染模板，您只要提供模板 名称和需要作为参数传递给模板的变量就行了。下面是一个简单的模板渲染例
子:

```python
from flask import render_template

@app.route('/hello/')
@app.route('/hello/{{ name }}')
def hello(name=None):
    return render_template('hello.html', name=name)
```

Flask 会在 templates 文件夹内寻找模板。因此，如果您的应用是一 个模块，那么模板文件夹应该在模块旁边；如果是一个包，那么就应该在包里
面：

### 情形 1 : 一个模块:

- /application.py
- /templates
    - /hello.html

### 情形 2 : 一个包:

- /application
    - /{{ init }}.py
    - /templates
        - /hello.html
          您可以充分使用 Jinja2 模板引擎的威力。更多内容，详见官方 Jinja2 模板文档 。

### 模板示例：

```
<!doctype html>
<title>Hello from Flask</title>
{% if name %}
<h1>Hello <name>!</h1>
{% else %}
<h1>Hello, World!</h1>
{% endif %}
```

在模板内部可以像使用 `url_for()` 和 `get_flashed_messages()` 函数一样访问 config 、 request 、 session 和 g 1 对象。

模板在继承使用的情况下尤其有用。其工作原理参见 模板继承 。简单的说，模板继承可以使每个页 面的特定元素（如页头、导航和页尾）保持一致。

自动转义默认开启。因此，如果 name 包含 HTML ，那么会被自动转义。 如果您可以信任某个变量，且知道它是安全的 HTML （例如变量来自一个把
wiki 标记转换为 HTML 的模块），那么可以使用 Markup 类把它标记为安全的，或者在模板中使用 |safe 过滤器。更多例子参见 Jinja 2
文档。

不确定 g 对象是什么？它是某个可以根据需要储存 信息的东西，详见 g 对象的文档和 使用 SQLite 3 。

### 操作请求数据

对于 web 应用来说对客户端向服务器发送的数据作出响应很重要。在 Flask 中由全局对象 request 来提供请求信息。如果您有一些
Python 基础，那么可能 会奇怪：既然这个对象是全局的，怎么还能保持线程 安全？答案是本地环境：

## 本地环境

### 内部信息

如果您想了解工作原理和如何使用本地环境进行测试，那么请阅读本节， 否则可以跳过本节。

某些对象在 Flask 中是全局对象，但不是通常意义下的全局对象。这些对象实 际上是特定环境下本地对象的代理。真拗口！但还是很容易理解的。

设想现在处于处理线程的环境中。一个请求进来了，服务器决定生成一个新线 程（或者叫其他什么名称的东西，这个下层的东西能够处理包括线程在内的并
发系统）。当 Flask 开始其内部请求处理时会把当前线程作为活动环境，并把 当前应用和 WSGI 环境绑定到这个环境（线程）。它以一种聪明的方式使得一
个应用可以在不中断的情况下调用另一个应用。

这对您有什么用？基本上您可以完全不必理会。这个只有在做单元测试时才有 用。在测试时会遇到由于没有请求对象而导致依赖于请求的代码会突然崩溃的
情况。对策是自己创建一个请求对象并绑定到环境。最简单的单元测试解决方 案是使用 test_request_context() 环境管理器。通过使 用
with 语句可以绑定一个测试请求，以便于交互。例如:

```python
from flask import request

with app.test_request_context('/hello', method='POST'):
    assert request.path == '/hello'
    assert request.method == 'POST'
```

另一种方式是把整个 WSGI 环境传递给 `request_context()` 方法:

```python
with app.request_context(environ):
    assert request.method == 'POST'
```

## 请求对象

请求对象在 API 一节中有详细说明这里不细谈（参见 Request ）。这里简略地谈一下最常见的操作。首先，您必 须从 flask
模块导入请求对象:

`from flask import request`
通过使用 `method` 属性可以操作当前请求方法，通过 使用 form 属性处理表单数据（在 POST 或者 PUT
请求中传输的数据）。以下是使用上述两个属性的例子:

```python
@app.route('/login', methods=['POST', 'GET'])
def login():
    error = None
    if request.method == 'POST':
        if valid_login(request.form['username'],
                       request.form['password']):
            return log_the_user_in(request.form['username'])
        else:
            error = 'Invalid username/password'
    return render_template('login.html', error=error)
```

- request.args 请求参数 就是url后面的数据
- request.form 请求表单数据
- request.json 请求头里面的'Content-Type': 'application/json',

当 form 属性中不存在这个键时会发生什么？会引发一个 KeyError 。如果您不像捕捉一个标准错误一样捕捉 KeyError ， 那么会显示一个
HTTP 400 Bad Request 错误页面。因此，多数情况下您不必 处理这个问题。

要操作 URL （如 `?key=value` ）中提交的参数可以使用 args 属性:

`searchword = request.args.get('key', '')`
用户可能会改变 URL 导致出现一个 400 请求出错页面，这样降低了用户友好 度。因此，我们推荐使用 get 或通过捕捉 KeyError 来访问
URL 参数。

完整的请求对象方法和属性参见 Request 文档。

## 文件上传

用 Flask 处理文件上传很容易，只要确保不要忘记在您的 HTML 表单中设置 enctype="multipart/form-data" 属性就可以了。否则浏览器将不会传送
您的文件。

已上传的文件被储存在内存或文件系统的临时位置。您可以通过请求对象 files 属性来访问上传的文件。每个上传的文件都储
存在这个字典型属性中。这个属性基本和标准 Python file 对象一 样，另外多出一个用于把上传文件保存到服务器的文件系统中的
save() 方法。下例展示其如 何运作:

```python
from flask import request

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        f = request.files['the_file']
        f.save('/var/www/uploads/uploaded_file.txt')
    ...
```

如果想要知道文件上传之前其在客户端系统中的名称，可以使用 filename 属性。但是请牢 记这个值是可以伪造的，永远不要信任这个值。如果想要把客户端的文件名作
为服务器上的文件名，可以通过 Werkzeug 提供的 secure_filename() 函数:

```python
from werkzeug.utils import secure_filename

@app.route('/upload', methods=['GET', 'POST'])
def upload_file():
    if request.method == 'POST':
        file = request.files['the_file']
        file.save(f"/var/www/uploads/{secure_filename(file.filename)}")
    ...
```

更好的例子参见 上传文件 。

## Cookies

要访问 cookies ，可以使用 cookies 属性。可以使 用响应对象 的 set_cookie 方法来设置 cookies 。 请求对象的 cookies
属性是一个包含了客户端传输 的所有 cookies 的字典。在 Flask 中，如果使用 会话 ，那么就 不要直接使用 cookies ，因为 会话
比较安全一些。

读取 cookies:

from flask import request

```python
@app.route('/')
def index():
    username = request.cookies.get('username')
```

储存 cookies:

```python
from flask import make_response

@app.route('/')
def index():
    resp = make_response(render_template(...))
    resp.set_cookie('username', 'the username')
    return resp
```

注意， cookies 设置在响应对象上。通常只是从视图函数返回字符串， Flask 会把它们转换为响应对象。如果您想显式地转换，那么可以使用
make_response() 函数，然后再修改它。

使用 doc:patterns/deferredcallbacks 方案可以在没有响应对象的情况下 设置一个 cookie 。

## 重定向和错误

使用 `redirect()` 函数可以重定向。使用 `abort()` 可以更早退出请求，并返回错误代码:

```python
from flask import abort, redirect, url_for

@app.route('/')
def index():
    return redirect(url_for('login'))

@app.route('/login')
def login():
    abort(401)
    this_is_never_executed()
```

上例实际上是没有意义的，它让一个用户从索引页重定向到一个无法访问的页 面（401 表示禁止访问）。但是上例可以说明重定向和出错跳出是如何工作的。

缺省情况下每种出错代码都会对应显示一个黑白的出错页面。使用 errorhandler() 装饰器可以定制出错页面:

```python
@app.errorhandler(404)
def page_not_found(error):
    return render_template('page_not_found.html'), 404
```

注意 `render_template()` 后面的 404 ，这表示页面对就的 出错代码是 404 ，即页面不存在。缺省情况下 200 表示：一切正常。

## 关于响应

视图函数的返回值会自动转换为一个响应对象。如果返回值是一个字符串，那 么会被转换为一个包含作为响应体的字符串、一个 200 OK
出错代码 和一 个 text/html 类型的响应对象。如果返回值是一个字典或者列表， 那么会调用 jsonify() 来产生一个响应。以下是转换的规则：

如果视图返回的是一个响应对象，那么就直接返回它。

如果返回的是一个字符串，那么根据这个字符串和缺省参数生成一个用于 返回的响应对象。

如果返回的是一个迭代器或者生成器，那么返回字符串或者字节，作为流 响应对待。

如果返回的是一个字典或者列表，那么使用 jsonify() 创建一个响应对象。

如果返回的是一个元组，那么元组中的项目可以提供额外的信息。元组中 必须至少包含一个项目，且项目应当由 (response, status) 、 (
response, headers) 或者 (response, status, headers) 组 成。 status 的值会重载状态代码， headers 是一个由额外头部
值组成的列表或字典。

如果以上都不是，那么 Flask 会假定返回值是一个有效的 WSGI 应用并把 它转换为一个响应对象。

如果想要在视图内部掌控响应对象的结果，那么可以使用 `make_response()` 函数。

设想有如下视图:

```python
@app.errorhandler(404)
def not_found(error):
    return render_template('error.html'), 404
```

可以使用 `make_response()` 包裹返回表达式，获得响应对象， 并对该对象进行修改，然后再返回:

```python
@app.errorhandler(404)
def not_found(error):
    resp = make_response(render_template('error.html'), 404)
    resp.headers['X-Something'] = 'A value'
    return resp
```

JSON 格式的 API
JSON 格式的响应是常见的，用 Flask 写这样的 API 是很容易上手的。如果从 视图返回一个 dict 或者 list ，那么它会被转换为一个
JSON 响应。

```python
@app.route("/me")
def me_api():
    user = get_current_user()
    return {
        "username": user.username,
        "theme": user.theme,
        "image": url_for("user_image", filename=user.image),
    }
```

如果 dict 还不能满足需求，还需要创建其他类型的 JSON 格式响应，可 以使用 jsonify() 函数。该函数会序列化任何支持的 JSON
数据类型。也可以研究研究 Flask 社区扩展，以支持更复杂的应用。

```python
@app.route("/users")
def users_api():
    users = get_all_users()
    return [user.to_json() for user in users]
```

这是一个向 jsonify() 函数传递数据的捷径，可以序列化 任何支持的 JSON 数据类型。这也意味着在字典和列表中的所有数据必须可以
被序列化。

对于复杂的数据类型，如数据库模型，你需要使用序列化库先把数据转换为合 法的 JSON 类型。有许多库，以及社区维护的 Flask API
扩展可以处理复杂数 据类型，

## 会话

除了请求对象之外还有一种称为 session 的对象，允许您在 不同请求之间储存信息。这个对象相当于用密钥签名加密的 cookie ，即用户
可以查看您的 cookie ，但是如果没有密钥就无法修改它。

使用会话之前您必须设置一个密钥。举例说明:

```python
from flask import session

app.secret_key = b'_5#y2L"F4Q8z\n\xec]/'

@app.route('/')
def index():
    if 'username' in session:
        return f'Logged in as {session["username"]}'
    return 'You are not logged in'

@app.route('/login', methods=['GET', 'POST'])
def login():
    if request.method == 'POST':
        session['username'] = request.form['username']
        return redirect(url_for('index'))
    return '''
        <form method="post">
            <p><input type=text name=username>
            <p><input type=submit value=Login>
        </form>
    '''

@app.route('/logout')
def logout():
    session.pop('username', None)
    return redirect(url_for('index'))
```

如何生成一个好的密钥
生成随机数的关键在于一个好的随机种子，因此一个好的密钥应当有足够 的随机性。操作系统可以有多种方式基于密码随机生成器来生成随机数据。
使用下面的命令可以快捷的为 Flask.secret_key （ 或者 SECRET_KEY ）生成值:

```shell
$ python -c 'import secrets; print(secrets.token_hex())'
'192b9bdd22ab9ed4d12e236c78afcb9a393ec15f71bbf5dc987d54727823bcbf'
```

基于 cookie 的会话的说明： Flask 会取出会话对象中的值，把值序列化后储 存到 cookie 中。在打开 cookie 的情况下，如果需要查找某个值，但是这个
值在请求中没有持续储存的话，那么不会得到一个清晰的出错信息。请检查页 面响应中的 cookie 的大小是否与网络浏览器所支持的大小一致。

除了缺省的客户端会话之外，还有许多 Flask 扩展支持服务端会话。

## 消息闪现

一个好的应用和用户接口都有良好的反馈，否则到后来用户就会讨厌这个应用。 Flask 通过闪现系统来提供了一个易用的反馈方式。闪现系统的基本工作原理
是在请求结束时记录一个消息，提供且只提供给下一个请求使用。通常通过一 个布局模板来展现闪现的消息。

`flash()` 用于闪现一个消息。在模板中，使用 `get_flashed_messages()` 来操作消息。完整的例子参见 消息闪现 。

## 日志

Changelog
有时候可能会遇到数据出错需要纠正的情况。例如因为用户篡改了数据或客户 端代码出错而导致一个客户端代码向服务器发送了明显错误的
HTTP 请求。多 数时候在类似情况下返回 400 Bad Request 就没事了，但也有不会返回的 时候，而代码还得继续运行下去。

这时候就需要使用日志来记录这些不正常的东西了。自从 Flask 0.3 后就已经 为您配置好了一个日志工具。

以下是一些日志调用示例:

```python
app.logger.debug('A value for debugging')
app.logger.warning('A warning occurred (%d apples)', 42)
app.logger.error('An error occurred')
```

logger 是一个标准的日志 Logger 类，更多信息详见官方的 logging 文档。

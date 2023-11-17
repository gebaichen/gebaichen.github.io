---
date: 2023.8.31
title: Flask实现登录
tags:
  - flask
  - flask-sqlalchemy
  - flask-login
  - flask-session
  - python
  - web
  - flask插件
description: Flask-login实现登录,登出等功能；Flask-Session 实现管理session,并把session储存到redis数据库
link: /flask/flask-login.html
---

# Flask实现登录

## 登录的方式

flask实现登录可以有两种方式，
这两种方式区分用‘前后端分离，半分离，不分离’

### 第一种方式实现登录

利用session储存登录信息，并且把用户User orm对象传入`g.user方便使用`

这一种session:是一种储存到服务器端的数据，需要秘钥进行加密，客户端浏览器无法访问
session加密存到cookie里面，cookie服务器端客户端都可以访问
。在客户端把带有session加密的cookie删除就退出登录

> 注：这种适合前后端不分离或者半分离（部分分离）

### 第二种方式实现登录

第二种方式需要使用jwt-token，登录完成后服务器给客户端传入一个token(
token的意思是“令牌”，是服务端生成的一串字符串，作为客户端进行请求的一个标识。)，
(token都有时间限制，到了时间就不管用了)客户端请求需要携带这个token,如果没有就是没登录或权限不够，

一般服务器端登陆完返回的有两个token

- assets-token：服务器返回的token，用来请求其他页面携带的
- refresh-token 刷新token：如果assets-token过期那么用刷新token去向服务器端请求assets-token
  并进行使用

> 注：这种适合前后端分离

### 注意

本篇文章，会讲解flask使用session来进行登录操作（更加常用）

## Flask-Login

这是一个flask专门做登录的一个库，他的底层是操作session来实现的

### 下载

::: code-group

```shell[pip]
pip install Flask-Login
```

```shell[poetry]
poetry add Flask-Login
```

:::

### 注册到app

注册app方式：

```python
# 导入flask_login 的LoginManager对象
from flask_login import LoginManager 
# 创建一个实例化对象
login_manager = LoginManager()
# 注册到app
login_manager.init_app(app)
```

#### 自定义回调函数

一般我们操作登录的时候会使用User这个ORM对象
而flask_login默认提供了一个`current_user`对象，这个对象就是当前登录的UserORM对象

而我们要在配置里编写回调函数才能达到以上效果

```python
@login_manager.user_loader
def load_user(userid):
    return User.query.get(userid)
```

这样我们就能使用current_user了

#### 验证失败回调

login-view ：验证失败跳转的界面

```python
login_manager.login_view = "index"  # 跳转到/首页目录
```

这里面传入的内容就是函数名，或者可以自己定义（`app.add_url_rule('<路由>','<名称（上文提到的）>',<函数>)`）

如果注册到了蓝图里面那么

```python
login_manager.login_view = "<蓝图名字>.函数名（自定义的名称）"  
```

### 工具

#### login_required

是一个装饰器用来检测是否登录的装饰器闭包函数

例如

```python
@app.get('/admin')
@login_required
def admin_admin():
  ...
```

#### login_user

是用来实现登录操作的`login_user(user)`
里面的参数是User的ORM对象

#### logout_user

是实现退出登录操作的无参数

```python
@app.route('/logout')
@login_required
def logout():
    logout_user()
    return 'Logged out successfully!'
```

### UserMixin

UserMixin的属性：

| 名称               | 作用                                                                                                              |
|------------------|-----------------------------------------------------------------------------------------------------------------|
| is_authenticated | 当用户通过验证时，也即提供有效证明时返回 True 。（只有通过验证的用户会满足 login_required 的条件。）                                                   |
| is_active        | 如果这是一个活动用户且通过验证，账户也已激活，未被停用，也不符合任何你 的应用拒绝一个账号的条件，返回 True。不活动的账号可能不会登入（当然， 是在没被强制的情况下）。                          |
| is_anonymous     | 如果是一个匿名用户，返回 True 。（真实用户应返回 False 。）                                                                            |
| get_id()         | 返回一个能唯一识别用户的，并能用于从 user_loader 回调中加载用户的 unicode 。注意着 必须 是一个unicode —— 如果 ID 原本是 一个 int 或其它类型，你需要把它转换为 unicode 。 |

要简便地实现用户类，你可以从 UserMixin 继承，它提供了对所有这些方法的默认 实现。（虽然这不是必须的。）

### 定义一个User

这次定义User类需要继承`flask_login.UserMixin`这样才能正常登录退出，使用上文的属性

```python
from flask_login import UserMixin

class User(UserMixin，db.Model):
    pass

```

## Flask-Session

作用是可以来操纵session,
最突出的优点是可以把session储存到redis数据库，而且还可以设定过期时间
更好的体验感。

### 下载

::: code-group

```shell[pip]
pip install Flask-Session
```

```shell[poetry]
poetry add Flask-Session
```

:::

### 注册到app

```python
from flask_session import Session

session = Session()
session.init_app(app)
```

### 配置

基本上常用的配置都在下面，
做项目时可以直接复制过去

```python
# Session保存配置
SESSION_TYPE = "redis"
# 开启session签名
SESSION_USE_SIGNER = True
# 指定 Session 保存的 redis
SESSION_REDIS = Redis(host='127.0.0.1', port=6379)
# 设置需要过期
SESSION_PERMANENT = False
# 设置过期时间
PERMANENT_SESSION_LIFETIME = datetime.timedelta(days=10)
```
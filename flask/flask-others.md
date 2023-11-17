---
date: 2023.8.22
title: Flask其他用法
tags:
  - flask
  - web
  - python
description: Flask其他的用法
link: /flask/flask-others.html
---

# Flask请求

## 集成 WSGI 中间件
如果想要在应用中添加一个 WSGI 中间件，那么可以用应用的 wsgi_app 属性来包装。例如，假设需要在 Nginx 后面使用 ProxyFix 中间件，那么可以这样 做:

```python
from werkzeug.middleware.proxy_fix import ProxyFix
app.wsgi_app = ProxyFix(app.wsgi_app)
```
用 `app.wsgi_app` 来包装，而不用 app 包装，意味着 app 仍旧 指向您的 Flask 应用，而不是指向中间件。这样可以继续直接使用和配置 app 。

## 使用 Flask 扩展
扩展是帮助完成公共任务的包。例如 Flask-SQLAlchemy 为在 Flask 中轻松使 用 SQLAlchemy 提供支持。

## 部署到网络服务器
已经准备好部署您的新 Flask 应用了
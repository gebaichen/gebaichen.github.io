---
date: 2023.9.1
title: Flask-CORS
tags:
  - flask
  - flask-cors
  - python
  - web
  - flask插件
description: 介绍什么是ajax跨域问题，并使用flask-cors来解决跨域问题
---

# {{ $frontmatter.title }}

用于处理跨源资源共享 （CORS） 的 Flask 扩展，使跨源 AJAX 成为可能。

## 跨域问题

### 什么是跨域问题

跨域是因为出于浏览器的同源策略限制。**同源策略**
（Sameoriginpolicy）是一种约定，它是浏览器最核心也最基本的安全功能，
如果缺少了同源策略，则浏览器的正常功能可能都会受到影响。
可以说Web是构建在同源策略基础之上的，浏览器只是针对同源策略的一种实现。
同源策略会阻止一个域的javascript脚本和另外一个域的内容进行交互。

所谓**同源**（即指在同一个域）就是两个页面具有相同的协议（protocol），
主机（host）和端口号（port）。

**跨域问题**就是当一个请求url的协议、域名、端口，
三者之间任意一个与当前页面url不同时出现的问题。

### 为什么会有跨域问题

因为我们在开发过过程中使用了**前后端分离**的方式，从而把不同的app部署到不同的服务器，不在同一域名内
就会出现跨域问题

当客户端向服务器端请求ajax服务时，如果客户端和服务器端域名不一致，就会出现跨域问题，ajax报错如下：
`No 'Access-Control-Allow-Origin' header is present on the requested 。`

### 怎样解决跨域问题

使用flask-cors这个包，来解决

## 1.安装

::: code-group

```shell[pip]
pip install Flask-CORS
```

```shell[poetry]
poetry add Flask-CORS
```

:::

## 2.初始化

```python
from flask import Flask
from flask_cors import CORS

app = Flask(__name__)
# r'/*' 是通配符，让本服务器所有的 URL 都允许跨域请求
CORS(app, resources=r'/*')
```

| 参数                   | 类型            | Head字段                             | 说明                        |
|----------------------|---------------|------------------------------------|---------------------------|
| resources            | 	字典、迭代器或字符串   | 	无                                 | 	全局配置允许跨域的API接口           |
| origins              | 	列表、字符串或正则表达式 | 	Access-Control-Allow-Origin       | 	配置允许跨域访问的源，*表示全部允许       |
| methods              | 	列表、字符串       | 	Access-Control-Allow-Methods      | 	配置跨域支持的请求方式， 如：GET、POST  |
| expose_headers       | 	列表、字符串       | 	Access-Control-Expose-Headers     | 	自定义请求响应的Head信息           |
| allow_headers	       | 列表、字符串或正则表达式  | 	Access-Control-Request-Headers    | 	配置允许跨域的请求头               |
| supports_credentials | 	布尔值          | 	Access-Control-Allow-Credentials	 | 是否允许请求发送cookie， false是不允许 |
| max_age	             | 整数、字符串        | 	Access-Control-Max-Age            | 	预检请求的有效时长                |

## 3.在被请求的Response header中加入header
```python
@app.after_request
def func_res(resp):     
    res = make_response(resp)
    res.headers['Access-Control-Allow-Origin'] = '*'
    res.headers['Access-Control-Allow-Methods'] = 'GET,POST'
    res.headers['Access-Control-Allow-Headers'] = 'x-requested-with,content-type'
    return res
```

## 注意
默认情况下，由于安全隐患，跨域提交 Cookie 处于禁用状态。请参阅文档，了解如何启用凭据请求，并确保在执行此操作之前添加某种 CSRF 保护！

如果想使用，操作如下：
```python

from flask import Flask, session
from flask_cors import CORS
 
app = Flask(__name__)
CORS(app, supports_credentials=True)
```

使用`supports_credentials=True`，把supports_credentials参数设置为true就可以启用cookie


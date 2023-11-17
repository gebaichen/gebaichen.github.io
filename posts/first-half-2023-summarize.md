---
date: 2023.8.20
title: 2023上半年总结
tags:
  - 总结
description: 总结上半年接触到的技术和感受
link: /posts/first-half-2023-summarize.html
---

# {{ $frontmatter.title }}

总结上半年接触到的技术和感受

## 接触的技术

### 前端

前端，我尝试了很多东西：

``layui``,``bootstrap``,``jquery``

``vue``,``vite``,``pinia``,``vue-router``,``elements-plus``、``vitepress``,``vuepress``

这些工具的使用，让我感到技术那是更新的真快，19年时我刚接触编程，当时vue还是vue2的版本
这几年我也是看到了技术的更新迭代，只能不停的自学:sob:。

### 后端

后端我主要是学习了flask

#### flask-sqlalchemy

今年flask-sqlalchemy更新，更新了新的查询方法

```python
q = db.select(UserModel)
q = q.filter(...)
users = db.session.execute(q)
```

这种方式写起来很爽，也很易懂

#### flask-limiter
<blockquote>
<p>
<a href="https://flask-limiter.readthedocs.io/en/stable/">https://flask-limiter.readthedocs.io/en/stable/</a>
</p>
</blockquote> 
今年年初我偶然发现了一个特别好的宝藏插件，他可以控制访问频率
我立马加入到了我的项目中
我也会在本站加<a href="/flask/flask-limiter.html">文章</a>来介绍用法

```python
from flask_limiter import Limiter
from flask_limiter.util import get_remote_address
from flask import Flask

limiter = Limiter(
    key_func=get_remote_address,
    # 每天200次，一小时50次
    default_limits=["4800 per day", "200 per hour", "50 per minute", "5 per second"],
    storage_uri=f"redis:redis_password//@redis_host:redis_port/1",
)


def register_limiter(app: Flask):
    limiter.init_app(app)
```

香死我了！！！！！！

#### flask-assets

<blockquote>
<p>
<a href="https://flask-assets.readthedocs.io/en/latest/">https://flask-assets.readthedocs.io/en/latest/</a>
</p>
</blockquote> 

flask-assets 实现对 JavaScript、css 文件打包、压缩
就是因为这个特性，吸引了我。

在访问网站应用程序的时候，浏览器会加载 html 之后再下载很多的 CSS/JS 文件，发送很多的请求。虽然现在浏览器支持并行下载，但也是有限制的，所以这也成为了网页加载速度的一个瓶颈。

flask-assets 可以将多个 css/js 文件合并为一个文件，并且将其删除空白符、换行符、压缩，使其体积变小（将近30%）。并且 flask-assets
还会使用特定的 HTTP Response Header 能够让浏览器缓存这些文件，只有这些文件被修改时才会再次下载，提高程序的性能。

#### pre-commit

<blockquote>
<p>
<a href="https://pre-commit.com/">https://pre-commit.com/</a>
</p>
</blockquote> 

使用 pre-commit 对 Python 代码校验

还有black,isort格式化代码

#### poetry

<blockquote>
<p>
<a href="https://python-poetry.org/">https://python-poetry.org/</a>
</p>
</blockquote>  
作为新发现的包管理器，差不多是 pip + venv，的结合体。可以类似 pip 用于管理第三方模块的管理，但是比 pip 的功能强大许多，同时还包含 venv 的虚拟环境管理功能。大致的功能：

1.管理第三方模块的安装与卸载

2.管理虚拟环境

3.管理虚拟环境的依赖

4.管理打包与发布

5.虚拟环境的依赖

## 我的项目

### 个人项目-曲奇论坛

耗费了我几乎两年时间的曲奇论坛，里面的技术也不是最新的，要改那是个大工程，所以我决定不改了。
这个项目绝对是我做的最好的一个项目

### 个人项目-学生信息分数管理系统

<blockquote>
<p>
<a href="https://gitee.com/ge-baichen_admin/quqistu.git">https://gitee.com/ge-baichen_admin/quqistu.git</a>
</p>
</blockquote> 
他是基于角色用户管理系统（rabc）做的,<a href="https://gitee.com/ge-baichen_admin/quqistu/blob/master/readme.md">介绍</a>

### 个人博客文档网站

<blockquote>
<p>
就是<a href="/">本站</a>
</p>
</blockquote> 

有一天在github看到了https://github.com/airene/vitepress-blog-pure 这个项目，
我也想做一个这样的，我就开始自己琢磨<a href="https://vitepress.dev/">vitepress</a>  
感觉这个还挺好用的，就建了本站

## 感受

这下半年也要过去了，我感觉就是时间真快，要学的内容越来越多，就一个vue的生态就不少。

这其实让我想起了一句话``"程序员的能力与他写过的代码是正比的。"``,还是要努力尽力迎接下一年的到来
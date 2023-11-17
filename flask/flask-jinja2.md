---
date: 2023.8.22
title: Flask模板（jinja2）
tags:
  - flask
  - web
  - python
  - jinja2
description: Flask模板（jinja2）基本使用方法，
link: /flask/flask-jinja2.html
---

<script setup>
const dot = '{{ ... }}';
const format_price = '{{ format_price(0.33) }}';
</script>

# Flask模板（jinja2）

Flask 使用 text 作为默认模板引擎。你完全可以使用其它模板引擎。但是 不管你使用哪种模板引擎，都必须安装 text 。因为使用
text 可以让 Flask 使用更多依赖于这个模板引擎的扩展。

本文只是简单介绍如何在 Flask 中使用 text 。如果要详细了解这个模板引
擎的语法，请查阅 [text](https://jinja.palletsprojects.com/templates/) 模板官方文档 。

## 模板

### 什么是模板

网站的主页会有一个欢迎用户的标题。虽然目前的应用程序还没有实现用户概念，但这不妨碍我使用一个Python字典来**模拟**一个用户，如下所示：

```python
user = {'username': 'quqi'}
```

创建模拟对象是一项实用的技术，它可以让你专注于应用程序的一部分，而无需为系统中尚不存在的其他部分分心。
在设计应用程序主页的时候，我可不希望因为没有一个用户系统来分散我的注意力，因此我使用了模拟用户对象，来继续接下来的工作。

#### 模板基本用法

原先的视图函数返回简单的字符串，我现在要将其扩展为包含完整HTML页面元素的字符串，如下所示：

```python
from flask import Flask

app = Flask(__name__, template_folder='templates')


@app.route('/')
@app.route('/index')
def index():
    user = {'username': 'quqi'}
    return f'''
    <html>
        <head>
            <title>个人主页-{user['username']}</title>
        </head>
        <body>
            <h1>Hello, {user['username']}!</h1>
        </body>
    </html>
    '''
```

利用上述的代码更新这个视图函数，然后再次在浏览器打开它的URL看看结果。

但是上面的案例有一个很大的缺陷——返回HTML的方式并不友好。如果视图变得非常多，就更加麻烦。

#### 创建模板

如果我说这个函数返回HTML的方式并不友好的话，你可能会觉得诧异。设想一下，当这个视图函数中的用户和博客不断变化时，里面的代码将会变得多么的复杂。应用的视图函数及其关联的URL也会持续增长。如果哪天我决定更改这个应用的布局，那就不得不更新每个视图函数的HTML字符串。显然，随着应用的扩张，这种方式完全不可行。

将应用程序的后台逻辑和网页布局划分开来，你不觉得更容易组织管理吗？甚至你可以聘请一位Web设计师来设计一个杀手级的网站前端，而你只需要用Python编写后台应用逻辑。

模板有助于实现页面展现和业务逻辑之间的分离。 在Flask中，模板被编写为单独的文件，存储在应用程序包内的**templates**文件夹中。
在确定你在**microblog**目录后，创建一个存储模板的目录：

```txt
(venv) $ mkdir templates
```

在下面可以看到你的第一个模板，它的功能与上面的`index()`视图函数返回的HTML页面相似。 把这个文件写在
**app/templates/index.html**中：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <title>个人主页 - {{ username }}</title>
</head>

<body>
<h1>Hello, {{ username }}!</h1>
</body>
</html>
```

这个HTML页面看起来非常简单，唯一值得关注的地方是 `{{ dot }}`。`{{ dot }}` 包含的内容是动态的，只有在运行时才知道具体表示成什么样子。

网页渲染转移到HTML模板之后，视图函数就能被简化：

```python
@app.route('/view1')
def view1():
    username = 'quqi'
    return render_template('view1.html', username=username)
```

看起来好多了吧？ 赶紧试试这个新版本的应用程序，看看模板是如何工作的。 在浏览器中加载页面后，你需要从浏览器查看 HTML
源代码并将其与原始模板进行比较。

将模板转换为完整的 HTML 页面的操作称为**渲染**。 为了渲染模板，需要从Flask框架中导入一个名为`render_template()` 的函数。
该函数需要传入模板文件名和模板参数的变量列表，并返回模板中所有占位符都用实际变量值替换后的字符串结果。

`render_template()` 函数调用Flask框架原生依赖的 [text](http://jinja.pocoo.org/) 模板引擎。 text
用 `render_template()` 函数传入的参数中的相应值替换 `{{dot}}` 块。

#### 模板的使用

设置 templates 文件夹属性以便能够在代码中有智能提示

设置 html 中的模板语言，以便在 html 有智能提示

### 模板语法

利用 text 这样的模板引擎，我们可以将一部分的程序逻辑放到模板中去。简单地说，我们可以在模板中使用Python语句和表达式来操作数据的输出。但需要注意的是，text并不⽀持所有Python语法。而且出于效率和
代码组织等方面的考虑，我们应该适度使用模板，仅把和输出控制有关的逻辑操作放到模板中。

text允许你在模板中使用大部分Python对象，比如字符串、列表、字典、元组、整型、浮点型、布尔值。它⽀持基本的运算符号（+、-、*
、/等）、比较符号（比如==、！=等）、逻辑符号（and、or、not和括号）以及in、is、None和布尔值（True、False）。

text 的语法和 Python 大致相同，你在后面会陆续接触到一些常见的用法。在模板里，你需要添加特定的定界符将 text
语句和变量标记出来，下面是三种常用的定界符：

- ``{{ dot }}``用来标记变量。
- ```{% ... %}``` 用来标记语句，比如 if 语句，for 语句等。
- ```{# ... #}``` 用来写注释。

模板中使用的变量需要在渲染的时候传递进去

#### 使用变量

代码中传入字符串，列表，字典到模板中

```python
@app.route('/args')
def args():
    my_str = 'hello'
    my_int = 10
    my_arr = [1, 2, 3, 4, 5]
    my_dict = {
        "name": "正心",
        'age': 18
    }
    return render_template(
        '0103args.html',
        my_str=my_str,
        my_int=my_int,
        my_arr=my_arr,
        my_dict=my_dict,
    )
```

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>模板变量</title>
</head>
<body>
<h1>我的模板变量</h1>
<div>str：{{ my_str }}</div>
<div>int：{{ my_int }}</div>
<div>arr：{{ my_arr }}</div>
<div>dict：{{ my_dict }}</div>
</body>
</html>
```

```html
<h1>相关运算</h1>
<div>str + str：{{ my_str + ' world !' }}</div>
<div>int + int：{{ my_int + 100}}</div>
<div>arr[1]：{{ my_arr[1] }}</div>
<div>arr[1:]：{{ my_arr[1:] }}</div>
<div>dict['name']：{{ my_dict['name'] }}</div>
<div>my_dict.items()：{{ my_dict.items() }}</div>

```

#### 条件语句

在渲染过程中使用实际值替换占位符，只是text在模板文件中支持的诸多强大操作之一。 模板也支持在`{%...％}`块内使用控制语句。
**temp_demo3.html**模板的下一个版本添加了一个条件语句：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    {% if username %}
    <title>个人主页 - {{ username }}</title>
    {% else %}
    <title>欢迎来到个人主页!</title>
    {% endif %}
</head>
<body>
<h1>Hello, {{ username }}!</h1>
</body>
</html>

```

现在，模板变得聪明点儿了，如果视图函数忘记给渲染函数传入一个名为 `title` 的关键字参数，那么模板将显示一个默认的标题，而不是显示一个空的标题。
你可以通过在视图函数的 `render_template()` 调用中去除`title`参数来试试这个条件语句是如何生效的。

```python
@app.route('/if')
def func_if():
    # 如果访问时携带用户名显示 个人主页-用户名
    # 如果没有携带用户名显示 欢迎来到个人主页
    username = request.args.get('username')
    return render_template('0202if.html', username=username)

```

#### 循环

登录后的用户可能想要在主页上查看其他用户的最新动态，针对这个需求，我现在要做的是丰富这个应用来满足它。

我将会故技重施，使用模拟对象的把戏来创建一些模拟用户和动态：

```python
@app.route('/loop')
def loop():
    my_array = ['张三', '李四', '王五']
    return render_template('view3.html',
                           username=my_array)

```

我使用了一个列表来表示用户。然后将列表的发送给模板进行渲染

在模板方面，我必须解决一个新问题。 用户动态列表拥有的元素数量由视图函数决定。
那么模板不能对有多少个用户动态进行任何假设，因此需要准备好以通用方式渲染任意数量的用户动态。

text提供了 `for` 控制结构来应对这类问题：

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>循环</title>
</head>
<body>
<h3>列表取值</h3>
<div>我爱吃 {{ arr[0] }}!</div>
<div>我爱吃 {{ arr[1] }}!</div>
<div>我爱吃 {{ arr[2] }}!</div>
<h3>循环遍历</h3>
{% for i in arr %}
<div>我爱吃 {{ i }}!</div>
{% endfor %}
</body>
</html>

```

大道至简，对吧？ 玩玩这个新版本的应用程序，一定要逐步添加更多的内容到用户列表，看看模板如何调度以展现视图函数传入的所有用户动态。

在一个 for 循环块中你可以访问这些特殊的变量:

| 变量             | 描述                   |
|----------------|----------------------|
| loop.index     | 当前循环迭代的次数（从 1 开始）    |
| loop.index0    | 当前循环迭代的次数（从 0 开始）    |
| loop.revindex  | 到循环结束需要迭代的次数（从 1 开始） |
| loop.revindex0 | 到循环结束需要迭代的次数（从 0 开始） |
| loop.first     | 如果是第一次迭代，为 True 。    |
| loop.last      | 如果是最后一次迭代，为 True 。   |
| loop.length    | 序列中的项目数。             |
| loop.cycle     | 在一串序列间期取值的辅助函数。      |

在循环内部,你可以使用一个叫做 loop 的特殊变量来获得关于 for 循环的一些信息

比如：要是我们想知道当前被迭代的元素序号，并模拟 Python 中的 enumerate 函数做的事情，则可以使用loop 变量的 index 属性,例如:

```html
<h3>循环特殊变量</h3>
{% for post in arr %}
<h1>{{ loop.index }}, {{ post }}</h1>
{% endfor %}

```

### 过滤器

在 text 中，过滤器（filter）是一些可以用来修改和过滤变量值的特殊函数，过滤器和变量用一个竖线（管道符号）隔开，需要参数的过滤器可以像函数一样使用括号传递。

有时候我们不仅仅只是需要输出变量的值，我们还需要修改变量的显示，甚至格式化、运算等等，而在模板中是不能直接调用 Python
中的某些方法，那么这就用到了过滤器。

下面是一个对 name 变量使用 title 过滤器的例⼦：

```
{{ name|title }}
```

这会将 name 变量的值标题化，相当于在 Python 里调用 name.title()。

**使用方式：**

过滤器的使用方式为：变量名 | 过滤器。

```python
{{variable | filter_name(*args)}}

```

如果没有任何参数传给过滤器,则可以把括号省略掉

```python
{{variable | filter_name}}

```

- 如：`variable`，这个过滤器的作用：把变量 variable 的值的首字母转换为大写，其他字母转换为小写

#### 链式调用

在 text 中，过滤器是可以支持链式调用的，示例如下：

```python
{{ "hello world" | reverse | upper }}

```

#### 字符串操作

safe：禁用转义

```python
<p>{{ '<b>hello</b>' | safe }}</p>

```

truncate: 字符串截断

```python
<p>{{ 'hello every one' | truncate(9)}}</p>

```

striptags：渲染之前把值中所有的HTML标签都删掉

```python
<p>{{ '<em>hello</em>' | striptags }}</p>

```

capitalize：把变量值的首字母转成大写，其余字母转小写

```python
<p>{{ 'hello' | capitalize }}</p>

```

lower：把值转成小写

```python
<p>{{ 'HELLO' | lower }}</p>

```

upper：把值转成大写

```python
<p>{{ 'hello' | upper }}</p>

```

title：把值中的每个单词的首字母都转成大写

```python
<p>{{ 'hello' | title }}</p>

```

reverse：字符串反转

```python
<p>{{ 'olleh' | reverse }}</p>

```

format：格式化输出

```python
<p>{{ '%s is %d' | format('name',17) }}</p>

```

#### 列表操作

first：取第一个元素

```python
<p>{{ [1,2,3,4,5,6] | first }}</p>

```

last：取最后一个元素

```python
<p>{{ [1,2,3,4,5,6] | last }}</p>

```

length：获取列表长度

```python
<p>{{ [1,2,3,4,5,6] | length }}</p>

```

sum：列表求和

```python
<p>{{ [1,2,3,4,5,6] | sum }}</p>

```

sort：列表排序

```
<p>{{ [6,2,3,1,5,4] | sort }}</p>

```

### 宏

使用宏之前代码

```html

<form>
    <label>用户名：</label><input type="text" name="username"/><br/>
    <label>身份证号：</label><input type="text" name="idcard"/><br/>
    <label>密码：</label><input type="password" name="password"/><br/>
    <label>确认密码：</label><input type="password" name="password2"/><br/>
    <input type="submit" value="注册"/>
</form>
```

定义宏

```html
{#定义宏，相当于定义一个函数，在使用的时候直接调用该宏，传入不同的参数就可以了#}
{% macro input(label="", type="text", name="", value="") %}
<label>{{ label }}</label><input type="{{ type }}" name="{{ name }}" value="{{ value }}"/>
{% endmacro %}

```

使用宏

```html

<form>
    {{ input("用户名：", name="username") }}<br/>
    {{ input("身份证号：", name="idcard") }}<br/>
    {{ input("密码：", type="password", name="password") }}<br/>
    {{ input("确认密码：", type="password", name="password2") }}<br/>
    {{ input(type="submit", value="注册") }}
</form>

```

对宏(macro)的理解：

- 1.把它看作 text 中的一个函数，它会返回一个模板或者 HTML 字符串
- 2.为了避免反复地编写同样的模板代码，出现代码冗余，可以把他们写成函数以进行重用
- 3.需要在多处重复使用的模板代码片段可以写入单独的文件，再包含在所有模板中，以避免重复

定义宏

```python
{% macro input(name,value='',type='text') %}
    <input type="{{type}}" name="{{name}}"
        value="{{value}}" class="form-control">
{% endmacro %}

```

调用宏

```python
{{ input('name'， value='zs')}}

```

这会输出

```python
<input type="text" name="name" value="zs" class="form-control" />

```

把宏单独抽取出来，封装成html文件，其它模板中导入使用，文件名可以自定义macro.html

```python
{% macro function(type='text', name='name', value='张三') %}
<input type="{{type}}" name="{{name}}" value="{{value}}" class="form-control" />
{% endmacro %}

```

在其它模板文件中先导入，再调用

```python
{% import 'macro.html' as func %}
{{ func.function() }}

```

### 模板的继承

绝大多数Web应用程序在页面的顶部都有一个导航栏，其中带有一些常用的链接，例如编辑配置文件，登录，注销等。我可以轻松地用HTML标记语言将导航栏添加到 `index.html`
模板上，但随着应用程序的增长，我将需要在其他页面重复同样的工作。尽量不要编写重复的代码，这是一个良好的编程习惯，毕竟我真的不想在诸多HTML模板上保留同样的代码。

text 有一个模板继承特性，专门解决这个问题。从本质上来讲，就是将所有模板中相同的部分转移到一个基础模板中，然后再从它继承过来。

所以我现在要做的是定义一个名为 `base.html` 的基本模板，其中包含一个简单的导航栏，以及我之前实现的标题逻辑。 您需要在模板文件
*templates/base.html* 中编写代码如下：

```python
<!DOCTYPE html>
<html lang="en">
<head>
    {% if username %}
        <title>个人主页 - {{ username }}</title>
    {% else %}
        <title>欢迎来到个人主页</title>
    {% endif %}
</head>
<body>

{% block content %}{% endblock %}

</body>
</html>

```

在这个模板中，我使用 `block` 控制语句来定义派生模板可以插入代码的位置。 *block* 被赋予一个唯一的名称，派生的模板可以在提供其内容时进行引用。

通过从基础模板 *base.html* 继承 HTML 元素，我现在可以简化模板 *index.html* 了：

```python
{% extends "base.html" %}

{% block content %}
    {% for i in username %}
            <h1>Hello, {{ i }}!</h1>
    {% endfor %}
{% endblock %}

```

自从基础模板 *base.html* 接手页面的布局之后，我就可以从 *index.html* 中删除所有这方面的元素，只留下内容部

分。 `extends` 语句用来建立了两个模板之间的继承关系，这样 text 才知道当要求呈现 `index.html`
时，需要将其嵌入到 `base.html` 中。 而两个模板中匹配的`block`语句和其名称 `content` ，让text知道如何将这两个模板合并成在一起。
现在，扩展应用程序的页面就变得极其方便了，我可以创建从同一个基础模板*base.html*继承的派生模板，这就是我让应用程序的所有页面拥有统一外观布局而不用重复编写代码的秘诀。

模板继承是为了重用模板中的公共内容。一般Web开发中，继承主要使用在网站的顶部菜单、底部。这些内容可以定义在父模板中，子模板直接继承，而不需要重复书写。

- 标签定义的内容

```python
{% block top %} {% endblock %}

```

- 相当于在父模板中挖个坑，当子模板继承父模板时，可以进行填充。
- 子模板使用 extends 指令声明这个模板继承自哪个模板
- 父模板中定义的块在子模板中被重新定义，在子模板中调用父模板的内容可以使用 super()

#### 父模板

- base.html

```python
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    {% if title %}
        <title>个人主页 - {{ username }}</title>
    {% else %}
        <title>欢迎来到个人主页</title>
    {% endif %}
    <style>
        div {
            border: 2px solid;
            height: 100px;

        }

        .nav {
            height: 40px;
        }

        .top {
            background-color: pink;
        }

        .content {
            background-color: pink;
        }

        .bottom {
            background-color: pink;
        }
    </style>
</head>
<body>
{% block top %}
    <div class="top">base 顶部菜单</div>
{% endblock top %}
<br>
{% block content %}
    <dic class="content">base 内容部分</dic>
{% endblock content %}
<br>
{% block bottom %}
    <div class="bottom">base 底部</div>
{% endblock bottom %}
</body>
</html>

```

#### 子模板

- extends指令声明这个模板继承自哪

```python
{% extends 'base.html' %}
{% block content %}
 需要填充的内容
{% endblock content %}

```

- 模板继承使用时注意点：
    - 不支持多继承
    - 为了便于阅读，在子模板中使用 extends 时，尽量写在模板的第一行。
    - 不能在一个模板文件中定义多个相同名字的 block 标签。
    - 当在页面中使用多个 block 标签时，建议给结束标签起个名字，当多个 block 嵌套时，阅读性更好。

#### 包含

text 模板中，除了宏和继承，还支持一种代码重用的功能，叫包含(Include)。它的功能是将另一个模板整个加载到当前模板中，并直接渲染。

- templates/header.html 的使用

```python
{% include 'header.html' %}

```

文件：header.html

```
<div class="nav">
    头部部分
</div>

```

包含在使用时，如果包含的模板文件不存在时，程序会抛出 **TemplateNotFound** 异常，可以加上 `ignore missing`
关键字。如果包含的模板文件不存在，会忽略这条include语句。

- include 的使用加上关键字ignore missing

```python
{% include 'header.html' ignore missing %}

```

**小结**

- 宏(Macro)、继承(Block)、包含(include)均能实现代码的复用。
- 继承(Block)的本质是代码替换，一般用来实现多个页面中重复不变的区域。
- 宏(Macro)的功能类似函数，可以传入参数，需要定义、调用。
- 包含(include)是直接将目标模板文件整个渲染出来。

在模板中，可能会遇到以下情况：

- 多个模板具有完全相同的顶部和底部内容
- 多个模板中具有相同的模板代码内容，但是内容中部分值不一样
- 多个模板中具有完全相同的 html 代码块内容

像遇到这种情况，可以使用 text 模板中的 宏、继承、包含来进行实现

### 静态文件

静态文件（static files）和我们的模板概念相反，指的是内容不需要动态生成的文件。比如图片、CSS 文件和 JavaScript 脚本等。

python代码

```
@app.route('/ex_static')
def ex_static():
    name = '正心'
    messages = [
        {'title': '有位非常漂亮的女同事，有天起晚了没有时间化妆便急忙冲到公司。结果那天她被记旷工了……'},
        {'title': '失恋算个啥？轻轻的，你走吧，千万别后悔，因为只要你一挥手，就会发现，已经有那等不及的意中人，正偷偷摸摸拉你的手！'},
        {'title': '世界上最有钱的人是奥特曼，因为所有取款机上都印着他名字的缩写“ATM” 。'},
        {'title': '所谓爱情也不过是：看上了，追求了，好上了，开心了；不久后，腻了，吵了，淡了，散了。'},
        {'title': '据说失眠的同学盯着看十分钟就能睡着了。'},
        {'title': '才知道，朋友就像人民币，有真、也有假，可惜我不是验钞机。'},
        {'title': '回想这几年，尝尽辛酸艰难。从一开始什么都没有到30万，从30万到200万，从200万、300万到现在的1300万！不是炫耀，我只是想通过我自己的经历告诉我的朋友们——手机像素越高，拍的照片越清晰！'},
    ]
    return render_template('static.html', name=name, messages=messages)

```

html代码

```html
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <title>Title</title>
    {# 生成静态文件 URL #}
    <link rel="stylesheet" href="/static/style.css">
</head>
<body>
<h2>
    {# 添加图片#}
    <img class="user_ico" src="/static/a.jpg">
    正心-语录
</h2>
<p>{{ messages|length }}条留言</p>
<ul class="message-list">
    {% for msg in messages %}
    <li>{{ msg['title'] }}</li>
    {% endfor %}
</ul>
</body>
</html>

```

static/style.css：定义页面样式

```css
body {
    margin: auto;
    max-width: 580px;
    font-size: 14px;
    font-family: Helvetica, Arial, sans-serif;
}

.user_ico {
    width: 40px;
}

.message-list {
    list-style-type: none;
    padding: 0;
    margin-bottom: 10px;
    box-shadow: 0 2px 5px 0 rgba(0, 0, 0, 0.16), 0 2px 10px 0 rgba(0, 0, 0, 0.12);
}

.message-list li {
    padding: 12px 24px;
    border-bottom: 1px solid #ddd;
}

```

#### 生成静态文件 URL

在 HTML 文件里，引入这些静态文件需要给出资源所在的 URL。为了更加灵活，这些文件的 URL 可以通过 Flask 提供的 `url_for()`
函数来生成。

我们学习过 `url_for()` 函数的用法，传入端点值（视图函数的名称）和参数，它会返回对应的
URL。对于静态文件，需要传入的端点值是 `static`，同时使用`filename` 参数来传入相对于 static 文件夹的文件路径。

**提示** 在 Python 脚本里，`url_for()` 函数需要从 `flask` 包中导入，而在模板中则可以直接使用，因为 Flask
把一些常用的函数和对象添加到了模板上下文（环境）里。

**由 url_for 生成静态url**

templates/static.html：引入 CSS 文件

```html

<link rel="stylesheet" href="{{ url_for('static', filename='style.css') }}" type="text/css">

```

最后要为对应的元素设置 `class` 属性值，以便和对应的 CSS 定义关联起来：

*templates/static.html：添加 class 属性*

```html
<img alt="user_ico" class="user_ico" src="{{ url_for('static', filename='a.jpg') }}">

```

花括号部分的调用会返回 `/static/a.jpg`。

最终的页面如下图所示：

#### 自定义错误页面

当程序返回错误响应时，会渲染一个默认的错误页面。默认的错误页面太简单了，而且和其他页面的风格不符，
导致用户看到这样的页面时往往会不知所措。我们可以自定义错误页面。

错误处理函数和视图函数很相似，返回值将会作为响应的主体。并在其中为最常见的404和500错误创建了模板文件，表示404 页面的
404.html 模板内容。

> 404页面模板
>

```
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
        <title>网页没有被找到</title>
</head>
<body>
<h1>页面不见了</h1>
<p>你已经迷失了回家的方向....</p>
</body>
</html>

```

错误处理函数需要附加app.errorhandler()装饰器，并传入错误状态
码作为参数。当发生错误时，对应的错误处理函数会被调用，它的返回值会作为错误响应的主体。代码清单3-13是用来捕捉404错误的错误处理器。

> 404错误处理器
>

```
from flask import Flask, render_template, flash

app = Flask(__name__)
app.secret_key = '123456'


@app.errorhandler(404)
def error404(e):
    flash('请重新刷新页面试试')
    flash('刷新也没用？检查一下代码哪里错了')
    flash('代码没错？重启pycharm试试')
    flash('重启pycharm没有？重启电脑试试')
    flash('重启电脑没用？重装系统试试')
    return render_template('404.html'), 404


```

错误处理函数接收异常对象作为参数，内置的异常对象提供了下列常用属性，如表3-7所示

> Werkzeug 内置的 HTTP 异常类的常用属性
>

| 属 性             | 说 明                                                 |
|-----------------|-----------------------------------------------------|
| **code**        | 状态码                                                 |
| **name**        | 原因短语                                                |
| **description** | 错误描述，另外使用 get_description() 方法还可以获取 HTML 格式的错误 描述代码 |

### 自定义过滤器

如果内置的过滤器不能满足你的需要，还可以添加自定义过滤器。使用 app.template_filter（）装饰器可以注册自定义过滤器

- 通过Flask应用对象的 **add_template_filter** 方法
- 通过装饰器来实现自定义过滤器

**重要：自定义的过滤器名称如果和内置的过滤器重名，会覆盖内置的过滤器。**

#### 需求：添加列表反转的过滤器

##### 方式一

通过调用应用程序实例的 add_template_filter 方法实现自定义过滤器。该方法第一个参数是函数名，第二个参数是自定义的过滤器名称：

```python
@app.template_filter('sort_reverse')
def sort_reverse(li):
    # 通过原列表创建一个新列表
    temp_li = list(li)
    # 将新列表进行返转
    temp_li.reverse()
    return temp_li

```

##### 方式二

用装饰器来实现自定义过滤器。装饰器传入的参数是自定义的过滤器名称。

```python
def sort_reverse(li):
    # 通过原列表创建一个新列表
    temp_li = list(li)
    # 将新列表进行返转
    temp_li.reverse()
    return temp_li

app.add_template_filter(do_listreverse, 'lireverse')

```

在 html 中使用该自定义过滤器

```html
<br/> my_array 原内容：{{ [3, 4, 2, 1, 7, 9]  }}
<br/> my_array 反转：{{ [3, 4, 2, 1, 7, 9]  | sort_reverse }}

```

运行结果

```
my_array 原内容：[3, 4, 2, 1, 7, 9] 
my_array 反转：[9, 7, 1, 2, 4, 3]

```

附录：

text常用内置过滤器

| 过滤器                                                                        | 说 明                                                               |
|----------------------------------------------------------------------------|-------------------------------------------------------------------|
| default (value, default_value=u", boolean=False)                           | 设置默认值，默认值作为参数传入，别名为d                                              |
| escape(s)                                                                  | 转义HTML文本，别名为e                                                     |
| first (seq)                                                                | 返回序列的第一个元素                                                        |
| last(seq)                                                                  | 返回序列的最后一个元素                                                       |
| length(object)                                                             | 返回变量的长度                                                           |
| random(seq)                                                                | 返回序列中的随机元素                                                        |
| safe( value)                                                               | 将变量值标记为安全，避免转义                                                    |
| trim(value)                                                                | 清除变量值前后的空格                                                        |
| max(value, case_sensitive=False, attribute=None)                           | 返回序列中的最大值                                                         |
| min(value, case_sensitive=False, attribute=None)                           | 返回序列中的最小值                                                         |
| unique(value, case_sensitive=F alse, attribute=None)                       | 返回序列中的不重复的值                                                       |
| striptags(value)                                                           | 清除变量值内的HTML标签                                                     |
| urlize (value, trim_url_limit=None, nofbllow=False, target=None, rel=None) | 将URL文本转换为可单击的HTML链接                                               |
| wordcount (s)                                                              | 计算单词数量                                                            |
| tojson(value, indent=None)                                                 | 将变量值转换为JSON格式                                                     |
| truncate(s, length=255, killwords=False,end-...', leeway=None)             | 截断字符串，常用于显示文章摘要，length参数设置截断的长度, killwords参数设置是否截断单词，end参数设置结尾的符号 |

这里只列出了一部分常用的过滤器，完整的列表请 [访问]( http://jinja.pocoo.org/docs/2.10/templates/#builtin-filters) 查看。

## Jinja 设置

在 Flask 中， text 默认配置如下：

- 当使用 render_template() 时，扩展名为 .html 、 .htm 、 .xml 、 .xhtml 和 .svg 的模 板中开启自动转义。

- 当使用 render_template_string() 时，字符 串开启自动转义。

- 在模板中可以使用 {% autoescape %} 来手动设置是否转义。

- Flask 在 text 环境中加入一些全局函数和辅助对象，以增强模板的功 能。

## 标准环境

缺省情况下，以下全局变量可以在 text 模板中使用：

- config（ `flask.Flask.config` ）当前配置对象
- request
  当前请求对象（ `flask.request` ）。 在没有活动请求环境情况下渲染模板时，这个变量不可用。

- session
  当前会话对象（ `flask.session` ）。 在没有活动请求环境情况下渲染模板时，这个变量不可用。

- g
  请求绑定的全局变量（ `flask.g` ）。 在没有活动请求环境情况下渲染模板时，这个变量不可用。

- `url_for()`
  `flask.url_for()` 函数。

- `get_flashed_messages()`
  `flask.get_flashed_messages()` 函数。

### Jinja 环境行为

这些添加到环境中的变量不是全局变量。与真正的全局变量不同的是这些变 量在已导入的模板的环境中是不可见的。这样做是基于性能的原因，同时也
考虑让代码更有条理。

那么意义何在？假设你需要导入一个宏，这个宏需要访问请求对象，那么你 有两个选择：

- 显式地把请求或都该请求有用的属性作为参数传递给宏。

- 导入`“ with context ”`宏。

导入方式如下：

```
{% from '_helpers.html' import my_macro with context %}
```

## 控制自动转义

自动转义是指自动对特殊字符进行转义。特殊字符是指 HTML （ 或 XML 和 XHTML ）中的 `&` 、 `>` 、 `<` 、 `"` 和 `'` 。因为这些特殊
字符代表了特殊的意思，所以如果要在文本中使用它们就必须把它们替换为 “实体”。如果不转义，那么用户就无法使用这些字符，而且还会带来安全问
题。

有时候，如需要直接把 HTML 植入页面的时候，可能会需要在模板中关闭自动 转义功能。这个可以直接植入的 HTML 一般来自安全的来源，例如一个把标记
语言转换为 HTML 的转换器。

有三种方法可以控制自动转义：

- 1.在 Python 代码中，可以在把 HTML 字符串传递给模板之前，用 Markup 对象封装。一般情况下推荐使用这个方法。

- 2.在模板中，使用 |safe 过滤器显式把一个字符串标记为安全的 HTML （例如： `myvariable|safe` ）。

- 3.临时关闭整个系统的自动转义。

在模板中关闭自动转义系统可以使用 `{% autoescape %}` 块：

```
{% autoescape false %}
<p>autoescaping is disabled here
<p>{{ will_not_be_escaped }} 
{% endautoescape %}
```

在这样做的时候，要非常小心块中的变量的安全性。

## 注册过滤器

有两种方法可以在 text 中注册你自己的过滤器。要么手动把它们放入应用 的 jinja_env 中，要么使用 `template_filter()` 装饰器。

下面两个例子功能相同，都是倒序一个对象:

```python
@app.template_filter('reverse')
def reverse_filter(s):
    return s[::-1]

def reverse_filter(s):
    return s[::-1]
app.jinja_env.filters['reverse'] = reverse_filter
```

装饰器的参数是可选的，如果不给出就使用函数名作为过滤器名。一旦注册完 成后，你就可以在模板中像 text 的内建过滤器一样使用过滤器了。例如，
假设在环境中你有一个 名为 mylist 的 Pyhton 列表:

```
{% for x in mylist | reverse %}
{% endfor %}
```

环境处理器
环境处理器的作用是把新的变量自动引入模板环境中。环境处理器在模板被渲 染前运行，因此可以把新的变量自动引入模板环境中。它是一个函数，返回值
是一个字典。在应用的所有模板中，这个字典将与模板环境合并:

```
@app.context_processor
def inject_user():
    return dict(user=g.user)
```

上例中的环境处理器创建了一个值为 `g.user` 的 user 变量，并把这个变 量加入了模板环境中。这个例子只是用于说明工作原理，不是非常有用，因为
在模板中， g 总是存在的。

传递值不仅仅局限于变量，还可以传递函数（ Python 提供传递函数的功能）:

```
@app.context_processor
def utility_processor():
    def format_price(amount, currency="€"):
        return f"{amount:.2f}{currency}"
    return dict(format_price=format_price)
```

上例中的环境处理器把 `format_price` 函数传递给了所有模板:

`{{ format_price }}`
你还可以把 `format_price` 创建为一个模板过滤器（参见 注册过滤器 ），这里只是演示如何在一个环境处理器中传递 函数。

## 总结

jinja2模板虽然很好，但是不要过度依赖，因为前后端不分离，和半分离
不是全栈的发展趋势，而发展趋势是**前后端分离**

然后实际开发中jinja2模板并不是最好的py 全栈模板
最好用的是mako模板，mako模板可以使用python代码这就减轻了不少负担
但是配置到flask应用却很麻烦，所以基本使用jinja2，包括我也喜欢用jinja2
，习惯了

### 全栈趋势：前后端分离

这种方式，开发的效率高，前端后端程序员至少两个，只需要有统一的端口。

并且前后端分离特别适合使用MVVM框架（vue,react）俗称大前端，拥有更好看的界面，
更高的开发效率。

前后端分开部署在两个服务器可以让出很多的性能空间，可以有效解决高并发问题


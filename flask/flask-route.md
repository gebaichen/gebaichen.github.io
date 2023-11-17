---
date: 2023.8.22
title: Flask路由
tags:
  - flask
  - web
  - python
description: flask路由的使用
link: /flask/flask-route.html
---

# Flask路由

> 注：flask请求方法在本文有演示，如果想详细了解可以看[Flask请求](/flask/flask-request.html)

## 老方法

### 建议

> 建议：先学习老方法，掌握其中的逻辑和用法，在去看新用法，因为新用法的底层和老方法一样
>

### URL与端点（路由）

视图函数的返回值可以自由修改，返回值作为响应的主体，默认会被浏览器作为 HTML 格式解析，所以可以直接返回一个 HTML 格式的内容：

```python
@app.route('/')
def index():
    return "hello, I'm quqi"

```

保存修改后，只需要在浏览器里刷新页面，你就会看到页面上的内容也会发生变化。

### app.route 的参数

可以自由修改传入 `app.route` 装饰器里的 URL 规则字符串，来修改访问的网站地址，但要注意以斜线 `/` 作为开头。例如：

```python
@app.route('/home')
def home():
    return "I'm quqi"

```

### 绑定多个路由

一个函数也可以绑定多个视图url,则需要多个装饰器来操作如下：

```python
@app.route('/index')
@app.route('/user')
def user():
    return 'Welcome to flask !'

```

现在无论是访问

http://127.0.0.1:5000/user

http://127.0.0.1:5000/index 都可以看到返回的内容。

### 接收传参

在前面，我们之所以把传入 `app.route` 装饰器的参数称为 URL 规则，是因为我们也可以在 URL
里定义变量部分。例如下面这个视图函数会处理所有类似 `/user/<name>` 的请求：

```python-vue
@app.route('/user/<user>')
def user_page(user):
    return f'user:{user.name}'

```

不论你访问

http://127.0.0.1:5000/user/quqi

http://127.0.0.1:5000/user/xiaoquqi

http://127.0.0.1:5000/user/

都会触发这个函数。通过下面的方式，我们也可以在视图函数里获取到这个变量值：

```python-vue
@app.route('/user/<user>')
def user_page(user):
    return 'User: {}'.format(user.name)

```

如何在一个在一个视图函数中如何访问另外一个视图函数？

-
    1. 求情目标视图的 url

    - 缺点：一旦 url 变动就会出错

-
    2. 根据函数名去请求 url

    - 优点： 函数名一般不会修改

> 将来如果修改了 `URL` ，但没有修改该 `URL` 对应的函数名，就不用到处去替换 `URL` 了。

### URL处理（转化器）

从前面的路由列表中可以看到，除了 /hello ，这个程序还包含许多 URL 规则，例如和 send 端点对应的 /send/<mobile_number> 。

现在请尝试访问 http://127.0.0.1:5000/send/mobile_number ，在URL中加入一个数字用于当做路由转化器。URL 中的变量部分默认类型为字符串，但
Flask 提供了一些转换器可以在 URL 规则里使用，如表2-6所示。

> Flask内置的URL变量转换器

| 转换器    | 说 明                                          |
|--------|----------------------------------------------|
| string | 不包含斜线的字符串（默认值）                               |
| int    | 整型                                           |
| float  | 浮点数                                          |
| path   | 包含斜线的字符串。static路由的URL规则中的filename变量就使用了这个转换器 |
| any    | 匹配一系列给定值中的一个元素                               |
| uuid   | UUID字符串                                      |
| 自定义    | [根据自己的需要去定义](/flask/flask-route.html#自定义转换器) |

转换器通过特定的规则指定，即“<转换器：变量名>”。<int:mobile_number>把 mobile_number 的值转换为整数，因此我们可以在视图函数中直接对year变量进行数学计算：

```python-vue
@app.route('/send/<int:mobile_number>') 
def go_back(mobile_number): 
	return f'<p>短信发送到 {mobile_number} !上面</p>'

```

默认的行为不仅仅是转换变量类型，还包括URL匹配。

将上面的例子以整型匹配数据，可以如下使用：

```python-vue
@app.route('/users/<int:user_id>')
def user_info(user_id):
    print(type(user_id))
    return f'hello user {user_id}'

```

### 自定义转换器

比如遇到需要检测的内容比如手机号，密码，用户名，等各种数据要检测是否符合条件，更好的至爬虫于门外

Eg:

提取手机号 `/sms_codes/18249869955` 中的手机号数据，Flask内置的转换器就无法满足需求，此时需要自定义转换器。

**定义方法**

自定义转换器主要做3步

1. 创建转换器类，保存匹配时的正则表达式

   ```python
   from werkzeug.routing import BaseConverter
   
   class MobilePhoneNumberConverter(BaseConverter):
       regex = r'1[3-9]\d{9}' # 这里填写正则表达式
   
   ```

    - 注意`regex`名字固定

2. 将自定义的转换器告知Flask应用

   ```python
   app = Flask(__name__)
   
   # 将自定义转换器添加到转换器字典中，并指定转换器使用时名字为: mobile
   app.url_map.converters['mobile'] = MobilePhoneNumberConverter
   
   ```

3. 在使用转换器的地方定义使用

   ```python-vue
   @app.route('/sms_codes/<mobile:mobile_num>')
   def send_sms_code(mob_mobile_numnum):
       return f'发送短信到 {mobile_num} 上'
   
   ```

### http请求方法

前面通过 flask routes 命令打印出的路由列表可以看到，每一个路由除了包含URL规则外，还设置了监听的HTTP方法。GET是最常用的
HTTP方法，所以视图函数默认监听的方法类型就是 GET，HEAD、 OPTIONS 方法的请求由 Flask 处理，而像 DELETE、PUT 等方法一般不会在
程序中实现，在后面我们构建 Web API 时才会用到这些方法。

我们可以在 app.route() 装饰器中使用 methods 参数传入一个包含监听 的 HTTP 方法的可迭代对象。例如，下面的视图函数同时监听
GET 请求和 POST 请求：

```python
@app.route('/hello', methods=['GET', 'POST'])
def hello(): 
	return '<h1>Hello, Flask!</h1>'
```

#### restful api格式

> [restful api格式详细见](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

| 请求方式   | 一般作用   |
|:-------|:-------|
| GET    | 请求获取数据 |
| POST   | 新增数据   | 
| PUT    | 修改数据   |  
| DELETE | 删除数据   |    
| PATCH  | 刷新数据   |    

## 新方法

> 新方法是flask2.0.1发布时出现的新定义路由的方式方法，比老方法更容易理解和观看
>

### 建议

> 建议：先学习老方法，掌握其中的逻辑和用法，在去看新用法，因为新用法的底层和老方法一样
>

### get请求

```python
@app.get('/home')
def home():
    return 'home'
```

用`@app.get("/home")`比`@app.route("/home", methods=["GET"])`要强一百倍
一个get方法看不出来什么，
如果要是用[REST-ful api规范](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)那就有福了

### post请求

```python 
@app.post('/home')
def home_post():
    return 'home_post'
```

### delete、put、patch请求

与get、post 请求同理

### 总体看

```python
@app.get('/home')
def get():
    return 'get'
    
@app.post('/home')
def post():
    return 'post'
    
@app.delete('/home')
def delete():
    return 'delete'

@app.put('/home')
def put():
    return 'put'

@app.patch('/home')
def patch():
    return 'patch'
    

```

```python
@app.route('/home',methods=['GET','POST','PUT','PATCH','DELETE'])
def home():
    if request.method == 'GET':
        return 'get'
    elif request.method == 'POST':
        return 'POST'
    elif request.method == 'PUT':
        return 'PUT'
    elif request.method == 'PATCH':
        return 'PATCH'
    elif request.method == 'DELETE':
        return 'DELETE'       
```

对比来看就知道谁更加好理解了吧

## 新老方法总结

1.新方法：更加好理解，比老方法更好看，更容易看懂，更适合前后端分离式，写api
（但是写api大多是用flask-restful）

2.老方法：新方法是基于老方法写的，（**老方法是新方法的底层逻辑**，
不算是最底层，**只是新方法封装了老方法**，~~老方法是新方法的下一层~~ ）

### 建议

我个人建议开发时不管什么样的都用新方法

新方法：只适用于前后端分离，部分分离（半分离）式

老方法：全可以用（分离、不分离、半分离）。老方法比新方法多了个前后端不分离

不分离是**同步写法**，只有先请求，才能有数据，不能几个一起请求

#### 同步

浏览器 --> 请求服务器

浏览器 <-- 服务器

浏览器 --> 请求服务器

浏览器 <-- 服务器

浏览器 --> 请求服务器

浏览器 <-- 服务器
（服务器返回数据）

默认的表单，只有请求完一次，才能请求下一次，并且post\put\delete...都要返回一个页面，因为默认的form表单
会重定向，只有重定向这个post请求返回一个页面才能显示数据，便于消息闪现

为什要要这重定向这个post请求返回一个页面，便于消息闪现？？？
因为flask官方的消息闪现是就是前后端不分离式，开发简单，很容易理解，但是内存开销大


#### 异步

浏览器 --> 请求服务器

浏览器 --> 请求服务器

浏览器 <-- 服务器

浏览器 --> 请求服务器

浏览器 <-- 服务器

浏览器 <-- 服务器

浏览器 --> 请求服务器

浏览器 <-- 服务器

可以几个请求在一起，可以一起接受数据

这样不用form默认表单进行提交，就需要ajax\fetch进行提交
返回的数据可以是json格式，请求的接口这就是api，不显示页面不渲染页面，只做逻辑处理并返回结果




---
date: 2023.9.10
title: Flask-RestFul
tags:
  - flask
  - flask-restful
  - python
  - web
  - flask插件
description: 使用Flask-RestFul根据restful api格式进行编写视图，这用方法很快捷，而且好管理。
link: /flask/flask-restful.html
---

# Flask-FestFul

**restful api是一种REST风格的API，REST风格的API,是一套用来规范多种形式的前端和同一个后台的交互方式的协议**

restful api 格式
> [restful api格式详细见](http://www.ruanyifeng.com/blog/2014/05/restful_api.html)

可以阅读上面的文章在根据本文进行学习

## 什么是FestFul api?

> RESTful API是REST风格的API，是一套用来规范多种形式的前端和同一个后台的交互方式的协议。RESTful
> API由后台也就是SERVER来提供前端来调用；前端调用API向后台发起HTTP请求，后台响应请求将处理结果反馈给前端。

想要知道RESTful api是什么，首先你要知道REST是什么。

REST（英文：REpresentational State Transfer，简称为REST）描述了一个架构样式的网络系统，它指的是一组架构约束条件和原则。然而满足这些约束条件和原则的应用程序或设计就是
RESTful。

REST的英语的直译就是“表现层状态转移”。如果看这个概念，估计没几个人能明白是什么意思。那下面就让我来用一句人话解释一下什么是RESTful:
URL定位资源，用HTTP动词（GET,POST,PUT,DELETE)描述操作。

Resource：资源，即数据。

Representational：某种表现形式，比如用JSON，XML，JPEG等；

State Transfer：状态变化。通过HTTP动词实现。

总结：**REST风格的API,是一套用来规范多种形式的前端和同一个后台的交互方式的协议**

## 请求方式

首先前面我们学习了几种请求方式比如：`GET`，`POST`...
这些都是常见的请求方式，那如果我们使用了restapi我们可以实现一下功能

### RestFul api的作用(重点)

restful api是可以根据对数据的增删改查来实现的api格式

比如说：

![festful-api.drawio.svg](..%2Fassets%2F2023.9.9%2Ffestful-api.drawio.svg)

以上这就是restful api格式
这样的格式可以让我们更加好的进行代码编写，而且好管理
| 请求方式 | 一般作用 |
|:-------|:-------|
| GET | 请求获取数据 |
| POST | 新增数据 |
| PUT | 修改数据 |  
| DELETE | 删除数据 |    
| PATCH | 刷新数据 |

## Flask-RESTful

**Flask-RESTful是用于快速构建REST API的Flask扩展。**

### 安装

::: code-group

```shell[pip]
pip install flask-restful
```

```shell[poetry]
poetry add flask-restful
```

:::
**类视图使用**

```python
from flask import Flask
from flask_restful import Resource, Api

app = Flask(__name__)

# 1. 创建一个 rest full
api = Api(app)


# 2. 定义一个资源的路由
# @api.resource('/foo')
class HelloWorldResource(Resource):
    def get(self):
        return {'hello': 'world'}

    def post(self):
        return {'msg': 'post hello world'}


# 3. 添加一个资源路由
api.add_resource(HelloWorldResource, '/')
# api.add_resource(HelloWorldResource, '/', endpoint='HelloWorld')

```

### 关于视图

#### 为路由起名

通过endpoint参数为路由起名

```python
api.add_resource(HelloWorldResource, '/', endpoint='HelloWorld')
```

#### 蓝图中使用

```python
from flask import Flask, Blueprint
from flask_restful import Api, Resource

app = Flask(__name__)

# 方法一： 先创建APP对象
user_api = Api()


# # 方法二 1. ：挂载到蓝图，由蓝图挂载到app对象
# user_bp = Blueprint('user', __name__)
# user_api = Api()
# user_api.init_app(user_bp)

@user_api.resource('/profile')
class UserProfileResource(Resource):
    def get(self):
        return {'msg': 'get user profile'}


# 方法一： 将 api 对象挂载到 APP 对象上
user_api.init_app(app)

# 方法二 2. ：将蓝图对象挂载到app对象上
# app.register_blueprint(user_bp, url_prefix='/users')

```

#### 装饰器

使用`method_decorators`添加装饰器

- 为类视图中的所有方法添加装饰器

```python
  def decorator1(func):
      def wrapper(*args, **kwargs):
          print('decorator1')
          return func(*args, **kwargs)
      return wrapper


  def decorator2(func):
      def wrapper(*args, **kwargs):
          print('decorator2')
          return func(*args, **kwargs)
      return wrapper


  class DemoResource(Resource):
      method_decorators = [decorator1, decorator2]

      def get(self):
          return {'msg': 'get view'}

      def post(self):
          return {'msg': 'post view'}
```

- 为类视图中不同的方法添加不同的装饰器

```python
  class DemoResource(Resource):
      method_decorators = {
          'get': [decorator1, decorator2],
          'post': [decorator1]
      }

      # 使用了decorator1 decorator2两个装饰器
      def get(self):
          return {'msg': 'get view'}

      # 使用了decorator1 装饰器
      def post(self):
          return {'msg': 'post view'}

      # 未使用装饰器
      def put(self):
          return {'msg': 'put view'}
```

### 关于请求处理

Flask-RESTful 提供了`RequestParser`类，用来帮助我们检验和转换请求数据。

```python
from flask_restful import reqparse

parser = reqparse.RequestParser()
parser.add_argument('rate', type=int, help='Rate cannot be converted', location='args')
parser.add_argument('name')
args = parser.parse_args()
```

#### 使用步骤：

1. 创建`RequestParser`对象

2. 向`RequestParser`对象中添加需要检验或转换的参数声明

3. 使用`parse_args()`方法启动检验处理

4. 检验之后从检验结果中获取参数时可按照字典操作或对象属性操作

   ```python
   args.rate
   或
   args['rate']
   ```

参数说明

#### required

描述请求是否一定要携带对应参数，**默认值为False**

- True 强制要求携带

  若未携带，则校验失败，向客户端返回错误信息，状态码400

- False 不强制要求携带

  若不强制携带，在客户端请求未携带参数时，取出值为None

```python
class DemoResource(Resource):
    def get(self):
        rp = RequestParser()
        rp.add_argument('a', required=False)
        args = rp.parse_args()
        return {'msg': 'data={}'.format(args.a)}

```

#### help

参数检验错误时返回的错误描述信息

```python
rp.add_argument('a', required=True, help='missing a param')

```

#### action

描述对于请求参数中出现多个同名参数时的处理方式

- `action='store'` 保留出现的第一个， 默认
- `action='append'` 以列表追加保存所有同名参数的值

```python
rp.add_argument('a', required=True, help='missing a param', action='append')

```

#### type

描述参数应该匹配的类型，可以使用python的标准数据类型string、int，也可使用Flask-RESTful提供的检验方法，还可以自己定义

- 标准类型

  ```python
  rp.add_argument('a', type=int, required=True, help='missing a param', action='append')
  
  ```

- Flask-RESTful提供

  检验类型方法在`flask_restful.inputs`模块中

    - `url`

    - `regex(指定正则表达式)`

      ```python
      from flask_restful import inputs
      rp.add_argument('a', type=inputs.regex(r'^\d{2}&'))
      
      ```

    - `natural` 自然数0、1、2、3...

    - `positive` 正整数 1、2、3...

    - `int_range(low ,high)` 整数范围

      ```python
      rp.add_argument('a', type=inputs.int_range(1, 10))
      
      ```

    - `boolean`

- 自定义

  ```python
  def mobile(mobile_str):
      """
      检验手机号格式
      :param mobile_str: str 被检验字符串
      :return: mobile_str
      """
      if re.match(r'^1[3-9]\d{9}$', mobile_str):
          return mobile_str
      else:
          raise ValueError('{} is not a valid mobile'.format(mobile_str))
  
  rp.add_argument('a', type=mobile)
  
  ```

#### location

描述参数应该在请求数据中出现的位置

```python
#  Look only in the POST body
parser.add_argument('name', type=int, location='form')

#  Look only in the querystring
parser.add_argument('PageSize', type=int, location='args')

#  From the request headers
parser.add_argument('User-Agent', location='headers')

#  From http cookies
parser.add_argument('session_id', location='cookies')

#  From json
parser.add_argument('user_id', location='json')

#  From file uploads
parser.add_argument('picture', location='files')

```

也可指明多个位置

```python
parser.add_argument('text', location=['headers', 'json'])

```

### 关于响应处理

#### 序列化数据

Flask-RESTful 提供了marshal工具，用来帮助我们将数据序列化为特定格式的字典数据，以便作为视图的返回值。

```python
from flask import Flask
from flask_restful import Resource, Api
from flask_restful import fields, marshal_with

app = Flask(__name__)

api = Api(app)


class User(object):
    def __init__(self, user_id, name, age):
        self.user_id = user_id
        self.name = name
        self.age = age
        self.hobby = ['吃', '喝']


# 声明需要序列化处理的字段
# 序列化字段的名字需要与对象中的名字是一样的
resource_fields = {
    'user_id': fields.Integer,
    'name': fields.String,
    'hobby': fields.String
}


class Demo(Resource):
    # 添加一个序列化装饰器
    @marshal_with(resource_fields, envelope='resource')
    def get(self):
        # 返回的内容给前端之前会进行序列化
        return User(1, 'quqi', 18)
        # return {'user_id': 1, 'name': 'quqi', 'age': 18}


api.add_resource(Todo, '/demo1')


```

也可以不使用装饰器的方式

```python
from flask_restful import marshal


class Demo(Resource):
    def get(self):
        # 不使用装饰器 marshal
        return marshal(User(1, 'quqi', 18), resource_fields, envelope='resource')

```

返回复杂的内容

```python
@api.resource('/complex')
class ComplexStructures(Resource):
    _resource_fields = {
        'name': fields.String,
        'address': {
            'line 1': fields.String(attribute='addr1'),
            'line 2': fields.String(attribute='addr2'),
            'city': fields.String(fields.String),
            'state': fields.String,
            'zip': fields.String,
        }
    }

    def get(self):
        data = {'name': 'quqi', 'addr1': '哈哈 街道', 'addr2': '', 'city': '鹤岗', 'state': '黑龙江',
                'zip': '423000'}
        return marshal(data, self._resource_fields)


```

#### 定制返回的JSON格式

#### 需求

想要接口返回的JSON数据具有如下统一的格式

```json
{
  "message": "描述信息",
  "data": {
    要返回的具体数据
  }
}

```

在接口处理正常的情况下， message返回ok即可，但是若想每个接口正确返回时省略message字段

```python
class DemoResource(Resource):
    def get(self):
        return {'user_id':1, 'name': 'itcast'}

```

对于诸如此类的接口，能否在某处统一格式化成上述需求格式？

```json
{
  "message": "OK",
  "data": {
    'user_id': 1,
    'name': 'itcast'
  }
}

```

#### 解决

**Flask-RESTful的Api对象提供了一个`representation`的装饰器，允许定制返回数据的呈现格式**

```python
api = Api(app)

@api.representation('application/json')
def handle_json(data, code, headers):
    # TODO 此处添加自定义处理
    return resp

```

Flask-RESTful原始对于json的格式处理方式如下：

代码出处：`flask_restful.representations.json`

```python
from flask import make_response, current_app
from flask_restful.utils import PY3
from json import dumps


def output_json(data, code, headers=None):
    """Makes a Flask response with a JSON encoded body"""

    settings = current_app.config.get('RESTFUL_JSON', {})

    # If we're in debug mode, and the indent is not set, we set it to a
    # reasonable value here.  Note that this won't override any existing value
    # that was set.  We also set the "sort_keys" value.
    if current_app.debug:
        settings.setdefault('indent', 4)
        settings.setdefault('sort_keys', not PY3)

    # always end the json dumps with a new line
    # see https://github.com/mitsuhiko/flask/pull/1262
    dumped = dumps(data, **settings) + "\n"

    resp = make_response(dumped, code)
    resp.headers.extend(headers or {})
    return resp

```

为满足需求，做如下改动即可

```python
@api.representation('application/json')
def output_json(data, code, headers=None):
    """Makes a Flask response with a JSON encoded body"""

    # 此处为自己添加***************
    if 'message' not in data:
        data = {
            'message': 'OK',
            'data': data
        }
    # **************************

    settings = current_app.config.get('RESTFUL_JSON', {})

    # If we're in debug mode, and the indent is not set, we set it to a
    # reasonable value here.  Note that this won't override any existing value
    # that was set.  We also set the "sort_keys" value.
    if current_app.debug:
        settings.setdefault('indent', 4)
        settings.setdefault('sort_keys', not PY3)

    # always end the json dumps with a new line
    # see https://github.com/mitsuhiko/flask/pull/1262
    dumped = dumps(data, **settings) + "\n"

    resp = make_response(dumped, code)
    resp.headers.extend(headers or {})
    return resp
```


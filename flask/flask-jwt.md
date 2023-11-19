---
date: 2023.11.19
title: Flask-JWT-Extended

tags:
  - flask
  - flask-jwt-extended
  - python
  - web
  - flask插件
description: 现在前后端分离开发已经是一个web开发者必备的技能了，而通信鉴权问题是前后端分离开发中首要解决的问题，用得最广泛的方式就是JWT(JSON Web Token)。今天我们来聊一聊为什么需要JWT、JWT的原理，以及在Flask中如何优化又便捷的实现JWT鉴权。
---

# Flask-JWT-Extended

## 安装

::: code-group

```shell[pip]
pip install flask-jwt-extended
```

```shell[poetry]
poetry flask-jwt-extended
```

:::

## 基本用法

在最简单的形式中，使用此扩展没有太多内容。 `create_access_token()` 用于创建 JSON Web 令牌、 `jwt_required()` 保护路由以及
`get_jwt_identity()` 获取受保护路由中 JWT 的标识

### 举例

```python
from flask import Flask
from flask import jsonify
from flask import request

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)

# 设置Flask-JWT-Extended扩展
app.config["JWT_SECRET_KEY"] = "super-secret"  # 改变这个!
jwt = JWTManager(app)


# 创建一个路由来验证您的用户并返回jwt
# create_access_token()函数用于实际生成JWT。
@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if username != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)


# 使用jwt_required保护路由，它将踢出请求
# 没有有效的JWT存在。
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # 使用get_jwt_identity访问当前用户的标识
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200


if __name__ == "__main__":
    app.run()
```

要访问受`jwt_required`保护的视图，您需要在每个请求中发送 JWT。默认情况下，这是通过如下所示的授权标头完成的：

我们可以使用 HTTPie 看到这一点。

```
$ http GET :5000/protected

HTTP/1.0 401 UNAUTHORIZED
Content-Length: 39
Content-Type: application/json
Date: Sun, 24 Jan 2021 18:09:17 GMT
Server: Werkzeug/1.0.1 Python/3.8.6

{
    "msg": "Missing Authorization Header"
}


$ http POST :5000/login username=test password=test

HTTP/1.0 200 OK
Content-Length: 288
Content-Type: application/json
Date: Sun, 24 Jan 2021 18:10:39 GMT
Server: Werkzeug/1.0.1 Python/3.8.6

{
    "access_token": "eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxMTUxMTgzOSwianRpIjoiMmI0NzliNTQtYTI0OS00ZDNjLWE4NjItZGVkZGIzODljNmVlIiwibmJmIjoxNjExNTExODM5LCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoidGVzdCIsImV4cCI6MTYxNDEwMzgzOX0.UpTueBRwNLK8e-06-oo5Y_9eWbaN5T3IHwKsy6Jauaw"
}


$ export JWT="eyJ0eXAiOiJKV1QiLCJhbGciOiJIUzI1NiJ9.eyJmcmVzaCI6ZmFsc2UsImlhdCI6MTYxMTUxMTgzOSwianRpIjoiMmI0NzliNTQtYTI0OS00ZDNjLWE4NjItZGVkZGIzODljNmVlIiwibmJmIjoxNjExNTExODM5LCJ0eXBlIjoiYWNjZXNzIiwic3ViIjoidGVzdCIsImV4cCI6MTYxNDEwMzgzOX0.UpTueBRwNLK8e-06-oo5Y_9eWbaN5T3IHwKsy6Jauaw"


$ http GET :5000/protected Authorization:"Bearer $JWT"

HTTP/1.0 200 OK
Content-Length: 24
Content-Type: application/json
Date: Sun, 24 Jan 2021 18:12:02 GMT
Server: Werkzeug/1.0.1 Python/3.8.6

{
    "logged_in_as": "test"
}
```

### 重要

请记住更改应用程序中的 JWT 密钥，并确保其安全。JWT 使用此密钥进行签名，如果有人拿到它，他们将能够创建 Web Flask 应用程序接受的任意令牌。

## 自动用户加载

在大多数 Web 应用程序中，访问正在访问受保护路由的用户非常重要。我们提供了几个回调函数，可以在使用 JWT 时实现无缝。

第一个是 `user_identity_loader()` ，它将用于创建 JWT 的任何 User 对象转换为 JSON 可序列化格式。

另一方面，当请求中存在 JWT 时，您可以使用 `user_lookup_loader()` 自动加载对象 User 。加载的用户可通过 在受保护的路由中使用
current_user 。

让我们看一个例子，同时利用SQLAlchemy来存储我们的用户：

```python

from hmac import compare_digest

from flask import Flask
from flask import jsonify
from flask import request
from flask_sqlalchemy import SQLAlchemy

from flask_jwt_extended import create_access_token
from flask_jwt_extended import current_user
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "super-secret"  # 改掉这个
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite://"
app.config["SQLALCHEMY_TRACK_MODIFICATIONS"] = False

jwt = JWTManager(app)
db = SQLAlchemy(app)


class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.Text, nullable=False, unique=True)
    full_name = db.Column(db.Text, nullable=False)

    # 注意:在实际应用程序中，请确保正确地散列和盐密码
    def check_password(self, password):
        return compare_digest(password, "password")


# 注册一个回调函数，该函数接受传入的对象
# identity在创建jwt时，并将其转换为JSON可序列化格式。
@jwt.user_identity_loader
def user_identity_lookup(user):
    return user.id


# 注册一个回调函数，无论何时从数据库加载一个用户
# 被保护路由被访问。这将返回a上的任何python对象
# success lookup，如果查找由于任何原因失败(例如
# 如果用户已从数据库中删除)。
@jwt.user_lookup_loader
def user_lookup_callback(_jwt_header, jwt_data):
    identity = jwt_data["sub"]
    return User.query.filter_by(id=identity).one_or_none()


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)

    user = User.query.filter_by(username=username).one_or_none()
    if not user or not user.check_password(password):
        return jsonify("Wrong username or password"), 401

    # 注意，我们在这里传递的是实际的sqlalchemy用户对象
    access_token = create_access_token(identity=user)
    return jsonify(access_token=access_token)


@app.route("/who_am_i", methods=["GET"])
@jwt_required()
def protected():
    # 现在我们可以通过'current_user'访问sqlalchemy User对象。
    return jsonify(
        id=current_user.id,
        full_name=current_user.full_name,
        username=current_user.username,
    )


if __name__ == "__main__":
    db.create_all()
    db.session.add(User(full_name="Bruce Wayne", username="batman"))
    db.session.add(User(full_name="Ann Takamaki", username="panther"))
    db.session.add(User(full_name="Jester Lavore", username="little_sapphire"))
    db.session.commit()

    app.run()
```

## 在 JWT 中存储其他数据

您可能希望在访问令牌中存储其他信息，以便以后在受保护的视图中访问这些信息。这可以使用带有 `create_access_token()`
or `create_refresh_token()` 函数的 **additional_claims** 参数来完成。可以通过该 `get_jwt()` 函数在受保护的路由中访问声明。

重要的是要记住，JWT 不是加密的，任何有权访问 JWT 的人都可以轻易地解码 JWT 的内容。因此，切勿将任何敏感信息放入 JWT 中。

```python
from flask import Flask
from flask import jsonify
from flask import request

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "super-secret"
jwt = JWTManager(app)


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if username != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401

    # 您可以使用additional_claims参数添加
    # 在JWT中自定义声明或覆盖默认声明。
    additional_claims = {"aud": "some_audience", "foo": "bar"}
    access_token = create_access_token(username, additional_claims=additional_claims)
    return jsonify(access_token=access_token)


# 在受保护视图中，获取添加到jwt中的声明
# get_jwt()方法
@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    claims = get_jwt()
    return jsonify(foo=claims["foo"])


if __name__ == "__main__":
    app.run()
```

或者，您可以使用装饰器注册一个回调函数， `additional_claims_loader()` 每当创建新的 JWT
时都会调用该函数，并返回要添加到该令牌的声明字典。在同时 `additional_claims_loader()` 使用参数和参数的情况下，两个结果将合并在一起，并绑定到
**additional_claims additional_claims** 参数提供的数据。

使用装饰器把返回数据与额外数据结合并返回

```python
# 使用additional_claims_loader，我们可以指定一个方法
# 创建jwt时调用。装饰方法必须取身份
# 我们正在创建一个令牌，并返回一个额外的字典
# 声明添加到JWT。
@jwt.additional_claims_loader
def add_claims_to_access_token(identity):
    return {
        "aud": "some_audience",
        "foo": "bar",
        "upcase_name": identity.upper(),
    }
```

## 部分保护路由

在某些情况下，您可能希望使用相同的路由，而不管请求中是否存在 JWT。在这些情况下，您可以与 **optional=True** 参数一起使用
`jwt_required()` 。这将允许访问端点，而不管 JWT 是否随请求一起发送。

如果不存在 JWT，则 将 `get_jwt_header()` `get_jwt()` 返回一个空字典。 `get_jwt_identity()` ， **current_user** 并将
`get_current_user()` 返回 None。

如果请求中存在过期或不可验证的 JWT，则仍会像往常一样返回错误。

```python
from flask import Flask
from flask import jsonify
from flask import request

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)

# Setup the Flask-JWT-Extended extension
app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)


@app.route("/login", methods=["POST"])
def login():
    username = request.json.get("username", None)
    password = request.json.get("password", None)
    if username != "test" or password != "test":
        return jsonify({"msg": "Bad username or password"}), 401

    access_token = create_access_token(identity=username)
    return jsonify(access_token=access_token)


@app.route("/optionally_protected", methods=["GET"])
@jwt_required(optional=True)
def optionally_protected():
    current_identity = get_jwt_identity()
    if current_identity:
        return jsonify(logged_in_as=current_identity)
    else:
        return jsonify(logged_in_as="anonymous user")


if __name__ == "__main__":
    app.run()

```

## 更改默认行为

此扩展提供合理的默认行为。例如，如果过期的令牌尝试访问受保护的终结点，你将收到 JSON 响应 like `{"msg": "Token has expired"}`
和 401 状态代码。但是，此扩展可能存在各种行为，您希望根据应用程序的需求进行自定义。我们可以使用各种加载器函数来做到这一点。下面是如何做到这一点的示例。

```python
from flask import Flask
from flask import jsonify

from flask_jwt_extended import create_access_token
from flask_jwt_extended import jwt_required
from flask_jwt_extended import JWTManager

app = Flask(__name__)

app.config["JWT_SECRET_KEY"] = "super-secret"  # Change this!
jwt = JWTManager(app)


# 设置一个回调函数，以便在过期时返回自定义响应
# token试图访问受保护的路由。这个回调函数
# 接受jwt_header和jwt_payload作为参数，并且必须返回一个Flask
# 反应。请查看API文档以查看所需的参数和返回
# 其他回调函数的值。
@jwt.expired_token_loader
def my_expired_token_callback(jwt_header, jwt_payload):
    return jsonify(code="dave", err="I can't let you do that"), 401


@app.route("/login", methods=["POST"])
def login():
    access_token = create_access_token("example_user")
    return jsonify(access_token=access_token)


@app.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    return jsonify(hello="world")


if __name__ == "__main__":
    app.run()
```

可以定义各种回调来自定义此扩展的行为。有关此扩展中可用的回调函数的完整列表，请参阅配置 Flask-JWT-Extended API 文档。

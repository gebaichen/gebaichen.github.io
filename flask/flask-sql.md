---
date: 2023.8.30
title: Flask操作mysql数据库
tags:
  - flask
  - flask-sqlalchemy
  - flask-migrate
  - python
  - web
  - flask插件
description: Flask-sqlalchemy实现ORM操作数据库;Flask-Migrate实现数据库迁移
link: /flask/flask-sql.html
---


# Flask操作mysql数据库

操作sql数据库在py中，一般使用pymysql
但是因为使用pymysql时要使用sql语言，就会变的如此的麻烦，而且不好理解

这时py有一个包sqlalchemy出现了，他比较像django内置的ORM，用类去封装一个表格，用ORM
方式操作数据库显的特别简单，易学，好上手，对开发者比较友好

## ORM & SQL

在 Web 应用里使用原生 SQL（一种特殊目的的编程语言，一种数据库查询和程序设计语言） 语句操作数据库主要存在下面两类问题：
::: tip

1. 手动编写 SQL 语句比较乏味，而且视图函数中加入太多 SQL 语句会降低代码的易读性。另外还会容易出现安全问题，比如 SQL 注入。
2. 常见的开发模式是在开发时使用简单的 SQLite，而在部署时切换到 MySQL 等更健壮的 DBMS（数据库管理系统）。但是对于不同的
   DBMS，我们需要使用不同的 Python 接口库，这让 DBMS 的切换变得不太容易。
3. 使用 ORM 可以避免 SQL 注入问题，但你仍然需要对传入的查询参数进行验证。在执行原生 SQL 语句时也要注意避免使用字符串拼接
   或字符串格式化的方式传入参数。
   :::

使用 ORM（对象关系映射） 可以很大程度上解决这些问题。它会自动帮你处理查询参数的转义，尽可能地避免 SQL 注入的发生。另外，它为不同的
DBMS 提供统 一的接口，让切换工作变得非常简单。ORM 扮演翻译的角色，能够将我们 的Python语言转换为 DBMS 能够读懂的 SQL
指令，让我们能够使用Python来操控数据库。

尽管ORM非常方便，但是自己编写 SQL 代码可以获得更大的灵活性和性能优势。就像是使用IDE一样，ORM 对初学者来说非常方便，但进阶以后你也许会想要自己掌控一切。

ORM 把底层的 SQL 数据实体转化成高层的 Python 对象，这样一来，你甚至不需要了解 SQL，只需要通过 Python 代码即可完成数据库操作，ORM
主要实现了三层映射关系：

- 数据表 --> py类。
- 字段 --> py类属性。
- 内容 --> py类实例。

## Flask-Sqlalchemy

Flask-SQLAlchemy 通过自动处理创建、使用和清理您通常使用的 SQLAlchemy 对象来简化 SQLAlchemy
的使用。虽然它添加了一些有用的功能，但它仍然像SQLAlchemy一样工作。
> https://flask-sqlalchemy.palletsprojects.com/en/3.0.x/

### 安装

::: code-group

```shell[pip]
pip install Flask-Sqlalchemy
```

```shell[poetry]
poetry add Flask-Sqlalchemy
```

:::

### 注册到app

把flask-sqlalchemy拓展插件注册到flask app中

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy

# create the extension
db = SQLAlchemy()
# create the app
app = Flask(__name__)
# configure the SQLite database, relative to the app instance folder
app.config["SQLALCHEMY_DATABASE_URI"] = "sqlite:///project.db"
# initialize the app with the extension
db.init_app(app)
```

此上代码是最简单的注册方法

#### 注

该 db 对象允许您访问用于定义模型的类以及 **db.Model** 用于执行查询的 **db.session** 类

有关连接字符串的说明以及使用的其他配置键的说明，请参阅配置。该 **SQLAlchemy** 对象还需要一些参数来自定义它管理的对象。

### 增-定义数据库模型

用于定义模型类的子类 **db.Model** 。为方便起见，该 db 对象使名称在 中 sqlalchemy **sqlalchemy.orm** 可用，例如 **db.Column** 。该模型将通过将 CamelCase 类名转换为 snake_case 来生成表名。

```python
class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    username = db.Column(db.String, unique=True, nullable=False)
    email = db.Column(db.String)
```

表名与类名相互保持一致
> 常用字段说明

| 字 段         | 说 明                                |
|:------------|------------------------------------|
| Integer     | 整数                                 |
| String      | 字符串，可选参数length可以用来设置最大长度           |
| Text        | 较长的Unicode文本                       |
| Date        | 日期，存储Python的datetime.date对象        |
| Time        | 时间，存储Python的datetime.time对象        |
| DateTime    | 时间和日期，存储Python的datetime对象          |
| Interval    | 时间间隔，存储Python的datetime.timedelta对象 |
| Float       | 浮点数                                |
| Boolean     | 布尔值                                |
| PickleType  | 存储Pickle列化的Python对象                |
| LargeBinary | 存储任意二进制数据                          |

#### 创建表

定义所有模型和表后，调用 ~~SQLAlchemy.create_all()~~（并不推荐此用法） 以在数据库中创建表架构。这需要应用程序上下文。由于此时您不在请求中，因此请手动创建一个。

```python
with app.app_context():
    db.create_all()
```

但是这么创建并不方便，创建表我们用flask-migrate这个包实行数据迁移来进项添加表

### 删-查-改

在 Flask 视图或 CLI 命令中，您可以使用 执行 db.session 查询和修改模型数据。

- `db.session.add(obj)` 将对象添加到要插入的会话中。修改对象的属性会更新该对象 。
- `db.session.delete(obj)` 删除对象。
- 请记住在修改、添加或删除任何数据后调用 `db.session.commit()` 。
- `db.session.execute(db.select(...))` 构造一个查询以从数据库中选择数。
  构建查询是 SQLAlchemy 的主要功能，因此您需要阅读其教程 select 以了解有关它的所有信息。
  通常使用该方法获取结果列表，或使用 `Result.scalars()` `Result.scalar()` 该方法获取单个结果。

您可能会看到用于 Model.query 构建查询的用法。这是一个较旧的查询接口，在 SQLAlchemy
中被视为遗留接口。更建议使用 `db.session.execute(db.select(...))` 。

例子：

```python
@app.route("/users")
def user_list():
    q = db.select(User) # 用q变量定义一个查找对象
    q = q.order_by(User.username) # 用赋值方式来写查找逻辑
    users = db.session.execute(q).scalars() # 用db.session.execute()执行q定义的查询对象
    return render_template("user/list.html", users=users)
```

> 注：还可以用query进行查询，大多使用query，因为`db.session.execute(db.select(...))`刚更新刚发布

#### 查询指南

我们已经知道了如何向数据库里添加记录，那么如何从数据库里取回 数据呢？使用模型类提供的query属性附加调用各种过滤方法及查询方法可
以完成这个任务。

一般来说，一个完整的查询遵循下面的模式：

也可以用query来查询，

```python
<模型类>.query.<过滤方法>.<查询方法>
```

从某个模型类出发，通过在query属性对应的Query对象上附加的过滤 方法和查询函数对模型类对应的表中的记录进行各种筛选和调整，最终返
回包含对应数据库记录数据的模型类实例，对返回的实例调用属性即可获 取对应的字段数据。

如果你执行了上面⼩节里的操作，我们的数据库现在一共会有三条记录

| id | name   | math | chinese | english |
|----|--------|------|---------|---------|
| 1  | Mark   | 100  | 68      | 60      |
| 2  | Alan   | 15   | 67      | 65      |
| 3  | Christ | 0    | 70      | 70      |
| 4  | Quqi   | 100  | 100     | 100     |

SQLAlchemy提供了许多查询方法用来获取记录

> 常用的SQLAlchemy查询方法

| 查询方法（触发器）              | 说	明                                   |
|------------------------|---------------------------------------|
| all()                  | 返回包含所有查询记录的列表                         |
| first()                | 返回查询的第一条记录，如果未找到，则返回None              |
| one()                  | 返回第一条记录，旦仅允许有一条记录。如果记录数量大于1或小于1，则拋出错误 |
| get(ident)             | 传入主键值作为参数，返回指定主键值的记录，如果未找到，则返回None    |
| count()                | 返回查询结果的数量                             |
| one_or_none()          | 类似one()，如果结果数量不为1，返回None              |
| first_or_404()         | 返回查询的第一条记录，如果未找到，则返回404错误响应           |
| get_or_404(ident)      | 传人主键值作为参数，返回指定主键值的记录，如果未找到，则返回404错误响应 |
| paginate()             | 返回一个Pagination对象，可以对记录进行分页处理          |
| with_parent( instance) | 传人模型类实例作为参数，返回和这个实例相关联的对象，后面会详细介绍     |

first_or_404()、get_or_404() 以及 paginate() 方法是 Flask-SQLAlchemy 附加的查询方法。

下面是对 Note 类进行查询的几个示例。all() 返回所有记录：

```python
>>> Students.query.all()
[<Students Mark>, <Students Alan>, <Students Christ>, <Students Quqi>]

```

first() 返回第一条记录：

```python
>>> Students.query.first()
>>> <Students Mark>

```

get() 返回指定主键值（id字段）的记录：

```python
>>> stu2 = Students.query.get(2)
>>> stu2 
<Students Alan>

```

count()返回记录的数量：

```python
>>> Students.query.count() 
4
```

SQLAlchemy还提供了许多过滤方法，使用这些过滤方法可以获取更 精确的查询，比如获取指定字段值的记录。对模型类的query属性存储的
Query对象调用过滤方法将返回一个更精确的Query对象（后面我们简称为 查询对象）。因为每个过滤方法都会返回新的查询对象，所以过滤器可以
叠加使用。在查询对象上调用前面介绍的查询方法，即可获得一个包含过 滤后的记录的列表。

所有的的查询方法和过滤方法列表 在http://docs.sqlalchemy.org/en/latest/orm/query.html 可以看到

查询过滤器可以**链式调用**实现多重查询，使查询结果进一步完善
| 查询过滤器 | 说 明 |
|----------------|-----------------------------------|
| filter_by()    | 使用指定规则过滤记录（以关键字表达式的形式），返回新产生的查洵对象 |
| filter()       | 使用指定的规则过滤记录，返回新产生的查询对象 |
| order_by()     | 根据指定条件对记录进行排序，返回新产生的查询对象 |
| limit(limit)   | 使用指定的值限制原查询返回的记录数量，返回新产生的查询对象 |
| group_by()     | 根据指定条件对记录进行分组，返回新产生的查询对象 |
| offset(offset) | 使用指定的值偏移原查询的结果，返回新产生的查询对象 |

filter()方法是最基础的查询方法。它使用指定的规则来过滤记录， 下面的示例在数据库里找出了body字段值为“SHAVE”的记录：

```python
>>> Students.query.filter(Students.name == 'Mark').first()
<Students Mark>

```

直接打印查询对象或将其转换为字符串可以查看对应的SQL语句：

```python
>>> Students.query.filter(Students.name == 'Mark').first()

SELECT students.id AS students_id, students.name AS students_name, students.math AS students_math, students.chinese AS students_chinese, students.english AS students_english 
FROM students 
WHERE students.name = ?
 LIMIT ? OFFSET ?

```

在filter()方法中传入表达式时，除了“==”以及表示不等于的“!=”， 其他常用的查询操作符以及使用示例如下所示：

LIKE：

```python
filter(Students.name.like('%Ma%'))

```

IN：

```python
filter(Students.name.in_(['Mark', 'Christ'])

```

NOT IN：

```python
.filter(~Students.name.in_(['Alan', 'Quqi'])

```

AND：

```python
from sqlalchemy import and_

filter(and_(Students.name == 'Quqi', Students.chinese == 100))

# 或在filter()中加入多个表达式，使用逗号分隔
filter(Students.name == 'Quqi', Students.chinese == 100)

# 或叠加调用多个 filte()/ filte_by() 方法 
filter(Students.name == 'Quqi').filter(Students.chinese == 100)

```

OR：

```python
from sqlalchemy import or_

print(Students.query.filter(or_(Students.name == 'Quqi', Students.chinese == 60)).all())


```

(完整的可用操作符列表)[http://docs.sqlalchemy.org/en/latest/core/sqlelement.html#sqlalchemy.sql.operator]

和filter()方法相比，filter_by()方法更易于使用。在filter_by() 方法中，你可以使用关键字表达式来指定过滤规则。更方便的是，你可以
在这个过滤器中直接使用字段名称。下面的示例使用filter_by()过滤器完 成了同样的任务：

```python

>>> print(Students.query.filter_by(name='Quqi').all())
[<Students Quqi>]

>>> print(Students.query.filter(name=='Quqi').all())
[<Students Quqi>]

```

filter & filter_by传入的分别是filter传入的是表达式，filter_by传入的是<参数名称>=<查询内容>

#### 新方法查询

```python
@app.route("/users")
def user_list():
    q = db.select(User) # 1.用q变量定义一个查找对象
    q = q.order_by(User.username) # 2.用赋值方式来写查找逻辑
    users = db.session.execute(q).scalars() # 3.用db.session.execute()执行q定义的查询对象
    return render_template("user/list.html", users=users)
```

查询逻辑：
| 查询过滤器 | 说 明 |
|----------------|-----------------------------------|
| where()       | 使用指定的规则过滤记录，返回新产生的查询对象 |
| order_by()     | 根据指定条件对记录进行排序，返回新产生的查询对象 |
| limit(limit)   | 使用指定的值限制原查询返回的记录数量，返回新产生的查询对象 |

可以多次进行赋值，进行编写逻辑

```python
@app.route("/users")
def user_list():
    q = db.select(User) # 1.用q变量定义一个查找对象
    q = q.order_by(User.username) # 2.1用赋值方式来写查找逻辑
    q = q.where(User.username != None) # 2.2用赋值方式来写查找逻辑
    users = db.session.execute(q).scalars() # 3.用db.session.execute()执行q定义的查询对象
    return render_template("user/list.html", users=users)
```

### 分页查询

#### 查询参数

| 参数名称         | 参数作用                                                                                |
|--------------|-------------------------------------------------------------------------------------|
| page         | 查询的页数                                                                               |
| per_page     | 每页的条数                                                                               |
| max_per_page | 每页最大条数，有值时，per_page 受它影响                                                            |
| error_out    | 当值为 True 时，下列情况会报错当 page 为 1 时，找不到任何数据page 小于 1，或者 per_page 为负数page 或 per_page 不是整数 |

该方法返回一个分页对象 Pagination

#### 查询字段（实例化分页的属性）

| 字段名称                                                                   | 字段作用                                           |
|------------------------------------------------------------------------|------------------------------------------------|
| items                                                                  | 当前页的数据列表                                       |
| page                                                                   | 当前页码                                           |
| pages                                                                  | 总页数                                            |
| total                                                                  | 总条数                                            |
| per_page                                                               | 每页的条数                                          |
| has_next                                                               | 如果下一页存在，返回 True                                |
| has_prev                                                               | 如果上一页存在，返回 True                                |
| next_num                                                               | 下一页的页码                                         |
| prev_num                                                               | 上一页的页码                                         |
| query                                                                  | 用于创建此分页对象的无限查询对象。                              |
| iter_pages(left_edge=2, left_current=2, right_current=5, right_edge=2) | 迭代分页中的页码，四个参数 ，分别控制了省略号左右两侧各显示多少页码 ，在模板中可以这样渲染 |

::: code-group

```python[老方式查询query]
page = User.query.order_by(User.join_date).paginate(page=page, pre_page=pre_page)
return render_template("user/list.html", page=page)
```

```python[新方式查询]
q = db.select(User)
q = q.order_by(User.join_date)
page = db.paginate(q, page=page, pre_page=pre_page)
return render_template("user/list.html", page=page)
```

:::

### 自定义数据表名

```python
class User(db.Model):
    __tablename__ = 'info_user'
    ...
```

用`__tablename__` 来自定义表名

### 自定义配置

这里就挑常用的

#### SQLALCHEMY_DATABASE_URI

链接网址配置

```python
app.config['SQLALCHEMY_DATABASE_URI'] = 'dialect://username:password@host:port/database'
```

##### 注

如果使用mysql会出现`无MySQLdb这个包`的错误这时有两种解决办法
::: code-group

```python[第一种]
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql+pymysql://username:password@host:port/database'
```

```python[第二种]
import pymysql

pymysql.install_as_MySQLdb()
app.config['SQLALCHEMY_DATABASE_URI'] = 'mysql://username:password@host:port/database'

```

:::

#### SQLALCHEMY_TRACK_MODIFICATIONS

如果启用，将记录模型上的所有 insert 、 update 和 delete 操作，然后在调用时 `session.commit()` 发送 `models_committed` 和
`before_models_committed` 信号。

### 数据库关系

在学习sql语言时就了解到了有几大关系：一对多，多对多模型
在开发中特别常用

简单来说就是可以通过一个user数据直接取到他的teacher的对象
他的teacher也可以取到所有同学的对象

#### 一对多

相当于一篇文章只能有一个作者
而一个作者能有很多篇文章

像，这样的关系模型被称为一对多模型

##### 定义

```python
class User(db.Model): 
    id = db.Column(db.Integer, primary_key=True) 
    name = db.Column(db.String(70), unique=True) 
    password = db.Column(db.String(50)) 
    
class Article(db.Model): 
    id = db.Column(db.Integer, primary_key=True)
    title = db.Column(db.String(50), index=True)
    content = db.Column(db.Text)
```

首先定义两个表格：用户、文章表

现在在这两个模型之间建立一个简单的一对多关系，
表示用户的User中添加一个关系属性articles，
作为 集合（collection）属性，当我们对特定的User对象调用articles属性会返
回所有相关的Article对象。这就是一对多模型。

##### 定义外键

什么是外键，通俗的来说就是一个表里面每一列数据的id是唯一的通过`primary_key=True`定义

定义关系首先要在Article创建一个外键
因为一个文章只能有一个用户（User）

```python
class Article(db.Model): 
    ... 
    user_id = db.Column(db.Integer, db.ForeignKey('user.id'))
```

这个字段使用db.ForeignKey类定义Article为外键，
> **传入关系另一侧的表名** + **主键字段** = **user.id**。

实际的效果是将article表的user_id的值限制为 user表的id列的值。
它将用来存储Article表中记录的主键值

###### 注

外键字段的命名没有限制，
为了区分名称，还有user_id的外键是user这个表格里面的主键（id）字段,所以命名
user_id

ForeignKey传入的user.id, 这个user是User表名，在这里传入的时候**大写默认变小写**
还可以根据上文的`__tablename__`修改表名

##### 定义关系类属性

定义关系的第二步是使用关系函数定义关系属性。
在定义属性中，一般把属性定义在User中
因为一个用户能有很多篇文章。

```python
class User(db.Model): 
	... 
	articles = db.relationship('Article')
```

- **relationship()函数的第一个参数为关系另一侧的模型名称，
  它会告诉SQLAlchemy将User与Article类建立关系。**
- 而ForeignKey，里面传入的是**表名**+主键字段

**这两个一定要区分开**

##### 新增（建立）关系

建立关系的方式大概有两种：

- 1.直接通过Article直接修改user_id

```python
article1 = Article.query.get(1)
article.user_id = 1
db.session.commit() # 提交到数据库
```

- 2.通过User的article属性直接append（删除是remove，因为User.articles是个**列表**），添加article对象

```python
article1 = Article.query.get(1)
user1 = User.query.get(1)
user1.article.append(article1)
db.session.commit() # 提交到数据库
```

```python
>>> article1.user_id 
1
>>> user1.articles 
[<Article 1>]


```

##### 删除关系（同理）

```python
article1 = Article.query.get(1)
user1 = User.query.get(1)
user1.article.remove(article1)
db.session.commit() # 提交到数据库
```

最后不要忘记`db.session.commit()`保存提交到数据库



> relationship常用参数

| 参数名            | 说	明                                     |
|----------------|-----------------------------------------|
| back_populates | 定义反向引用，用于建立双向关系，在关系的另一侧也必须显式定义关系属性      |
| backref        | 添加反向引用，A动在另一侧建立关系属性，是back_populates的简化版 |
| lazy           | 指定如何加载相关记录，具体选项见下表                      |
| uselist        | 指定是否使用列表的形式加载记录，设为False则使用标量(scalar)    |
| cascade        | 设置级联操作，后面会具体介绍                          |
| order_by       | 指定加载相关记录时的排序方式                          |
| secondary      | 在多对多关系中指定关联表                            |
| primaryjoin    | 指定多对多关系中的一级联结条件                         |
| secondaryjoin  | 指定多对多关系中的二级联结条件                         |

> lazy参数可选值

| 关系加载方式    | 说	明                                              |
|-----------|--------------------------------------------------|
| select    | 在必要时一次性加载记录，返回包含记录的列表（默认值），等同于lazy=Tme           |
| joined    | 和父査询一样加载记录，但使用联结，等同于lazy=False                   |
| immediate | 一旦父查询加载就加载                                       |
| subquery  | 类似于joined,不过将使用子查询                               |
| dynamic   | 不直接加载记录，而是返回一个包含相关记录的query对象，以便再继续附加查询函 数对结果进行过滤 |

dynamic选项仅用于集合关系属性，不可用于一对多或是在关系函数中将uselist参数设为False的情况。

许多教程和示例使用dynamic来动态加载所有集合关系属性对应的记 录，这是应该避免的行为。使用dynamic加载方式意味着每次操作关系都会
执行一次SQL查询，这会造成潜在的性能问题。大多数情况下我们只需要
使用默认值（select），只有在调用关系属性会返回大量记录，并且总是需要对关系属性返回的结果附加额外的查询时才需要使用动态加载
（lazy='dynamic'）。

##### 建立双向访问关系

比如我可以通过User.articles访问所有的文章
我也能通过Article.user获取User对象

```python
class User(db.Model):
    ...
    # # 2. 定义关系
    # articles = db.relationship('Article')

    # 4. 可以直接添加反向引用
    articles = db.relationship('Article', backref='user')
```

添加反向引用就可以实现
Article.user能获取User对象

建立关系：

```python
article1 = Article.query.get(1)
print(article1.user)
user1 = User.query.get(3)
print(user1.articles)

article1.user = user1
print(article1.user)


```

相对的，将某个Article的user属性设为None，就会解除与对应User对象的关系：

```python
article1.user = None
print(article1.user)
```

另外，在反向调用是时，如果想继续查询，想要把`lazy="dynamic"`
可以这么做

```python
class User(db.Model):
    ...
    # # 2. 定义关系
    # articles = db.relationship('Article')

    # 4. 可以直接添加反向引用
    articles = db.relationship('Article', backref=db.backref('user', lazy="dynamic"))
```

#### 多对多

多对多模型就相当于：一篇文章可以被很多用户收藏；而用户可以收藏很多篇文章
这样比如说:

- 张三收藏了《三体》《流浪地球》；
- 李四收藏了《三体》

但是如果想储存多对多关系，需要另外定义一个表

```python
tb_user_collection = db.Table(
    "info_user_collection",
    db.Column(
        "user_id", db.Integer, db.ForeignKey("user.id"), primary_key=True
    ),  # 文章编号
    db.Column(
        "article_id", db.Integer, db.ForeignKey("article.id"), primary_key=True
    ),  # 分类编号
)

class User(db.Model):
    ...
    collection_articles = db.relationship(
        "Article", secondary=tb_user_collection
    )  # 用户收藏的文章
    
```

定义当方法和一对多模型差不多，
而在`relationship()`里面secondary需要添加多对多模型关系的表的对象
在`info_user_collection`表中，需要定义两个外键，分别是`user.id`、`article.id`

##### 新增|删除 关系

方法和一对多模型相似使用列表的`append()`、`remove()`来实现新增删除对象

##### 双向查询

定义方式和一对多模型一模一样，还是使用backref参数设置反向查询对象

```python
class User(db.Model):
    ...
    collection_articles = db.relationship(
        "Article", secondary=tb_user_collection, backref='users'
    )  # 用户收藏的文章
    
```

## Flask-Migrate

Flask-Migrate 是一个扩展，用于处理使用 Alembic 的 Flask 应用程序的 SQLAlchemy 数据库迁移。数据库操作作为 `flask db`
命令下的命令行参数提供。

### 安装

::: code-group

```shell[pip]
pip install Flask-Migrate
```

```shell[poetry]
poetry add Flask-Migrate
```

:::

### 注册到app

```python
from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate

app = Flask(__name__)
app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///app.db'

db = SQLAlchemy(app)
migrate = Migrate(app, db)

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(128))
```

注册的时候要传入两个参数第一个是**app对象**，另一个是**flask-sqlalchemy的db对象**

### 数据迁移

使用上述应用程序，您可以使用以下命令创建数据库或启用迁移（如果数据库已存在）：
```shell
flask db init
```

请注意，必须根据 Flask 文档设置 `FLASK_APP` 环境变量，此命令才能正常工作。这会将一个 `migrations` 文件夹添加到您的应用程序中。此文件夹的内容需要与其他源文件一起添加到版本控制中。

然后，您可以生成初始迁移：

```shell
flask db migrate
```

迁移脚本需要审查和编辑，因为 Alembic 目前不会检测到您对模型所做的每个更改。特别是，Alembic 目前无法检测到索引。完成后，还需要将迁移脚本添加到版本控制中。

然后，您可以将迁移应用于数据库：

```shell
flask db upgrade
```

**然后，每次数据库模型更改时，都重复 migrate and upgrade 命令。**


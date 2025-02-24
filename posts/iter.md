---
date: 2025.2.24
title: Python迭代器与生成器
tags:
  - python
  - python进阶
description: 介绍Python迭代起和生成器，优势，用法
---

# Python迭代器与生成器

## 迭代器

### 迭代

在进行了解迭代器和生成器之前先了解一下什么是迭代？可迭代对象？

#### 案例

咱们先看案例
，首先如果你想要逐个访问一个字符串，列表，元组，字典，集合等中每一个数据这个时候我们需要用到for循环
:::code-group

```python[代码]
array = ['a', 'b', 'c']
for i in array:
    print(i)
```

```text[返回的结果]
a
b
c
```

:::
上面案例看到了列表可以被用for遍历（逐个访问每一个内容），除了列表，
字符串，元组，字典，集合，**迭代器**等都可以被for遍历
这个时候你可能会看到列表， 字符串，元组，字典，集合这不都学过吗，但**迭代器**甚至都没听过
，那迭代器到底是什么，现在我用一个案例展示一下迭代器的使用方法
:::code-group

```python[代码]
array = ['a', 'b', 'c'] 
array = iter(array) # iter()就是声明为迭代器
array = array.__iter__() # 这行代码和上一行代码是等效的
print(array.__next__())# .__next__() 等同于next(array)
print(next(array)) 
print(array.__next__())
```

```text[返回的结果]
a
b
c
```

:::
首先先定义一个迭代器，把列表转换成迭代器，类比于相当于我把整数1用`str()`转换成了字符串'1'。
大家发现迭代器不仅可以用for遍历而且也可以用`next()`方法进行遍历。

迭代器的`next()`方法每一次调用就能按照次序的返回里面的每一个数据。

#### next()和for的区别

但我们思考一个问题，在使用for遍历时，当遍历到最后一个内容之后会跳出循环，这个是众所周知的，
但当使用next()方法时，假设列表[1, 2, 3]我调用三次next()就会按顺序返回1,2,3。
可是当我第四次调用next()时是会返回1，还是还会返回3，还是报错？

先做个实验
:::code-group

```python[代码]
array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
array2 = iter(array2)
while True:
    print(array2.__next__())
```

```text[返回的结果]
1
2
3
4
5
6
7
8
9
Traceback (most recent call last):
  File "D:\xiaoquqi\pythonProject1\iter.py", line 10, in <module>
    print(array2.__next__())
StopIteration 
```

:::
我们发现是报错了<br>

StopIteration报错，意思是这个对象里面只有九个数据，使用九次`next()`函数之后，
指针就移动到了最后一个元素的后面。如果再访问，指针并没有自动返回到首位置，而是仍然停留在末位置，所以报
StopIteration，想要再开始，需要重新载入迭代对象。
如果这样的话可以给代码修改一下下

```python
array2 = [1, 2, 3, 4, 5, 6, 7, 8, 9]
array2 = iter(array2)
while True:
    try:
        print(array2.__next__())
    except StopIteration:
        break
```

这样就成功的调用成功了

#### 总结

以上这些可以被遍历的都叫可迭代对象
包括：列表， 字符串，元组，字典，集合，**迭代器**等

#### 名词解释归纳

| 名词    | 解释                                                           |
|-------|:-------------------------------------------------------------|
| 迭代    | 一次次的逐个访问每一个内容                                                |
| 遍历    | 一次次的逐个访问每一个内容，而且一次只能访问一个内容，也叫迭代，可以把迭代和遍历理解为同一个事物             |
| 可迭代对象 | 可以被遍历逐个访问的对象，并且能够用循环语句之类的方法来一个一个读取元素。那么用来循环的如 for 就被称之为迭代工具。 |
| 循环    | 指的是在满足条件的情况下，重复执行同一段代码                                       |

### 迭代器介绍

> 迭代器：**迭代器是一个可以记住遍历内容的位置的对象。**

通俗点讲就是，有`next()`方法的对象就叫做迭代器

#### 迭代器与可迭代对象区别和关系

可迭代对象：前面我只给大家举了例子包括有（字符串，列表，元组，字典，集合，迭代器等），
现在给大家介绍可迭代对象的定义。

> 定义：可以用for循环遍历逐个访问每一项内容的对象

**特点：所有的可迭代对象都有__iter__()方法，也就是说有__iter__()方法的都是可迭代对象**
而迭代器那，迭代器是有`next()`方法的可迭代对象

![迭代器与可迭代对象关系.png](/public/images/迭代器与可迭代对象关系.png)

看图可以明白可迭代对象分为三类。
迭代器不仅拥有`__iter__()`方法而且还有`next()`方法
字符串，元组列表集合，字典等只有`__iter__()`方法

**综上所述**：可迭代对象包含迭代器。

如果用 `dir(list)`,`dir(tuple)`,`dir(set)`,`dir(dict)` 来查看不同类型对象的属性，会发现它们都有一个名为`__iter__()`
的东西。这个应该引起读者的关注，因为它和迭代器（iterator）、内置的函数 `iter()` 在名字上是一样的，除了前后的双下划线。

我们也能猜出它肯定是跟迭代有关的东西。当然，这种猜测也不是没有根据的，其重要根据就是英文单词，如果它们之间没有一点关系，肯定不会将命名搞得一样。

`__iter__()` 就是对象的一个特殊方法，它是迭代规则 `(iterator potocol)`
的基础。或者说，对象如果没有它，就不能返回迭代器，就没有 `next()` 方法，就不能迭代。

### iter() 函数与 next() 函数

字符串，列表，元组，字典，集合等都是可迭代对象，我们可以通过 `iter()`
函数将这些可迭代对象转化成迭代器对象。然后我们可以对获取到的迭代器不断使用next()函数来获取下一条数据。`iter()`
函数实际上就是调用了可迭代对象的 `__iter__()` 方法。
前面已经在案例中提过了。
:::code-group

```python[代码]
array = ['a', 'b', 'c'] 
array = iter(array) # iter()就是声明为迭代器
array = array.__iter__() # 这行代码和上一行代码是等效的
print(array.__next__())# .__next__() 等同于next(array)
print(next(array)) 
print(array.__next__())
print(array.__next__())
```

```text[返回的结果]
a
b
c
Traceback (most recent call last):
  File "D:\xiaoquqi\pythonProject1\iter.py", line 10, in <module>
    print(array.__next__())
StopIteration 
```

> 注意，当我们已经迭代完最后一个数据之后，再次调用next()函数会抛出 `StopIteration`
> 的异常，来告诉我们所有数据都已迭代完成，不用再执行next()函数了。

### 自定义迭代器

迭代器是用来帮助我们 **记录每次迭代访问到的位置** ，当我们对迭代器使用next()
函数的时候，迭代器会向我们返回它所记录位置的下一个位置的数据。实际上，在使用next()
函数的时候，调用的就是迭代器对象的`__next__`方法。所以，我们要想构造一个迭代器，就要实现它的`__next__`
方法。但这还不够，python要求迭代器本身也是可迭代的，所以我们还要为迭代器实现`__iter__`方法，而`__iter__`
方法要返回一个迭代器，迭代器自身正是一个迭代器，所以迭代器的`__iter__`方法返回自身即可。

一个实现了`__iter__()` 方法和`__next__()` 方法的对象，就是迭代器。

`list`、`tuple`、`set`、`dict` 对象有`__iter__()`方法，标着他们能够迭代。这些类型都是 Python 中固有的，我们能不能自己写一个对象，让它能够迭代呢？

当然呢！要不然 python 怎么强悍呢。
:::code-group

```python[code]
"""
自己实现range方法
"""
class MyRange(object):
    def __init__(self, n):
        self.i = 0
        self.n = n

    def __iter__(self):
        return self

    def __next__(self):
        if self.i < self.n:
            i = self.i
            self.i += 1
            return i
        else:
            raise StopIteration()

x = MyRange(7)
print("x.next()==>", x.__next__())
print("x.next()==>", x.__next__())
print("------for loop--------")
for i in x:
    print(i)
```

```text[cmd]
x.next()==> 0
x.next()==> 1
------for loop--------
2
3
4
5
6
```

:::
以上代码的含义，是自己仿写了拥有 `range()` 的对象，这个对象是可迭代的。分析如下：

`__iter__()` 是类中的核心，它返回了迭代器本身。一个实现了`__iter__()`方法的对象，即意味着其实可迭代的。

含有 `next()` 的对象，就是迭代器，并且在这个方法中，在没有元素的时候要发起 `StopIteration()` 异常。

如果对以上类的调用换一种方式：

```python
x = MyRange(7)
print(list(x))
print("x.next()==>", x.next())
```

:::warning
`print(list(x))` 将对象返回值都装进了列表中并打印出来，这个正常运行了。此时指针已经移动到了迭代对象的最后一个，`next()`
方法没有检测也不知道是不是要停止了，它还要继续下去，当继续下一个的时候，才发现没有元素了，于是返回了 `StopIteration()`。
:::

### 判断一个对象是否是可迭代对象

可以使用 `isinstance()` 判断一个对象是否是 Iterable 对象：
:::code-group

```python[版本低于3.10]
from collections import Iterable

print(isinstance([], Iterable))
print(isinstance(iter([]), Iterable))
print(isinstance(iter("abc"), Iterable))
```

```python[版本高于或等于3.10]
from collections.abc import Iterable

print(isinstance([], Iterable))
print(isinstance(iter([]), Iterable))
print(isinstance(iter("abc"), Iterable))
```

```text[运行的效果]
True
True
True
```

:::

### 判断对象是否是迭代器

可以使用 `isinstance()` 判断一个对象是否是 Iterator 对象：
:::code-group

```python[版本低于3.10]
from collections import Iterator

isinstance([], Iterator)
isinstance(iter([]), Iterator)
isinstance(iter("abc"), Iterator)
```

```python[版本高于或等于3.10]
from collections.abc import Iterator

isinstance([], Iterator)
isinstance(iter([]), Iterator)
isinstance(iter("abc"), Iterator)
```

```text[运行的效果]
False
True
True
```

:::
不难看出list 不是迭代器

### for...in...循环的本质

for **`item`** in **`Iterable`** 循环的本质就是先通过 `iter()` 函数将可迭代对象 `Iterable`
转换为迭代器对象，然后对获取到的迭代器不断调用`next()`方法来获取下一个值并将其赋值给item，当遇到 `StopIteration` 的异常后循环结束。

### 并不是只有for循环能接收可迭代对象

除了`for`循环能接收可迭代对象，`list`、`tuple`等也能接收。
:::code-group

```python[code]
li = list(range(10))
print(li)
tp = tuple(range(12))
print(tp)
```

```python[cmd]
[0, 1, 2, 3, 4, 5, 6, 7, 8, 9]
(0, 1, 2, 3, 4, 5, 6, 7, 8, 9, 10, 11)
```

:::

## 生成器

> 生成器是一种特殊的迭代器，生成器自动实现了“迭代器协议”（即__iter__和next方法），不需要再手动实现两方法。

> 生成器在迭代的过程中可以改变当前迭代值，而修改普通迭代器的当前迭代值往往会发生异常，影响程序的执行。

那么让我来介绍一下如何自定义一个生成器

:::code-group

```python[code]
def func1():
    yield 1
    yield 2
    yield 3
print(dir(func1()))
```

```text[cmd]
['__class__', '__del__', '__delattr__', '__dir__', '__doc__', '__eq__', '__format__', '__ge__', '__getattribute__', '__gt__', '__hash__', '__init__', '__init_subclass__', '__iter__', '__le__', '__lt__', '__name__', '__ne__', '__new__', '__next__', '__qualname__', '__reduce__', '__reduce_ex__', '__repr__', '__setattr__', '__sizeof__', '__str__', '__subclasshook__', 'close', 'gi_code', 'gi_frame', 'gi_running', 'gi_yieldfrom', 'send', 'throw']
```

:::
首先生成器的定义就是一个函数，因这他是特殊的迭代器，所以定义的话直接省略了`iter()`,`next()`方法的定义，
就可以直接用`yield`进行定义。

然后我们可以看到打印的这个生成器对象的方法中有__iter__(),__next__()进而看出了生成器对象实则就是一个迭代器，
定义方法则比迭代器的定义方法简单许多

### yield的意义

现在来理解一下yield的意义
yield其实可以理解为函数的return，众所周知，**函数中的return返回一个数据就自动退出函数运行**，
**但是yield是返回数据但不退出函数**

:::code-group

```python[code]
def func1():
    yield 1
    yield 2
    yield 3
print(func1())
f = func1()
print(f.__next__())
print(f.__next__())
print(f.__next__())
```

```text[cmd]
<generator object func1 at 0x0000019F53BA4200>
1
2
3
```

:::
通过代码可以看出如果直接print生成器函数那么返回的不是数据结果，而是一个对象
如果想要获得数据可以使用for循环，也可以用next()获取数据，也可以转换成列表，元组等。

如果我上面说的话没有理解没有关系可以看一个案例就能明白

#### 案例：理解yield和return的区别

为了弄清楚 yield 和 return 的区别，我们写两个没有什么用途的函数：
:::code-group

```python[code]
def r_return(n):
     print("进入了函数.")
     while n > 0:
         print("返回内容之前")
         return n
         n -= 1
         print("返回内容之后")
rr = r_return(3)
print(rr)
```

```text[cmd]
进入了函数.
返回内容之前
3
```

:::
从函数被调用的过程可以清晰看出，`rr = r_return(3)`，函数体内的语句就开始执行了，遇到 return，将值返回，然后就结束函数体内的执行。所以
return 后面的语句根本没有执行。

下面将 return 改为 yield：
:::code-group

```python[code]
def y_yield(n):
     print("进入了函数.")
     while n > 0:
         print("返回内容之前")
         yield n
         n -= 1
         print("返回内容之后")
 
yy = y_yield(3)    #没有执行函数体内语句
print(yy.__next__())                             
print(yy.__next__())                 
print(yy.__next__())          
print(yy.__next__())
```

```text[cmd]
进入了函数.
返回内容之前
3
返回内容之后
返回内容之前
2
返回内容之后
返回内容之前
1
返回内容之后
Traceback (most recent call last):
  File "D:\xiaoquqi\pythonProject1\iter.py", line 107, in <module>
    print(yy.__next__())
StopIteration
```

:::
一般的函数，都是止于 return。作为生成器的函数，由于有了 yield，则会遇到它挂起，如果还有
return，遇到它就直接抛出 `SoptIteration` 异常而中止迭代。

经过上面的各种例子，已经明确，一个函数中，只要包含了 yield
语句，它就是生成器，也是迭代器。这种方式显然比前面写迭代器的类要简便多了。但，并不意味着上节的就被抛弃。是生成器还是迭代器，都是根据具体的使用情景而定。

### 能接受参数的生成器（不常用）

在实际开发中不常用，所以不做过多介绍

```python
def simple_coroutine():
    print('生成器启动')
    while True:
        n = yield
        print('生成器接收到的参数为 %s' % n)

my_coro = simple_coroutine()
next(my_coro)
my_coro.send("hello")
```

当执行到 `my_coro.next()` 的时候，生成器开始执行，在内部遇到了 `yield` 挂起。注意在生成器函数中，`n = yield`
中的 `n = yield` 是一个表达式，并将接收到的结果赋值给 n。

当执行 `my_coro.send("hello")` 的时候，原来已经被挂起的生成器（函数）又被唤醒，开始执行 `n = yield `，也就是讲 send()
方法发送的值返回。这就是在运行后能够为生成器提供值的含义。

如果接下来再执行 `next(my_coro)` 会怎样？

什么也没有，其实就是返回了 None。按照前面的叙述，读者可以看到，这次执行 `next()`，由于没有传入任何值，yield 返回的就只能是
None.

> 最后一句，你在编程中，不用生成器也可以。
---
date: 2023.9.2
title: Poetry的基本使用
tags:
  - python
  - poetry
description: 使用Poetry进行项目打包、管理依赖
---

# {{ $frontmatter.title }}

Python的打包系统和依赖管理相当复杂，对新人来讲尤其费解。要正确地创建Python项目所需要的文件:setup.py, requirements.txt,
setup.cfg, http://MANIFEST.in 和新加入的pipfile，有时候即使对一个有经验的老手，也是有一些困难的。因此，我希望创建一种工具，只用一个文件就实现依赖管理、打包和发布。

通过前面的案例，我们已经提出了一些问题。但不止于此。

当您将依赖加入到`requirements.txt`
时，没有人帮你确定它是否与既存的依赖能够和平共处，这个过程要比我们想象的复杂许多，不仅仅是直接依赖，还需要考虑彼此的传递依赖是否也能彼此兼容；所以一般的做法是，先将它们加进来，完成开发和测试，在打包之前，运行
`pip freeze > requirements.txt`
来锁定依赖库的版本。但我们也在前面的案例中提到，这种方法可能会将不必要的开发依赖打入到发行版中；此外，它也会过度锁定版本，从而使得一些活跃的第三方库失去自动更新热修复和安全更新的机会。

项目的版本管理也是一个问题。在老旧的Python项目中，一般我们使用bumpversion来管理版本，它需要使用三个文件。在我的日常使用时，它常常会出现各种问题，最常见的是单双引号导致把`__version__`
=0.1当成一个版本号，而不是`0.1`。这样打出来的包名也会奇怪地多一个无意义的version字样。单双引号则是因为你的format工具对字符串常量应该使用什么样的引号规则有自己的意见。

项目进行打包和发布需要准备太多的文件，正如Poetry的开发者所说，要确保这些文件的内容完全正确，对一个有经验的开发者来说，也不是轻而易举的事；更重要的是，我们也决不应该在这方面花费太多的时间！

Poetry解决了所有这些问题（除了案例中的第一个，该问题要通过tox和CI来解决）。它提供了版本管理、依赖解析、构建和发布的一站式服务，并将所有的配置，集中到一个文件中，即pyproject.toml。此外，Poetry还提供了一个简单的工程创建向导。

## 什么是poetry?

Poetry 和 Pipenv 类似，是一个 Python 虚拟环境和依赖管理工具，另外它还提供了包管理功能，比如打包和发布。你可以把它看做是
Pipenv 和 Flit 这些工具的超集。它可以让你用 Poetry 来同时管理 Python 库和 Python 程序。

### 方便在哪？

#### pip

pip比如说：我安装一个flask包会有很多依赖
但是如果我删除了flask包依赖没有被删除
这就是pip处理依赖的问题

#### poetry

然而poetry就完美解决了这个问题，依赖是不会写入`pyproject.toml`配置文件的
删除一个包会默认删除她的依赖

## 安装poetry

```shell
pip install poetry
```

## Poetry 的基本用法

Poetry 的用法很简单，大部分命令和 Pipenv 接近。我们需要先了解一些基本概念和 Tips：

使用 PEP 518 引入的新标准 pyproject.toml 文件管理依赖列表和项目的各种 meta 信息，用来替代
Pipfile、requirements.txt、setup.py、setup.cfg、MANIFEST.in 等等各种配置文件。
依赖分为两种，普通依赖（生产环境）和开发依赖。
安装某个包，会在 pyproject.toml 文件中默认使用 upper bound（中文翻译？）版本限定，比如 Flask^1.1。这被叫做 Caret
requirements（中文翻译？），比如某个依赖的版本限定是 ^2.9.0，当你执行 poetry update 的时候，它或许会更新到 2.14.0，但不会更新到
3.0.0；假如固定的版本是 ^0.1.11，它可能会更新到 0.1.19，但不会更新到 0.2.0。总之，在更新依赖的时候不会修改最左边非零的数字号版本（对于
SemVer 版本号而言），这样的默认设定可以确保你在更新依赖的时候不会更新到具有不兼容变动的版本。另外也支持更多依赖版本限定符号。
不会像 Pipenv 那样随时更新你的锁定依赖版本，锁定依赖存储在 poetry.lock 文件里（这个文件会自动生成）。所以，记得把你的
poetry.lock 文件纳入版本控制。
执行 poetry 或 poetry list 命令查看所有可用的命令。
如果你想了解更多进阶的内容，比如设置命令行补全、打包和发布等等，请阅读 [Poetry](https://python-poetry.org/docs/) 文档。

### 初始化

如果你是在一个已有的项目里使用 Poetry，你只需要执行 `poetry init` 命令来创建一个 pyproject.toml 文件：

```shell
mkdir poetry-demo
cd poetry-demo
poetry init
```

这时会在项目里创建一个文件`pyproject.toml`

```toml
[tool.poetry]
name = "poetry-demo"
version = "0.1.0"
description = ""
authors = ["xxxxxx <pyxxponly@gmail.com>"]
readme = "README.md"
packages = [{include = "poetry_demo"}]

[tool.poetry.dependencies]
python = "^3.10"


[build-system]
requires = ["poetry-core"]
build-backend = "poetry.core.masonry.api"
```

### 创建虚拟环境

使用以下代码可以在项目里面创建一个虚拟环境，并产生一个文件夹`.venv`
这个文件夹与用`python -m venv venv`创建的是一样差不多的

```shell
poetry env use python
```

#### 重点说明

- `poetry env use python` 是使用当前命令行下激活的 python 解释器创建虚拟环境
    - 也可以将指令最后的 python ，改为 python3、python3.8，之类的，甚至只要需要 3.8，只要确保对于的解释器能够在环境变量中找到。
    - 更多的配置可以查看 [官方文档](https://python-poetry.org/)
- poetry
  默认会将虚拟环境统一放在指定目录，例如刚刚创建的项目就放在 `C:\Users\xxp\AppData\Local\pypoetry\Cache\virtualenvs\`
  目录当中
- 虚拟环境的命名模式为`项目名-随机数-python版本`
  对于这种命名我个人是蛮喜欢的，每个项目有一个单独虚拟环境，并且制定了对应的版本，看一眼就能知道自己使用的环境是否正确。

对于 poetry 将虚拟环境统一放在指定路径下，这一点我更偏向于 venv 的做法，也就是把虚拟环境放在项目目录下，方便用于观看依赖包的源码，在做项目部署的时候更方便一些。

所幸 poetry 提供了这样的选项。

在当前项目下创建虚拟环境
我们可以使用 poetry config --list 指令来查看 poetry 的几个主要设定，

```shell
X:\poetry-demo>poetry config --list
cache-dir = "C:\\Users\\xxp\\AppData\\Local\\pypoetry\\Cache"
experimental.new-installer = true
experimental.system-git-client = false
installer.max-workers = null
installer.modern-installation = true
installer.no-binary = null
installer.parallel = true
virtualenvs.create = true
virtualenvs.in-project = null
virtualenvs.options.always-copy = false
virtualenvs.options.no-pip = false
virtualenvs.options.no-setuptools = false
virtualenvs.options.system-site-packages = false
virtualenvs.path = "C:\\Users\\xxp\\AppData\\Local\\pypoetry\\Cache\\virtualenvs"
virtualenvs.prefer-active-python = false
virtualenvs.prompt = "{project_name}-py{python_version}"
```

其中 `virtualenvs.create = true` 若改为 false，则可以停止 poetry 在检查不到虚拟环境是自动创建的行为模式，但是建议不要改动。

而 `virtualenvs.in-project = false` 就是我们要修改的目标，使用指令：

```shell
poetry config virtualenvs.in-project true
```

先把之前创建的虚拟环境删除

```shell
X:\poetry-demo>poetry env remove python
Deleted virtualenv: C:\Users\xxp\AppData\Local\pypoetry\Cache\virtualenvs\poetry-demo-Ut74gzEx-py3.10
```

重新创建虚拟环境，看一下差异：

```shell
X:\poetry-demo>poetry env use python
Creating virtualenv poetry-demo in X:\poetry-demo\.venv
Using virtualenv: X:\poetry-demo\.venv

```

可以看出：

虚拟环境的路径改为项目的根目录下了
名称固定位 `.venv`
个人觉得这样的设定更加简洁。

### 激活虚拟环境

如果你想显式的激活虚拟环境，使用` poetry shell `命令：

```shell
X:\poetry-demo>poetry shell
Spawning shell within X:\poetry-demo\.venv

(poetry-demo-py3.10) X:\poetry-demo>
```

这样你就能进入poetry虚拟环境了

如果想退出直接在命令行里输入`exit`就可以退出

```shell
(poetry-demo-py3.10) X:\poetry-demo>exit
X:\poetry-demo>
```

## Poetry指令的使用

### 安装包

使用 `poetry add` 命令来安装一个包：

```shell
poetry add flask
```

添加 `--dev` 参数可以指定为开发依赖：

```shell
 poetry add pytest --dev
```

注意：安装的包和模块的开发依赖不写入`pyproject.toml`

### 追踪 & 更新包
使用 `poetry show` 命令可以查看所有安装的依赖（可以传递包名称作为参数查看具体某个包的信息）：

```shell
$ poetry show
```
添加 `--tree` 选项可以查看依赖关系：
```shell
$ poetry show --tree
```
添加 `--outdated` 可以查看可以更新的依赖：
```shell
$ poetry show --outdated
```
执行 `poetry update` 命令可以更新所有锁定版本的依赖：
```shell
$ poetry update
```
如果你想更新某个指定的依赖，传递包名作为参数：
```shell
$ poetry update foo
```
### 卸载包
使用 `poetry remove <包名称>` 卸载一个包：
```shell
$ poetry remove foo
```
## 使用
当你从gitee、github上下载一个仓库使用的是poetry管理的包，里面没有虚拟环境
这时我们就不能使用`poetry env use python`创建虚拟环境了，
我们需要在命令行里输入`poetry install`来进行创建虚拟环境，**并自动安装依赖包**

```shell
# 就会把所有在pyproject.toml上的所有包都下载下来并创建虚拟环境
poetry install
```

下面紧接着就可以运行代码了！

## 更多
更多的用法可以详细查看：[使用 Python Poetry 进行依赖项管理（翻译）](https://muzing.top/posts/3fa905f9/)
## 换源
```shell
poetry source add tsinghua https://pypi.tuna.tsinghua.edu.cn/simple
```
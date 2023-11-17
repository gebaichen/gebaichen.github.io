---
date: 2023.9.11
title: 格式化Python代码并对提交进行检查
tags:
  - python
  - black
  - isort
  - pre-commit
  - python代码规范
description: 格式化Python代码并对提交进行检查，有助于更好的多人开发
---

# 格式化代码并对提交进行检查

## 为什么要用工具来格式化代码？

在做项目中我们可能会遇到一个问题，这个问题就是，如果多人开发的时候，每个人的
代码风格也都不一样，如何统一，让每个人都看懂对方的代码？
这个时候就需要格式化工具对代码进行格式化处理
并且如果你的代码放在gitee/github上代码很烂，是会被喷的，
还有如果那你自身代码写得并不规范可以使用格式化代码工具来，把代码进行格式化，
更加符合编程规范

## Black

### black介绍

使用 Python 这么久以来，我尝过不少的代码格式化工具，但是因为配置麻烦最终都放弃了。直到遇见了 black
。这个工具实现了零配置将所有的代码格式统一，并且可以配置到 pre-commit ， 在用 Git 进行提交之前进行校验，这样就可以非常轻松的实现项目所有代码风格完全统一。

### 安装

::: code-group

```shell[pip]
pip install black
```

```shell[poetry]
poetry add black
```

:::

### 简单使用

1、作为脚本运行

```shell
black {source_file_or_directory}
# black {文件或者目录}
```

2、如果将 Black 作为脚本运行不起作用，您可以尝试将其作为包运行：

```shell
python -m black {source_file_or_directory}

```

3、如果想要将当前目录下所有文件格式化，也可以使用 black .

```shell
black .
```

## Isort

isort 是一个实用的 Python 程序/库，用于按照字母表顺序对 imports 进行排序，并自动按类型（标准库/第三方库/自己的模块/……）划分部分。它为各种编辑器提供了命令行程序、Python
库和插件，以快速对所有导入进行排序。

### 安装

::: code-group

```shell[pip]
pip install isort
```

```shell[poetry]
poetry add isort
```

:::

::: tip

如果您希望 isort 作为项目的 linter，则可能需要为每个使用它的项目添加 isort 作为显示开发依赖项。另一方面，如果您是个人开发人员，只是使用
isort 作为个人工具来清理您自己的 commit ，那么全局或用户级别的安装是有意义的。两者都在一台机器上无缝支持。 简单使

:::

### 简单使用

1、命令行使用

在特定文件上运行：

```shell
isort mypythonfile.py mypythonfile2.py
```

2、递归地使用：

```shell
isort .
```

3、在 Python 内使用

```python
import isort

isort.file("pythonfile.py")
```

## pre-commit

> https://blog.csdn.net/kiscon/article/details/115399290
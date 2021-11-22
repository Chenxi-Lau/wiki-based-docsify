# 工作流程

> Git 常用的 6 个命令：**git clone**、**git push**、**git add** 、**git commit**、**git checkout**、**git pull**

Git 工作流程的基本示意图为：

![img](https://www.runoob.com/wp-content/uploads/2015/02/git-command.jpg)

**说明：**

- workspace：工作区
- staging area：暂存区/缓存区
- local repository：或本地仓库
- remote repository：远程仓库

一个简单的操作步骤：

```git
$ git init
$ git add .
$ git commit
```

- git init - 初始化仓库。
- git add . - 添加文件到暂存区。
- git commit - 将暂存区内容添加到仓库中。

## 1.常用命令

| 命令       | 说明                                     |
| ---------- | ---------------------------------------- |
| git add    | 添加文件到缓存区                         |
| git status | 查看仓库当前的状态，显示有变更的文件。   |
| git diff   | 比较文件的不同，即暂存区和工作区的差异。 |
| git commit | 提交暂存区到本地仓库。                   |
| git reset  | 回退版本。                               |
| git rm     | 删除工作区文件。                         |
| git mv     | 移动或重命名工作区文件。                 |

## 2.远程操作

| 命令      | 说明                 |
| --------- | -------------------- |
| git fetch | 从远程获取代码库。   |
| git pull  | 下载远程代码并合并。 |
| git push  | 上传远程代码并合并。 |

## 3.分支管理

| 命令                     | 说明           |
| ------------------------ | -------------- |
| git branch branchname    | 创建分支命令。 |
| git checkout branchname  | 切换分支命令。 |
| git merge                | 合并分支命令。 |
| git branch -d branchname | 删除分支命令。 |

# 常用命令

::: tip
此处只列举命令名称，命令的具体用法可直接在[手册](https://www.linuxcool.com/)中查询
:::

## 系统信息

- uname 查看系统信息
- hostname 查看主机名
- cat /proc/cpuinfo 查看 CPU 信息
- lsmod 查看已加载的系统模块
- top 查看系统使用情况
- df 查看磁盘使用情况
- fdisk 查看磁盘分区
- du 查看目录使用情况
- iostat 查看 I / O 使用情况
- free 显示系统内存情况
- env 查看环境变量
- uptime 查看系统运行时间、用户数、负载

## 系统操作

- shutdown 关机
- reboot 重启
- mount 挂载设备
- umount 卸载设备

## 用户相关

- su 切换用户
- sudo 以管理员身份执行
- who 查看当前用户名
- ssh 远程连接
- logout 注销
- useradd 创建用户
- userdel 删除用户
- usermod 修改用户
- groupadd 创建用户组
- groupdel 删除用户组
- groupmod 修改用户组
- passwd 修改密码
- last 显示用户或终端的登录情况

## 文件相关

- cd 切换目录
- ls 查看目录列表
- tree 打印目录树
- mkdir 创建目录
- rm 删除目录
- touch 新建文件
- cp 复制文件
- mv 移动文件
- ln 创建文件链接
- find 搜索文件
- locate 定位文件
- whereis 查看可执行文件路径
- which 在 PATH 指定的路径中，搜索某系统命令的位置
- chmod 设置目录权限
- cat / more / less 查看文件
- tac 倒序查看文件
- head / tail 查看文件开头 / 结尾
- paste 合并文件
- zip / tar / gzip 压缩文件
- unzip / tar / gunzip 解压文件
- grep / sed / awk 文本处理
- vim 文本编辑

![vim键盘图](https://www.runoob.com/wp-content/uploads/2015/10/vi-vim-cheat-sheet-sch1.gif)

## 程序相关

- crontab 计划任务
- nohup 后台运行程序
- jobs 查看系统任务
- ps 查看进程
- kill 杀死进程
- rpm / yum / apt / apt-get / dpkg 软件包管理
- service / systemctl 服务管理

## 网络相关

- ifconfig 查看网络属性
- netstat 查看网络状态
- iptables 查看 iptables 规则

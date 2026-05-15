# ssh相关
## ssh免密码登陆
设需要从B机器登陆到A机器
1. 登录A机器
2. 执行下面代码, 将会在~/.ssh下生成密钥文件和私钥文件 id_rsa,id_rsa.pub或id_dsa,id_dsa.pub
  ```bash
  ssh-keygen -t [rsa|dsa]
  ```
3. 将 .pub 文件复制到B机器的 .ssh 目录， 并 
  ```bash
  cat id_dsa.pub >> ~/.ssh/authorized_keys
  ```
4. 大功告成，从B机器登录A机器的目标账户，不再需要密码了

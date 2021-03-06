Simulators
=======

A system for Simulators.

- *great.simulators* is the version for Great Ideas in Computer Science 2019
- *sjtu.cool* is the version for Programming Fall 2015 AI Project
- *p2dv.in* is the version for Programming Fall 2014 AI Project

## Core Server Setup Example

```sh
sudo locale-gen zh_CN.UTF-8
sudo dpkg-reconfigure tzdata

curl -sL https://deb.nodesource.com/setup_0.12 | sudo bash -
sudo apt-get install build-essential git python-pip python3-pip python-dev nodejs screen mongodb-server vim nginx npm
sudo pip3 install tornado pymongo subprocess32
sudo pip3 install tabulate requests
sudo useradd -m -s /bin/bash p2dv
sudo passwd p2dv
sudo vim /etc/nginx/sites-enabled/default
sudo service nginx reload

# as p2dv at /home/p2dv
su p2dv
cd /home/p2dv
git clone https://github.com/spectrometerHBH/sjtu.cool.git
cp sjtu.cool/core_server/const.sample.py sjtu.cool/core_server/const.py
cp sjtu.cool/web/settings.sample.js sjtu.cool/web/settings.js
vim sjtu.cool/core_server/const.py
vim sjtu.cool/web/settings.js
mkdir data
mkdir data/ai
mkdir data/log
mkdir data/upload
mkdir log

# start web service
screen -S web
cd sjtu.cool/web/
npm install express connect-mongo method-override ejs mongoose body-parser # install nodejs packeages, maybe not complete
node app.js 

# start task dispatcher
screen -S core_server
cd sjtu.cool/core_server/
python3 core_server.py 
```

## Judge Server Setup Example

```sh
sudo locale-gen zh_CN.UTF-8
sudo dpkg-reconfigure tzdata
sudo apt-get update
sudo apt-get install build-essential git python-pip python-dev screen vim
sudo pip install subprocess32 pymongo
sudo useradd -m -s /bin/bash p2dv
sudo passwd p2dv

# as p2dv at /home/p2dv
su p2dv
cd /home/p2dv
git clone https://github.com/spectrometerHBH/sjtu.cool.git
cp sjtu.cool/daemon/const.sample.py sjtu.cool/daemon/const.py
vim sjtu.cool/daemon/const.py
mkdir data
mkdir data/ai
mkdir ai
mkdir log

# either start daemon using screen
screen -S daemon
cd sjtu.cool/daemon/
python3 p2dv.in.py 
```

## Nginx Configuration Example

```conf
server {
    listen 80 default_server;
    listen [::]:80 default_server ipv6only=on;

    #root /usr/share/nginx/html;
    #index index.html index.htm;

    server_name localhost sjtu.cool .sjtu.cool;

    location / {
      proxy_redirect     off;
      proxy_set_header   X-Real-IP          $remote_addr;
      proxy_set_header   X-Forwarded-For    $proxy_add_x_forwarded_for;
      proxy_set_header   X-Forwarded-Proto  $scheme;
      proxy_set_header   Host               $http_host;
      proxy_set_header   X-NginX-Proxy      true;
      proxy_set_header   Connection         "";
      proxy_http_version 1.1;
      proxy_pass         http://127.0.0.1:3000;
    }
}
```

## Credits of *p2dv.in*

- AI Judge by `@juda`: [@juda/animal](https://github.com/juda/animal)
- The whole system by `@abcdabcd987`

## Credits of *sjtu.cool*

- Battle Demo by `@BreakVoid`
- Sample AI by `@greatwall1995`: [gist:chess_sample_ai.cc](https://gist.github.com/abcdabcd987/d6d284227f5c5953c857)
- AI Judge by `@bywbilly`: [@abcdabcd987/ACM-2015-AI-Server](https://github.com/abcdabcd987/ACM-2015-AI-Server)
- IPC library by `@abcdabcd987`: [@abcdabcd987/py-stdio-ipc](https://github.com/abcdabcd987/py-stdio-ipc)
- Adaption from *p2dv.in* by `@abcdabcd987`

## Credits of *great.simulators*

- Simulator Demo by `@ulitaig`/`@yyNoBug`/`@MasterJH5574`/`@abclzr`/`@sparkmxy`
- Adaption from *sjtu.cool* by `@spectrometerHBH`

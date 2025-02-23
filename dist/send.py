import os
from fabric import Connection

os.system('npm run build')
os.system('tar -zcvf dist.tar.gz ./dist')

conn = Connection(host='root@47.92.128.37', connect_kwargs={"password": "Liyao123quqi123"})

conn.put('dist.tar.gz', 'dist.tar.gz')
conn.run('tar -zxvf dist.tar.gz -C .')
conn.run('sudo rm -rf /usr/share/nginx/html/')
conn.run('sudo mv ./dist /usr/share/nginx/html/')
conn.run('rm -rf ./dist')
conn.run('rm -rf ./dist.tar.gz')
os.system('rm -rf ./dist.tar.gz')

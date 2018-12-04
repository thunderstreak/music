const fs = require('fs');
const { spawn } = require('child_process');
const p = spawn("ls", ['-lh', '/usr']);
export default {
    //标准输出
    stdout(){
        p.stdout.on('data', function (d) {
            //创建文件
            fs.open('ls', 'w+', function(err, fd) {
                if (err) {
                    return console.error(err);
                }
            });

            //写入服务器日志
            fs.appendFile('ls', d.toString(),  function(err) {
                if (err) {
                    return console.error(err);
                }
            });
        });
    },
    //标准错误
    stderr(){
        p.stderr.on('data', function (data) {
            //写入服务器错误日志
            fs.appendFile('ls', d.toString(),  function(err) {
                if (err) {
                    return console.error(err);
                }
            });
        });
    }
}

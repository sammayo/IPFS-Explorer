const ipfsAPI = require('ipfs-api');
const bl = require('bl');

var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})
//console.log(ipfs);

function upload(name, data) {
  const file = [ new Buffer(JSON.stringify({name: name, data: data})) ];

  return new Promise((resolve, reject) => {
    ipfs.files.add(file, function(err, files) {
      if (err) {
        console.log(err);
        throw err;
      }
      console.log(files[0].hash);
      resolve(files[0].hash);
    })
  });
}
//upload('sup.txt', "hesdfllo");

function download(hash) {
  var content;
  return new Promise((resolve, reject) => {
    ipfs.files.cat(hash, function(err, stream) {
      if (err) {
        console.log(err);
      }
      stream.pipe(bl((err, data) => {
        content = JSON.parse(data);
        console.log(content);
        resolve(content);
      }))
    });
  });
}

module.exports = {
  upload: upload,
  download: download
};
const ipfsAPI = require('ipfs-api');
const bl = require('bl');

var ipfs = ipfsAPI('localhost', '5001', {protocol: 'http'})
//console.log(ipfs);

function upload(name, data) {
  const file = [ new Buffer(JSON.stringify({name: name, data: data})) ];

  ipfs.files.add(file, function(err, files) {
    if (err) throw err;
    console.log(files[0].hash);
    return files[0].hash;
  })
}
//upload('sup.txt', "hesdfllo");

function download(hash) {
  var content;
  ipfs.files.cat(hash, function(err, stream) {
    if (err) throw err;
    stream.pipe(bl((err, data) => {
      content = JSON.parse(data.toString());
      console.log(content);
    }))
  });
  return content;
}
//download("QmSdj8B9mpjFb4feNcbjdN512du7bPPGuKHzWt4H568TN7")
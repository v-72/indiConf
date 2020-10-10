var getUserMedia = require('getusermedia')

getUserMedia({ video: true, audio: true }, async function (err, stream) {
  if (err) return console.error(err)
  var isMaster = true;
  var count = 0;
  var Peer = require('simple-peer')
  var peer = new Peer({
    initiator: location.hash === '#master',
    trickle: false,
    stream: stream
  })
  if(location.hash === '#slave'){
    isMaster = false;
    const masterId = await callApi('get',{},'master');
    peer.signal(masterId)
  }else if(location.hash === '#master'){
    var checkForSlave = setInterval(checkSlave, 1000);
    async function checkSlave() {
        const slaveId = await callApi('get',{},'slave');
        if(slaveId){
            count ++;
            peer.signal(slaveId);
            clearInterval(checkForSlave);
        }
    }
  }
  peer.on('error', (err)=>{
      alert(err)
  })
  peer.on('signal', function (data) {
    if(count === 0){
        callApi('post',{type: isMaster ? 'master' : 'slave', token: JSON.stringify(data)})
    }
    //document.getElementById('yourId').innerText = JSON.stringify(data)
  })

//   document.getElementById('connect').addEventListener('click', function () {
//     var otherId = JSON.parse(document.getElementById('otherId').value)
//     peer.signal(otherId)
//   })

//   document.getElementById('send').addEventListener('click', function () {
//     var yourMessage = document.getElementById('yourMessage').value
//     peer.send(yourMessage)
//   })

//   peer.on('data', function (data) {
//     document.getElementById('messages').textContent += data + '\n'
//   })

  peer.on('stream', function (stream) {
    const mediaStream = new MediaStream(stream);
    var video = document.getElementById('video')
    video.srcObject = mediaStream
  })
})

async function callApi(method = 'get',data={},type=''){
    try{
        const options =  {
            method: method,
            headers: { 
                "Content-type": "application/json; charset=UTF-8"
            } 
        }
        method === 'post' ? options['body']= JSON.stringify(data): null;
        let response = await fetch(`/api?type=${type}`,options)
        response = await response.json()
        return response.token;
    }catch(err){
        return null
    }
}
// get the users consent to use their camera
navigator.mediaDevices.getUserMedia({ video: { facingMode: "environment" }, audio: false})
// navigator.mediaDevices.getUserMedia({ video: true, audio: false})
.then((stream) => {
    // importing libaries ("simple-peer" for peer-to-peer connections, "signalhub" for the exchange of signaling informaition)
    document.getElementById("play").style.display = "none"; 
    const Peer = require('simple-peer')
    const peer = new Peer ({
        initiator: location.hash == '#init',
        trickle: false,
        stream: stream
    })

    const signalhub = require('signalhub')
    const hub = signalhub('video-livestream', [
        'https://192.168.178.42:8080'
    ])

    // an error has occurred
    peer.on('error', (err) => document.write(err))

    // when a signal is created -> if initiator = true at start, initiator = false after receiving the offer
    peer.on('signal', (data) => {
        if(location.hash == '#init') {
            hub.broadcast('forward', JSON.stringify(data))
        } else {
            hub.broadcast('backward', JSON.stringify(data))
        }
    })

    // listens to broadcasted changes from the peer.on('signal) -> uses offer to create awnser
    hub.subscribe('forward').on('data', (data) => {
        let otherID = JSON.parse(data)
        if(location.hash != '#init') {
            console.log('forward', otherID)
            peer.signal(otherID)
        }
    })

    hub.subscribe('backward').on('data', (data) => {
        let otherID = JSON.parse(data)
        if(location.hash == '#init') {
            console.log('backward', otherID)
            peer.signal(otherID)
        }
    })

    peer.on('connected', () => console.log('IT WORKS :)'))

    // video stream -> create video and play it
    
        const video = document.createElement('video')
        document.body.appendChild(video)

        video.srcObject = stream
        video.play()
    
})
.catch((stream) => {
    // document.write(err)

console.log("Hallo es geht.")
const Peer = require('simple-peer')
const peer = new Peer ({
    initiator: location.hash == '#init',
    trickle: false,
})

const signalhub = require('signalhub')
const hub = signalhub('video-livestream', [
    'https://192.168.178.42:8080'
])
peer.on('error', (err) => document.write(err))

// when a signal is created -> if initiator = true at start, initiator = false after receiving the offer
peer.on('signal', (data) => {
    if(location.hash == '#init') {
        hub.broadcast('forward', JSON.stringify(data))
    } else {
        hub.broadcast('backward', JSON.stringify(data))
    }
})

// listens to broadcasted changes from the peer.on('signal) -> uses offer to create awnser
hub.subscribe('forward').on('data', (data) => {
    let otherID = JSON.parse(data)
    if(location.hash != '#init') {
        console.log('forward', otherID)
        peer.signal(otherID)
    }
})

hub.subscribe('backward').on('data', (data) => {
    let otherID = JSON.parse(data)
    if(location.hash == '#init') {
        console.log('backward', otherID)
        peer.signal(otherID)
    }
})

peer.on('connected', () => console.log('IT WORKS :)'))

// video stream -> create video and play it
peer.on('stream', (stream) => {
    const video = document.createElement('video')
    document.body.appendChild(video)

    video.srcObject = stream
    document.querySelector('button').addEventListener('click', function() {
        video.play()
        console.log("play");
        document.getElementById("play").style.display = "none"; 
      });
})
})


    

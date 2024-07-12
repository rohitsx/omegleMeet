import { useState, useRef, useEffect } from 'react'
import LocalVideo from '../assets/videoCall/localVideo';
import RemoteVideo from '../assets/videoCall/remoteVideo';
import MessagBox from '../assets/messaging/messageBox';
import InputBox from '../assets/messaging/inputBox';
import useSocket from '../hooks/useSocket';
import usePeerConnection from '../hooks/usePeerConnection';
import initiatePeerConnection from '../hooks/initiatePeerConnection';
import ConnectionStatusBar from '../assets/messaging/connectionStatusBar';
import ChangeLocalMediaStream from '../assets/videoCall/changeCam';

export default function ChatPage({ username, setUsername }) {

    const [message, setMessage] = useState([])
    const [peerConnection, setPeerConnection] = useState(null)
    const [ChangeCamOverly, setChangeCamOverly] = useState(null)
    const [updateUser, setUpdateUser] = useState(0)
    const [stream, setStream] = useState(null)
    const [selectedDeviceId, setSelectedDeviceId] = useState(null);
    const prevUpdateUser = useRef(0)
    const localVideo = useRef(null)
    const remoteVideo = useRef(null)

    const { socket, strangerUserId, strangerUsername, sendPeerRequest, connectionStatus } = useSocket(
        username, remoteVideo.current, setMessage, updateUser, peerConnection, setPeerConnection, prevUpdateUser)
    usePeerConnection(socket, strangerUserId, setPeerConnection, peerConnection, updateUser)


    initiatePeerConnection(socket, peerConnection, sendPeerRequest, strangerUserId)

    return (

        <div id='chatPage'>
            <div id='videoCall'>
                <ChangeLocalMediaStream
                    peerConnection={peerConnection}
                    localVideo={localVideo.current}
                    ChangeCamOverly={ChangeCamOverly}
                    setChangeCamOverly={setChangeCamOverly}
                    selectedDeviceId={selectedDeviceId}
                    setSelectedDeviceId={setSelectedDeviceId}
                    setStream={setStream}
                />
                <LocalVideo
                    localVideo={localVideo}
                    peerConnection={peerConnection}
                    setChangeCamOverly={setChangeCamOverly}
                    setStream={setStream}
                    stream={stream}
                    selectedDeviceId={selectedDeviceId}
                />
                <RemoteVideo
                    remoteVideo={remoteVideo}
                    peerConnection={peerConnection}
                    setChangeCamOverly={setChangeCamOverly}
                />
            </div>
            <div id='messaging'>
                <ConnectionStatusBar strangerUsername={strangerUsername} />
                <MessagBox
                    message={message}
                    username={username}
                    socket={socket}
                    setMessage={setMessage}
                    strangerUsername={strangerUsername}
                    strangerUserId={strangerUserId}
                    connectionStatus={connectionStatus}
                />
                <InputBox
                    socket={socket}
                    setMessage={setMessage}
                    setUsername={setUsername}
                    setUpdateUser={setUpdateUser}
                    strangerUserId={strangerUserId}
                    username={username}
                    strangerUsername={strangerUsername}
                    prevUpdateUser={prevUpdateUser}
                />
            </div>
        </div>
    )
}
import React from 'react';
import Peer from 'peerjs';
import $ from 'jquery';
import uid from 'uid';
import io from 'socket.io-client';
import "./style.css";

export const CreatePage = () => {
    const NEW_PEER_ID = 'NEW_PEER_ID';
    const ONLINE_PEER_ARRAY = 'ONLINE_PEER_ARRAY';
    const NEW_CLIENT_CONNECT = 'NEW_CLIENT_CONNECT';
    const SOMEONE_DISCONNECTED = 'SOMEONE_DISCONNECTED';

    const socket = io("home-learning.herokuapp.com"); 

    const CONFIG_PEER = {
        host: 'jkq.herokuapp.com',
        port: 443,
        secure: true,
    }

    const peerId =  getPeer();
    function getPeer(){
        const id = uid(2)
        return id;
    }

    socket.emit(NEW_PEER_ID, peerId)
    
    socket.on(ONLINE_PEER_ARRAY, arrPeerId => {
        arrPeerId.forEach(id => {
            $('#ulPeer').append(`<li id="${id}">${id} </li>`) 
        })
    });    
    
    socket.on(NEW_CLIENT_CONNECT, id => {
           $('#ulPeer').append(`<li id="${id}">${id} </li>`) 
        })

    socket.on(SOMEONE_DISCONNECTED, peerId => {
        $(`#${peerId}`).remove();
    });
    
    const peer = new Peer(peerId, CONFIG_PEER );

        function btnCall(){
            
            const frienId = $('#txtFrienId').val();
             $('#ulCallFrien').append(`<li>Звонок ${frienId}  </li>`)
            openStream(stream=>{
                playVideo(stream, 'localStream');
                const call = peer.call(frienId, stream 
                    ,{
                        videoCodec: 'H264',
                        audioReceiveEnabled: true,
                      }
                    );
                call.on('stream', remoteStream => playVideo(remoteStream, 'friendStream'))
            })
        }
        
        function openStream(cb) {
            const constraints = { audio: false, video: { width: 1280, height: 720 } };
            navigator.mediaDevices.getUserMedia( constraints )
            .then(stream => { 
                cb(stream) 
            })
            .catch(err => {
                console.log('ERROR:', err)
            })
        } 
    
        function playVideo(stream, idVideo) {
            const video = document.getElementById(idVideo)
            video.srcObject = stream;
            video.onloadedmetadata = function(){   
                video.play();
                console.log(stream);
            }
        }

        peer.on('call', (call)=>{
            openStream(stream => {
                playVideo (stream, 'localStream');
                call.answer(stream);
                call.on('stream', remoteStream => playVideo(remoteStream, 'friendStream'))
            });
        });
    
    return (
            <div className="inter">
                <div className="row">
                    <ul> 
                        <div className="col l9 s14">  
                            <div className="container" style={{marginBottom: 10}}>     
                                <h5> Мой id:  {peer.id} </h5> 
                                <div className='videos'>
                                    <video  id="localStream" className="my-video"></video>
                                    <video  id="friendStream" className="user-video"></video>
                                </div>
                                <br></br>
                                <p>ID пользователя: </p> 
                                <input type="text"  id="txtFrienId"></input>
                                <br></br>
                                <input type="submit" onClick={()=>btnCall()} value="Вызов" />
                            </div>
                        </div>
                    </ul>
                    <ul>
                        <div className="container" style={{marginBottom: 10}}>    
                            <ul> 
                                <h5> Online: </h5>
                                <li id="ulPeer"></li>
                            </ul>
                        </div>
                    </ul> 
                </div>
            </div>
    )
}

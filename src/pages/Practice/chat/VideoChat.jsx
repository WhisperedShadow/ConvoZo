import { useEffect, useState, useRef } from "react";
import { auth, database } from "../../../config/firebase";
import { onAuthStateChanged } from "firebase/auth";
import { ref, get, set } from "firebase/database";
import Peer from "peerjs";
import { getUserData } from "../../../components/datacollector";
import styles from "./VideoChat.module.css"; // Import CSS module

function VideoChat() {
  const [user, setUser] = useState(null);
  const [username, setUsername] = useState("Guest");
  const [peer, setPeer] = useState(null);
  const [myStream, setMyStream] = useState(null);
  const [currentCall, setCurrentCall] = useState(null);
  const [isMuted, setIsMuted] = useState(false);
  const [isVideoOff, setIsVideoOff] = useState(false);

  const localVideoRef = useRef(null);
  const remoteVideoRef = useRef(null);

  useEffect(() => {
    const initializePeer = (userId) => {
      const newPeer = new Peer(userId);
      newPeer.on("open", (id) => console.log(`${id} connected`));
      newPeer.on("call", (call) => {
        navigator.mediaDevices
          .getUserMedia({ video: true, audio: true })
          .then((stream) => {
            setMyStream(stream);
            addLocalVideo(stream);
            call.answer(stream);
            call.on("stream", addRemoteVideo);
            call.on("close", () => alert("User disconnected"));
            setCurrentCall(call);
          });
      });
      setPeer(newPeer);
    };

    const setupLocalVideo = () => {
      navigator.mediaDevices
        .getUserMedia({ video: true, audio: true })
        .then((stream) => {
          setMyStream(stream);
          addLocalVideo(stream);
        });
    };

    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (user) {
        setUser(user);
        getUserData(() => {}, setUsername, () => {}, () => {}, () => {});
        initializePeer(user.uid);
        set(ref(database, `onlineUsers/${user.uid}`), true);
        ref(database, `onlineUsers/${user.uid}`).onDisconnect().remove();
        setupLocalVideo();
      } else {
        window.location.href = "/login";
      }
    });

    return () => unsubscribe();
  }, []);

  const addLocalVideo = (stream) => {
    if (localVideoRef.current) {
      localVideoRef.current.srcObject = stream;
      localVideoRef.current.play();
    }
  };

  const addRemoteVideo = (stream) => {
    if (remoteVideoRef.current) {
      remoteVideoRef.current.srcObject = stream;
      remoteVideoRef.current.play();
    }
  };

  const randomCall = () => {
    get(ref(database, "onlineUsers")).then((snapshot) => {
      const onlineUsers = snapshot.val();
      if (!onlineUsers) return alert("No users online.");
      const userList = Object.keys(onlineUsers).filter(
        (uid) => uid !== user.uid
      );
      if (userList.length) {
        makeCall(userList[Math.floor(Math.random() * userList.length)]);
      } else {
        alert("No users available.");
      }
    });
  };

  const makeCall = (receiverId) => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: true })
      .then((stream) => {
        setMyStream(stream);
        addLocalVideo(stream);
        const call = peer.call(receiverId, stream);
        call.on("stream", addRemoteVideo);
        call.on("close", () => alert("User disconnected"));
        setCurrentCall(call);
      });
  };

  const toggleMute = () => {
    if (myStream) {
      myStream.getAudioTracks()[0].enabled = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const toggleVideo = () => {
    if (myStream) {
      myStream.getVideoTracks()[0].enabled = !isVideoOff;
      setIsVideoOff(!isVideoOff);
    }
  };

  const endCall = () => {
    if (currentCall) currentCall.close();
    if (myStream) myStream.getTracks().forEach((track) => track.stop());
    window.location.reload();
  };

  return (
    <div className={styles.videoChatContainer}>
      <h3>{username} ({user?.email})</h3>
      <div className={styles.videoSection}>
        <div className={styles.videoContainer}>
          <video ref={localVideoRef} muted className={styles.video} />
        </div>
        <div className={styles.videoContainer}>
          <video ref={remoteVideoRef} className={styles.video} />
        </div>
      </div>
      <div className={styles.controls}>
        <button onClick={randomCall}>Find</button>
        <button onClick={toggleMute}>{isMuted ? "Unmute" : "Mute"}</button>
        <button onClick={toggleVideo}>
          {isVideoOff ? "Show Video" : "Hide Video"}
        </button>
        <button onClick={endCall} className={styles.endCall}>
          End Call
        </button>
      </div>
    </div>
  );
}

export default VideoChat;

let peerConnection;//一個包含這個連線所有資訊的物件
let localStream;
let remoteStream;
const APP_ID = "99553a9fb19c449c965e617e1b4e7486";//Agora 提供之project id
const uid=String(Math.floor(Math.random()*10000));
let client;

//ICE Servers from google
const servers = {
  iceServers: [
    {
      urls: ["stun:stun1.1.google.com:19302", "stun:stun2.1.google.com:19302"],
    },
  ],
};

//初始化頁面function
const init=async()=>{
  //透過Agora的signal server去創造連線
  client = await AgoraRTM.createInstance(APP_ID);
  //獲取小天使提供的一個token
  const { token } = await fetch(`http://localhost:3333/webrtc/token/${uid}`)
    .then((res) => res.json())
    .catch((error) => console.log(error));
  //使用id和token去login，如果token是null或是undefined的話回傳undefined
  await client.login({ uid, token: token ?? undefined });
  //互叫到server後，創造一個channel，channel name為main
  const channel = client.createChannel("main");
  //加入channel
  channel.join();
  //透過on監聽channel中的MemberJoined 事件
  channel.on("MemberJoined", handlePeerJoined);
  //透過on監聽client中的MessageFromPeer事件
  client.on("MessageFromPeer", handleMessageFromPeer);
  //呼叫 navigator.mediaDevices.getUserMedia 的web api 向使用者詢問存取權
  localStream = await navigator.mediaDevices.getUserMedia({
    video: true,
  });
  //取得localStream後透過video(HTML MediaElement 有的srcObject物件設定進去video tag)
  document.getElementById("user-1").srcObject = localStream;
}

const handlePeerJoined=async(MemberId)=>{
  console.log(`A new peer has joined this room:${MemberId}`);
//當有peer 進來後，就創造一個offer
  createOffer(MemberId);
}
const handleMessageFromPeer=async(message,MemberId)=>{
  //接收從createOffer傳進來的message
  message=JSON.parse(message.text);
    console.log("Message:", message.type);
  //如果傳送過來的是offer
  if(message.type==='offer'){
    //要先確定要顯示的時候localStream已經存在，因為快速refresh的時候會有時間差
    if(!localStream){
      localStream = await navigator.mediaDevices.getUserMedia({
        video: true,
      });
      document.getElementById("user-1").srcObject = localStream;
    }
    //在Dom render offer
    document.getElementById('offer-sdp').value=JSON.stringify(message.offer); 
    //render 完 offer後造answer
    createAnswer(MemberId);
  }
  //如果收到的是answer傳來的訊息，代表我是offer方，要render answer 在DOM，也要互叫addAnswer讓他不只是出現在畫面的一串訊息，而是真正建立連線。
  if (message.type === "answer") {
      document.getElementById("answer-sdp").value = JSON.stringify(
        message.answer
      );
     addAnswer();
    }
 //判斷如果是 ice candidate建立時傳送的訊息
  if(message.type==='candidate'){
    //確保peerConnect 存在，防止任何潛在的delay
    if(peerConnection){
      //addIceCandidate：將收到的遠端ice candidate資訊加到remote description
      peerConnection.addIceCandidate(message.candidate);
    }
  }
}
const createPeerConnection = async (sdpType,MemberId) => {
  // new 一個新RTCPeerConnection物件，存入peerConnection，建立點對點連線
  //RTCPeerConnection為web API
  peerConnection = new RTCPeerConnection(servers);
  // 透過web API MediaStream ，new 一個新MediaStream，存入remoteStream
  remoteStream = new MediaStream();
  //將remoteStream設定入DOM中第二位使用者video的srcObject
  document.getElementById("user-2").srcObject = remoteStream;
  //getTracks 為MediaStream的method，會返回MediaStream的序列，就是裡面包含的所有video or audio
  localStream.getTracks().forEach((track) => {
    //addTrack為RTCPeerConnection的method，localSteam的track加入peerConnection
    peerConnection.addTrack(track, localStream);
  });

  //等於addEventListener('track', event => { });監聽上面發生的addTrack事件
  peerConnection.ontrack = async (event) => {
    //把track加入remoteStream
    event.streams[0].getTracks().forEach((track) => {
      remoteStream.addTrack(track);
    });
  };
  //當offer被創造後，呼叫ice candidate，產生一個新的ice candidate
  peerConnection.onicecandidate = async (event) => {
    //確認有candidate後，顯示加過ice的offer在DOM
    if (event.candidate) {
      document.getElementById(sdpType).value = JSON.stringify(
        peerConnection.localDescription
      );
      //在ice candidate 產生後，傳送candidate訊息給peer
      client.sendMessageToPeer(
        {
          text: JSON.stringify({
            'type': "candidate",
            candidate: event.candidate,
          }),
        },
        MemberId
      );
    }
  };
};

const createOffer=async(MemberId)=>{
  createPeerConnection("offer-sdp", MemberId);
  //使用RTCPeerConnection的createOffer method--> 創造一個offer
  const offer = await peerConnection.createOffer();
  //使用RTCPeerConnection的setLocalDescription-->將offer設定給local description
  await peerConnection.setLocalDescription(offer);
  //把offer設定到DOM要顯示offer的textarea
  document.getElementById("offer-sdp").value = JSON.stringify(offer);
  //運用sendMessageToPeer method 把offer傳送給加入的peer
  client.sendMessageToPeer(
    { text: JSON.stringify({ type: "offer", offer: offer }) },
    MemberId
  );
}

const createAnswer=async(MemberId)=>{
  //接收offer這端，也需要建立一個peerConnection
  createPeerConnection("answer-sdp", MemberId);
  //取offer
  let offer=document.getElementById('offer-sdp').value;
  //先確保有取到offer，如果沒有，這創造answer就沒意義了，所以跳alert
  if(!offer) return alert('Retrieve offer from peer first...');
  //因為在DOM取到的offer是string，要先把它變成物件
  offer=JSON.parse(offer)
  //接收端把offer設定成remote description
  await peerConnection.setRemoteDescription(offer);
  //創造一個answer
  const answer =await peerConnection.createAnswer();
  //將answer設定成localDescription
  await peerConnection.setLocalDescription(answer);

  //把answer在DOM顯示出來
  document.getElementById('answer-sdp').value=JSON.stringify(answer);
  //在把answer放入dom後，傳送answer給peer
  client.sendMessageToPeer(
      { text: JSON.stringify({ "type": "answer", 'answer': answer }) },
      MemberId
    );
}

const addAnswer=async()=>{
  //取DOM的answer
  let answer = document.getElementById("answer-sdp").value;
  //確保有answer
  if (!answer) return alert("Retrieve answer from peer first...");
  //將取到的answer轉成物件
  answer = JSON.parse(answer);

  //要先確定沒有currentRemoteDescription，避免重複加
  if (!peerConnection.currentRemoteDescription) {
    //將remote description設定為answer
    peerConnection.setRemoteDescription(answer);
  }
}

init();

// document.getElementById('create-offer').addEventListener('click',createOffer);
// document.getElementById("create-answer").addEventListener("click", createAnswer);
// document
//       .getElementById("add-answer")
//       .addEventListener("click", addAnswer);

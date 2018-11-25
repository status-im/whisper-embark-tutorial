import EmbarkJS from 'Embark/EmbarkJS';
import web3 from 'Embark/web3';

const PRIVATE_MESSAGE_REGEX = /^\/msg (0x[A-Za-z0-9]{130}) (.*)$/;
const DEFAULT_CHANNEL = "default";

EmbarkJS.onReady(async (err) => {
    if(err){
        alert("EmbarkJS is not available");
        return;
    }

    const channelName = document.getElementById('channel-name')
    channelName.innerHTML = DEFAULT_CHANNEL;

    // Generate a symmetric key
    const channelSymKey = await web3.shh.generateSymKeyFromPassword(DEFAULT_CHANNEL);

    // Obtain public key
    const pubKey = await web3.shh.getPublicKey(EmbarkJS.Messages.currentMessages.sig);


    document.getElementById('chat-form').onsubmit = (e) => {
        e.preventDefault();
       
        const message = document.getElementById('input-text').value;

        if(message.startsWith('/msg')){
            if(PRIVATE_MESSAGE_REGEX.test(message)){
                const msgParts = message.match(PRIVATE_MESSAGE_REGEX);
                const contactCode = msgParts[1];
                const messageContent = msgParts[2];

                // Send private message
                EmbarkJS.Messages.sendMessage({
                    pubKey: contactCode,
                    topic: DEFAULT_CHANNEL,
                    data: messageContent
                });

                // Since we cannot receive private messages sent to someone else, we need to add it manually on the UI
                addMessage(messageContent, new Date().getTime()/1000);
            }
        } else {
            // Send message via whisper
            EmbarkJS.Messages.sendMessage({
                symKeyID: channelSymKey,
                topic: DEFAULT_CHANNEL, 
                data: message
            });
        }
    }


    // Subscribe to public messages
    EmbarkJS.Messages.listenTo({
        topic: [DEFAULT_CHANNEL],
        symKeyID: channelSymKey
    }, (error, message) => { 
        if(error){
            alert("Error during subscription");
            return;
        }

        const {data, time} = message; 
        addMessage(data, time);
    });

    // Subscribe to private messages
    EmbarkJS.Messages.listenTo({
        usePrivateKey: true,
        privateKeyID: EmbarkJS.Messages.currentMessages.sig
    }, (error, message) => { 
        if(error){
            alert("Error during subscription");
            return;
        }

        const {data, time} = message; 
        addMessage(data, time);
    });


    const contactCode = document.getElementById('contact-code')
    contactCode.innerHTML = pubKey;

    const addMessage = (data, time) => {
        // Create new li for chat text 
        const li = document.createElement('li');
        const timeSpan = document.createElement("span");
        const p = document.createElement("p");

        const timeFormat = (new Date(time * 1000).toLocaleTimeString());

        const attr = document.createAttribute("class"); 
        attr.value = "time"; 

        timeSpan.append(document.createTextNode(timeFormat));
        timeSpan.setAttributeNode(attr);  
        
        p.appendChild(document.createTextNode(data));

        li.appendChild(timeSpan);
        li.appendChild(p);

        const chatText = document.getElementById('chat-text');
        chatText.appendChild(li);

        // Scroll div
        const chatArea = document.getElementById("chat-area");
        chatArea.scrollTop = chatArea.scrollHeight;

        // Clear text area
        document.getElementById('input-text').value = "";
    }
});

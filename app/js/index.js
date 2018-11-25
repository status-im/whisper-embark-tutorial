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

    // TODO: Generate a symmetric key


    // TODO: Obtain public key
    const pubKey = "0x"


    document.getElementById('chat-form').onsubmit = (e) => {
        e.preventDefault();
       
        const message = document.getElementById('input-text').value;
        if(message.startsWith('/msg')){
            if(PRIVATE_MESSAGE_REGEX.test(message)){
                const msgParts = message.match(PRIVATE_MESSAGE_REGEX);
                const contactCode = msgParts[1];
                const messageContent = msgParts[2];

                // TODO: Send private message
                



                // Since we cannot receive private messages sent to someone else, we need to add it manually on the UI
                addMessage(messageContent, new Date().getTime()/1000);
            }
        } else {
            // TODO: Send message via whisper
        }
    }


    // TODO: Subscribe to public messages

    

    // TODO: Subscribe to private messages




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

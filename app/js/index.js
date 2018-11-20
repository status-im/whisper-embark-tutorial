import EmbarkJS from 'Embark/EmbarkJS';

const DEFAULT_CHANNEL = "default";

EmbarkJS.onReady((err) => {
    if(err){
        alert("EmbarkJS is not available");
        return;
    }

    const channelName = document.getElementById('channel-name')
    channelName.innerHTML = DEFAULT_CHANNEL;

    document.getElementById('chat-form').onsubmit = (e) => {
        e.preventDefault();
       
        const message = document.getElementById('input-text').value;

        // TODO: Send message via whisper
    }


    // TODO: Subscribe to whisper messages

    

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

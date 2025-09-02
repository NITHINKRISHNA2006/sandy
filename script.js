function openNav() {
    document.getElementById("mySidebar").style.width = "250px";
    document.getElementById("main").style.marginLeft = "250px";
}

function closeNav() {
    document.getElementById("mySidebar").style.width = "0";
    document.getElementById("main").style.marginLeft = "20px";
}

// Typewriter effect for bot messages
function typeWriterEffect(message, elementId) {
    let i = 0;
    const elem = document.getElementById(elementId);

    function typing() {
        if (i < message.length) {
            elem.innerHTML += message.charAt(i);
            i++;
            elem.parentElement.scrollTop = elem.parentElement.scrollHeight; // auto-scroll
            setTimeout(typing, 35); // typing speed
        }
    }
    typing();
}

async function sendMessage() {
    const input = document.getElementById("chatInput");
    const messagesDiv = document.getElementById("chatMessages");
    const userMessage = input.value.trim();

    if (userMessage === "") return;

    // Display user message
    const userMsgDiv = document.createElement("div");
    userMsgDiv.className = "user-message";
    userMsgDiv.textContent = userMessage;
    messagesDiv.appendChild(userMsgDiv);

    input.value = "";

    // Create bot message container
    const botMsgDiv = document.createElement("div");
    botMsgDiv.className = "bot-message";
    botMsgDiv.id = "botReply-" + Date.now();
    messagesDiv.appendChild(botMsgDiv);

    // Scroll to bottom
    messagesDiv.scrollTop = messagesDiv.scrollHeight;

    try {
        const response = await fetch("https://nithinkrishna.app.n8n.cloud/webhook/sandy", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ message: userMessage })
        });

        const data = await response.json();

        // ✅ Expect JSON like { "reply": "Hello Kanna! ..." }
        let sandyReply = data.reply || "⚠️ Sorry Kanna, something went wrong.";

        // Display reply with typewriter effect
        typeWriterEffect(sandyReply, botMsgDiv.id);

    } catch (error) {
        typeWriterEffect("⚠️ Sorry Kanna, something went wrong.", botMsgDiv.id);
        console.error(error);
    }
}


// Trigger sendMessage on Enter key
document.getElementById("chatInput").addEventListener("keypress", function(event) {
    if (event.key === "Enter") {
        event.preventDefault();
        sendMessage();
    }
});
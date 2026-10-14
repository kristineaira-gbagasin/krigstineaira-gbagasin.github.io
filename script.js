var OWNER_PASSWORD = "kristine2007";
var isUnlocked = false;

function copyText(text) {
    var tempInput = document.createElement("input");
    tempInput.value = text;
    document.body.appendChild(tempInput);
    tempInput.select();
    document.execCommand("copy");
    document.body.removeChild(tempInput);
    showToast("Copied: " + text);
}

function showToast(msgText) {
    var msg = document.createElement("div");
    msg.innerText = msgText;
    msg.style.position = "fixed";
    msg.style.bottom = "20px";
    msg.style.right = "20px";
    msg.style.backgroundColor = "var(--primary-color)";
    msg.style.color = "white";
    msg.style.padding = "10px 16px";
    msg.style.borderRadius = "5px";
    msg.style.fontSize = "0.85rem";
    msg.style.boxShadow = "0 2px 8px rgba(0,0,0,0.3)";
    msg.style.zIndex = "9999";
    document.body.appendChild(msg);

    setTimeout(function() {
        if (msg.parentNode) {
            msg.parentNode.removeChild(msg);
        }
    }, 2500);
}

var defaultMessages = [
    {
        id: 101,
        name: "Instructor Reyes",
        email: "reyes.it@kcp.edu.ph",
        subject: "Great Portfolio Page!",
        message: "Hello Kristine, nice job on setting up your personal portfolio with structured HTML and CSS formatting. Keep up the good work in Web & Mobile Development!",
        date: "October 8, 2026, 2:15 PM"
    }
];

function getMessages() {
    var saved = localStorage.getItem("kristine_portfolio_messages");
    if (saved) {
        try { return JSON.parse(saved); } catch(e) { return defaultMessages; }
    }
    return defaultMessages;
}

function saveMessages(messages) {
    localStorage.setItem("kristine_portfolio_messages", JSON.stringify(messages));
    updateBadges(messages.length);
}

function updateBadges(count) {
    var badges = document.querySelectorAll(".unread-badge");
    badges.forEach(function(b) { b.innerText = count; });
}

function unlockInbox() {
    var inputVal = document.getElementById("ownerPassInput").value;
    var errorMsg = document.getElementById("authErrorMessage");

    if (inputVal === OWNER_PASSWORD) {
        isUnlocked = true;
        errorMsg.style.display = "none";
        document.getElementById("ownerPassInput").value = "";
        document.getElementById("inboxLockedView").style.display = "none";
        document.getElementById("inboxUnlockedView").style.display = "block";
        renderMessages();
        showToast("Inbox unlocked. Welcome back Kristine!");
    } else {
        errorMsg.style.display = "block";
    }
}

function lockInbox() {
    isUnlocked = false;
    document.getElementById("inboxLockedView").style.display = "block";
    document.getElementById("inboxUnlockedView").style.display = "none";
    document.getElementById("messagesContainer").innerHTML = "";
    showToast("Inbox locked.");
}

function renderMessages() {
    if (!isUnlocked) return;
    var messages = getMessages();
    var container = document.getElementById("messagesContainer");
    updateBadges(messages.length);

    if (messages.length === 0) {
        container.innerHTML = '<div class="message-card empty-inbox-card">No messages received yet. Submit one using the form above!</div>';
        return;
    }

    var html = "";
    for (var i = messages.length - 1; i >= 0; i--) {
        var msg = messages[i];
        html += '<div class="message-card">' +
                    '<div class="message-meta">' +
                        '<span class="message-sender"><i class="fas fa-user-circle"></i> ' + escapeHtml(msg.name) + ' (' + escapeHtml(msg.email) + ')</span>' +
                        '<span><i class="far fa-clock"></i> ' + escapeHtml(msg.date) + '</span>' +
                    '</div>' +
                    '<div class="message-subject-line"><strong>Subject:</strong> ' + escapeHtml(msg.subject || "No Subject") + '</div>' +
                    '<div class="message-body">' + escapeHtml(msg.message) + '</div>' +
                    '<button class="btn-delete" onclick="deleteMessage(' + msg.id + ')"><i class="fas fa-trash-alt"></i> Delete</button>' +
                '</div>';
    }
    container.innerHTML = html;
}

function escapeHtml(str) {
    if (!str) return '';
    return str.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;").replace(/"/g, "&quot;").replace(/'/g, "&#039;");
}

function handleFormSubmit(event) {
    event.preventDefault();
    var name = document.getElementById("senderName").value.trim();
    var email = document.getElementById("senderEmail").value.trim();
    var subject = document.getElementById("messageSubject").value.trim();
    var text = document.getElementById("messageText").value.trim();

    if (!name || !email || !text) {
        showToast("Please fill in all required fields.");
        return;
    }

    var now = new Date();
    var timeString = now.toLocaleDateString() + " at " + now.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'});

    var newMessage = {
        id: Date.now(),
        name: name,
        email: email,
        subject: subject || "No Subject",
        message: text,
        date: timeString
    };

    var messages = getMessages();
    messages.push(newMessage);
    saveMessages(messages);

    document.getElementById("portfolioContactForm").reset();
    showToast("Your message was sent securely to Kristine!");

    if (isUnlocked) { renderMessages(); }
}

function deleteMessage(id) {
    var messages = getMessages();
    var filtered = messages.filter(function(m) { return m.id !== id; });
    saveMessages(filtered);
    renderMessages();
    showToast("Message deleted.");
}

function clearAllMessages() {
    if (confirm("Are you sure you want to clear all received messages?")) {
        saveMessages([]);
        renderMessages();
        showToast("Inbox cleared.");
    }
}

document.addEventListener("DOMContentLoaded", () => {
    var messages = getMessages();
    updateBadges(messages.length);

    // Theme Switcher
    const themeToggleBtn = document.getElementById("theme-toggle");
    themeToggleBtn.addEventListener("click", () => {
        let theme = document.documentElement.getAttribute("data-theme");
        if (theme === "dark") {
            document.documentElement.setAttribute("data-theme", "light");
            themeToggleBtn.textContent = "🌙 Dark";
        } else {
            document.documentElement.setAttribute("data-theme", "dark");
            themeToggleBtn.textContent = "☀️ Light";
        }
    });

    // Back to Top Button
    const backToTopBtn = document.getElementById("back-to-top");
    window.addEventListener("scroll", () => {
        if (window.scrollY > 300) {
            backToTopBtn.style.display = "block";
        } else {
            backToTopBtn.style.display = "none";
        }
    });

    backToTopBtn.addEventListener("click", () => {
        window.scrollTo({ top: 0, behavior: "smooth" });
    });
});
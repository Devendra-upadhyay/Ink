

const currentURL = window.location.href;

document.getElementById("copyLink").onclick = function () {

    navigator.clipboard.writeText(currentURL);

    this.innerHTML = "Copied ✓";

    setTimeout(() => {

        this.innerHTML = "Copy Link";

    },2000);

};



document.getElementById("shareWhatsapp").onclick = function () {

    window.open(

        "https://wa.me/?text=" + encodeURIComponent(currentURL),

        "_blank"

    );

};



document.getElementById("shareTwitter").onclick = function () {

    window.open(

        "https://twitter.com/intent/tweet?url=" +

        encodeURIComponent(currentURL),

        "_blank"

    );

};


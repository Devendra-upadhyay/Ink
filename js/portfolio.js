document.querySelectorAll(".education-card").forEach(card=>{

    card.addEventListener("click",()=>{

        card.classList.toggle("active");

    });

});
/* ==========================================
   INK WEBSITE MAIN JAVASCRIPT
   Common JS for all pages
========================================== */


/* ==========================================
   HAMBURGER MENU
========================================== */

document.addEventListener("DOMContentLoaded", function () {

    const hamburger = document.getElementById("hamburger");
    const navMenu = document.getElementById("navMenu");


    if (hamburger && navMenu) {


        hamburger.addEventListener("click", function () {

            navMenu.classList.toggle("active");

            hamburger.classList.toggle("open");

        });



        // Close menu after clicking navigation link

        const navLinks = navMenu.querySelectorAll("a");


        navLinks.forEach(link => {

            link.addEventListener("click", function () {

                navMenu.classList.remove("active");

                hamburger.classList.remove("open");

            });

        });


    }


});





/* ==========================================
   POEM SEARCH
========================================== */


function searchPoemsByName(){


    const searchBox = document.getElementById("poemSearch");


    if(!searchBox) return;



    const value = searchBox.value.toLowerCase();



    const poems = document.querySelectorAll(".poem-card");



    poems.forEach(poem => {


        const title = poem.dataset.title?.toLowerCase() || "";



        if(title.includes(value)){

            poem.style.display = "block";

        }

        else{

            poem.style.display = "none";

        }


    });


}





/* ==========================================
   POEM FILTER
========================================== */


function filterPoems(category, button){


    const poems = document.querySelectorAll(".poem-card");


    if(button){


        document
        .querySelectorAll(".filters button")
        .forEach(btn => btn.classList.remove("active"));


        button.classList.add("active");


    }




    poems.forEach(poem => {


        if(category === "all"){

            poem.style.display = "block";

        }


        else if(poem.classList.contains(category)){


            poem.style.display = "block";


        }


        else{


            poem.style.display = "none";


        }


    });


}





/* ==========================================
   ARTICLE SEARCH
========================================== */


function searchArticlesByName(){


    const searchBox = document.getElementById("articleSearch");


    if(!searchBox) return;



    const value = searchBox.value.toLowerCase();



    const articles = document.querySelectorAll(".article-card");



    articles.forEach(article => {


        const title = article.dataset.title?.toLowerCase() || "";



        if(title.includes(value)){


            article.style.display = "block";


        }

        else{


            article.style.display = "none";


        }


    });


}







/* ==========================================
   ARTICLE FILTER
========================================== */


function filterArticles(category, button){



    const articles = document.querySelectorAll(".article-card");



    if(button){


        document
        .querySelectorAll(".filters button")
        .forEach(btn => btn.classList.remove("active"));


        button.classList.add("active");


    }




    articles.forEach(article => {



        if(category === "all"){


            article.style.display = "block";


        }


        else if(article.classList.contains(category)){


            article.style.display = "block";


        }


        else{


            article.style.display = "none";


        }



    });


}





/* ==========================================
   ACTIVE NAV LINK
========================================== */


document.addEventListener("DOMContentLoaded", function(){


    let currentPage = 
    window.location.pathname.split("/").pop();



    const navLinks =
    document.querySelectorAll(".nav-right a");



    navLinks.forEach(link => {



        let linkPage =
        link.getAttribute("href")
        ?.split("/")
        .pop();



        if(linkPage === currentPage){


            link.classList.add("active");


        }



    });



});
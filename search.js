<script>
function searchPoems() {
  let input = document.getElementById("poemSearch").value.toLowerCase();
  let poems = document.querySelectorAll(".poem-item");

  poems.forEach(poem => {
    let title = poem.getAttribute("data-title").toLowerCase();
    poem.style.display = title.includes(input) ? "block" : "none";
  });
}
</script>

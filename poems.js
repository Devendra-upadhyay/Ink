function filterPoems(category) {
  const cards = document.querySelectorAll('.poem-card');
  const buttons = document.querySelectorAll('.filters button');

  buttons.forEach(btn => btn.classList.remove('active'));
  event.target.classList.add('active');

  cards.forEach(card => {
    if (category === 'all' || card.classList.contains(category)) {
      card.style.display = 'block';
    } else {
      card.style.display = 'none';
    }
  });
}
function searchPoemsByName() {
  const input = document.getElementById("poemSearch").value.toLowerCase();
  const poems = document.querySelectorAll(".poem-card");

  poems.forEach(poem => {
    const title = poem.getAttribute("data-title").toLowerCase();
    poem.style.display = title.includes(input) ? "block" : "none";
  });
}
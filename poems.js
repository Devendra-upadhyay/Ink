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

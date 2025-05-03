let selectedNavigationCard = null;

export function setSelectedNavigationCard(card) {
  if (card && (
    card.name === 'Canteen' || 
    card.name === 'Auditorium' ||
    card.name === 'Drama Room' ||
    card.name === 'Reception' ||
    card.name === 'Podcast Room' ||
    card.name === 'Maker Space' ||
    card.name === 'Music Room' ||
    card.name === 'IT Support'
  )) {
    selectedNavigationCard = card;
  } else {
    selectedNavigationCard = null;
  }
}

export function getSelectedNavigationCard() {
  return selectedNavigationCard;
} 
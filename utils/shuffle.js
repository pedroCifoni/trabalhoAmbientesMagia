function shuffleArray(array) {
  const newArray = [...array];
  for (let currentIndex = newArray.length - 1; currentIndex > 0; currentIndex -= 1) {
    const randomIndex = Math.floor(Math.random() * (currentIndex + 1));
    const temporaryValue = newArray[currentIndex];
    newArray[currentIndex] = newArray[randomIndex];
    newArray[randomIndex] = temporaryValue;
  }
  return newArray;
}

module.exports = {
  shuffleArray,
};

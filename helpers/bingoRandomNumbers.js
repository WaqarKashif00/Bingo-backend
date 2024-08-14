function shuffle(array) {
  var tmp,
    current,
    top = array.length;
  if (top)
    while (--top) {
      current = Math.floor(Math.random() * (top + 1));
      tmp = array[current];
      array[current] = array[top];
      array[top] = tmp;
    }
  return array;
}

const randomNumGenerator = () => {
  for (var a = [], i = 0; i <= 90; ++i) a[i] = i;
  a = shuffle(a);

  return a;
};

export default randomNumGenerator;

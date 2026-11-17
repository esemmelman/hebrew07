const content = {
  letters: [...'אבגדהוזחטיכלמנסעפצקרשתםן'],
  vowels: ['אַ', 'אָ', 'אֶ', 'אֵ', 'אִ', 'אֹ', 'אֻ', 'אְ', 'אֲ', 'אֱ', 'אֳ', 'אוּ'],
  words: ['שָׁלוֹם', 'בַּיִת', 'סֵפֶר', 'מַיִם', 'לֶחֶם', 'שֶׁמֶשׁ', 'יָרֵחַ', 'יֶלֶד', 'יַלְדָּה', 'אִמָּא', 'אַבָּא', 'תּוֹדָה', 'אוֹר', 'יוֹם', 'לַיְלָה', 'חָבֵר', 'פֶּרַח', 'עֵץ', 'דֶּלֶת', 'חַלּוֹן']
};
const options = [...document.querySelectorAll('[role="option"]')];
const item = document.querySelector('#item');
const stage = document.querySelector('main');
const previous = {};
let animation;
let dismissTimer;

function fitItem() {
  const size = Math.min(300, stage.clientHeight * 0.48, stage.clientWidth * 0.68);
  item.style.fontSize = `${size}px`;
  if (item.offsetWidth > stage.clientWidth * 0.85) {
    item.style.fontSize = `${size * stage.clientWidth * 0.85 / item.offsetWidth}px`;
  }
}

function select(option) {
  const category = option.dataset.category;
  const choices = content[category].filter(value => value !== previous[category]);
  const value = choices[Math.floor(Math.random() * choices.length)];
  previous[category] = value;
  options.forEach(button => {
    button.setAttribute('aria-selected', String(button === option));
    button.tabIndex = button === option ? 0 : -1;
  });
  animation?.cancel();
  animation = undefined;
  clearTimeout(dismissTimer);
  item.textContent = value;
  fitItem();
  if (option.dataset.mode === 'brief') {
    item.style.transform = 'scale(1)';
    dismissTimer = setTimeout(() => {
      item.textContent = '';
      item.style.transform = 'scale(0)';
    }, 2000);
    return;
  }
  item.style.transform = 'scale(0)';
  animation = item.animate(
    [{ transform: 'scale(0.025)' }, { transform: 'scale(1)' }],
    { duration: 10000, easing: 'cubic-bezier(0.6, 0.03, 0.85, 0.2)', fill: 'forwards' }
  );
}

options.forEach((option, index) => {
  option.addEventListener('click', () => select(option));
  option.addEventListener('keydown', event => {
    let next;
    if (event.key === 'ArrowDown') next = (index + 1) % options.length;
    if (event.key === 'ArrowUp') next = (index + options.length - 1) % options.length;
    if (event.key === 'Home') next = 0;
    if (event.key === 'End') next = options.length - 1;
    if (next !== undefined) {
      event.preventDefault();
      options[next].focus();
      select(options[next]);
    }
  });
});
stage.addEventListener('click', () => animation?.finish());
window.addEventListener('resize', fitItem);

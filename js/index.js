// элементы в DOM можно получить при помощи функции querySelector
const fruitsList = document.querySelector('.fruits__list'); // список карточек
const shuffleButton = document.querySelector('.shuffle__btn'); // кнопка перемешивания
const filterButton = document.querySelector('.filter__btn'); // кнопка фильтрации
const sortKindLabel = document.querySelector('.sort__kind'); // поле с названием сортировки
const sortTimeLabel = document.querySelector('.sort__time'); // поле с временем сортировки
const sortChangeButton = document.querySelector('.sort__change__btn'); // кнопка смены сортировки
const sortActionButton = document.querySelector('.sort__action__btn'); // кнопка сортировки
const kindInput = document.querySelector('.kind__input'); // поле с названием вида
const colorInput = document.querySelector('.color__input'); // поле с названием цвета
const weightInput = document.querySelector('.weight__input'); // поле с весом
const addActionButton = document.querySelector('.add__action__btn'); // кнопка добавления

// список фруктов в JSON формате
let fruitsJSON = `[
  {"kind": "Мангустин", "color": "фиолетовый", "weight": 13},
  {"kind": "Дуриан", "color": "зеленый", "weight": 35},
  {"kind": "Личи", "color": "розово-красный", "weight": 17},
  {"kind": "Карамбола", "color": "желтый", "weight": 28},
  {"kind": "Тамаринд", "color": "светло-коричневый", "weight": 22}
]`;

// преобразование JSON в объект JavaScript
let fruits = JSON.parse(fruitsJSON); 

/*** ОТОБРАЖЕНИЕ ***/

// TODO: очищаем fruitsList от вложенных элементов,
// чтобы заполнить актуальными данными из fruits
  const display = (arr) => {
    fruitsList.innerHTML='';
    for (let i = 0; i < arr.length; i++) {

      // определяем цвет обрамления в зависимости от цвета фрукта
      let colorName = '';
      switch (arr[i].color){
        case 'фиолетовый': colorName = 'violet';
        break;
        case 'зеленый': colorName = 'green';
        break;
        case 'розово-красный': colorName = 'carmazin';
        break;
        case 'желтый': colorName = 'yellow';
        break;
        case 'светло-коричневый': colorName = 'lightbrown';
        break;
      }

      // отрисовка карточек
      let li = document.createElement('li'); 
      li.className = 'fruit__item fruit_' + colorName;
      let fruit__info=document.createElement('div');
      fruit__info.className='fruit__info';
    
      let newIndex = document.createElement('div');
      newIndex.appendChild(document.createTextNode("index: " + i)); 
      fruit__info.appendChild(newIndex);
  
      for(let property in arr[i]){
        newData = document.createTextNode(property + ': ' + arr[i][property]);
        let div = document.createElement('div');
        div.appendChild(newData);
        fruit__info.appendChild(div);       
      }
     
     li.appendChild(fruit__info);
     fruitsList.appendChild(li);
    }
  };

// первая отрисовка карточек
display(fruits);

/*** ПЕРЕМЕШИВАНИЕ ***/

// генерация случайного числа в заданном диапазоне
const getRandomInt = (min, max) => {
  return Math.floor(Math.random() * (max - min + 1)) + min;
};

// функция сравнения двух массивов
function arraysCompare(arr1, arr2){
  return (arr1.length == arr2.length) && arr1.every( (element, index) => element === arr2[index] );
 }

const shuffleFruits = () => {
  let resultArr = []; // новый массив
  let copyArr = fruits.slice(); // копия начального массива для сравнения
    
  while (fruits.length > 0) {
    let index = getRandomInt(0, fruits.length - 1);
    resultArr.push(fruits[index]);
    fruits.splice(index, 1);
  }
 
  if(arraysCompare(resultArr, copyArr)){
    alert('Перемешать не получилось, попробуйте снова');
  }

  fruits = resultArr;
};

shuffleButton.addEventListener('click', () => {
  shuffleFruits();
  display(fruits);
});

/*** ФИЛЬТРАЦИЯ ***/

// инициализация полей
let minWeight = 0; // минимальное значение веса
let maxWeight = Infinity; // максимальное значение веса

// фильтрация массива
const filterFruits = () => {
  fruits = fruits.filter((element) => {
    if(minWeight <= element.weight && element.weight <= maxWeight)
      return element;    
  });
};

filterButton.addEventListener('click', () => {
  minWeight=parseInt(document.querySelector('.minweight__input').value);
  maxWeight=parseInt(document.querySelector('.maxweight__input').value);
  filterFruits();
  display(fruits);
});

/*** СОРТИРОВКА ***/

let sortKind = 'bubbleSort'; // инициализация состояния вида сортировки
let sortTime = '-'; // инициализация состояния времени сортировки

// сравнение цветов по первой букве в алфавитном порядке
const comparationColor = (a, b) => {
  let priority = ['а','б','в','г','д','е','ё','ж','з','и','к','л','м','н','о','п','р','с','е','у','ф','х','ц','ч','ш','щ','э','ю','я'];
  let priority1 = priority.indexOf(a.color[0]);
  let priority2 = priority.indexOf(b.color[0]);
  return priority1 > priority2;
};

// функция меняет местами два элемента массива c индексами firstIndex и secondIndex
function swap(arr, firstIndex, secondIndex){
  const temp = arr[firstIndex];
  arr[firstIndex] = arr[secondIndex];
  arr[secondIndex] = temp;
};

// функция разделяет массив на две части, возвращает индекс pivot элемента
function split(arr, left, right, comparation){
  let pivot = arr[Math.floor((right + left) / 2)],
      i = left,
      j = right;
  while (i <= j) {
      while (comparation(pivot, arr[i])) {
          i++;
      }
      while (comparation(arr[j],pivot)) {
          j--;
      }
      if (i <= j) {
          swap(arr, i, j);
          i++;
          j--;
      }
  }
  return i;
};

const sortAPI = {
  // сортировка пузырьком
  bubbleSort(arr, comparation) {
    const n = arr.length;
    for (let i = 0; i < n-1; i++) { 
        for (let j = 0; j < n-1-i; j++) { 
            if (comparation(arr[j], arr[j+1])) { 
                swap(arr,j,j+1); 
            }
        }
    }           
    return arr;       
  },

    // быстрая сортировка 
    quickSort(arr, comparation, left=0, right = arr.length-1) {
      let index;
      if (arr.length > 1) {
         index = split(arr, left, right, comparation);
         if (left < index - 1) {
             sortAPI.quickSort(arr, comparation, left, index - 1);
         }
         if (index < right) {
          sortAPI.quickSort(arr, comparation, index, right);
         }
     }
     return arr;
    },
  
  // выполняет сортировку и производит замер времени
  startSort(sort, arr, comparation) {
    const start = new Date().getTime();
    sort(arr, comparation);
    const end = new Date().getTime();
    sortTime = `${end - start} ms`;
  },
};

// инициализация полей
let sortFieldsInit=()=>{
  sortKindLabel.textContent = sortKind;
  sortTimeLabel.textContent = sortTime;
  }
  sortFieldsInit();

sortChangeButton.addEventListener('click', () => {
  // TODO: переключать значение sortKind между 'bubbleSort' / 'quickSort'
  if (sortKind == 'bubbleSort') {
    sortKind = 'quickSort';
  }
  else{
    sortKind = 'bubbleSort';
  }
  sortTime = '-';
  sortFieldsInit();
 });


sortActionButton.addEventListener('click', () => {
  const sort = sortAPI[sortKind];
  sortAPI.startSort(sort, fruits, comparationColor);
  display(fruits);
  sortFieldsInit();
});

/*** ДОБАВИТЬ ФРУКТ ***/

addActionButton.addEventListener('click', () => {
  let addFruit={
  kind: kindInput.value,
  color: colorInput.value,
  weight: parseInt(weightInput.value),
};

if(addFruit.kind && addFruit.color && addFruit.weight){
fruits.push(addFruit);
display(fruits);
}else{
  alert("Для добавления нового фрукта КОРРЕКТНО заполните все поля");
}
});



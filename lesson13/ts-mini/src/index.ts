console.log('TS мини‑песочница 🚀');

// Примитив + проверка типизации
let age: number = 18;
// age = "18"; // ❌ TypeScript не даст так сделать

// 1. Создай переменные age1/title1/isReady1 с типами number/string/boolean
let age1: number = 18;
let title1: string = 'About us';
let isReady1: boolean = false;

// 2. Опиши литеральный тип Mode, который может иметь значения "light или "dark"
// и переменную currentMode этого типа
type Mode = 'light' | 'dark';
let currentMode: Mode = 'light';

// 3. Создай тип ID как объединение number | string и две переменные с разными значениями
type ID = number | string;
const id1: ID = 15;
const id2: ID = '5';

// 4. Создай переменные nums (массив чисел) и names (массив строк). Явно их типизируй
let nums: number[] = [1, 2, 3]; //let nums:Array<number>
let names: string[] = ['a', 'b', 'c']; //let names:Array<string>

// 5. Создай объект product и задай тип «на месте»: product имеет id (число), name (строка), price (число)
let product: { id: number; name: string; price: number } = {
  id: 2,
  name: 'lock',
  price: 15,
};

// 6. Дай имя типу Person, у которого id число, name строка и создай переменную p этого типа
type Person = { id: number; name: string };
const p: Person = { id: 0, name: 'Vova' };

// 7. Напиши функцию sizeOf: принимает string | number → возвращает number (длина строки или само число)
function sizeOf(size: string | number): number {
  if (typeof size === 'string') {
    return size.length;
  }
  return size;
}

// 8. Опиши тип User: id — number, name — string, nickname — опционально (string)
type User = { id: number; name: string; nickname?: string };

// 9. Функция hello: принимает User → возвращает "Hi, Ann (@ann)" или "Hi, Ann" (если нет nickname). Реализуй ее
function hello(user: User): string {
  if (user.nickname) {
    return 'Hi, Ann (@ann)';
  }
  return 'Hi, Ann';
}

// 10. Типизируй стрелочную функцию lower: принимает string → возвращает string
const lower = (text: string): string => text.toLocaleLowerCase();

// 11. Опиши тип функции Calc: принимает 2 аргумента number (a, b), возвращает number
type Calc = (a: number, b: number) => number;

// 12. Реализуй 2 функции: add (складывает 2 числа) и mul (перемножает) с типом Calc
const add: Calc = (a, b) => a + b;
const mul: Calc = (a, b) => a * b;

// 13. Напиши функцию log: принимает message (строка), ничего не возвращает (void). Просто логирует message в консоль
function log(message: string): void {
  console.log(message);
}

// 14. Напиши и типизируй функцию firstEven: принимает массив чисел
// и возвращает первое четное число или undefined (если в массиве нет четных)
function firstEven(array: number[]): number | undefined {
  return array.find((i) => i % 2 === 0);
}

// 15. Опиши тип Profile2 (id число, name: строка, age опциональное поле число);
// напиши функцию ageLabel(p:Profile2):string (с проверкой undefined)
type Profile = { id: number; name: string; age?: number };
function ageLabel(p: Profile): string {
  if (age === undefined) {
    return `Id: ${p.id}, name: ${p.name}`;
  }
  return `Id: ${p.id}, name: ${p.name}, age: ${p.age}`;
}

// 16. Напиши и типизируй функцию createPagination. Принимает 3 аргумента page число, pageSize число
// sortBy строка со значением по умолчанию 'createdAt'.
// Функция возвращает объект
// { page: number;
//   pageSize: number,
//   sortBy: string }
function createPagination(
  page: number,
  pageSize: number,
  sortBy: string = 'createdAt'
): { page: number; pageSize: number; sortBy: string } {
  return {
    page,
    pageSize,
    sortBy,
  };
}

// 17. Создай литеральный тип Result и функцию isOk которая принимает Result
// и возвращает boolean (true если "ok" и false если "fail")
type Result = 'ok' | 'fail';
function isOk(r: Result): boolean {
  if (r === 'ok') return true;
  return false;
}

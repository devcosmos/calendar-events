# Swim Events Calendar

Основан на [Next.js](https://nextjs.org/).

## 🛠 Стек

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Swiper](https://swiperjs.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 🧼 Код-стайл

- ESLint: `eslint.config.mjs`
- Prettier: `.prettierrc`
- Tailwind CSS: `tailwind.config.ts`

## 📄 Лицензия

[ELASTIC LICENSE 2.0](../LICENSE)

## 🎨 Credits

Иконки: [Solar](https://icon-sets.iconify.design/solar/) by [480 Design](https://www.figma.com/community/file/1166831539721848736), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## TODO:

- Update dependencies (tailwind to 4v)
- цветовые схемы - баги на светлых темах
- tabbar botton add animation from favourive button
- рефактор кнопок - сделать три вида
- перенести nbsp на бекенд

- добавить не только города, но и регионы
- подумать над тем, что бы переключать фильтрацию при РФ/За рубежом
- поработать с фильтрами (только города РФ + добавить регионы)

Я бы разбил логику так:

есть выбор - россия и всё остальное

если ничего не выбрано или выбраны оба варианта, то выводить место проведения - все города/страны где больше 2-3

если выбрана россия (показать только города РФ + вывести фильтр по регионам)

если выбрано за рубежом (показать только зарубежные города / страны)

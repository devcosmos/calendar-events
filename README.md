# Schedule Frontend

Пользовательский интерфейс платформы расписаний. Основан на [Next.js](https://nextjs.org/).

## 🛠 Стек

- [Next.js](https://nextjs.org/)
- [TypeScript](https://www.typescriptlang.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [ESLint](https://eslint.org/)
- [Prettier](https://prettier.io/)
- [Swiper](https://swiperjs.com/)
- [Zustand](https://zustand-demo.pmnd.rs/)

## 🚀 Установка и запуск

```bash
npm install
npm run dev
```

## 📂 Структура

```
web/
├── app/                 # Страницы, маршруты, компоненты и утилиты
├── public/              # Статичные ресурсы
└── ...
```

## 📜 Скрипты

```bash
npm run dev        # Запуск dev-сервера
npm run build      # Сборка
```

## 🐳 Docker

Пример сборки и запуска:

```bash
docker build -t schedule-frontend .
docker run -p 3000:3000 schedule-frontend
```

## 🧼 Код-стайл

- ESLint: `eslint.config.mjs`
- Prettier: `.prettierrc`
- Tailwind CSS: `tailwind.config.ts`

## 📄 Лицензия

[MIT](../LICENSE)

## 🎨 Credits

Иконки: [Solar](https://icon-sets.iconify.design/solar/) by [480 Design](https://www.figma.com/community/file/1166831539721848736), licensed under [CC BY 4.0](https://creativecommons.org/licenses/by/4.0/).

## TODO:

- Update dependencies (tailwind to 4v)
- цветовые схемы - баги на светлых темах
- tabbar botton add animation from favourive button
- рефактор кнопок - сделать три вида

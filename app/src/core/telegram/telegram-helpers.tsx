/**
 * Преобразует HEX-цвет в строку формата RGB.
 *
 * Функция принимает строку HEX-цвета (например, `#ffffff` или `#abc`),
 * конвертирует её в RGB-формат и возвращает строку в формате `"R G B"`.
 *
 * @param hex Цвет в формате HEX (например, `#RRGGBB` или `#RGB`).
 * @returns Цвет в формате `"R G B"`, где R, G и B — целые числа от 0 до 255.
 */
function hexToRgb(hex: string): string {
  hex = hex.replace(/^#/, '');
  if (hex.length === 3) {
    hex = hex
      .split('')
      .map((x) => x + x)
      .join(''); // #abc → #aabbcc
  }
  const bigint: number = parseInt(hex, 16);
  const r: number = (bigint >> 16) & 255;
  const g: number = (bigint >> 8) & 255;
  const b: number = bigint & 255;

  return `${r} ${g} ${b}`; // Выходной формат: "34 197 94"
}

/**
 * Конвертирует HEX-цвета в атрибуте `style` у тега `<html>` в формат RGB и записывает в `<body>`.
 *
 * Функция ищет все HEX-значения (например, `#ffffff`, `#abc`) в атрибуте `style` тега `<html>`,
 * заменяет их на RGB (`rgb(255, 255, 255)`) и записывает обновлённый стиль в `<body>`,
 * сохраняя остальные свойства.
 */
export function convertHtmlHexStylesToBodyRgb(): void {
  const htmlElement = document.documentElement; // Берём <html>
  const hexRegex: RegExp = /#([0-9A-Fa-f]{3,6})/g; // Регулярка для HEX-цветов

  // Проверяем, есть ли `style` у <html>
  const style: string | null = htmlElement.getAttribute('style');

  if (style) {
    // Заменяем все HEX-значения на RGB
    const updatedStyle: string = style.replace(hexRegex, (hex: string) => `${hexToRgb(hex)}`);

    // Обновляем `style` у <body>
    document.body.setAttribute('style', updatedStyle);
  }
}

/* Interface translations never modify project data or watch-face text. */
const R390_I18N = (() => {
  const entries = {
    'Касания холста':'Canvas touch mode', 'Прокрутка':'Scroll', 'Правка':'Edit',
    'Язык интерфейса':'Interface language', '✦ Как начать':'✦ Quick start',
    'Отменить (Ctrl+Z)':'Undo (Ctrl+Z)', 'Повторить (Ctrl+Shift+Z / Ctrl+Y)':'Redo (Ctrl+Shift+Z / Ctrl+Y)',
    'Открыть':'Open', 'Сохранить':'Save', '＋ Новый':'＋ New', 'Собрать BIN':'Build BIN', 'Готово':'Ready',
    'Добавить':'Add', 'Изображение':'Image', 'Время':'Time', 'Стрелки':'Hands', 'Дата':'Date', 'Шаги':'Steps',
    'Пульс':'Heart rate', 'Ккал':'Calories', 'Батарея':'Battery', 'Текст':'Text', 'Документ':'Document',
    'Имя':'Name', 'Название циферблата':'Watch face name', 'Фон':'Background', 'Сетка':'Grid',
    'Показывать':'Show grid', 'Привязка':'Snap', 'Экспорт':'Export', 'Оценка':'Estimated size', 'Лимит':'Limit',
    'Основной':'Main', '▶ Анимация':'▶ Animation', '❚❚ Пауза':'❚❚ Pause', 'По центру':'Center', 'Удалить слой':'Delete layer',
    'Предпросмотр':'Preview', 'Инспектор':'Inspector', 'Слои проекта':'Project layers',
    'Выберите слой в списке.':'Select a layer in the list.', 'Автор:':'Author:', '❤ Поддержать':'❤ Support',
    'Режим интерфейса':'Interface mode', 'Мобильный':'Mobile', 'Как начать':'Quick start', 'Закрыть':'Close',
    'Что умеет редактор':'Editor features', 'Шрифты':'Fonts', 'Создай проект':'Create a project',
    'Добавь элементы':'Add elements', 'Настрой вид':'Adjust the appearance', 'Сделай AOD':'Create an AOD',
    'Собери BIN':'Build a BIN', 'Понятно':'Got it', 'Перетащить слой':'Drag layer', 'Показать слой':'Show layer',
    'Скрыть слой':'Hide layer', 'Дублировать слой (Ctrl+D)':'Duplicate layer (Ctrl+D)',
    'Обводка':'Outline', 'Цвет контура':'Outline color', 'Толщина, px':'Width, px', 'Ширина':'Width', 'Высота':'Height',
    'Видимый':'Visible', 'Шрифт':'Font', 'Размер':'Size', 'Цифры':'Digits', 'Мигающие точки':'Blinking colon',
    'Интервал':'Interval', '500 мс':'500 ms', '1000 мс':'1000 ms', 'Часовая, px':'Hour hand, px',
    'Толщина':'Width', 'Цвет часовой':'Hour color', 'Минутная, px':'Minute hand, px', 'Цвет минутной':'Minute color',
    'Секундная':'Second hand', 'Секундная, px':'Second hand, px', 'Хвост, px':'Tail, px', 'Цвет секундной':'Second color',
    'Точка центра':'Center cap', 'Цвет центра':'Cap color', '＋ Добавить шрифт':'＋ Add font', 'Цвет':'Color',
    'Жирный':'Bold', 'Выравн.':'Alignment', 'Слева':'Left', 'Центр':'Center', 'Справа':'Right',
    'Подпись':'Label', 'Пример':'Sample', 'Цифры px':'Digits, px', 'Подпись px':'Label, px', 'Вид':'Style',
    'Иконка':'Icon', 'Полоса':'Bar', 'Кольцо':'Ring', 'Только %':'Percent only', 'Иконка + %':'Icon + percent',
    'Пример %':'Sample %', 'Размер %':'Percent size', 'Проценты':'Percentage',
    'Запустить предпросмотр анимации':'Start animation preview', 'Остановить предпросмотр анимации':'Stop animation preview',
    'Дата и время здесь нужны только для предпросмотра циферблата. На часах время и дата берутся из системных значений.':'These date and time values are for preview only. The watch uses its system date and time.',
    'AOD: без GIF и фитнес-метрик. Время, дата, батарея, текст и статические изображения поддерживаются.':'AOD: no GIFs or fitness metrics. Time, date, battery, text and static images are supported.',
    'Сетка — чисто визуальный инструмент для удобного выравнивания. Она не попадает в BIN или preview; включить/выключить — клавиша':'The grid helps align elements and is excluded from the BIN and preview. Toggle it with',
    'Размер меняется на холсте за 8 маркеров. Shift + угол сохраняет пропорции.':'Resize using the eight canvas handles. Shift + a corner preserves the aspect ratio.',
    'В AOD двоеточие экспортируется статичным — без анимации.':'The AOD colon is exported as a static element.',
    'Мигает только двоеточие; цифры времени остаются native sprite-виджетами.':'Only the colon blinks; time digits remain native sprite widgets.',
    'В AOD секундная стрелка не экспортируется — так же сделано в штатном Minimalist.':'The second hand is excluded from AOD, as in the stock Minimalist face.',
    'Дата остаётся native-виджетом Fit3 и использует системный шрифт часов. Кастомные шрифты применяются к времени и статическому тексту.':'Date remains a native Fit3 widget using the watch system font. Custom fonts apply to time and static text.',
    'На часах source 37 используется дважды: sprite для уровня и native type 5 для точного текущего процента.':'On the watch, source 37 is used twice: a level sprite and native type 5 for the current percentage.',
    'Основной экран + отдельный AOD, двойной предпросмотр, GIF, время, дата, шаги, пульс, ккал, батарея, текст, цвета, resize и Undo/Redo. Интерфейс можно переключать между PC и мобильным режимом возле кнопки автора.':'Main screen and separate AOD, dual previews, GIFs, time, date, steps, heart rate, calories, battery, text, colors, resizing and Undo/Redo. Switch between desktop and mobile mode in the bottom bar.',
    'Inter, Roboto, Open Sans, Lato, Montserrat, Oswald, Ubuntu, Merriweather, Playfair Display, Roboto Mono + импорт своих TTF/OTF/WOFF.':'Inter, Roboto, Open Sans, Lato, Montserrat, Oswald, Ubuntu, Merriweather, Playfair Display, Roboto Mono + custom TTF/OTF/WOFF imports.',
    'Задай ID от 200 до 250 — этот диапазон зарезервирован для пользовательских циферблатов.':'Set an ID from 200 to 250, the range reserved for custom watch faces.',
    'Время, дату, батарею, текст, PNG или GIF перетаскивай прямо на экран.':'Add time, date, battery, text, PNGs or GIFs and drag them on the screen.',
    'Размер, цвет и шрифт меняются в инспекторе справа. Ctrl+Z — отмена, Ctrl+D — копия слоя.':'Adjust size, color and font in the inspector. Ctrl+Z undoes; Ctrl+D duplicates a layer.',
    'Переключись на вкладку AOD и собери отдельный экран Always On Display.':'Switch to AOD and create a separate Always On Display screen.',
    'Нажми «Собрать BIN». Редактор сам создаст style0.bin, aod.bin, preview и CRC.':'Click Build BIN. The editor creates style0.bin, aod.bin, the preview and CRC.',
    'Создать новый проект?':'Create a new project?', 'Введите ID от 200 до 250':'Enter an ID from 200 to 250',
    'Укажите ID от 200 до 250':'Set an ID from 200 to 250',
    'Перед сборкой укажите свободный ID циферблата от 200 до 250.':'Before building, set an unused watch face ID from 200 to 250.',
    'Введите название циферблата перед сборкой BIN:':'Enter a watch face name before building the BIN:',
    'Нужно указать имя циферблата':'A watch face name is required', 'Сборка основного экрана и AOD…':'Building the main screen and AOD…',
    'Загрузка ресурсов проекта…':'Loading project resources…', 'Проект загружен':'Project loaded',
    'Разбираю GIF на кадры…':'Decoding GIF frames…', 'Этот слой недоступен в AOD.':'This layer is unavailable in AOD.',
    'В AOD анимация отключена для экономии энергии.':'Animation is disabled in AOD to save power.',
    'ImageDecoder недоступен':'ImageDecoder is unavailable', 'В GIF не найдены кадры':'No frames found in GIF',
    'Некорректный GIF':'Invalid GIF', 'GIF без palette':'GIF has no palette', 'GIF содержит больше 118 кадров':'GIF contains more than 118 frames',
    'Максимум 118 кадров в v0.6.7':'Maximum 118 frames in v0.6.7', 'Анимация больше 118 кадров':'Animation exceeds 118 frames',
    'setting.bin отсутствует или повреждён':'setting.bin is missing or damaged', 'setting.bin объявляет 0 вариантов циферблата':'setting.bin declares zero watch face variants',
    'style0.bin отсутствует':'style0.bin is missing', 'Изменение':'Change', 'История':'History',
    'Создание проекта':'Project created', 'Копия слоя':'Layer duplicated', 'Порядок слоёв':'Layer order',
    'Слой скрыт':'Layer hidden', 'Слой показан':'Layer shown', 'Удалён слой':'Layer deleted',
    'Свойства слоя':'Layer properties', 'Добавлен шрифт':'Font added', 'Добавлено изображение':'Image added',
    'Добавлена анимация':'Animation added', 'Центрирование':'Layer centered', 'Параметры проекта':'Project settings',
    'Перемещение/масштабирование':'Move/resize', 'Название циферблата':'Watch face name', 'Сетка редактора':'Editor grid'
  };
  const patterns = [
    [/^(\d+) кадров\. Максимум 118 кадров на одну анимацию\.$/, '$1 frames. Maximum 118 frames per animation.'],
    [/^Native source ID: (\d+)\. Значение на часах обновляется системой\.$/, 'Native source ID: $1. The watch updates the value automatically.'],
    [/^GIF содержит (\d+) кадров — максимум 118$/, 'GIF contains $1 frames; maximum 118'],
    [/^GIF: (\d+) кадров, исходная скорость ≈ (.+) FPS — загружаю…$/, 'GIF: $1 frames, original speed ≈ $2 FPS; loading…'],
    [/^Загрузка (\d+) кадров…$/, 'Loading $1 frames…'],
    [/^После учёта таймингов получилось (\d+) кадров — максимум 118$/, 'Timing expansion produced $1 frames; maximum 118'],
    [/^(\d+) кадров загружено @ (.+) FPS — предпросмотр запущен$/, '$1 frames loaded @ $2 FPS; preview started'],
    [/^Кадр (\d+)$/, 'Frame $1'],
    [/^Количество вариантов не совпадает: (.+)$/, 'Variant count mismatch: $1']
  ];
  const prefixes = {'Ошибка: ':'Error: ', 'Ошибка GIF: ':'GIF error: ', 'Ошибка проекта: ':'Project error: ',
    'Не удалось импортировать анимацию: ':'Animation import failed: ', 'Не удалось загрузить шрифт: ':'Font import failed: ',
    'Шрифт добавлен: ':'Font added: ', 'Готово: ':'Ready: ', 'Неожиданный блок GIF 0x':'Unexpected GIF block 0x',
    'Слишком длинный путь ':'Path is too long: '};
  let language = 'ru';
  try { language = localStorage.getItem('r390-language') === 'en' ? 'en' : 'ru'; } catch (_) {}
  function translate(value) {
    if (language !== 'en' || typeof value !== 'string') return value;
    if (Object.hasOwn(entries, value)) return entries[value];
    for (const [pattern, replacement] of patterns) if (pattern.test(value)) return value.replace(pattern, replacement);
    for (const [prefix, replacement] of Object.entries(prefixes)) if (value.startsWith(prefix)) return replacement + translate(value.slice(prefix.length));
    return value;
  }
  const originals = new WeakMap();
  function localizedValue(target, key, value) {
    let values = originals.get(target);
    if (!values) { values = new Map(); originals.set(target, values); }
    const previous = values.get(key);
    const source = previous && value === previous.output ? previous.source : value;
    const output = source.replace(/\S(?:[\s\S]*\S)?/, text => translate(text));
    values.set(key, {source, output});
    return output;
  }
  const observer = new MutationObserver(localize);
  function localize() {
    observer.disconnect();
    const walker = document.createTreeWalker(document.body, NodeFilter.SHOW_TEXT);
    let node;
    while ((node = walker.nextNode())) {
      if (node.parentElement.closest('script, style, .layer .name, #r390StatusBar > span:first-child')) continue;
      const output = localizedValue(node, 'text', node.nodeValue);
      if (output !== node.nodeValue) node.nodeValue = output;
    }
    document.querySelectorAll('[title], [placeholder], [aria-label]').forEach(element => {
      for (const attribute of ['title', 'placeholder', 'aria-label']) {
        if (!element.hasAttribute(attribute)) continue;
        const value = element.getAttribute(attribute);
        const output = localizedValue(element, attribute, value);
        if (output !== value) element.setAttribute(attribute, output);
      }
    });
    document.documentElement.lang = language;
    document.querySelectorAll('[data-language]').forEach(button => {
      const active = button.dataset.language === language;
      button.classList.toggle('active', active);
      button.setAttribute('aria-pressed', String(active));
    });
    observer.observe(document.body, {subtree:true, childList:true, characterData:true, attributes:true, attributeFilter:['title','placeholder','aria-label']});
  }
  document.addEventListener('click', event => {
    const button = event.target.closest('[data-language]');
    if (!button) return;
    language = button.dataset.language === 'en' ? 'en' : 'ru';
    try { localStorage.setItem('r390-language', language); } catch (_) {}
    if (typeof updateR390StatusBar === 'function') updateR390StatusBar();
    localize();
  });
  document.addEventListener('DOMContentLoaded', localize);
  return {translate};
})();
function localizedAlert(message) { window.alert(R390_I18N.translate(message)); }
function localizedConfirm(message) { return window.confirm(R390_I18N.translate(message)); }
function localizedPrompt(message, value) { return window.prompt(R390_I18N.translate(message), value); }

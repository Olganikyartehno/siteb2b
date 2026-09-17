/**
 * ЮнитКонтроль.Запуск — приём заявок с лендинга в Google Таблицу.
 *
 * НАСТРОЙКА:
 * 1. Создайте Google Таблицу: sheets.google.com → «Пустая таблица».
 * 2. Расширения → Apps Script. Удалите код по умолчанию, вставьте этот файл.
 * 3. Развернуть → Новое развертывание → Тип: «Веб-приложение».
 *    - Выполнять от имени: вы
 *    - Кто имеет доступ: «Все, у кого есть ссылка» (или «Любой»)
 * 4. Скопируйте URL веб-приложения и вставьте его в index.html
 *    в переменную GAS_URL вместо «ВСТАВЬТЕ_URL_GOOGLE_APPS_SCRIPT».
 *
 * Таблица: столбцы Дата | Продукт | Имя | Контакт | Магазины | Комментарий
 */

function doPost(e) {
  var lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    var data = JSON.parse(e.postData.contents);
    var ss = SpreadsheetApp.getActiveSpreadsheet();
    var sheet = ss.getSheetByName('Заявки') || ss.insertSheet('Заявки');

    if (sheet.getLastRow() === 0) {
      sheet.appendRow(['Дата', 'Продукт', 'Имя', 'Контакт', 'Магазины', 'Комментарий']);
    }

    sheet.appendRow([
      new Date(),
      data.product || '',
      data.name || '',
      data.contact || '',
      data.stores || '',
      data.comment || ''
    ]);

    return ContentService.createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (err) {
    return ContentService.createTextOutput(JSON.stringify({ ok: false, error: String(err) }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function doGet() {
  return ContentService.createTextOutput('OK');
}
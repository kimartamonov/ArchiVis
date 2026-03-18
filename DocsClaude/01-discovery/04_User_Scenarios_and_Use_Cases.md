# 04. User Scenarios and Use Cases

> Главный вопрос документа: «Что именно делает пользователь шаг за шагом?»

---

## Канонический end-to-end сценарий MVP

### «Оценка последствий изменения Application Component»

**Актор:** Enterprise Architect.
**Цель:** За 2 минуты получить полную картину последствий замены «Payment Gateway».

**Предусловия:**
- Architeezy доступен по сети (или загружен demo dataset).
- Пользователь имеет URL + API token.
- Модель содержит >= 1 элемент, >= 1 отношение, >= 1 диаграмму.

**Основной поток:**

| Шаг | Действие пользователя | Ответ системы |
|-----|----------------------|---------------|
| 1 | Открывает ArchiLens | Экран подключения |
| 2 | Вводит URL Architeezy + token, нажимает Connect | Система проверяет подключение, загружает список моделей |
| 3 | Выбирает модель | Система загружает элементы, отношения, диаграммы. Строит граф. Показывает прогресс |
| 4 | Попадает на Model Explorer | Видит количество элементов, слоёв, диаграмм |
| 5 | Вводит в поиск «Payment» | Dropdown с подсказками: «Payment Gateway», «Payment Service», «Payment Process» |
| 6 | Выбирает «Payment Gateway» | Открывается Impact Analyzer |
| 7 | Видит карточку элемента | Тип: Application Component. Слой: Application. Degree: 8 (in: 3, out: 5) |
| 8 | Видит affected elements (1 шаг) | 8 элементов по слоям: Business: 2, Application: 4, Technology: 2 |
| 9 | Переключает глубину на 2 шага | Affected расширяется до 19 элементов с цветовой кодировкой |
| 10 | Видит affected diagrams | 4 диаграммы, на которых присутствует «Payment Gateway» |
| 11 | Нажимает Export GraphML | Скачивается файл с подграфом 2-шагового impact |
| 12 | Нажимает Export CSV | Скачивается таблица affected elements с метриками |

**Результат:** Архитектор за < 2 минут получил полную картину, с экспортом для отчёта.

**Критерий успеха:** Affected elements корректны, файлы открываются в yEd и Excel.

---

## Сценарий 2: Model Coverage & Hygiene

**Актор:** Repository Owner.
**Цель:** За 1 минуту получить картину качества модели.
**Приоритет:** P1 (вторичный).

**Поток:**

| Шаг | Действие | Ответ системы |
|-----|----------|---------------|
| 1 | Загружает модель (шаги 1-4 из сценария 1) | Модель загружена |
| 2 | Переходит на Coverage & Quality | Экран coverage |
| 3 | Видит общие метрики | Всего: 247 элементов. Orphans: 18 (7.3%). Без диаграмм: 34 (13.8%) |
| 4 | Видит список orphan elements | Таблица с сортировкой |
| 5 | Кликает на orphan | Переход к карточке элемента |
| 6 | Экспортирует список в CSV | Файл для cleanup-плана |

**Критерий успеха:** Orphan elements определены корректно, числа совпадают с ручной проверкой.

---

## Сценарий 3: Global Graph Exploration

**Актор:** Enterprise Architect.
**Цель:** Визуально обследовать модель, найти хабы и узкие места.
**Приоритет:** P0 (основной).

**Поток:**

| Шаг | Действие | Ответ системы |
|-----|----------|---------------|
| 1 | Загружает модель | Модель загружена |
| 2 | Открывает Global Graph | Единый граф всех элементов с цветовой кодировкой слоёв |
| 3 | Zoom/pan по графу | Интерактивная навигация |
| 4 | Фильтрует по слою Application | Остаются только Application-элементы |
| 5 | Кликает по крупному узлу | Popup: имя, тип, degree |
| 6 | Переходит к Impact Analyzer | Анализ выбранного элемента |

---

## Сценарий 4: Table View Navigation

**Актор:** Архитектор или аналитик.
**Цель:** Работать с моделью через таблицу, сортировать по метрикам.
**Приоритет:** P1.

**Поток:**

| Шаг | Действие | Ответ системы |
|-----|----------|---------------|
| 1 | Переходит на Table View | Таблица всех элементов: name, type, layer, degree, diagrams_count |
| 2 | Сортирует по degree (desc) | Видит top hubs |
| 3 | Фильтрует по Technology layer | Только Technology-элементы |
| 4 | Кликает по строке | Переход к карточке / Impact Analyzer |

---

## Сценарий 5: Evidence-Based Narrative

**Актор:** Архитектор перед governance board.
**Цель:** Подготовить артефакт для презентации.
**Приоритет:** P1.

**Поток:**

1. Проводит impact analysis (сценарий 1).
2. Экспортирует подграф в GraphML → открывает в yEd → layout → сохраняет PNG.
3. Экспортирует CSV → открывает в Excel → форматирует для отчёта.
4. Вставляет в презентацию: «Изменение Payment Gateway затрагивает 19 элементов на 3 слоях».

---

## Точки входа в сценарии

| Сценарий | Стартовый экран | Триггер |
|----------|----------------|---------|
| Impact Analysis | Model Explorer → поиск | Клик по элементу → Analyze Impact |
| Coverage & Hygiene | Coverage screen | Загрузка модели |
| Global Graph | Global Graph | Загрузка модели |
| Table View | Table View | Навигация |
| Export | Любой экран с результатами | Кнопка Export |

---

## Способы нахождения элемента

1. **Текстовый поиск** по имени (fuzzy, case-insensitive) — основной.
2. **Клик по узлу в Global Graph** — визуальный.
3. **Клик по строке в таблице** — табличный.

---

## Обработка ошибок и отклонений

| Отклонение | Поведение системы |
|-----------|------------------|
| Элемент не найден | «No elements found. Try a different search term.» |
| API не отвечает | «Cannot connect to Architeezy. Check URL and credentials.» + Retry |
| Модель > 500 элементов | Warning: «Large model. Performance may be reduced.» |
| Нет отношений | «No relationships found. Impact analysis requires relationships.» |
| Модель пустая | «No elements found in this model.» |
| Невалидный токен | «Authentication failed. Please check your API token.» |
| Битые ссылки | Warning: «N broken references found.» Битые ссылки игнорируются |

---

## Приоритизация сценариев

| Приоритет | Сценарий |
|-----------|----------|
| **P0** | Impact Analysis end-to-end (канонический) |
| **P0** | Подключение и загрузка модели |
| **P0** | Global Graph просмотр |
| **P1** | Coverage & Hygiene |
| **P1** | Table View с метриками |
| **P1** | Export GraphML/CSV |
| **Stretch** | Evidence-based narrative |

---

## Явно исключённые сценарии

1. Cross-Layer X-Ray (вертикальная визуализация business → technology).
2. Compare two states (сравнение версий модели).
3. Saved analysis (сохранение и повторное открытие результатов).
4. Shared links (отправка URL коллеге).
5. Batch analysis (анализ всех элементов разом).
6. Custom quality rules.

---

*Связь с другими документами: пользователи → [03_Stakeholders_and_Users](03_Stakeholders_and_Users.md), функции → [05_Functional_Requirements](../02-requirements/05_Functional_Requirements.md), приёмка → [11_Acceptance_Criteria](../04-delivery/11_Acceptance_Criteria_and_Test_Strategy.md).*

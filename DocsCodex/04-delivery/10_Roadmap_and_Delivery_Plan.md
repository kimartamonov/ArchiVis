# 10 Roadmap and Delivery Plan

## Delivery context

ArchiLens OSS должен дойти до usable MVP коротким, дисциплинированным циклом. Главный риск проекта — не нехватка идей, а расползание scope и уход в визуализацию до подтверждения реальной пользы.

## Целевой горизонт MVP

Реалистичный горизонт первой версии:

- 3-4 недели до рабочего MVP;
- локальный и self-hosted запуск;
- один основной сквозной сценарий в готовом состоянии.

## Базовая команда

Минимально жизнеспособная команда:

- 1 product/tech lead;
- 1 fullstack/frontend engineer, если доступен.

Если команда из одного человека, roadmap сохраняется, но количество параллельных направлений должно быть минимальным.

## Макро-этапы реализации

### M0 Foundation Gate

Цель:

Подтвердить интеграционный путь и стабилизировать исходную рамку реализации.

Содержание:

- структура проекта;
- базовый deployment baseline;
- доступ к Architeezy API;
- acceptance datasets;
- финализация канонической доменной модели.

Результат:

Можно начинать capability slicing и реализацию без критических архитектурных пробелов.

### M1 Valuable MVP

Цель:

Дать первый ценный пользовательский результат: выбор модели, поиск элемента, просмотр собранной в единый контекст сущности.

Содержание:

- загрузка модели;
- построение графа;
- поиск;
- таблица элементов;
- карточка элемента;
- диаграммное присутствие элемента.

Результат:

Пользователь уже видит, что продукт склеивает разрозненные представления в одну анализируемую сущность.

### M2 Usable MVP

Цель:

Собрать главный рабочий сценарий impact analysis.

Содержание:

- impact traversal;
- глубина анализа 1-3;
- affected elements;
- affected layers;
- affected diagrams;
- базовый result navigation.

Результат:

Пользователь может пройти основной end-to-end сценарий от выбора модели до полезного результата impact analysis.

### M3 Stronger MVP

Цель:

Сделать MVP пригодным для регулярного использования и приемки.

Содержание:

- coverage and hygiene indicators;
- export in CSV and GraphML;
- explainability baseline;
- error handling;
- performance smoke fixes;
- demo script;
- README, runbook, known limitations.

Результат:

Получается не просто demo, а продукт, который можно дать пилотному пользователю.

## Рекомендуемый порядок реализации

1. Интеграция с Architeezy.
2. Нормализация данных в канонический граф.
3. Базовые метрики и quality signals.
4. Impact analysis.
5. Search and element navigation.
6. Coverage.
7. Export.
8. Explainability and stabilization.

## Критический путь проекта

Критический путь MVP:

`доступ к данным -> построение графа -> impact analysis -> выбор элемента -> export результата`

Если любой из этих шагов не реализован, MVP не выполняет свою основную задачу.

## Основные зависимости, влияющие на сроки

### Внешние

- доступность и стабильность Architeezy API;
- наличие real-world или анонимизированной модели;
- возможность экспертной валидации;
- OSS licensing and publishing constraints.

### Внутренние

- согласованность доменной модели;
- выбор архитектурной формы BFF/backend;
- понятные правила базовых метрик и explainability;
- наличие controlled datasets.

## Что можно показать рано

### Demo-ready point

Продукт уже можно показать как demo после того, как работают:

- загрузка модели;
- поиск элемента;
- impact analysis;
- базовый табличный и графовый результат.

Но это еще не final MVP.

### Pilot-ready point

Пилотному пользователю продукт можно давать только после того, как есть:

- explainability;
- export;
- базовая устойчивость к ошибкам и плохим данным;
- known limitations и runbook.

## Cut lines при нехватке времени

### Что можно урезать первым

- богатство глобального графового режима;
- количество вторичных фильтров;
- визуальную полировку;
- глубину отдельного coverage UI;
- сложность risk card.

### Что нельзя убирать

- реальную загрузку модели;
- канонический граф;
- поиск и выбор элемента;
- impact analysis;
- affected layers and diagrams;
- explainability baseline;
- export.

## Отдельный milestone на доверие к результату

У ArchiLens OSS должен быть явный delivery milestone на explainability и доверие к метрикам. Это не косметика, а часть core value продукта.

## Связь с phase 2 and 3

### Phase 2

Логичное развитие после MVP:

- richer centrality and impact metrics;
- improved graph navigation;
- compare states;
- saved analytical views;
- quality rules expansion.

### Phase 3

Следующий шаг:

- multi-model analysis;
- ecosystem-level extensions;
- alerts;
- CLI/batch user mode;
- additional model sources.

## Обязательные deliverables кроме кода

Для MVP обязательны:

- sample datasets;
- demo script;
- README;
- runbook;
- known limitations;
- sample exports;
- acceptance checklist.

## Признаки готовности к post-MVP roadmap

Переход к post-MVP имеет смысл, если:

- основной e2e-flow стабильно работает на реальной модели;
- есть подтверждение полезности от практикующего архитектора;
- результат вызывает доверие;
- кодовая база допускает добавление новых capabilities без распада архитектуры.

## Вывод

Roadmap ArchiLens OSS должен вести не от “списка фич”, а от способности стабильно пройти главный пользовательский поток. MVP должен быть построен по короткому критическому пути и закончиться не просто demo, а self-hosted, объяснимым, проверяемым инструментом для impact analysis и базового governance.

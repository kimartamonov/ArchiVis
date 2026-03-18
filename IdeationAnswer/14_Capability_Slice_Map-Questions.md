# 14_Capability_Slice_Map: ответы и принятые решения

## Принцип slicing

Для ArchiLens OSS slicing должен идти **по пользовательскому результату внутри сквозного сценария**, а не по слоям системы и не по списку технологий. Если резать по типу “сначала backend, потом UI, потом граф”, команда может долго двигаться технически, но не получить ни одного демонстрируемого результата.

Поэтому capability slice должен отвечать на вопрос: **какой законченный пользовательский шаг стал возможен после этой поставки**.

## Ответы на вопросы

### Какой принцип slicing будет основным

Основной принцип slicing: **по сквозному пользовательскому результату, с учетом технических зависимостей**.

То есть сначала формируем вертикальные slices, а внутри каждого уже закрываем нужные части connector, engine, UI и export.

### Какие milestones логично выделить в MVP

Для MVP логично выделить 4 milestone-группы:

1. `M0 Foundation Gate`
2. `M1 Valuable MVP`
3. `M2 Usable MVP`
4. `M3 Stronger MVP`

Идея простая:

- `M0` подготавливает почву;
- `M1` дает первый реальный пользовательский результат;
- `M2` собирает цельный MVP;
- `M3` усиливает качество и доверие, но не меняет суть продукта.

### Какой readiness gate должен быть выполнен до начала полноценной нарезки на slices

До полноценной нарезки на slices должен быть выполнен `Foundation Gate`:

- подтвержден базовый путь интеграции с Architeezy;
- зафиксирована каноническая доменная модель;
- принят `P0` контур MVP;
- определены acceptance datasets;
- решено, есть ли BFF/backend.

Без этого slicing быстро становится ложной детализацией.

### Какой самый маленький ценный slice можно показать пользователю как ранний результат

Самый маленький ценный slice:

> Пользователь выбирает модель, находит элемент и видит его базовые связи и диаграммное присутствие в нормализованном представлении.

Это еще не полный impact analysis, но уже не просто технический каркас. Пользователь получает первую практическую ценность: единое представление объекта, размазанного по разным view.

Назовем этот slice `Slice 1: Model-to-Element Insight`.

### Какие следующие slices нужны после него, чтобы последовательно собрать полный MVP

Рекомендуемая последовательность slices:

1. `Slice 1: Model-to-Element Insight`
2. `Slice 2: Impact Analysis Core`
3. `Slice 3: Impact Result Navigation`
4. `Slice 4: Coverage & Hygiene Basics`
5. `Slice 5: Export & Evidence Pack`
6. `Slice 6: Stability, Explainability, Demo Readiness`

### Какой user outcome должен быть у каждого slice

`Slice 1: Model-to-Element Insight`

- пользователь может выбрать модель и найти нужный элемент;
- пользователь видит единый элемент с его базовыми связями и view coverage.

`Slice 2: Impact Analysis Core`

- пользователь получает impact result на глубину 1-3 шага.

`Slice 3: Impact Result Navigation`

- пользователь может исследовать impact result, переходя по связанным элементам и между табличным и графовым режимом.

`Slice 4: Coverage & Hygiene Basics`

- пользователь видит orphan и low-coverage элементы и может перейти от проблемы к анализу.

`Slice 5: Export & Evidence Pack`

- пользователь может вынести результат за пределы UI и использовать его в обсуждении изменений.

`Slice 6: Stability, Explainability, Demo Readiness`

- пользователь получает не просто расчет, а достоверный, понятный и пригодный к регулярному использованию результат.

### Какие функциональные требования входят в каждый slice

`Slice 1: Model-to-Element Insight`

- подключение к источнику;
- выбор модели;
- загрузка и нормализация;
- поиск по имени;
- таблица элементов;
- карточка элемента;
- базовые диаграммные ссылки.

`Slice 2: Impact Analysis Core`

- запуск impact analysis;
- выбор глубины;
- расчет affected elements;
- вывод affected layers;
- вывод affected diagrams.

`Slice 3: Impact Result Navigation`

- подграф результата;
- переход к связанному элементу;
- переключение табличного и графового представления;
- базовые фильтры результата.

`Slice 4: Coverage & Hygiene Basics`

- orphan detection;
- low-coverage detection;
- список проблемных элементов;
- переход к элементу.

`Slice 5: Export & Evidence Pack`

- export `CSV`;
- export `GraphML`;
- краткий explainability summary для результата.

`Slice 6: Stability, Explainability, Demo Readiness`

- обработка ошибок;
- предупреждения о неполных данных;
- performance smoke fixes;
- demo dataset packaging;
- documentation and known limitations.

### Какие acceptance criteria будут подтверждать готовность каждого slice

`Slice 1` готов, если:

- модель загружается;
- элемент находится через поиск;
- открывается его карточка;
- диаграммное присутствие видно из единого контекста.

`Slice 2` готов, если:

- impact analysis работает на глубину 1-3;
- возвращает ожидаемые результаты на known dataset.

`Slice 3` готов, если:

- пользователь может исследовать impact result без повторного ручного поиска;
- не зависит только от одной формы представления.

`Slice 4` готов, если:

- orphan и low-coverage списки вычисляются и доступны из UI;
- можно перейти от проблемного элемента к анализу.

`Slice 5` готов, если:

- результат impact и coverage можно выгрузить в обязательных форматах;
- структура файлов соответствует agreed schema.

`Slice 6` готов, если:

- основные ошибки диагностируются;
- результат понятен пользователю;
- demo и приемка проходят без ручной инженерной подгонки.

### Какие demo steps будут показывать ценность каждого slice

`Slice 1` demo:

- выбрать модель;
- найти элемент;
- показать, что он собран из разрозненных представлений в одну сущность.

`Slice 2` demo:

- выбрать глубину 1/2/3;
- показать, как растет impact radius.

`Slice 3` demo:

- перейти от seed-элемента к затронутому соседу;
- показать графовый и табличный view одного результата.

`Slice 4` demo:

- открыть orphan list;
- перейти к проблемному элементу;
- показать, что слабое качество модели видно системно.

`Slice 5` demo:

- экспортировать CSV или GraphML;
- показать, что результат можно использовать вне продукта.

`Slice 6` demo:

- воспроизвести сценарий на реальной модели без инженерных костылей;
- показать предупреждение о плохих данных и корректное поведение системы.

### Какие решения и зависимости блокируют запуск каждого slice

`Slice 1` блокируют:

- интеграционный контракт;
- доменная модель;
- решение по BFF/backend.

`Slice 2` блокируют:

- корректная нормализация графа;
- определение правил impact traversal.

`Slice 3` блокируют:

- единый state model для selection/result;
- базовый графовый rendering contract.

`Slice 4` блокируют:

- agreed rules для orphan и low-coverage;
- доступность diagram references.

`Slice 5` блокируют:

- согласованные export schemas;
- готовность impact and coverage outputs.

`Slice 6` блокируют:

- acceptance datasets;
- экспертная валидация;
- финальный список known limitations.

### Какие evidence/артефакты должны быть на выходе каждого slice

`Slice 1`:

- demo walkthrough;
- sample loaded model;
- список известных ограничений по данным.

`Slice 2`:

- expected vs actual impact results на test dataset;
- unit/integration tests для traversal.

`Slice 3`:

- e2e demo flow;
- короткий usability note по navigation.

`Slice 4`:

- sample CSV проблемных элементов;
- documented rules orphan/low-coverage.

`Slice 5`:

- sample `CSV`;
- sample `GraphML`;
- проверка схемы экспортов.

`Slice 6`:

- acceptance checklist;
- test report;
- demo script;
- README/runbook;
- expert validation notes.

### Что нужно явно вынести за пределы каждого slice

Чтобы slices оставались вертикальными и управляемыми, из них нужно явно выносить:

- advanced analytics beyond current slice goal;
- cross-slice visual polish;
- saved views и collaboration;
- multi-model support;
- любые runtime plugin mechanics;
- executive storytelling features.

Каждый slice должен завершаться пользовательским результатом, а не попыткой “сразу сделать весь модуль красиво”.

### Какие slices являются обязательными, а какие stretch/optional

Обязательные slices:

- `Slice 1`;
- `Slice 2`;
- `Slice 4`;
- `Slice 5`;
- `Slice 6`.

Условно обязательный, но допускающий упрощение:

- `Slice 3`.

Почему так:

- навигация по результату важна, но при нехватке времени ее можно сделать проще, чем originally planned, не потеряв ядро ценности.

### Как зависимости между slices влияют на порядок milestones

Порядок почти линейный, потому что:

- без `Slice 1` невозможно полезно показать `Slice 2`;
- без `Slice 2` нечего навигировать и экспортировать;
- `Slice 4` использует уже построенный граф и diagram refs;
- `Slice 5` зависит от готовых outputs;
- `Slice 6` имеет смысл только после появления реального пользовательского потока.

### Где проходят cut lines на случай нехватки времени

Главная cut line между `valuable MVP` и `stronger MVP` проходит так:

**Valuable MVP**:

- `Slice 1`;
- `Slice 2`;
- упрощенный `Slice 5`;
- минимальный `Slice 6`.

**Stronger MVP**:

- полный `Slice 3`;
- `Slice 4` в полноценном UI;
- усиленная explainability и полировка.

То есть при дефиците времени можно упростить navigation и coverage presentation, но нельзя выбросить загрузку модели, impact core и экспорт результата.

## Итоговая capability map MVP

Capability map ArchiLens OSS должна строиться вокруг последовательного усиления одного пользовательского потока: от выбора модели и поиска элемента к impact analysis, затем к навигации по результату, quality signals, экспорту и, наконец, к стабильности и explainability. Такой slicing позволяет уже на ранних этапах показывать реальную ценность пользователю, а при нехватке времени проводить честкие cut lines между “уже полезным MVP” и “более сильной, но не обязательной” версией.

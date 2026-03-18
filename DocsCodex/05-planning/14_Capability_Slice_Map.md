# 14 Capability Slice Map

## Принцип slicing

Capability slicing для ArchiLens OSS строится по пользовательскому результату внутри одного сквозного сценария. Система не режется на “backend/frontend/graph” как отдельные вертикали delivery. Вместо этого каждый slice должен давать наблюдаемый шаг вперед для primary user.

## Readiness gate перед slicing

До полноценной нарезки roadmap на slices должны быть готовы:

- подтвержден baseline интеграции с Architeezy;
- зафиксирована доменная модель;
- принят P0 scope MVP;
- определены acceptance datasets;
- принято решение по BFF/backend.

## Milestone map

- `M0 Foundation Gate`
- `M1 Valuable MVP`
- `M2 Usable MVP`
- `M3 Stronger MVP`

## Capability slices

### Slice 1. Model-to-Element Insight

- Milestone: `M1 Valuable MVP`
- User outcome: пользователь выбирает модель, находит элемент и видит его как одну собранную сущность, а не как набор разрозненных diagram representations.
- In scope:
  - загрузка модели;
  - построение графа;
  - поиск;
  - таблица элементов;
  - карточка элемента;
  - view presence.
- FR coverage:
  - FR-01 ... FR-08
- Acceptance:
  - модель загружается;
  - элемент находится;
  - карточка элемента открывается;
  - diagram presence видно в одном контексте.
- Demo step:
  - выбрать модель -> найти элемент -> показать, что он собран из нескольких view.
- Required decisions:
  - DB-04, DB-05, DB-06
- Dependencies:
  - Foundation Gate
- Exit evidence:
  - sample loaded model;
  - walkthrough;
  - known data limitations list.
- Out of scope:
  - impact traversal;
  - export;
  - advanced metrics.

### Slice 2. Impact Analysis Core

- Milestone: `M2 Usable MVP`
- User outcome: пользователь получает impact result для выбранного элемента на глубину 1-3.
- In scope:
  - impact traversal;
  - depth control;
  - affected elements;
  - affected layers;
  - affected diagrams.
- FR coverage:
  - FR-09 ... FR-12
- Acceptance:
  - impact analysis работает на 1-3 шагах;
  - на test dataset возвращается ожидаемый результат.
- Demo step:
  - выбрать seed element -> запустить impact -> показать рост impact radius.
- Required decisions:
  - DB-07, DB-08
- Dependencies:
  - Slice 1
- Exit evidence:
  - expected vs actual results;
  - unit and integration tests.
- Out of scope:
  - compare states;
  - advanced criticality modes.

### Slice 3. Impact Result Navigation

- Milestone: `M2 Usable MVP`
- User outcome: пользователь исследует результат impact analysis, переходя по связанным сущностям.
- In scope:
  - subgraph view;
  - tabular result view;
  - переход к связанному элементу;
  - базовые result filters.
- FR coverage:
  - FR-12, FR-13
- Acceptance:
  - можно переключаться между result views;
  - можно переходить к следующему элементу без повторного ручного поиска.
- Demo step:
  - перейти от seed element к affected neighbor и продолжить анализ.
- Required decisions:
  - state model for selection/result
- Dependencies:
  - Slice 2
- Exit evidence:
  - e2e navigation walkthrough.
- Out of scope:
  - saved navigation state;
  - deep visualization polish.

### Slice 4. Coverage and Hygiene Basics

- Milestone: `M3 Stronger MVP`
- User outcome: пользователь видит деградацию модели и может перейти от проблемного элемента к анализу.
- In scope:
  - orphan detection;
  - low-coverage detection;
  - проблемные списки;
  - переход к элементу.
- FR coverage:
  - FR-14, FR-15, FR-16
- Acceptance:
  - orphan и low-coverage элементы вычисляются и отображаются;
  - возможен переход к элементу и impact analysis.
- Demo step:
  - открыть orphan list -> выбрать элемент -> перейти в анализ.
- Required decisions:
  - agreed quality rule baseline
- Dependencies:
  - Slice 1, Slice 2
- Exit evidence:
  - sample CSV for quality output;
  - rules note.
- Out of scope:
  - custom quality rule editing;
  - advanced heatmaps.

### Slice 5. Export and Evidence Pack

- Milestone: `M3 Stronger MVP`
- User outcome: пользователь может вынести результат анализа во внешнее обсуждение.
- In scope:
  - CSV export;
  - GraphML export;
  - краткий explainability summary рядом с export context.
- FR coverage:
  - FR-17, FR-18, FR-19
- Acceptance:
  - оба формата экспортируются стабильно;
  - sample files соответствуют agreed schema.
- Demo step:
  - выполнить impact analysis -> экспортировать CSV и GraphML.
- Required decisions:
  - export schemas;
  - explainability baseline.
- Dependencies:
  - Slice 2
- Exit evidence:
  - sample exports;
  - schema validation note.
- Out of scope:
  - PNG/SVG export;
  - import back into system.

### Slice 6. Stability, Explainability, Demo Readiness

- Milestone: `M3 Stronger MVP`
- User outcome: продукт становится пригодным не только для demo, но и для controlled pilot use.
- In scope:
  - error handling;
  - warnings on incomplete data;
  - performance smoke fixes;
  - demo dataset packaging;
  - README, runbook, known limitations;
  - expert validation preparation.
- FR/NFR coverage:
  - FR-20;
  - core NFR baseline.
- Acceptance:
  - главный сценарий проходит стабильно;
  - проблемы данных диагностируются;
  - acceptance checklist и supporting artifacts собраны.
- Demo step:
  - показать главный сценарий на реальной или safe model без ручной инженерной подгонки.
- Required decisions:
  - DB-07, DB-08, DB-09
- Dependencies:
  - Slice 2, Slice 4, Slice 5
- Exit evidence:
  - checklist;
  - test report;
  - demo script;
  - expert validation notes.
- Out of scope:
  - full production hardening;
  - enterprise-grade ops platform.

## Optional or stretch slices

Stretch для MVP:

- richer graph navigation in Slice 3;
- stronger visual emphasis in graph result;
- deeper quality presentation beyond lists.

## Сборка milestones из slices

- `M1 Valuable MVP`: Slice 1
- `M2 Usable MVP`: Slice 2 + simplified Slice 3
- `M3 Stronger MVP`: Slice 4 + Slice 5 + Slice 6

## Cut lines при нехватке времени

### Valuable MVP

Минимально полезная поставка:

- Slice 1;
- Slice 2;
- упрощенный Slice 5;
- минимальный Slice 6.

### Stronger MVP

Полноценная версия внутри планового горизонта:

- полный Slice 3;
- Slice 4;
- улучшенная explainability and stabilization.

## Вывод

Capability map ArchiLens OSS удерживает delivery вокруг одного пользовательского потока: от выбора модели и поиска элемента к impact analysis, затем к navigation, quality signals, export и readiness for real use. Это позволяет строить roadmap по ценности, а не по техническим слоям.

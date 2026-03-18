# Traceability Matrix

## Issues → Capability Slices → FR → AC

| Issue | Slice | FR | AC | Demo Steps | Decisions | Risks |
|-------|-------|----|----|------------|-----------|-------|
| M0-01 | RG | — | — | — | D-15, D-16 | R1, R4 |
| M0-02 | RG | — | — | — | D-1, D-2, D-13 | — |
| M0-03 | RG | — | — | — | D-9 | — |
| M0-04 | RG | FR-1.8 | — | — | D-10 | R5 |
| M0-05 | RG | — | — | — | — | — |
| M1-01 | S-1 | FR-1.8 | AC-1.4 | S-1 step 2 | D-10 | — |
| M1-02 | S-1 | FR-1.1, FR-1.2, FR-1.3, FR-1.5 | AC-1.1, AC-1.2, AC-1.3 | SC-1 steps 2-3 | D-15, D-16 | R1, R4 |
| M1-03 | S-1 | FR-1.6, FR-8.5, FR-8.6 | AC-2.1, AC-2.2, AC-2.4 | — | D-8 | — |
| M1-04 | S-1 | FR-8.4 | AC-2.3 | — | — | — |
| M1-05 | S-1 | — | — | — | — | — |
| M1-06 | S-1 | FR-8.1, FR-8.3 | — | — | D-4, D-6 | — |
| M1-07 | S-1 | FR-1.1, FR-1.2, FR-1.4, FR-1.8 | AC-1.1, AC-1.4 | SC-1 steps 1-3 | — | R4 |
| M1-08 | S-1 | FR-2.1, FR-2.2, FR-2.3, FR-2.6, FR-2.7 | AC-2.1, AC-2.2, AC-2.5 | S-1 steps 3-4 | D-3, D-11 | R2 |
| M1-09 | S-1 | FR-2.8, FR-2.9 | — | S-1 step 5 | — | — |
| M1-10 | S-1 | — | AC-1.1, AC-1.4, AC-2.1–AC-2.5 | S-1 full | — | — |
| M2-01 | S-2 | FR-3.3, FR-3.4, FR-8.6 | AC-3.2, AC-3.3, AC-3.4, AC-3.9 | — | D-12 | — |
| M2-02 | S-2 | FR-3.5, FR-3.6, FR-3.8 | AC-3.5, AC-3.6 | SC-1 step 8 | — | — |
| M2-03 | S-2 | — | AC-3.8 | — | — | — |
| M2-04 | S-2 | FR-6.1, FR-6.2, FR-6.3 | AC-5.1 | SC-1 step 5 | — | — |
| M2-05 | S-2 | FR-3.1, FR-3.2, FR-3.5 | AC-3.1 | SC-1 steps 6-7 | — | R3 |
| M2-06 | S-2 | FR-3.4 | AC-3.7 | SC-1 step 9 | — | — |
| M2-07 | S-2 | FR-3.7 | — | SC-1 step 9 | — | R2 |
| M2-08 | S-2 | — | AC-3.1–AC-3.9, AC-5.1 | S-2 full | — | — |
| M3-01 | S-3 | FR-4.1, FR-4.2, FR-4.3, FR-4.4, FR-4.5 | — | S-3 steps 1-3 | D-14 | — |
| M3-02 | S-3 | FR-5.1, FR-5.2 | AC-4.1, AC-4.2 | — | — | — |
| M3-03 | S-3 | FR-5.2, FR-5.3 | AC-4.1, AC-4.2, AC-4.3 | S-3 steps 4-6 | — | — |
| M3-04 | S-3 | FR-6.4 | AC-5.3 | — | — | — |
| M3-05 | S-3 | FR-4.5, FR-2.9 | — | S-3 step 6 | — | — |
| M3-06 | S-3 | — | AC-4.1–AC-4.3, AC-5.3 | S-3 full | — | — |
| M4-01 | S-4 | FR-7.1 | AC-6.1, AC-6.2 | SC-1 step 11 | — | — |
| M4-02 | S-4 | FR-7.2 | AC-6.3, AC-6.4 | SC-1 step 12 | — | — |
| M4-03 | S-4 | — | — | — | — | — |
| M4-04 | S-4 | FR-7.1, FR-7.2 | — | SC-1 steps 11-12 | — | — |
| M4-05 | S-4 | — | AC-6.1–AC-6.4 | S-4 full | — | — |
| M4-06 | — | — | — | — | — | R6 |
| M4-07 | — | — | — | — | D-7 | — |
| M4-08 | — | — | — | SC-1 full | — | — |
| M4-09 | — | — | All AC | All demo | — | All risks |

---

## FR Coverage Check

### P0 FR полностью покрыты:

| FR Group | FR IDs | Covered by Issues |
|----------|--------|-------------------|
| Подключение | FR-1.1–FR-1.6 | M1-02, M1-07, M1-03 |
| Global Graph | FR-2.1–FR-2.9 | M1-08, M1-09, M3-04 |
| Impact Analyzer | FR-3.1–FR-3.8 | M2-01, M2-02, M2-04, M2-05, M2-06, M2-07 |
| Таблица | FR-4.1–FR-4.5 | M3-01 |
| Coverage | FR-5.1–FR-5.3 | M3-02, M3-03 |
| Поиск и навигация | FR-6.1–FR-6.4 | M2-04, M3-04 |
| Экспорт | FR-7.1–FR-7.2 | M4-01, M4-02, M4-04 |
| Системные | FR-8.1, FR-8.3–FR-8.6 | M1-03, M1-04, M1-06, M2-01 |

**Все 34 P0 FR покрыты.**

---

## Acceptance Criteria Coverage

| AC Group | AC IDs | Covered by Validation |
|----------|--------|----------------------|
| Подключение | AC-1.1–AC-1.4 | M1-10 |
| Загрузка и граф | AC-2.1–AC-2.5 | M1-10 |
| Impact Analyzer | AC-3.1–AC-3.9 | M2-08 |
| Coverage | AC-4.1–AC-4.3 | M3-06 |
| Фильтры и поиск | AC-5.1, AC-5.3 | M2-08, M3-06 |
| Экспорт | AC-6.1–AC-6.4 | M4-05 |

**Все AC покрыты validation issues.**

---

## Demo Scenario Coverage

Канонический сценарий (SC-1) из документа 04:

| Шаг | Описание | Issue |
|-----|----------|-------|
| 1 | Открывает ArchiLens | M1-07 |
| 2 | Connect / Load Demo | M1-07, M1-01, M1-02 |
| 3 | Выбирает модель, видит граф | M1-08 |
| 4 | Model Explorer | M3-04 |
| 5 | Поиск «Payment» | M2-04 |
| 6 | Выбирает «Payment Gateway» | M2-05 |
| 7 | Карточка элемента | M2-05 |
| 8 | Affected elements (1 шаг) | M2-05, M2-06 |
| 9 | Переключает на 2 шага | M2-06 |
| 10 | Affected diagrams | M2-05 |
| 11 | Export GraphML | M4-04 |
| 12 | Export CSV | M4-04 |

**Весь канонический сценарий покрыт.**

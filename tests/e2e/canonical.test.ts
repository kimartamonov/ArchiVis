import { test, expect } from '@playwright/test';

test.describe('SC-1: Canonical Scenario — E2E Smoke Test', () => {
  test('full user journey on demo dataset', async ({ page }) => {
    const sidebar = page.getByRole('navigation', { name: 'Main navigation' });

    // Step 1: Open app → Connection Screen renders
    await page.goto('/');
    await expect(page.getByRole('heading', { name: 'ArchiLens' })).toBeVisible();
    await expect(page.getByText('Load Demo Dataset')).toBeVisible();

    // Step 2: Load demo dataset
    await page.getByText('Load Demo Dataset').click();

    // Step 3: Graph renders (React Flow container present)
    await expect(page.locator('.react-flow')).toBeVisible({ timeout: 10_000 });

    // Verify sidebar navigation items
    await expect(sidebar).toBeVisible();
    await expect(sidebar.getByText('Graph')).toBeVisible();
    await expect(sidebar.getByText('Impact')).toBeVisible();
    await expect(sidebar.getByText('Table')).toBeVisible();
    await expect(sidebar.getByText('Coverage')).toBeVisible();

    // Step 4: Navigate to Table View via sidebar
    await sidebar.getByText('Table').click();
    await expect(page.getByText('elements')).toBeVisible({ timeout: 5_000 });

    // Step 5: Table renders rows
    const tableRows = page.locator('tbody tr');
    await expect(tableRows.first()).toBeVisible();
    const rowCount = await tableRows.count();
    expect(rowCount).toBeGreaterThan(0);

    // Step 6: Export CSV button is visible and enabled
    const csvBtn = page.getByText('Export CSV');
    await expect(csvBtn).toBeVisible();
    await expect(csvBtn).toBeEnabled();

    // Step 7: Click a table row → navigates to Impact Analyzer with that element
    await tableRows.first().click();
    // Wait for impact analysis to compute and Export GraphML to appear
    await expect(page.getByText('Export GraphML')).toBeVisible({ timeout: 10_000 });
    // The element should have connections → affected > 0 → button enabled
    // (first table row is typically a well-connected element)
    await expect(page.getByText('Export GraphML')).toBeEnabled({ timeout: 5_000 });

    // Step 8: Navigate to Coverage via sidebar
    await sidebar.getByText('Coverage').click();
    await expect(page.getByText('Coverage Report')).toBeVisible({ timeout: 5_000 });
    await expect(page.getByText('Orphan Elements', { exact: true })).toBeVisible();
    await expect(page.getByText('Total Elements', { exact: true })).toBeVisible();

    // Step 9: Navigate to Impact Analyzer (element still selected from step 7)
    await sidebar.getByText('Impact').click();
    await expect(page.getByText('Export GraphML')).toBeVisible({ timeout: 5_000 });

    // Step 10: Navigate back to Graph via sidebar
    await sidebar.getByText('Graph').click();
    await expect(page.locator('.react-flow')).toBeVisible({ timeout: 5_000 });
  });
});

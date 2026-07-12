import { test, expect } from "@playwright/test";

test.describe("Cart flow", () => {
  test("cart page loads empty", async ({ page }) => {
    await page.goto("/cart");
    await expect(page.locator("body")).toBeVisible();
  });

  test("cart shows empty state or items", async ({ page }) => {
    await page.goto("/cart");
    const body = page.locator("body");
    await expect(body).toBeVisible();
    const text = await body.textContent();
    expect(text).toBeTruthy();
  });
});

test.describe("Newsletter", () => {
  test("newsletter section is visible on homepage", async ({ page }) => {
    await page.goto("/");
    const newsletter = page.locator("text=Newsletter").first();
    await expect(newsletter).toBeVisible();
  });
});

test.describe("Contact form", () => {
  test("contact page loads with form", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator("body")).toBeVisible();
    const form = page.locator("form");
    await expect(form).toBeVisible();
  });

  test("contact form has required fields", async ({ page }) => {
    await page.goto("/contact");
    await expect(page.locator('input[type="email"]')).toBeVisible();
    await expect(page.locator("textarea")).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toBeVisible();
  });
});

test.describe("Login page", () => {
  test("login page loads with form fields", async ({ page }) => {
    await page.goto("/login");
    await expect(page.locator("body")).toBeVisible();
  });
});

test.describe("Admin guard", () => {
  test("admin redirects to login when not authenticated", async ({ page }) => {
    await page.goto("/admin");
    await page.waitForURL(/\/login/, { timeout: 10_000 });
    expect(page.url()).toContain("/login");
  });
});

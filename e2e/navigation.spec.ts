import { test, expect } from "@playwright/test";

test.describe("Homepage", () => {
  test("loads and displays main content", async ({ page }) => {
    await page.goto("/");
    await expect(page).toHaveTitle(/Lisory/i);
    await expect(page.locator("body")).toBeVisible();
  });

  test("navigation links are present", async ({ page }) => {
    await page.goto("/");
    const navLinks = page.locator("nav a, header a");
    const count = await navLinks.count();
    expect(count).toBeGreaterThan(0);
  });
});

test.describe("Public pages", () => {
  const publicPages = [
    { path: "/", name: "Homepage" },
    { path: "/about", name: "About" },
    { path: "/contact", name: "Contact" },
    { path: "/faq", name: "FAQ" },
    { path: "/login", name: "Login" },
    { path: "/cadastro", name: "Register" },
    { path: "/cart", name: "Cart" },
    { path: "/category", name: "Category" },
    { path: "/politica-trocas", name: "Return Policy" },
    { path: "/privacidade", name: "Privacy" },
    { path: "/termos", name: "Terms" },
  ];

  for (const { path, name } of publicPages) {
    test(`${name} (${path}) loads without error`, async ({ page }) => {
      const response = await page.goto(path);
      expect(response?.status()).toBeLessThan(500);
      await expect(page.locator("body")).toBeVisible();
    });
  }
});

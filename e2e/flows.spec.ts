import { expect, test, type Page } from "@playwright/test";

/** Navigate and wait for hydration, so keyboard shortcuts are wired up. */
async function open(page: Page, url: string) {
  await page.goto(url);
  await page.waitForLoadState("networkidle");
}

test("kvíz: A–D vybere odpověď, Enter potvrdí a pokračuje", async ({ page }) => {
  await open(page, "/kvizy/prvni-svetova-valka?pocet=2");
  await expect(page.getByText("1 / 2")).toBeVisible();
  await page.keyboard.press("a");
  await expect(page.getByRole("radio", { name: /Trojspolek a.Dohoda/ })).toBeChecked();
  await page.keyboard.press("Enter");
  await expect(page.getByText("Správně. Odpověď byla potvrzena.")).toBeVisible();
  await expect(page.getByText("Proč", { exact: true })).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByText("2 / 2")).toBeVisible();
  await page.keyboard.press("c");
  await page.keyboard.press("Enter");
  await expect(page.getByText("Nesprávně. Správná odpověď je B.")).toBeVisible();
  await page.keyboard.press("Enter");
  await expect(page.getByRole("heading", { name: "Kvíz máš hotový" })).toBeVisible();
});

test("kartičky: mezerník otočí, 1–3 ohodnotí, na konci hotovo", async ({ page }) => {
  await open(page, "/karticky");
  await expect(page.getByText("1 z 6")).toBeVisible();
  await page.keyboard.press("Space");
  await expect(page.getByText("Odpověď", { exact: true })).toBeVisible();
  await page.keyboard.press("3");
  await expect(page.getByText("2 z 6")).toBeVisible();
  for (const key of ["1", "2", "3", "3", "3"]) {
    await page.keyboard.press("Space");
    await page.keyboard.press(key);
  }
  await expect(page.getByRole("heading", { name: "Na dnešek máš hotovo" })).toBeVisible();
  // 4 × “Umím”, 2 to repeat.
  await expect(page.getByText("umím").locator("..")).toContainText("4");
});

test("tutor streamuje odpověď a citace otevře inspektor se zdrojem", async ({ page }) => {
  await open(page, "/predmety/dejepis/otazky/7/studium");
  await page.getByRole("button", { name: "Co byla červencová krize?" }).click();
  const answer = page.getByRole("article", { name: "Odpověď tutora" }).last();
  await expect(answer).toHaveAttribute("aria-busy", "false", { timeout: 10_000 });
  await expect(answer).toContainText("Rakousko-Uhersko vydalo Srbsku ultimátum");
  await answer.getByRole("button", { name: /Časová osa 1900–1914 \(zdroj 2\)/ }).click();
  const inspector = page.getByRole("complementary", { name: "Zdroj" });
  await expect(inspector.getByRole("heading", { name: "Časová osa 1900–1914" })).toBeVisible();
  await expect(inspector.locator("mark")).toContainText("Gavrilo Princip");
});

test("tutor nedostupný ukáže stav z framu 39", async ({ page }) => {
  await open(page, "/predmety/dejepis/otazky/7/studium?simulace=tutor-nedostupny");
  await page.getByRole("button", { name: "Shrň to do tří bodů" }).click();
  await expect(page.getByRole("alert").filter({ hasText: "Chat je dočasně nedostupný" })).toBeVisible();
  await expect(page.getByRole("button", { name: "Zkusit znovu" })).toBeVisible();
});

test("⌘K otevře hledání a přejde na otázku", async ({ page }) => {
  await open(page, "/");
  await page.keyboard.press("ControlOrMeta+k");
  const dialog = page.getByRole("dialog", { name: "Hledat otázky a pojmy" });
  await expect(dialog).toBeVisible();
  await page.keyboard.type("pricin");
  await page.keyboard.press("Enter");
  await expect(page).toHaveURL(/\/predmety\/dejepis\/otazky\/7$/);
  await expect(page.getByRole("heading", { level: 1, name: "Příčiny první světové války" }).first()).toBeVisible();
});

test("katalog: prázdné hledání a vymazání filtrů", async ({ page }) => {
  await open(page, "/balicky");
  await page.getByRole("searchbox", { name: "Hledat balíček nebo předmět" }).first().fill("chemie");
  await expect(page.getByText("Žádný balíček neodpovídá hledání")).toBeVisible();
  await page.getByRole("button", { name: "Vymazat hledání a filtry" }).click();
  await expect(page.getByRole("heading", { name: /Maturita · všeobecný/ })).toBeVisible();
});

test("rozbor bez vyhodnocení ukáže chybový stav", async ({ page }) => {
  await open(page, "/predmety/dejepis/otazky/7/rozbor/2");
  await expect(page.getByRole("alert").filter({ hasText: "Orientační vyhodnocení teď není dostupné" })).toBeVisible();
});

test("číselná úloha se vyhodnotí podle klíče", async ({ page }) => {
  await open(page, "/predmety/matematika/otazky/4/zkouska");
  await page.getByLabel("Výsledek").fill("192");
  await page.getByRole("button", { name: "Odevzdat" }).click();
  await expect(page.getByText("Správně", { exact: true })).toBeVisible();
});

test("mobil: citace otevře bottom sheet @mobile", async ({ page }) => {
  await open(page, "/predmety/dejepis/otazky/7/studium");
  await page.getByRole("button", { name: /Studijní podklad, kap.\s4 \(zdroj 1\)/ }).first().click();
  const sheet = page.getByRole("dialog", { name: "Zdroj" });
  await expect(sheet.getByRole("heading", { name: "Studijní podklad" })).toBeVisible();
  await page.keyboard.press("Escape");
  await expect(sheet).toBeHidden();
});

test("Dnes přehraje vstup jen při první návštěvě relace", async ({ page }) => {
  await open(page, "/");
  const heading = page.locator("header.today-enter").filter({ has: page.getByRole("heading", { level: 1 }) });
  await expect(heading).toHaveCSS("animation-name", "rise-in");
  await page.reload();
  await expect(heading).toHaveCSS("animation-name", "none");
});

test("mobil: kartičku lze po odhalení ohodnotit tažením @mobile", async ({ page, context }) => {
  await open(page, "/karticky");
  await page.getByRole("button", { name: "Otočit kartičku" }).tap();
  const question = page.getByRole("heading", { level: 1 });
  const bounds = (await question.boundingBox())!;
  const y = Math.round(bounds.y + bounds.height / 2);
  const client = await context.newCDPSession(page);
  await client.send("Input.dispatchTouchEvent", { type: "touchStart", touchPoints: [{ x: 85, y }] });
  for (const x of [110, 150, 195, 235, 280]) {
    await client.send("Input.dispatchTouchEvent", { type: "touchMove", touchPoints: [{ x, y }] });
  }
  await client.send("Input.dispatchTouchEvent", { type: "touchEnd", touchPoints: [] });
  await expect(page.getByText("2 z 6")).toBeVisible();
});

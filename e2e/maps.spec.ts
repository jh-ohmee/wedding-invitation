import { test, expect } from "@playwright/test"

const BASE_URL = "https://jh-ohmee.github.io/wedding-invitation/"

test.describe("Wedding Invitation - Kakao Maps & SDK Integration", () => {
  test.beforeEach(async ({ page }) => {
    const errors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text())
    })
    page.on("pageerror", (err) => errors.push(err.message))

    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 })
    ;(page as any).__errors = errors
  })

  test("Page loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/.*/)
    const app = page.locator("#root")
    await expect(app).toBeVisible()
  })

  test("Kakao Maps script loads", async ({ page }) => {
    const kakaoMapsScript = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script"))
      return scripts.some((s) => s.src.includes("dapi.kakao.com"))
    })
    expect(kakaoMapsScript).toBe(true)
  })

  test("Kakao Map renders in the Location section", async ({ page }) => {
    const locationSection = page.locator(".location").first()
    await locationSection.scrollIntoViewIfNeeded()

    // Wait for lazy load + SDK async load + map render chain
    const mapElement = page.locator(".location .map-inner")
    await expect(mapElement).toBeVisible({ timeout: 15000 })

    // Poll for map content (SDK loads async after scroll triggers lazy mount)
    await expect(async () => {
      const hasMapContent = await page.evaluate(() => {
        const mapDiv = document.querySelector(".location .map-inner")
        if (!mapDiv) return false
        return mapDiv.children.length > 0
      })
      expect(hasMapContent).toBe(true)
    }).toPass({ timeout: 15000 })
  })

  test("Kakao Map does not show error fallback", async ({ page }) => {
    await page.locator(".location").first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(2000)

    const fallback = page.getByText("Map is not available")
    await expect(fallback).not.toBeVisible()
  })

  test("Kakao SDK script loads and initializes", async ({ page }) => {
    await page.waitForTimeout(3000)

    const kakaoInitialized = await page.evaluate(() => {
      return !!(window as any).Kakao && (window as any).Kakao.isInitialized()
    })
    expect(kakaoInitialized).toBe(true)
  })

  test("Kakao share button exists", async ({ page }) => {
    const shareButton = page.locator(".ktalk-share")
    await expect(shareButton).toBeVisible({ timeout: 10000 })
  })

  test("Navigation buttons exist (카카오맵 + 티맵)", async ({ page }) => {
    const locationSection = page.locator(".location").first()
    await locationSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(2000)

    const kakaoMapIcon = page.locator('img[alt="kakao-map-icon"]')
    await expect(kakaoMapIcon).toBeVisible({ timeout: 10000 })

    const tmapIcon = page.locator('img[alt="t-map-icon"]')
    await expect(tmapIcon).toBeVisible({ timeout: 10000 })
  })

  test("No critical console errors", async ({ page }) => {
    await page.locator(".location").first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(5000)

    const errors = (page as any).__errors as string[]
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("CORS") &&
        !e.includes("net::ERR") &&
        !e.includes("third-party cookie")
    )

    if (criticalErrors.length > 0) {
      console.log("Critical errors found:", criticalErrors)
    }

    expect(criticalErrors.length).toBe(0)
  })
})

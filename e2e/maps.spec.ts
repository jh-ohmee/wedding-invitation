import { test, expect } from "@playwright/test"

const BASE_URL = "https://jh-ohmee.github.io/wedding-invitation/"

test.describe("Wedding Invitation - Maps & SDK Integration", () => {
  test.beforeEach(async ({ page }) => {
    // Collect console errors
    const errors: string[] = []
    page.on("console", (msg) => {
      if (msg.type() === "error") errors.push(msg.text())
    })
    page.on("pageerror", (err) => errors.push(err.message))

    await page.goto(BASE_URL, { waitUntil: "networkidle", timeout: 30000 })
    // Store errors for later assertions
    ;(page as any).__errors = errors
  })

  test("Page loads successfully", async ({ page }) => {
    await expect(page).toHaveTitle(/.*/)
    // Check that the main app container exists
    const app = page.locator("#root")
    await expect(app).toBeVisible()
  })

  test("Naver Map script loads", async ({ page }) => {
    // Check that the Naver Maps API script is injected
    const naverScript = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script"))
      return scripts.some((s) => s.src.includes("oapi.map.naver.com"))
    })
    expect(naverScript).toBe(true)
  })

  test("Naver Map renders in the Location section", async ({ page }) => {
    // Scroll to location section to trigger lazy loading
    const locationSection = page.locator(".location").first()
    await locationSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(3000)

    // Check for Naver map container (canvas or div rendered by Naver SDK)
    const mapElement = page.locator(".location .map-inner")
    await expect(mapElement).toBeVisible({ timeout: 10000 })

    // Verify the map has rendered content (Naver creates canvas/img elements)
    const hasMapContent = await page.evaluate(() => {
      const mapDiv = document.querySelector(".location .map-inner")
      if (!mapDiv) return false
      // Naver Maps renders into the container with child elements
      return mapDiv.children.length > 0
    })
    expect(hasMapContent).toBe(true)
  })

  test("Naver Map does not show error fallback", async ({ page }) => {
    await page.locator(".location").first().scrollIntoViewIfNeeded()
    await page.waitForTimeout(2000)

    // "Map is not available" text should NOT be visible
    const fallback = page.getByText("Map is not available")
    await expect(fallback).not.toBeVisible()
  })

  test("Kakao SDK script loads", async ({ page }) => {
    const kakaoScript = await page.evaluate(() => {
      const scripts = Array.from(document.querySelectorAll("script"))
      return scripts.some((s) => s.src.includes("kakao"))
    })
    expect(kakaoScript).toBe(true)
  })

  test("Kakao SDK initializes successfully", async ({ page }) => {
    // Wait for Kakao SDK to load and initialize
    await page.waitForTimeout(3000)

    const kakaoInitialized = await page.evaluate(() => {
      return !!(window as any).Kakao && (window as any).Kakao.isInitialized()
    })
    expect(kakaoInitialized).toBe(true)
  })

  test("Kakao share button exists and is clickable", async ({ page }) => {
    // Look for the KakaoTalk share button
    const shareButton = page.locator(".ktalk-share")
    await expect(shareButton).toBeVisible({ timeout: 10000 })
  })

  test("Navigation buttons exist (Naver Map + Kakao Navi)", async ({
    page,
  }) => {
    const locationSection = page.locator(".location").first()
    await locationSection.scrollIntoViewIfNeeded()
    await page.waitForTimeout(2000)

    // Check for Naver Map icon/link
    const nmapIcon = page.locator('img[alt="naver-map-icon"]')
    await expect(nmapIcon).toBeVisible({ timeout: 10000 })

    // Check for Kakao Navi icon/link
    const knaviIcon = page.locator('img[alt="kakao-navi-icon"]')
    await expect(knaviIcon).toBeVisible({ timeout: 10000 })
  })

  test("No critical console errors", async ({ page }) => {
    await page.waitForTimeout(3000)
    const errors = (page as any).__errors as string[]

    // Filter out non-critical errors (CORS, favicon, etc.)
    const criticalErrors = errors.filter(
      (e) =>
        !e.includes("favicon") &&
        !e.includes("CORS") &&
        !e.includes("net::ERR") &&
        !e.includes("third-party cookie")
    )

    // Log for debugging
    if (criticalErrors.length > 0) {
      console.log("Critical errors found:", criticalErrors)
    }

    expect(criticalErrors.length).toBe(0)
  })
})

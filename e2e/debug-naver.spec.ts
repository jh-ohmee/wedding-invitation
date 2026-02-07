import { test } from "@playwright/test"

test("Debug Naver Map API responses", async ({ page }) => {
  const responses: string[] = []
  const errors: string[] = []

  page.on("console", (msg) => {
    errors.push(`[${msg.type()}] ${msg.text()}`)
  })

  page.on("response", (resp) => {
    if (resp.url().includes("naver") || resp.url().includes("ncloud")) {
      responses.push(`${resp.status()} ${resp.url().substring(0, 150)}`)
    }
  })

  page.on("pageerror", (err) => errors.push(`[pageerror] ${err.message}`))

  await page.goto("https://jh-ohmee.github.io/wedding-invitation/", {
    waitUntil: "networkidle",
    timeout: 30000,
  })

  // Scroll to location to trigger map load
  await page.evaluate(() => {
    const loc = document.querySelector(".location")
    if (loc) loc.scrollIntoView()
  })
  await page.waitForTimeout(5000)

  console.log("\n=== ALL NAVER RESPONSES ===")
  responses.forEach((r) => console.log(r))
  console.log("\n=== ALL CONSOLE MESSAGES ===")
  errors.forEach((e) => console.log(e))

  // Check what the naver object looks like
  const naverStatus = await page.evaluate(() => {
    const w = window as any
    return {
      hasNaver: !!w.naver,
      hasNaverMaps: !!(w.naver && w.naver.maps),
      scriptSrc: Array.from(document.querySelectorAll("script"))
        .filter((s: any) => s.src.includes("naver"))
        .map((s: any) => s.src),
    }
  })
  console.log("\n=== NAVER SDK STATUS ===")
  console.log(JSON.stringify(naverStatus, null, 2))
})

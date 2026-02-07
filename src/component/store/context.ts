/* eslint-disable @typescript-eslint/no-explicit-any */

import { createContext } from "react"

export const StoreContext = createContext({
  kakaoMaps: null as any,
  setKakaoMaps: (() => {}) as (kakaoMaps: any) => void,
  kakao: null as any,
  setKakao: (() => {}) as (kakao: any) => void,
})

/* eslint-disable @typescript-eslint/no-explicit-any */

import { PropsWithChildren, useState } from "react"
import { StoreContext } from "./context"

export const StoreProvider = ({ children }: PropsWithChildren) => {
  const [kakaoMaps, setKakaoMaps] = useState<any>(null)
  const [kakao, setKakao] = useState<any>(null)

  return (
    <StoreContext.Provider value={{ kakaoMaps, setKakaoMaps, kakao, setKakao }}>
      {children}
    </StoreContext.Provider>
  )
}

import {
  GROOM_FULLNAME,
  BRIDE_FULLNAME,
} from "../../const"
import { LazyDiv } from "../lazyDiv"

export const Invitation = () => {
  return (
    <LazyDiv className="card invitation">
      <h2 className="english">Invitation</h2>

      <div className="break" />

      <div className="content">봄날의 따스한 햇살 아래</div>
      <div className="content">소중한 분들을 모시고</div>
      <div className="content">사랑의 약속을 하려고 합니다.</div>
      <div className="break" />
      <div className="content">함께 걸어갈 날들이</div>
      <div className="content">꽃처럼 아름답도록</div>
      <div className="content">서로의 봄이 되겠습니다.</div>
      <div className="break" />
      <div className="content">기쁜날 함께 하시어</div>
      <div className="content">저희의 앞날을 축복해 주세요.</div>

      <div className="break" />

      <div className="couple-names">
        {GROOM_FULLNAME} <span className="ampersand">&</span> {BRIDE_FULLNAME}
      </div>
    </LazyDiv>
  )
}

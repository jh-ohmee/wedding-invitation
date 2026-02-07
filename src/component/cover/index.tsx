import {
  BRIDE_FULLNAME,
  GROOM_FULLNAME,
  LOCATION,
  WEDDING_DATE,
  WEDDING_DATE_FORMAT,
} from "../../const"
import { COVER_IMAGE } from "../../images"
import { LazyDiv } from "../lazyDiv"

export const Cover = () => {
  return (
    <LazyDiv className="card cover">
      <div className="cover-top">
        <div className="ornament-line" />
        <div className="wedding-label">Wedding Invitation</div>
        <div className="ornament-line" />
      </div>
      <div className="image-wrapper">
        <img src={COVER_IMAGE} alt="wedding" />
      </div>
      <div className="couple-names">
        {GROOM_FULLNAME} <span className="ampersand">&amp;</span> {BRIDE_FULLNAME}
      </div>
      <div className="wedding-info">
        <div className="info">{WEDDING_DATE.format(WEDDING_DATE_FORMAT)}</div>
        <div className="info">{LOCATION}</div>
      </div>
    </LazyDiv>
  )
}

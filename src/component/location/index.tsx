import { Map } from "./map"
import CarIcon from "../../icons/car-icon.svg?react"
import BusIcon from "../../icons/bus-icon.svg?react"
import { LazyDiv } from "../lazyDiv"
import { LOCATION, LOCATION_ADDRESS, VENUE_CONFIRMED } from "../../const"

export const Location = () => {
  return (
    <>
      <LazyDiv className="card location">
        <h2 className="english">Location</h2>
        <div className="addr">
          {LOCATION}
          <div className="detail">{LOCATION_ADDRESS}</div>
        </div>
        <Map />
      </LazyDiv>
      {VENUE_CONFIRMED ? (
        <LazyDiv className="card location">
          <div className="location-info">
            <div className="transportation-icon-wrapper">
              <BusIcon className="transportation-icon" />
            </div>
            <div className="heading">대중교통</div>
            <div />
            <div className="content">추후 안내 예정</div>
          </div>
          <div className="location-info">
            <div className="transportation-icon-wrapper">
              <CarIcon className="transportation-icon" />
            </div>
            <div className="heading">자가용</div>
            <div />
            <div className="content">추후 안내 예정</div>
          </div>
        </LazyDiv>
      ) : (
        <LazyDiv className="card location">
          <div className="venue-pending">
            장소가 확정되면 교통편을 안내드리겠습니다.
          </div>
        </LazyDiv>
      )}
    </>
  )
}

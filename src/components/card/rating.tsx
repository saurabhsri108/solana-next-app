import { Fragment } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faStar } from "@fortawesome/free-solid-svg-icons";
import {
  faStar as faRegularStar,
  faStarHalfAlt as faStarHalf,
} from "@fortawesome/free-regular-svg-icons";

export const Rating = ({ rating }: { rating: number }) => {
  return (
    <Fragment>
      {rating >= 1 ? (
        <FontAwesomeIcon icon={faStar} className="text-amber-500" />
      ) : rating >= 0.5 ? (
        <FontAwesomeIcon icon={faStarHalf} className="text-amber-500" />
      ) : (
        <FontAwesomeIcon icon={faRegularStar} className="text-amber-500" />
      )}
      {rating >= 2 ? (
        <FontAwesomeIcon icon={faStar} className="text-amber-500" />
      ) : rating >= 1.5 ? (
        <FontAwesomeIcon icon={faStarHalf} className="text-amber-500" />
      ) : (
        <FontAwesomeIcon icon={faRegularStar} className="text-amber-500" />
      )}
      {rating >= 3 ? (
        <FontAwesomeIcon icon={faStar} className="text-amber-500" />
      ) : rating >= 2.5 ? (
        <FontAwesomeIcon icon={faStarHalf} className="text-amber-500" />
      ) : (
        <FontAwesomeIcon icon={faRegularStar} className="text-amber-500" />
      )}
      {rating >= 4 ? (
        <FontAwesomeIcon icon={faStar} className="text-amber-500" />
      ) : rating >= 3.5 ? (
        <FontAwesomeIcon icon={faStarHalf} className="text-amber-500" />
      ) : (
        <FontAwesomeIcon icon={faRegularStar} className="text-amber-500" />
      )}
      {rating >= 5 ? (
        <FontAwesomeIcon icon={faStar} className="text-amber-500" />
      ) : rating >= 4.5 ? (
        <FontAwesomeIcon icon={faStarHalf} className="text-amber-500" />
      ) : (
        <FontAwesomeIcon icon={faRegularStar} className="text-amber-500" />
      )}
    </Fragment>
  );
};

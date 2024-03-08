// StarRating.tsx
import React from "react";
import { Star, StarBorder, StarHalf } from "@material-ui/icons";
import { makeStyles } from "@material-ui/core/styles";

const useStyles = makeStyles({
  star: {
    color: "#FFD700", // Golden color
  },
  hollowStar: {
    color: "grey",
  },
});

interface StarRatingProps {
  rating: number;
}

const StarRating: React.FC<StarRatingProps> = ({ rating }) => {
  const classes = useStyles();

  const fullStars = Math.floor(rating);
  const hasHalfStar = rating % 1 !== 0;

  return (
    <>
      {[...Array(fullStars)].map((_, index) => (
        <Star key={index} className={classes.star} />
      ))}
      {hasHalfStar && <StarHalf className={classes.star} />}
      {[...Array(5 - fullStars - (hasHalfStar ? 1 : 0))].map((_, index) => (
        <StarBorder key={index} className={classes.hollowStar} />
      ))}
    </>
  );
};

export default StarRating;

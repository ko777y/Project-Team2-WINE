import React from "react";
import { useRouter } from "next/router";
import styles from "./WineCard.module.css";
import { FaStar, FaArrowRight } from "react-icons/fa";

interface WineCardProps {
  id: number;
  name: string;
  avgRating: number;
  image: string;
  region: string;
  price: number;
  reviewCount: number;
  recentReview?: { content: string } | null;
}

const WineCard: React.FC<WineCardProps> = ({
  id,
  name,
  avgRating = 0,
  image,
  region,
  price,
  reviewCount,
  recentReview,
}) => {
  const router = useRouter();

  const handleCardClick = () => {
    router.push(`/wines/${id}`);
  };

  return (
    <div className={styles.wine_card} onClick={handleCardClick}>
      <div className={styles.card_top}>
        <img
          src={image || "https://via.placeholder.com/150"}
          alt={name}
          className={styles.wine_image}
          style={{
            width: "150px",
            height: "200px",
            objectFit: "cover",
            borderRadius: "8px",
          }}
        />

        <div className={styles.info_section}>
          <h2 className={styles.name}>{name}</h2>
          <p className={styles.region}>{region}</p>
          <div className={styles.price}>₩ {price.toLocaleString()}</div>
        </div>

        <div className={styles.rating_section}>
          <div className={styles.rating}>{avgRating.toFixed(1)}</div>
          <div className={styles.stars}>
            {Array.from({ length: 5 }, (_, i) => (
              <FaStar
                key={i}
                className={
                  i < Math.floor(avgRating)
                    ? styles.star_filled
                    : styles.star_empty
                }
              />
            ))}
          </div>
          <p className={styles.reviews}>{reviewCount}개의 후기</p>
          <FaArrowRight className={styles.arrow_icon} />
        </div>
      </div>

      <div className={styles.latest_review_section}>
        <h3>최신 후기</h3>
        <p>{recentReview ? recentReview.content : "후기가 없습니다."}</p>
      </div>
    </div>
  );
};

export default WineCard;

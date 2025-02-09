import React from "react";
import Head from "next/head";
import Link from "next/link";
import PrimaryButton from "@/components/PrimaryButton";
import Header from "@/components/Header";
import styles from "./Landing.module.css";
import Image from "next/image";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";

export default function Home() {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 2,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,  
    arrows: false,
  };

  return (
    <>
      <Head>
        <title>WHYNE</title>
      </Head>
      <Header />
      <div className={styles.image_wrapper}>
        <Image
          src="/assets/images/landing_main.png"
          width={1140}
          height={535}
          alt="Landing Main Image"
          priority
        />
      </div>
      <div className={styles.textboxes_container}>
        {/* 첫 번째 텍스트 박스 */}
        <div className={`${styles.textbox} ${styles.textbox_large}`}>
          <div className={styles.recommendation_text}>
            <p className={styles.main_text}>매달 새로운 와인 추천</p>
            <p className={styles.sub_text}>매달 다양한 와인을 만나보세요</p>
          </div>
          <div className={styles.monthly_recommendation}>
            <h2 className={styles.monthly_title}>이번달 추천 와인</h2>
            {/* 슬라이더 시작 */}
            <Slider {...settings} className={styles.wine_slider}>
              {/* 첫 번째 흰색 박스 */}
              <div className={styles.wine_slide}>
                <div className={styles.wine_box}>
                  <Image
                    src="/assets/images/wine-bottle1.png"
                    alt="4.8 와인"
                    width={38}
                    height={136}
                    className={styles.wine_image}
                  />
                  <div className={styles.wine_info}>
                    <span className={styles.wine_rating}>4.8</span>
                    <Image
                      src="/assets/images/star-score.png"
                      alt="별점"
                      width={60}
                      height={12}
                      className={styles.star_rating}
                    />
                    <span className={styles.wine_name}>Sentinel Cabernet Sauvignon 2016</span>
                  </div>
                </div>
              </div>

              {/* 두 번째 흰색 박스 */}
              <div className={styles.wine_slide}>
                <div className={styles.wine_box}>
                  <Image
                    src="/assets/images/wine-bottle2.png"
                    alt="4.3 와인"
                    width={38}
                    height={136}
                    className={styles.wine_image}
                  />
                  <div className={styles.wine_info}>
                    <span className={styles.wine_rating}>4.3</span>
                    <Image
                      src="/assets/images/star-score.png"
                      alt="별점"
                      width={60}
                      height={12}
                      className={styles.star_rating}
                    />
                    <span className={styles.wine_name}>Another Wine 2018</span>
                  </div>
                </div>
              </div>
            </Slider>
            {/* 슬라이더 끝 */}
          </div>
        </div>

        {/* 두 번째 텍스트 박스 */}
        <div className={styles.centered_textboxes}>
          <div className={styles.textbox}>
            <div className={styles.custom_wine_text}>
              <p>다양한 필터로 찾는</p>
              <p>내 맞춤 와인</p>
              <p className={styles.sub_text}>와인타입, 가격, 평점으로 나에게 맞는 와인을 쉽게 검색하세요</p>
            </div>
            <div className={styles.inner_textbox_second}>
              <Image
                src="/assets/images/wine-bottle-large.png"
                alt="Large Wine Bottle"
                width={69.78}
                height={232.16}
                className={styles.large_wine_bottle}
                priority
              />
              <div className={styles.wine_info_combined} style={{ position: 'absolute', top: '30.09px', left: '126px' }}>
              <div className={styles.wine_name_large}>
  <span>Sentinel Cabernet</span>
  <br />
  <span>Sauvignon 2016</span>
</div>

                <p className={styles.wine_region}>Western Cape, South Africa</p>
                <p className={styles.wine_price}>₩64,990</p>
                <div className={styles.wine_rating_large}>4.8</div>
              </div>
              <div className={styles.wine_bottle_bottom_line}></div>
            </div>
          </div>

          {/* 세 번째 텍스트 박스 */}
          <div className={styles.textbox}>
            <div className={styles.review_system_text}>
              <p>직관적인</p>
              <p>리뷰 시스템</p>
              <p className={styles.sub_text}>더 구체화된 리뷰 시스템으로 쉽고 빠르게 와인 리뷰를 살펴보세요</p>
            </div>
            <div className={styles.inner_textbox_third}>
              <div className={styles.transparent_shape}></div>
            </div>
          </div>
        </div>
      </div>

      {/* 하단 버튼 */}
      <div className={styles.button_wrapper}>
        <Link href="/wines">
          <PrimaryButton className={styles.wine_button}>와인 보러가기</PrimaryButton>
        </Link>
      </div>
    </>
  );
}

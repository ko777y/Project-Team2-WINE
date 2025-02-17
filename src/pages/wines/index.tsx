import React, { useState, useEffect } from "react";
import axios from "@/libs/axios";
import WineFilter from "./indexcomponents/WineFilter";
import WineSearchBar from "./indexcomponents/WineSearchBar";
import MonthlyWineCarousel from "./indexcomponents/MonthlyWineCarousel";
import WineRegisterModal from "./indexcomponents/WineRegisterModal";
import WineCard from "./indexcomponents/WineCard";
import WineFilterToggleButton from "./indexcomponents/WineFilterToggleButton";
import styles from "./indexcomponents/WinePage.module.css";
import Header from "@/components/Header";
import { WineData } from "./indexcomponents/WineRegisterModal";
import Head from "next/head";

/* ✅ Wine 타입 정의 */
interface Wine {
  id: number;
  name: string;
  region: string;
  image: string;
  price: number;
  type: string;
  avgRating: number;
  reviewCount: number;
  recentReview?: {
    id: number;
    content: string;
    createdAt: string;
    updatedAt: string;
  } | null;
  userId: number;
}

interface FilterOptions {
  type: string;
  minPrice: number;
  maxPrice: number;
  ratings: string[];
}

const VALID_TYPES = ["RED", "WHITE", "SPARKLING"];

const WinePage: React.FC = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [wineList, setWineList] = useState<Wine[]>([]);
  const [nextCursor, setNextCursor] = useState<number | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [filters, setFilters] = useState<FilterOptions>({
    type: "",
    minPrice: 0,
    maxPrice: 5000000,
    ratings: [],
  });

  // 반응형 필터
  const [isFilterOpen, setIsFilterOpen] = useState<boolean>(false);
  const [windowWidth, setWindowWidth] = useState<number | null>(null);

  /* 브라우저 환경에서만 window 사용 */
  useEffect(() => {
    if (typeof window !== "undefined") {
      setWindowWidth(window.innerWidth);
      setIsFilterOpen(window.innerWidth >= 769);

      const handleResize = () => {
        setWindowWidth(window.innerWidth);
        setIsFilterOpen(window.innerWidth >= 769);
      };

      window.addEventListener("resize", handleResize);
      return () => window.removeEventListener("resize", handleResize);
    }
  }, []);

  const toggleFilter = () => {
    setIsFilterOpen((prev) => !prev);
  };

  // append=true → "더보기" 기능: 목록을 누적
  // append=false(기본값) → 검색/필터 변경 시 새 목록으로 덮어씀
  const fetchWines = async (append = false) => {
    if (isLoading) return;
    setIsLoading(true);

    try {
      const params = new URLSearchParams();
      params.append("limit", "10");

      if (nextCursor !== null && append) {
        params.append("cursor", String(nextCursor));
      } else {
        setNextCursor(null);
      }

      // 검색어
      if (searchQuery.trim()) {
        params.append("search", searchQuery);
      }

      // 유효한 타입만 전송
      const upperType = filters.type.toUpperCase();
      if (VALID_TYPES.includes(upperType)) {
        params.append("type", upperType);
      }

      // minPrice / maxPrice
      if (filters.minPrice > 0) {
        params.append("minPrice", String(filters.minPrice));
      }
      if (filters.maxPrice < 5000000) {
        params.append("maxPrice", String(filters.maxPrice));
      }

      // ratings
      if (filters.ratings.length > 0) {
        filters.ratings.forEach((rating) => {
          // 서버가 기대하는 형식대로 전송 (가령 ratings[])
          params.append("ratings[]", rating);
        });
      }

      const url = `wines?${params.toString()}`;
      console.log("🛠 API 요청 URL:", url);

      // 요청
      const response = await axios.get(url);
      const newWines: Wine[] = response.data.list || [];

      if (append) {
        // "더보기" → 기존 목록 + 새 목록
        setWineList((prev) => [...prev, ...newWines]);
      } else {
        // 새 검색/필터 → 새 목록으로 덮어씀
        setWineList(newWines);
      }

      // 다음 cursor 업데이트
      setNextCursor(response.data.nextCursor);
    } catch (error) {
      console.error("❌ 와인 데이터를 불러오는 중 오류 발생:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /* 검색어 & 필터 변경 시 API 호출 (초기 로드/필터 변경 시 append=false) */
  useEffect(() => {
    fetchWines(false); // 새로운 조건이니까 누적X
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [searchQuery, filters]);

  /* (11) 필터 적용 함수 */
  const handleApplyFilters = (newFilters: FilterOptions | null) => {
    if (!newFilters) {
      setFilters({
        type: "",
        minPrice: 0,
        maxPrice: 5000000,
        ratings: [],
      });
    } else {
      setFilters(newFilters);
    }
  };

  return (
    <>
      <Head>
        <title>WHYNE - 와인 목록</title>
      </Head>
      <div>
        {windowWidth !== null && windowWidth < 769 && (
          <WineFilterToggleButton onClick={toggleFilter} />
        )}
        <div className={styles.page_container}>
          <Header />
          <div className={styles.carousel_container}>
            <MonthlyWineCarousel />
          </div>

          <main className={styles.main_content}>
            <div className={styles.content_wrapper}>
              {/* 필터 사이드바 */}
              <aside
                className={`${styles.filter_section} ${
                  isFilterOpen ? styles.active : ""
                }`}
              >
                <WineFilter
                  onApplyFilters={handleApplyFilters}
                  isFilterOpen={isFilterOpen}
                >
                  <button
                    className={styles.register_button}
                    onClick={() => setIsModalOpen(true)}
                  >
                    와인 등록하기
                  </button>
                </WineFilter>
              </aside>

              {/* 메인 콘텐츠 영역 */}
              <section className={styles.content_section}>
                <div className={styles.search_bar_container}>
                  <WineSearchBar onSearch={(query) => setSearchQuery(query)} />
                </div>

                <div className={styles.wine_list_container}>
                  {wineList.length > 0 ? (
                    wineList.map((wine) => <WineCard key={wine.id} {...wine} />)
                  ) : (
                    <p>검색 결과가 없습니다.</p>
                  )}
                </div>

                {nextCursor && (
                  // ✅ "더보기" 버튼 → append=true
                  <button
                    className={styles.load_more_button}
                    onClick={() => fetchWines(true)}
                    disabled={isLoading}
                  >
                    {isLoading ? "로딩 중..." : "더보기"}
                  </button>
                )}
              </section>
            </div>
          </main>
        </div>

        {/* 모달 렌더링 */}
        {isModalOpen && (
          <WineRegisterModal
            onClose={() => setIsModalOpen(false)}
            onSubmit={(wineData: WineData) => {
              console.log("등록된 와인:", wineData);
              const newWine: Wine = {
                id: Date.now(),
                name: wineData.name,
                region: wineData.region,
                image: wineData.image,
                price: wineData.price,
                type: wineData.type,
                avgRating: 0,
                reviewCount: 0,
                userId: 1,
                recentReview: null,
              };
              // 등록된 와인 목록에 추가
              setWineList((prev) => [...prev, newWine]);
              setIsModalOpen(false);
            }}
          />
        )}
      </div>
    </>
  );
};

export default WinePage;

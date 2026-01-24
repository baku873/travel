import clientPromise from "@/lib/mongo";
import { NextResponse } from "next/server";

// Prevents caching so you can run this multiple times to reset DB
export const dynamic = "force-dynamic"; 

/* ────────────────────── 1. TRIPS DATA (TRILINGUAL & MULTI-CURRENCY) ────────────────────── */
const tripsData = [
  // ─── EXISTING TRIPS ───
  {
    type: "standard", 
    region: "europe",
    title: { mn: "Швейцарийн Glacier Express", en: "Swiss Glacier Express", ko: "스위스 빙하 특급" },
    category: "nature",
    location: { mn: "Швейцарь (Альпийн нуруу)", en: "Switzerland (The Alps)", ko: "스위스 (알프스)" },
    duration: { mn: "1 Өдөр", en: "1 Day", ko: "1일" },
    rating: 5.0,
    price: { mn: 950000, en: 280, ko: 380000 }, 
    image: "/glacier.png", 
    description: {
      mn: "Дэлхийн хамгийн удаан 'түргэн галт тэрэг'-ээр 8 цагийн турш Альпийн уулсын зүрхээр аялцгаая!",
      en: "Travel through the heart of the Alps for 8 hours on the world's slowest 'express train'!",
      ko: "세계에서 가장 느린 '특급 열차'를 타고 알프스의 심장부를 8시간 동안 여행해보세요!"
    },
    tags: ["train", "nature", "alps"],
    featured: false,
    itinerary: [
      { day: 1, title: { mn: "Цюрих хотод буух", en: "Arrival in Zurich", ko: "취리히 도착" }, desc: { mn: "Онгоцны буудлаас тосч авах.", en: "Airport pickup.", ko: "공항 픽업." } }
    ]
  },
  {
    type: "standard",
    region: "europe",
    title: { mn: "Европын Топ 6 Улс", en: "Europe Top 6 Countries", ko: "유럽 6개국 투어" },
    category: "city",
    location: { mn: "Герман - Франц - Итали", en: "Germany - France - Italy", ko: "독일 - 프랑스 - 이탈리아" },
    duration: { mn: "7 Өдөр", en: "7 Days", ko: "7일" },
    rating: 4.8,
    reviews: 10,
    price: { mn: 8900000, en: 2600, ko: 3500000 },
    oldPrice: { mn: 9500000, en: 2800, ko: 3800000 },
    image: "/europe.png", 
    description: {
      mn: "Франкфурт, Женев, Милан, Парис хотуудаар аялах гайхалтай боломж.",
      en: "An amazing opportunity to travel through Frankfurt, Geneva, Milan, and Paris.",
      ko: "프랑크푸르트, 제네바, 밀라노, 파리를 여행하는 놀라운 기회."
    },
    tags: ["christmas", "europe"],
    saleMonth: 11, 
    featured: true,
    seatsLeft: 5,
    itinerary: [
      { day: 1, title: { mn: "Франкфурт", en: "Frankfurt", ko: "프랑크푸르트" }, desc: { mn: "...", en: "...", ko: "..." } }
    ]
  },

  // ─── NEW: STANDARD PACKAGES ───
  {
    type: "standard",
    region: "mongolia",
    title: { mn: "Хөвсгөл Далайн Аялал", en: "Khuvsgul Lake Tour", ko: "홉스굴 호수 투어" },
    category: "nature",
    location: { mn: "Хөвсгөл, Монгол", en: "Khuvsgul, Mongolia", ko: "몽골 홉스굴" },
    duration: { mn: "4 Өдөр", en: "4 Days", ko: "4일" },
    rating: 4.9,
    reviews: 120,
    price: { mn: 450000, en: 135, ko: 180000 },
    oldPrice: { mn: 550000, en: 165, ko: 220000 },
    image: "/lake.jpg",
    tags: ["Best Seller", "Discount"],
    featured: true,
    description: {
      mn: "Монголын хөх сувд Хөвсгөл далайгаар аялах мартагдашгүй аялал.",
      en: "Unforgettable trip to Lake Khuvsgul, the Blue Pearl of Mongolia.",
      ko: "몽골의 푸른 진주, 홉스굴 호수로 떠나는 잊지 못할 여행."
    },
    itinerary: [{ day: 1, title: { mn: "Мөрөн хот", en: "Murun City", ko: "무릉 시" }, desc: { mn: "...", en: "...", ko: "..." } }]
  },
  {
    type: "standard",
    region: "europe",
    title: { mn: "Парис & Европын Тур", en: "Paris & Europe Tour", ko: "파리 & 유럽 투어" },
    category: "city",
    location: { mn: "Парис, Франц", en: "Paris, France", ko: "프랑스 파리" },
    duration: { mn: "7 Өдөр", en: "7 Days", ko: "7일" },
    rating: 5.0,
    reviews: 85,
    price: { mn: 4500000, en: 1350, ko: 1800000 },
    image: "/paris.jpg",
    tags: ["Luxury"],
    featured: false,
    description: {
      mn: "Хайрын хот Парисаар аялж, Эйфелийн цамхагийг үзэх аялал.",
      en: "Tour the city of love, Paris, and visit the Eiffel Tower.",
      ko: "사랑의 도시 파리를 여행하고 에펠탑을 방문하세요."
    },
    itinerary: [{ day: 1, title: { mn: "Парис", en: "Paris", ko: "파리" }, desc: { mn: "...", en: "...", ko: "..." } }]
  },

  // ─── NEW: FAMILY PACKAGES ───
  {
    type: "family",
    region: "asia",
    title: { mn: "Токио Диснейленд Аялал", en: "Tokyo Disneyland Trip", ko: "도쿄 디즈니랜드 여행" },
    category: "theme_park",
    location: { mn: "Токио, Япон", en: "Tokyo, Japan", ko: "일본 도쿄" },
    duration: { mn: "5 Өдөр", en: "5 Days", ko: "5일" },
    rating: 4.9,
    price: { mn: 3800000, en: 1150, ko: 1500000 },
    image: "/tokyo.jpg",
    ageGroup: { mn: "3+ нас", en: "Ages 3+", ko: "3세 이상" },
    perks: ["Disney Ticket", "Breakfast"],
    featured: true,
    description: {
      mn: "Хүүхэд багачуудын мөрөөдлийн ертөнц Диснейлэнд.",
      en: "Disneyland, the dream world for children.",
      ko: "아이들의 꿈의 세상, 디즈니랜드."
    },
    itinerary: [{ day: 1, title: { mn: "Токио", en: "Tokyo", ko: "도쿄" }, desc: { mn: "...", en: "...", ko: "..." } }]
  },
  {
    type: "family",
    region: "europe",
    title: { mn: "Анталья - All Inclusive", en: "Antalya - All Inclusive", ko: "안탈리아 - 올 인클루시브" },
    category: "resort",
    location: { mn: "Анталья, Турк", en: "Antalya, Turkey", ko: "터키 안탈리아" },
    duration: { mn: "8 Өдөр", en: "8 Days", ko: "8일" },
    rating: 4.8,
    price: { mn: 4200000, en: 1250, ko: 1700000 },
    image: "/turkey.jpg",
    ageGroup: { mn: "Бүх нас", en: "All Ages", ko: "전연령" },
    perks: ["Kids Free", "Aqua Park"],
    featured: false,
    description: {
      mn: "Газар дундын тэнгисийн эрэг дээрх тансаг амралт.",
      en: "Luxury vacation on the Mediterranean coast.",
      ko: "지중해 해안에서의 럭셔리 휴가."
    },
    itinerary: [{ day: 1, title: { mn: "Анталья", en: "Antalya", ko: "안탈리아" }, desc: { mn: "...", en: "...", ko: "..." } }]
  },

  // ─── NEW: HONEYMOON PACKAGES ───
  {
    type: "honeymoon",
    region: "asia",
    title: { mn: "Мальдив - Усан Вилла", en: "Maldives - Water Villa", ko: "몰디브 - 워터 빌라" },
    category: "island",
    location: { mn: "Мале, Мальдив", en: "Male, Maldives", ko: "몰디브 말레" },
    duration: { mn: "6 Өдөр", en: "6 Days", ko: "6일" },
    rating: 5.0,
    price: { mn: 8500000, en: 2500, ko: 3400000 },
    image: "/maldives.jpg",
    romanceFactor: "10/10",
    perks: ["Private Pool", "Candlelight Dinner"],
    tags: ["Adults Only"],
    description: {
      mn: "Энэтхэгийн далай дахь диваажин.",
      en: "Paradise in the Indian Ocean.",
      ko: "인도양의 낙원."
    },
    itinerary: [{ day: 1, title: { mn: "Мале", en: "Male", ko: "말레" }, desc: { mn: "...", en: "...", ko: "..." } }]
  },
  {
    type: "honeymoon",
    region: "europe",
    title: { mn: "Санторини - Нар Жаргах Мөч", en: "Santorini - Sunset Moment", ko: "산토리니 - 일몰의 순간" },
    category: "island",
    location: { mn: "Санторини, Грек", en: "Santorini, Greece", ko: "그리스 산토리니" },
    duration: { mn: "7 Өдөр", en: "7 Days", ko: "7일" },
    rating: 4.9,
    price: { mn: 6200000, en: 1850, ko: 2500000 },
    image: "/santorini.jpg",
    romanceFactor: "9.8/10",
    perks: ["Wine Tasting", "Photoshoot"],
    tags: ["Best View"],
    description: {
      mn: "Цагаан байшин, цэнхэр дээвэр, гайхалтай нар жаргалт.",
      en: "White houses, blue roofs, and amazing sunsets.",
      ko: "하얀 집, 파란 지붕, 그리고 놀라운 일몰."
    },
    itinerary: [{ day: 1, title: { mn: "Санторини", en: "Santorini", ko: "산토리니" }, desc: { mn: "...", en: "...", ko: "..." } }]
  },

  // ─── NEW: SOLO PACKAGES ───
  {
    type: "solo",
    region: "asia",
    title: { mn: "Тайланд - Backpacking Tour", en: "Thailand - Backpacking Tour", ko: "태국 - 배낭여행" },
    category: "party",
    location: { mn: "Бангкок & Ко-Панган", en: "Bangkok & Koh Phangan", ko: "방콕 & 코팡안" },
    duration: { mn: "10 Өдөр", en: "10 Days", ko: "10일" },
    rating: 4.8,
    price: { mn: 2800000, en: 850, ko: 1150000 },
    image: "/thailand-solo.jpg",
    vibe: "High Energy",
    tags: ["Hostel Life", "Full Moon Party"],
    socialScore: 95,
    description: {
      mn: "Залуусын эрч хүч, үдэшлэг, шинэ танилууд.",
      en: "Youth energy, parties, and new friends.",
      ko: "젊음의 에너지, 파티, 그리고 새로운 만남."
    },
    itinerary: [{ day: 1, title: { mn: "Бангкок", en: "Bangkok", ko: "방콕" }, desc: { mn: "...", en: "...", ko: "..." } }]
  },
  {
    type: "solo",
    region: "asia",
    title: { mn: "Вьетнам - Мото Аялал", en: "Vietnam - Moto Tour", ko: "베트남 - 모터사이클 투어" },
    category: "adventure",
    location: { mn: "Ха-Жанг, Вьетнам", en: "Ha Giang, Vietnam", ko: "베트남 하장" },
    duration: { mn: "7 Өдөр", en: "7 Days", ko: "7일" },
    rating: 4.9,
    price: { mn: 3100000, en: 950, ko: 1250000 },
    image: "/vietnam.jpg",
    vibe: "Adrenaline",
    tags: ["Moto", "Mountains"],
    socialScore: 80,
    description: {
      mn: "Уулын замаар мотоциклтой аялах жинхэнэ адал явдал.",
      en: "Real adventure motorcycling through mountain roads.",
      ko: "산길을 달리는 진정한 모터사이클 모험."
    },
    itinerary: [{ day: 1, title: { mn: "Ханой", en: "Hanoi", ko: "하노이" }, desc: { mn: "...", en: "...", ko: "..." } }]
  },
  // ─── NEW: WINTER SPECIAL ───
  {
    type: "standard",
    region: "mongolia",
    title: { mn: "Мөнгөн Өвөл - Хөвсгөл", en: "Silver Winter - Khuvsgul", ko: "은빛 겨울 - 홉스굴" },
    category: "nature",
    location: { mn: "Хөвсгөл нуур, Монгол", en: "Lake Khuvsgul, Mongolia", ko: "몽골 홉스굴 호수" },
    duration: { mn: "3 Өдөр", en: "3 Days", ko: "3일" },
    rating: 5.0,
    reviews: 45,
    price: { mn: 1000000, en: 280, ko: 380000 }, // Legacy field
    priceAdult: { mn: 1000000, en: 280, ko: 380000 },
    priceChild: { mn: 800000, en: 220, ko: 300000 },
    salePrice: { mn: 800000, en: 224, ko: 304000 }, // 20% OFF
    discountPercentage: 20,
    image: "/glacier.png", // Reusing existing image asset
    tags: ["Winter", "Frozen Lake", "Adventure"],
    featured: true,
    description: {
      mn: "Хөвсгөл нуурын цэнгэг агаар, мөсөн бүрхүүл дээгүүрх гайхамшигт аялал. Өвлийн байгалийн дахин давтагдашгүй үзэсгэлэнг өөрийн биеэр мэдрээрэй.",
      en: "A wonderful journey across the fresh air and ice cover of Lake Khuvsgul. Experience the unique beauty of winter nature.",
      ko: "홉스굴 호수의 신선한 공기와 얼음 덮인 풍경을 가로지르는 멋진 여행. 겨울 자연의 독특한 아름다움을 경험해 보세요."
    },
    highlights: [
      { mn: "Мөсөн дээгүүрх нохойтой чарганы аялал", en: "Dog sledding on ice", ko: "얼음 위 개썰매 여행" },
      { mn: "Хүслийн хаданд зочлох", en: "Visit to the Wish Rock", ko: "소원의 바위 방문" },
      { mn: "Мөсөн дээрх гар бөмбөгийн тэмцээн", en: "Ice volleyball match", ko: "얼음 위 배구 경기" }
    ],
    includedServices: [
      { mn: "Юрт бааз / Зочид буудлын байрлал", en: "Ger camp / Hotel accommodation", ko: "게르 캠프 / 호텔 숙박" },
      { mn: "Өдрийн 3 хоол (Тусгай цэс)", en: "3 meals per day (Special menu)", ko: "1일 3식 (특식)" },
      { mn: "Тохилог тээврийн хэрэгсэл", en: "Comfortable transportation", ko: "편안한 교통수단" },
      { mn: "Мэргэжлийн хөтөч", en: "Professional guide", ko: "전문 가이드" }
    ],
    excludedServices: [
      { mn: "Хувийн хэрэглээний зардал", en: "Personal expenses", ko: "개인 비용" },
      { mn: "Нэмэлт уух зүйлс", en: "Extra drinks", ko: "추가 음료" },
      { mn: "Гэнэтийн ослын даатгал", en: "Travel insurance", ko: "여행자 보험" }
    ],
    availableDates: [
      { date: "2026.02.15", status: "open", isFull: false },
      { date: "2026.03.08", status: "open", isFull: false },
      { date: "2026.03.15", status: "open", isFull: false }
    ],
    allowCustomDate: true,
    itinerary: [
      { 
        day: 1, 
        title: { mn: "Улаанбаатар - Хөвсгөл", en: "Ulaanbaatar - Khuvsgul", ko: "울란바토르 - 홉스굴" }, 
        desc: { 
          mn: "Улаанбаатар хотоос аялал эхэлж, Хөвсгөл нуурын эрэгт байрлах тохилог бааздаа ирж тухлах. Орой нь орон нутгийн онцлогтой зоог барина.", 
          en: "Start the journey from UB, settle in a cozy camp on the shores of Lake Khuvsgul. Local dinner in the evening.",
          ko: "울란바토르에서 출발하여 홉스굴 호숫가의 아늑한 캠프에 정착합니다. 저녁에는 지역 특식을 즐깁니다."
        } 
      },
      { 
        day: 2, 
        title: { mn: "Мөсөн дээгүүрх адал явдал", en: "Adventure on Ice", ko: "얼음 위의 모험" }, 
        desc: { 
          mn: "Мөсөн дээгүүрх аялал. Нохойтой чаргаар гулгах, мөсөн дээрх гар бөмбөгийн тэмцээнд оролцож, Хүслийн хаданд зочлон хүслээ даатгах.",
          en: "Ice trip. Dog sledding, participating in an ice volleyball match, and visiting the Wish Rock.",
          ko: "얼음 여행. 개썰매 타기, 얼음 배구 경기 참여, 소원의 바위 방문."
        } 
      },
      { 
        day: 3, 
        title: { mn: "Дурсгал худалдан авах & Буцах", en: "Souvenirs & Return", ko: "기념품 및 귀환" }, 
        desc: { 
          mn: "Орон нутгийн гар урлалын дэлгүүрээр зочлох. Хөвсгөлийн бэлэг дурсгал худалдан авч, аяллын хаалтын зоог барин Улаанбаатар хот руу буцах.",
          en: "Visit local handicraft shops. Buy souvenirs, have a farewell lunch, and return to UB.",
          ko: "지역 공예품점 방문. 기념품 구매, 환송 오찬 후 울란바토르로 귀환."
        } 
      }
    ]
  }
];

/* ────────────────────── 2. BLOG DATA (TRILINGUAL) ────────────────────── */
const blogData = [
  {
    title: { mn: "2025 онд заавал очих 10 газар", en: "10 Must-Visit Places in 2025", ko: "2025년 꼭 가봐야 할 10곳" },
    excerpt: { mn: "Дэлхий даяарх аялал...", en: "Global tourism trends...", ko: "세계 여행 트렌드..." },
    content: { mn: "<p>...</p>", en: "<p>...</p>", ko: "<p>...</p>" },
    category: "guide",
    author: "B. Anudari",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anu",
    date: "2025.11.20",
    readTime: { mn: "5 мин", en: "5 min", ko: "5분" },
    image: "/paris.jpg",
    featured: true
  },
  {
    title: { mn: "Чемоданаа хэрхэн зөв баглах вэ?", en: "How to Pack Correctly?", ko: "여행 가방 싸는 법" },
    excerpt: { mn: "Ачаагаа хөнгөн байлгах...", en: "Keep luggage light...", ko: "짐을 가볍게 유지하는 방법..." },
    content: { mn: "<p>...</p>", en: "<p>...</p>", ko: "<p>...</p>" },
    category: "tips",
    author: "G. Temuulen",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Temu",
    date: "2025.11.18",
    readTime: { mn: "3 мин", en: "3 min", ko: "3분" },
    image: "/packing.jpg", 
    featured: false
  }
];

/* ────────────────────── 3. EXECUTE SEEDING ────────────────────── */
export async function GET() {
  try {
    const client = await clientPromise;
    const db = client.db("travel_db");
    
    // Seed Trips
    const tripsCollection = db.collection("trips");
    await tripsCollection.deleteMany({}); 
    const tripsResult = await tripsCollection.insertMany(tripsData); 

    // Seed Blogs
    const blogCollection = db.collection("posts");
    await blogCollection.deleteMany({}); 
    const blogResult = await blogCollection.insertMany(blogData); 

    return NextResponse.json({ 
      success: true, 
      message: "Database RESET with FULL TRILINGUAL & MULTI-CURRENCY DATA!", 
      tripsCount: tripsResult.insertedCount,
      blogCount: blogResult.insertedCount
    });
  } catch (e: any) {
    return NextResponse.json({ success: false, error: e.message }, { status: 500 });
  }
}
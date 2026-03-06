import { ObjectId } from "mongodb";
import clientPromise from "./index";

const DB_NAME = "travel_db";
const COLLECTION = "posts";

/* ────────────────────── BILINGUAL DATA ────────────────────── */
const blogPosts = [
  {
    title: {
      mn: "Монголд аялахад юу бэлдэх вэ?",
      en: "What to Pack for Mongolia: The Ultimate Guide"
    },
    excerpt: {
      mn: "Монголын цаг агаар, нөхцөл байдалд тохирсон хувцас, хэрэгслийн жагсаалт.",
      en: "A complete packing list for Mongolia's unpredictable weather and nomadic adventures."
    },
    content: `
      <h2>Clothing Layers are Key</h2>
      <p>Mongolia is known as the "Land of Blue Sky," but the weather can change rapidly. Layering is essential.</p>
      <ul>
        <li><strong>Base Layer:</strong> Thermal underwear (merino wool is best).</li>
        <li><strong>Mid Layer:</strong> Fleece or wool sweater.</li>
        <li><strong>Outer Layer:</strong> Windproof and waterproof jacket.</li>
      </ul>
      <h2>Essential Gear</h2>
      <ul>
        <li>Sturdy hiking boots</li>
        <li>Power bank (electricity can be scarce in gers)</li>
        <li>Sunscreen and sunglasses (high altitude sun is strong)</li>
      </ul>
    `,
    category: "tips",
    author: "Mongol Trail Team",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=MT",
    date: "2025.12.01",
    readTime: { mn: "4 мин", en: "4 min" },
    image: "/packing-mongolia.jpg",
    featured: false
  },
  {
    title: {
      mn: "Хөвсгөл нуур руу явах хамгийн тохиромжтой цаг",
      en: "Best Time to Visit Khuvsgul Lake"
    },
    excerpt: {
      mn: "Хөвсгөл далайг үзэхэд хамгийн тохиромжтой улирал, цаг агаарын онцлог.",
      en: "When to visit the Blue Pearl of Mongolia for the best experience and weather."
    },
    content: `
      <h2>Summer (July - August)</h2>
      <p>The most popular time to visit. The weather is pleasant (15°C to 25°C), and the lake is ice-free, perfect for boating and kayaking.</p>
      
      <h2>Winter (February - March)</h2>
      <p>For the adventurous, winter offers the famous <strong>Blue Pearl Ice Festival</strong>. The lake freezes over completely, allowing for driving on ice, skating, and horse sleigh rides.</p>
      
      <h2>Shoulder Season (June & September)</h2>
      <p>Fewer crowds and crisp air. Nights can be freezing, but the autumn colors in September are breathtaking.</p>
    `,
    category: "guide",
    author: "B. Anudari",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anu",
    date: "2025.12.05",
    readTime: { mn: "5 мин", en: "5 min" },
    image: "/khuvsgul.jpg",
    featured: true
  },
  {
    title: {
      mn: "2025 онд заавал очих 10 газар",
      en: "10 Must-Visit Places in 2025"
    },
    excerpt: {
      mn: "Дэлхий даяарх аялал жуулчлалын чиг хандлага, шинээр нээгдэж буй үзэсгэлэнт газрууд.",
      en: "Global tourism trends, newly opening scenic spots, and budget travel opportunities."
    },
    content: "<p>...</p>",
    category: "guide",
    author: "B. Anudari",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Anu",
    date: "2025.11.20",
    readTime: { mn: "5 мин", en: "5 min" },
    image: "/paris.jpg",
    featured: true
  },
  {
    title: {
      mn: "Чемоданаа хэрхэн зөв баглах вэ?",
      en: "How to Pack Your Suitcase Correctly?"
    },
    excerpt: {
      mn: "Ачаагаа хөнгөн байлгахын зэрэгцээ хэрэгтэй бүхнээ багтаах шалгарсан аргууд.",
      en: "Proven methods to keep your luggage light while packing everything you need."
    },
    content: "<p>...</p>",
    category: "tips",
    author: "G. Temuulen",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Temu",
    date: "2025.11.18",
    readTime: { mn: "3 мин", en: "3 min" },
    image: "/packing.jpg", 
    featured: false
  },
  {
    title: {
      mn: "Японы гудамжны хоолны соёл",
      en: "Japanese Street Food Culture"
    },
    excerpt: {
      mn: "Токиогийн гудамжаар аялж, Рамен, Такояки, Якитори зэрэг амтат хоолнуудын түүхтэй танилцсан тэмдэглэл.",
      en: "Notes on touring Tokyo streets and exploring the history of Ramen, Takoyaki, and Yakitori."
    },
    content: "<p>...</p>",
    category: "food",
    author: "M. Sarnai",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sara",
    date: "2025.11.15",
    readTime: { mn: "6 мин", en: "6 min" },
    image: "/japan.jpg",
    featured: false
  },
  {
    title: {
      mn: "Ганцаараа аялахад юу анхаарах вэ?",
      en: "Is Mongolia Travel Safe for Solo Travelers in 2025?"
    },
    excerpt: {
      mn: "Аюулгүй байдал, шинэ найзуудтай болох, өөрийгөө нээх аяллын тухай сэтгэл зүйн болон практик зөвлөгөө.",
      en: "A comprehensive guide on safety, cultural etiquette, and practical tips for solo tourists planning a Mongol travel expedition."
    },
    content: {
      mn: "<p>Ганцаараа аялах нь өөрийгөө нээх гайхалтай боломж юм...</p>",
      en: "<h2>The Short Answer: Yes, Mongolia is Extremely Safe</h2><p>For solo travelers wondering about <strong>Mongolian travel safety</strong>, the country ranks as one of the safest destinations in Asia. Violent crime against tourists is exceptionally rare, and the nomadic culture is inherently hospitable. However, the true danger lies not in people, but in the remote nature of the <strong>Mongolian trails</strong>.</p><h2>Navigating the Gobi Desert and Altai Mountains</h2><p>If you are planning <strong>Gobi Desert tours</strong> or trekking in the Altai, do not go completely alone. The lack of cell service, paved roads, and extreme weather means getting lost or breaking down can be life-threatening. Always hire an experienced local guide and driver through a reputable agency like Mongol Trail.</p><h2>Ulaanbaatar Safety Tips</h2><ul><li>Beware of pickpockets in crowded areas like the Narantuul Market (Black Market).</li><li>Use official taxi apps (like UBCab) rather than hailing random cars off the street at night.</li></ul>"
    },
    category: "tips",
    author: "D. Bat",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bat",
    date: "2025.11.10",
    readTime: { mn: "8 мин", en: "8 min" },
    image: "/solo.jpg",
    featured: false
  },
  {
    title: {
      mn: "Бали арал дээрх дижитал нүүдэлчид",
      en: "Digital Nomads in Bali"
    },
    excerpt: {
      mn: "Балид хэрхэн ажиллаж, амьдрах вэ? Виза, интернет, coworking space-үүдийн тухай мэдээлэл.",
      en: "How to live and work in Bali? Details about visas, internet, and coworking spaces."
    },
    content: "<p>...</p>",
    category: "stories",
    author: "E. Zolboo",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Zolo",
    date: "2025.11.05",
    readTime: { mn: "10 мин", en: "10 min" },
    image: "/bali-nomad.jpg",
    featured: false
  },
  {
    title: {
      mn: "Европоор галт тэргээр аялсан нь",
      en: "Traveling Europe by Train"
    },
    excerpt: {
      mn: "Eurail Pass ашиглан 5 улсаар аялсан миний түүх. Зардал хэмнэх аргууд болон хамгийн гоё маршрут.",
      en: "My story of traveling through 5 countries using a Eurail Pass. Cost-saving tips and best routes."
    },
    content: "<p>...</p>",
    category: "stories",
    author: "T. Bold",
    authorImg: "https://api.dicebear.com/7.x/avataaars/svg?seed=Bold",
    date: "2025.10.28",
    readTime: { mn: "7 мин", en: "7 min" },
    image: "/eurotrip.jpg",
    featured: false
  }
];

/* ────────────────────── HELPER MAPPER ────────────────────── */
function mapPost(doc: any) {
  return {
    ...doc,
    _id: doc._id.toString(),
  };
}

/* ────────────────────── FETCH FUNCTIONS ────────────────────── */

// 1. Get Posts (With Category Filter)
export async function getPosts(category: string = "all") {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);

  const query = category === "all" ? {} : { category };
  
  const posts = await collection
    .find(query)
    .sort({ date: -1 })
    .toArray();

  return posts.map(mapPost);
}

// 2. Get Featured Post
export async function getFeaturedPost() {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);

  const post = await collection.findOne({ featured: true });
  return post ? mapPost(post) : null;
}

// 3. Get Single Post by ID
export async function getPostById(id: string) {
  const client = await clientPromise;
  const collection = client.db(DB_NAME).collection(COLLECTION);

  try {
    const post = await collection.findOne({ _id: new ObjectId(id) });
    return post ? mapPost(post) : null;
  } catch (error) {
    return null;
  }
}

/* ────────────────────── SEEDING FUNCTION ────────────────────── */
export async function seedBlog() {
  const client = await clientPromise;
  const db = client.db(DB_NAME);
  const collection = db.collection(COLLECTION);

  // Clear existing data
  await collection.deleteMany({});

  // Insert new data
  const result = await collection.insertMany(blogPosts);
  return { success: true, count: result.insertedCount };
}
/* =========================================================
   Content + copy. Edit prices, dishes and text here only.
   L(hebrew, arabic, english)
   ========================================================= */
const L = (he, ar, en) => ({ he, ar, en });

const CONFIG = {
  phone: '+97246426033',
  currency: '₪',
  wazeRestaurant: 'https://waze.com/ul?q=%D7%9E%D7%A4%D7%92%D7%A9%20%D7%94%D7%9B%D7%A4%D7%A8',
  firstOrderNo: 4192,
  timeZone: 'Asia/Jerusalem',
  opensAt: '11:00',
  closesAt: '23:00',
};

const CATS = [
  { id: 'meat',    name: L('שווארמה ובשר', 'شاورما ولحوم', 'Shawarma & meat') },
  { id: 'chicken', name: L('עוף', 'دجاج', 'Chicken') },
  { id: 'dishes',  name: L('מנות', 'أطباق', 'Dishes') },
  { id: 'sides',        name: L('פלאפל וצ׳יפס', 'فلافل وبطاطا مقلية', 'Falafel & fries') },
  { id: 'salad-boxes',  name: L('קופסאות ומגשי סלטים', 'علب وصواني سلطات', 'Salad boxes & trays') },
  { id: 'custom-salad-boxes', name: L('קופסאות סלטים בהתאמה', 'علب سلطات حسب اختيارك', 'Build-your-own salad boxes') },
  { id: 'drinks',  name: L('שתייה', 'مشروبات', 'Drinks') },
];

const TAKEAWAY = L('לקחת', 'سفري', 'Take-away');
const DESC_TAKEAWAY = L('לקחת', 'سفري', 'To go');
const DESC_FORMATS = L('בפיתה, באגט, לאפה או מגש', 'بخبز بيتا أو باچيت أو لافة أو طبق', 'In pita, baguette, laffa or on a plate');

/* Photo paths are relative to this file. */
const ITEMS = [
  /* prices: per serving format, from the menu board. Omit a key to hide that option. */
  { id:'shawarma', cat:'meat', photo:'Shawarma%20Baguette.jpeg',
    prices:{ pita:50, baguette:52, laffa:54, plate:100 },
    name:L('שווארמה','شاورما','Shawarma'), desc:DESC_FORMATS },
  { id:'sh-personal', cat:'meat', photo:'%D7%9E%D7%92%D7%A9%20%D7%A9%D7%95%D7%95%D7%90%D7%A8%D7%9E%D7%94%20%D7%90%D7%99%D7%A9%D7%99%D7%AA.jpeg', tag:L('לקחת','سفري','Take-away'),
    prices:{ plate:65 },
    name:L('מגש שווארמה אישית','طبق شاورما شخصي','Personal shawarma tray'),
    desc:L('מגש אישי לקחת','طبق شخصي سفري','Personal tray, to go') },
  { id:'schnitzel', cat:'chicken', photo:'Schnitzel%20Baguette.jpeg',
    prices:{ pita:40, baguette:42, laffa:44 },
    name:L('שניצל','شنيتسل','Schnitzel'), desc:DESC_FORMATS },
  { id:'chicken-breast', cat:'chicken', photo:'%D7%97%D7%96%D7%94%20%D7%A2%D7%95%D7%A3%20Baguette.jpeg', detailPhoto:'%D7%97%D7%96%D7%94%20%D7%A2%D7%95%D7%A3%20Dish.jpeg',
    prices:{ pita:40, baguette:42, laffa:44, plate:60 },
    name:L('חזה עוף','صدر دجاج','Chicken breast'), desc:DESC_FORMATS },
  { id:'chicken-thighs', cat:'chicken', photo:'%D7%A4%D7%A8%D7%92%D7%99%D7%95%D7%AA%20Baguette.jpeg', detailPhoto:'%D7%A4%D7%A8%D7%92%D7%99%D7%95%D7%AA%20Dish.jpeg',
    prices:{ pita:40, baguette:42, laffa:44, plate:60 },
    name:L('פרגיות','برقيت','Chicken thighs'), desc:DESC_FORMATS },
  { id:'hearts', cat:'chicken', photo:'%D7%9C%D7%91%D7%91%D7%95%D7%AA%20Baguette.jpeg', detailPhoto:'%D7%9C%D7%91%D7%91%D7%95%D7%AA%20Dish.jpeg',
    prices:{ pita:40, baguette:42, laffa:44, plate:58 },
    name:L('לבבות','قلوب','Hearts'), desc:DESC_FORMATS },
  { id:'liver', cat:'chicken', photo:'%D7%9B%D7%91%D7%93%20Baguette.jpeg', detailPhoto:'%D7%9B%D7%91%D7%93%20Dish.jpeg',
    prices:{ pita:40, baguette:42, laffa:44, plate:60 },
    name:L('כבד','كبدة','Liver'), desc:DESC_FORMATS },
  { id:'kabab', cat:'meat', photo:'Kabab%20Baguette.jpeg',
    prices:{ pita:40, baguette:42, laffa:44 },
    name:L('קבב','كباب','Kabab'), desc:DESC_FORMATS },
  { id:'lamb', cat:'meat', photo:'%D7%9B%D7%91%D7%A9%20Baguette.jpeg', detailPhoto:'%D7%9B%D7%91%D7%A9%20Dish.jpeg',
    prices:{ pita:45, baguette:48, laffa:50, plate:73 },
    name:L('כבש','لحم غنم','Lamb'), desc:DESC_FORMATS },
  { id:'falafel', cat:'sides', photo:'Falafel%20Baguette.jpeg',
    prices:{ pita:25, baguette:28, laffa:30 },
    name:L('פלאפל','فلافل','Falafel'), desc:DESC_FORMATS },

  /* Plate-only dishes have their own category and dish photos. */
  { id:'schnitzel-dish', cat:'dishes', dish:true, photo:'Schnitzel%20Dish.jpeg',
    prices:{ plate:60 }, name:L('שניצל כמנה','وجبة شنيتسل','Schnitzel dish'), desc:L('מוגש כמנה עם סלטים לבחירה','يُقدّم كوجبة مع سلطات للاختيار','Served as a dish with salads of your choice') },
  { id:'kabab-dish', cat:'dishes', dish:true, photo:'Kabab%20Dish.jpeg',
    prices:{ plate:60 }, name:L('קבב כמנה','وجبة كباب','Kabab dish'), desc:L('מוגש כמנה עם סלטים לבחירה','يُقدّم كوجبة مع سلطات للاختيار','Served as a dish with salads of your choice') },
  { id:'falafel-dish', cat:'dishes', dish:true, photo:'Falafel%20Dish.jpeg',
    prices:{ plate:33 }, name:L('פלאפל כמנה','وجبة فلافل','Falafel dish'), desc:L('מוגש כמנה עם סלטים לבחירה','يُقدّم كوجبة مع سلطات للاختيار','Served as a dish with salads of your choice') },

  /* Take-away salads and fries, grouped by serving style.
     direct:true = added straight to the cart, no bread/salad builder. */
  { id:'salad-quarter', cat:'salad-boxes', direct:true, price:12, photo:'%D7%A8%D7%91%D7%A2%20%D7%A7%D7%95%D7%A4%D7%A1%D7%AA%20%D7%A1%D7%9C%D7%98%D7%99%D7%9D.jpeg', tag:TAKEAWAY,
    name:L('רבע קופסת סלטים','ربع علبة سلطات','Quarter box of salads'), desc:DESC_TAKEAWAY },
  { id:'salad-half', cat:'salad-boxes', direct:true, price:22, photo:'', tag:TAKEAWAY,
    name:L('חצי קופסת סלטים','نصف علبة سلطات','Half box of salads'), desc:DESC_TAKEAWAY },
  { id:'salad-tray-s', cat:'salad-boxes', direct:true, price:25, photo:'%D7%9E%D7%92%D7%A9%20%D7%A1%D7%9C%D7%98%D7%99%D7%9D%20%D7%A7%D7%98%D7%9F.jpeg', tag:TAKEAWAY,
    name:L('מגש סלטים קטן','طبق سلطات صغير','Small salad tray'), desc:DESC_TAKEAWAY },
  { id:'salad-tray-l', cat:'salad-boxes', direct:true, price:35, photo:'%D7%9E%D7%92%D7%A9%20%D7%A1%D7%9C%D7%98%D7%99%D7%9D%20%D7%92%D7%93%D7%95%D7%9C.jpeg', tag:TAKEAWAY,
    name:L('מגש סלטים גדול','طبق سلطات كبير','Large salad tray'), desc:DESC_TAKEAWAY },
  { id:'salad-tray-split', cat:'salad-boxes', direct:true, price:35, photo:'%D7%9E%D7%92%D7%A9%20%D7%A1%D7%9C%D7%98%D7%99%D7%9D%20%D7%92%D7%93%D7%95%D7%9C.jpeg', tag:TAKEAWAY,
    name:L('מגש סלטים מחולק','طبق سلطات مقسّم','Divided salad tray'), desc:DESC_TAKEAWAY },
  { id:'custom-salad-box', cat:'custom-salad-boxes', saladBox:true,
    photo:'%D7%A8%D7%91%D7%A2%20%D7%A7%D7%95%D7%A4%D7%A1%D7%AA%20%D7%A1%D7%9C%D7%98%D7%99%D7%9D.jpeg',
    prices:{ quarter:12, half:22 },
    name:L('קופסת סלטים בהרכבה','علبة سلطات من اختيارك','Build-your-own salad box'),
    desc:L('בוחרים גודל, כמות וסלטים לבחירה','اختر الحجم والكمية والسلطات','Choose a size, quantity, and salads') },
  { id:'fries-tray-s', cat:'sides', direct:true, price:22, photo:'Small%20Fries.jpeg', tag:TAKEAWAY,
    name:L('מגש צ׳יפס קטן','طبق شيبس صغير','Small fries tray'), desc:DESC_TAKEAWAY },
  { id:'fries-tray-l', cat:'sides', direct:true, price:35, photo:'Big%20Fries.jpeg', tag:TAKEAWAY,
    name:L('מגש צ׳יפס גדול','طبق شيبس كبير','Large fries tray'), desc:DESC_TAKEAWAY },
];

/* Give every menu item sold as a plate its own entry in the dishes category. */
const PLATE_DISHES = ITEMS
  .filter((item) => item.prices && item.prices.plate != null && !item.dish)
  .map((item) => ({
    ...item,
    id: 'dish-' + item.id,
    cat: 'dishes',
    dish: true,
    photo: item.detailPhoto || '',
    detailPhoto: item.detailPhoto || '',
    prices: { plate: item.prices.plate },
    tag: null,
    name: item.id === 'sh-personal'
      ? item.name
      : L(item.name.he + ' כמנה', 'وجبة ' + item.name.ar, item.name.en + ' dish'),
    desc: L('מוגש כמנה עם סלטים לבחירה', 'يُقدّم كوجبة مع سلطات للاختيار', 'Served as a dish with salads of your choice'),
  }));
const ALL_ITEMS = ITEMS.concat(PLATE_DISHES);

const DRINKS = [
  /* from the menu board ("שתיה") */
  { id:'tapuzina', price:10, photo:'%D7%AA%D7%A4%D7%95%D7%96%D7%99%D7%A0%D7%94%20330%20%D7%9E%D7%B4%D7%9C.gif', name:L('תפוזינה 330 מ״ל','تفوزينا 330 مل','Tapuzina 330 ml') },
  { id:'spring-tea', price:12, photo:'%D7%A1%D7%A4%D7%A8%D7%99%D7%A0%D7%92%20tea%200.5%20%D7%9C%D7%B3.avif', name:L('ספרינג tea 0.5 ל׳','سبرينج تي 0.5 لتر','Spring Tea 0.5 L') },
  { id:'spring-can', price:10, photo:'%D7%A4%D7%97%D7%99%D7%AA%20%D7%A1%D7%A4%D7%A8%D7%99%D7%A0%D7%92%20330%20%D7%9E%D7%B4%D7%9C.webp', name:L('פחית ספרינג 330 מ״ל','علبة سبرينج 330 مل','Spring can 330 ml') },
  { id:'flavored-water', price:10, photo:'', name:L('מים בטעמים 0.5 ל׳','مياه بنكهات 0.5 لتر','Flavored water 0.5 L') },
  { id:'schweppes-fruit', price:10, photo:'', name:L('שופס פירות 330 מ״ל','شويبس فواكه 330 مل','Schweppes fruit 330 ml') },
  { id:'schweppes-sparkling', price:10, photo:'', name:L('שופס מוגז עדן 330 מ״ל','شويبس غازي عدن 330 مل','Schweppes sparkling Eden 330 ml') },
  { id:'schweppes-soda', price:8, photo:'', name:L('שופס סודה 250 מ״ל','شويبس صودا 250 مل','Schweppes soda 250 ml') },
  { id:'eden-water', price:8, photo:'', name:L('מי עדן 0.5 ל׳','مياه عدن 0.5 لتر','Eden water 0.5 L') },
  { id:'soft-can', price:10, photo:'', name:L('פחית שתייה','علبة مشروب','Soft drink can') },
  { id:'soft-large', price:18, photo:'', name:L('בקבוק שתייה גדול','زجاجة مشروب كبيرة','Large drink bottle') },
];

const BEST_SELLERS = ['shawarma', 'kabab', 'falafel', 'fries-tray-s'];

const BREADS = [
  { id:'pita', photo:'%D7%A4%D7%99%D7%AA%D7%94.png', name:L('פיתה','خبز بيتا','Pita') },
  { id:'baguette', photo:'%D7%91%D7%90%D7%92%D7%98.jpg', name:L('באגט','باچيت','Baguette') },
  { id:'laffa', photo:'%D7%9C%D7%90%D7%A4%D7%94.jpg', name:L('לאפה','لافة','Laffa') },
  { id:'plate', name:L('מגש','طبق','Plate') },
];

const SALADS = [
  { id:'hummus', photo:'%D7%97%D7%95%D7%9E%D7%95%D7%A1.jpg', name:L('חומוס','حمص','Hummus') },
  { id:'red-cabbage-mayo', photo:'%D7%9B%D7%A8%D7%95%D7%91%20%D7%90%D7%93%D7%95%D7%9D%20%D7%91%D7%9E%D7%99%D7%95%D7%A0%D7%96.webp', name:L('כרוב אדום במיונז','ملفوف أحمر بالمايونيز','Red cabbage with mayonnaise') },
  { id:'vegetables-tahina', photo:'', name:L('סלט ירקות בטחינה','سلطة خضار بالطحينة','Vegetable salad with tahina') },
  { id:'turkish', photo:'%D7%A1%D7%9C%D7%98%20%D7%98%D7%95%D7%A8%D7%A7%D7%99.jpg', name:L('סלט טורקי','سلطة تركية','Turkish salad') },
  { id:'eggplant-tahina', photo:'', name:L('חציל עם טחינה','باذنجان بالطحينة','Eggplant with tahina') },
  { id:'greek-eggplant', photo:'', name:L('חציל ירקות (יווני)','باذنجان بالخضار (يوناني)','Greek eggplant and vegetables') },
  { id:'vegetable-salad', photo:'', name:L('סלט ירקות','سلطة خضار','Vegetable salad') },
  { id:'white-cabbage', photo:'%D7%9B%D7%A8%D7%95%D7%91%20%D7%9C%D7%91%D7%9F.jpg', name:L('כרוב לבן','ملفوف أبيض','White cabbage') },
  { id:'red-cabbage', photo:'', name:L('כרוב אדום','ملفوف أحمر','Red cabbage') },
  { id:'seasoning', photo:'', name:L('תובלה','بهارات','Seasoning') },
  { id:'sumac-onion', photo:'%D7%91%D7%A6%D7%9C%20%D7%A1%D7%95%D7%9E%D7%A7.jpg', name:L('בצל סומק','بصل بالسماق','Sumac onion') },
  { id:'watercress', photo:'', name:L('גרג׳יר','جرجير','Watercress') },
  { id:'corn', photo:'%D7%AA%D7%99%D7%A8%D7%A1.jpg', name:L('תירס','ذرة','Corn') },
  { id:'carrot', photo:'%D7%92%D7%96%D7%A8.jpg', name:L('גזר','جزر','Carrot') },
  { id:'pickles', photo:'', name:L('מלפפון חמוץ','خيار مخلل','Pickle') },
];

const FRIES = [
  { id:'fries-small', price:22, photo:'Small%20Fries.jpeg', name:L('צ׳יפס קטן','بطاطا مقلية صغيرة','Small fries') },
  { id:'fries-large', price:35, photo:'Big%20Fries.jpeg', name:L('צ׳יפס','بطاطا مقلية','Fries') },
];

const EXTRAS = [
  { id:'schug', price:0, name:L('סחוג חריף','شطة حارة','Spicy schug') },
  { id:'meat', price:12, name:L('תוספת בשר','لحمة إضافية','Extra meat') },
];

const T = {
  brand: L('מפגש הכפר','ملتقى القرية','Mifgash HaKfar'),
  brandSub: L('מסעדה מזרחית · ניין','مطعم شرقي · نين','Middle-eastern grill · Nein'),
  openUntil: L('פתוח עכשיו · עד {time}','مفتوح الآن · حتى {time}','Open now · until {time}'),
  closedToday: L('סגור · נפתח ב־{time} היום','مغلق · يفتح اليوم الساعة {time}','Closed · opens {time} today'),
  closedUntil: L('סגור · נפתח ב־{time} מחר','مغلق · يفتح غداً الساعة {time}','Closed · opens {time} tomorrow'),
  rating: L('דירוג 4.7','تقييم 4.7','4.7 rating'),
  heroTitle: L('שווארמה\nמהשיפוד','شاورما\nمن السيخ','Shawarma\noff the spit'),
  heroSub: L('מזמינים כאן ואוספים טרי וחם מהמסעדה.','اطلب من هون واستلم طازج وساخن من المطعم.','Order here and pick it up fresh and hot at the restaurant.'),
  pickupOnly: L('איסוף עצמי בלבד','استلام من المطعم فقط','Pickup only'),
  readyTime: L('מוכן תוך כ־15 דקות','جاهز خلال حوالي 15 دقيقة','Ready in about 15 min'),
  orderNow: L('להזמנה','اطلب الآن','Order now'),
  popularTitle: L('הכי מוזמנים','الأكثر طلباً','Popular picks'),
  popularSub: L('הוספה מהירה להזמנה','أضف بسرعة إلى طلبك','Add an item in one tap'),
  reorder: L('הזמנה חוזרת','إعادة آخر طلب','Reorder last order'),
  add: L('הוסף','أضف','Add'),
  aboutEyebrow: L('על המסעדה · ניין','عن المطعم · نين','THE RESTAURANT · NEIN'),
  aboutTitle: L('שווארמה שנפרסת בהזמנה','شاورما تُقطع عند الطلب','Shawarma, carved to order'),
  aboutIntro: L('הזמינו שווארמה, בחרו סלטים ותוספות, ואספו את המנה במסעדה בניין.','اطلب الشاورما، واختر السلطات والإضافات، ثم استلم وجبتك من المطعم في نين.','Order shawarma, add salads and sides, and collect your meal at the restaurant in Nein.'),
  aboutGrillTitle: L('צלייה על השיפוד','شواء على السيخ','Roasted on the spit'),
  aboutGrillBody: L('השווארמה נפרסת לאחר ביצוע ההזמנה.','نقطع الشاورما بعد تسجيل الطلب.','We carve the shawarma after your order is placed.'),
  aboutSaladsTitle: L('סלטים ותוספות','سلطات وإضافات','Salads and sides'),
  aboutSaladsBody: L('בחרו את הסלטים והתוספות שתרצו לצד המנה.','اختر السلطات والإضافات التي تريدها مع وجبتك.','Choose the salads and sides you want with your meal.'),
  aboutPickupTitle: L('איסוף מהמסעדה','استلام من المطعم','Restaurant pickup'),
  aboutPickupBody: L('בחרו זמן איסוף במהלך ההזמנה והגיעו למסעדה בניין.','اختر وقت الاستلام أثناء الطلب وتوجّه إلى المطعم في نين.','Select a pickup time while placing your order.'),
  whatsapp: L('וואטסאפ','واتساب','WhatsApp'),
  menuHint: L('בוחרים מנה להתאמה אישית, או לוחצים על הוספה כדי לצרף אותה להזמנה.','اختر طبقاً لتخصيصه، أو اضغط على زر الإضافة لإضافته مباشرة إلى طلبك.','Choose a dish to customize, or tap Add to put it straight in your order.'),
  address: L('הכביש הראשי, ניין','الشارع الرئيسي، نين','Main road, Nein'),
  hours: L('כל יום {opens}–{closes}','كل يوم {opens}–{closes}','Daily {opens}–{closes}'),
  phone: L('04-642-6033','04-642-6033','04-642-6033'),
  foodStatus: L('סטטוס כשרות: בררו ישירות מול המסעדה.','حالة الكوشير: يرجى الاستفسار مباشرة من المطعم.','Kosher status: please confirm directly with the restaurant.'),
  allergenNotice: L('אלרגיות: שאלו אותנו לפני ההזמנה על רכיבים וחשיפה אפשרית.','الحساسية: اسألونا قبل الطلب عن المكونات واحتمال التعرض لها.','Allergens: ask us before ordering about ingredients and possible cross-contact.'),
  call: L('חייגו','اتصل','Call'),
  breadQ: L('באיזה לחם?','بأي خبز؟','Which bread?'),
  required: L('חובה','إلزامي','Required'),
  noCharge: L('ללא תוספת','بدون زيادة','No charge'),
  from: L('מ־','من ','From '),
  free: L('חינם','مجاناً','Free'),
  saladsQ: L('סלטים','سلطات','Salads'),
  saladsFree: L('עד 5 ללא תשלום','حتى 5 مجاناً','Up to 5, no charge'),
  boxSizeQ: L('גודל הקופסה','حجم العلبة','Box size'),
  boxQuarter: L('רבע קופסה','ربع علبة','Quarter box'),
  boxHalf: L('חצי קופסה','نصف علبة','Half box'),
  boxContentsQ: L('מה לשים בקופסה?','ماذا تريد في العلبة؟','What would you like in your box?'),
  boxContentsHint: L('בחרו עד 5 סוגים','اختر حتى 5 أنواع','Choose up to 5'),
  friesQ: L('צ׳יפס כתוספת','بطاطا مقلية كإضافة','Add fries'),
  noFries: L('בלי צ׳יפס','بدون بطاطا مقلية','No fries'),
  extrasQ: L('תוספות','إضافات','Extras'),
  noteQ: L('הערה למטבח','ملاحظة للمطبخ','Note for the kitchen'),
  notePlaceholder: L('בלי בצל, חריף בצד…','بدون بصل، الحار على جنب…','No onion, spicy on the side…'),
  addToCart: L('הוספה להזמנה','أضف للطلب','Add to order'),
  stepSides: L('שלב 2 מתוך 3','خطوة 2 من 3','Step 2 of 3'),
  stepDrinks: L('שלב 3 מתוך 3','خطوة 3 من 3','Step 3 of 3'),
  sidesTitle: L('רוצים תוספת?','بدك إضافة؟','Anything on the side?'),
  sidesSub: L('מטוגן טרי וחם לצד המנה','يُقلى طازج وساخن بجانب الوجبة','Freshly fried and served hot with your dish'),
  noThanks: L('לא תודה','لا شكراً','No thanks'),
  addSides: L('הוספה','أضف','Add'),
  back: L('חזרה','رجوع','Back'),
  keepOrdering: L('חזרה לתפריט','رجوع للقائمة','Back to menu'),
  cartTitle: L('ההזמנה שלי','طلبي','My order'),
  emptyCart: L('ההזמנה ריקה','الطلب فاضي','Your order is empty'),
  addDrinks: L('להוסיף שתייה','أضف مشروب','Add drinks'),
  addMore: L('להוסיף מנה','أضف طبق','Add a dish'),
  side: L('תוספת','إضافة','Side'),
  drink: L('שתייה','مشروب','Drink'),
  subtotal: L('סה״כ מנות','مجموع الأطباق','Subtotal'),
  total: L('לתשלום','للدفع','Total'),
  toCheckout: L('המשך לאיסוף ותשלום','متابعة للاستلام والدفع','Pickup & payment'),
  viewCart: L('להזמנה שלי','طلبي','View order'),
  checkoutTitle: L('איסוף עצמי ותשלום','استلام من المطعم ودفع','Pickup & payment'),
  pickupTitle: L('איסוף מהמסעדה','استلام من المطعم','Pick up at the restaurant'),
  pickupBody: L('נכין את ההזמנה לאיסוף בכתובת: הכביש הראשי, ניין.','سنجهّز طلبك للاستلام من: الشارع الرئيسي، نين.','Your order will be prepared for pickup at: Main road, Nein.'),
  pickupDirections: L('ניווט למסעדה ב-Waze','الاتجاهات للمطعم عبر Waze','Directions to restaurant in Waze'),
  pickupTimeQ: L('מתי לאסוף?','متى تريد الاستلام؟','When would you like to pick up?'),
  pickupAsap: L('בהקדם האפשרי','في أقرب وقت ممكن','ASAP'),
  pickup15: L('בעוד 15 דקות','بعد 15 دقيقة','In 15 minutes'),
  pickup30: L('בעוד 30 דקות','بعد 30 دقيقة','In 30 minutes'),
  pickup45: L('בעוד 45 דקות','بعد 45 دقيقة','In 45 minutes'),
  pickupLater: L('בחירת שעה מאוחרת','اختيار وقت لاحق','Choose a later time'),
  customerNameQ: L('שם','الاسم','Name'),
  customerNamePlaceholder: L('גלעד כהן','غالب محمد','Gad Cohen'),
  customerPhoneQ: L('מספר טלפון','رقم الهاتف','Phone number'),
  customerPhonePlaceholder: L('050-1234567','050-1234567','050-1234567'),
  payQ: L('תשלום','الدفع','Payment'),
  cashOnly: L('תשלום במזומן באיסוף. פרטי כרטיס אינם נאספים באתר.','الدفع نقداً عند الاستلام. لا يتم جمع بيانات البطاقة على الموقع.','Cash at pickup. Card details are not collected on this site.'),
  payCash: L('מזומן באיסוף','نقداً عند الاستلام','Cash at pickup'),
  place: L('אישור ההזמנה','تأكيد الطلب','Place order'),
  doneTitle: L('סיכום הזמנה','ملخص الطلب','Order summary'),
  doneBody: L('זהו אתר הדגמה בלבד — ההזמנה לא נשלחה למסעדה. התקשרו לאישור.','هذا موقع تجريبي فقط — لم يُرسل الطلب إلى المطعم. اتصلوا للتأكيد.','This is a demo only; the order was not sent to the restaurant. Call to confirm.'),
  demoNotice: L('הדגמה בלבד: ההזמנה אינה נשלחת למסעדה.','نسخة تجريبية: لا يتم إرسال الطلب إلى المطعم.','Demo only: orders are not transmitted to the restaurant.'),
  statusReceived: L('התקבל','تم الاستلام','Received'),
  statusPreparing: L('בהכנה','قيد التحضير','Preparing'),
  statusReady: L('מוכן לאיסוף','جاهز للاستلام','Ready for pickup'),
  pickupTimeLabel: L('זמן איסוף','وقت الاستلام','Pickup time'),
  pickupAsapReceipt: L('בהקדם האפשרי','في أقرب وقت ممكن','ASAP'),
  orderNo: L('מספר הדגמה','رقم تجريبي','Demo number'),
  orderNo: L('מספר הזמנה','رقم الطلب','Order number'),
  newOrder: L('הזמנה חדשה','طلب جديد','New order'),
};

const u = (id, w = 1400) =>
    `https://images.unsplash.com/${id}?auto=format&fit=crop&w=${w}&q=85`;

// Navbar-এর language toggle এই array থেকে .map() করে
export const languages = [
    { code: "en", label: "English", dir: "ltr" },
    { code: "ar", label: "العربية", dir: "rtl" },
];

// ছবি ভাষার ওপর নির্ভর করে না
export const bannerImages = [
    u("photo-1604413191066-4dd20bedf486"),
    u("photo-1677840147140-252adb9ca347"),
    u("photo-1694043325785-d841a964257f"),
    u("photo-1562440499-64c9a111f713"),
    u("photo-1557308536-ee471ef2c390"),
    u("photo-1578985545062-69928b1d9587"),
    u("photo-1558636508-e0db3814bd1d"),
];

export const translations = {
    en: {
        banner: {
            primaryCta: "Explore the collection",
            secondaryCta: "Shop by occasion",
            chooseSlide: "Choose slide",
            prev: "Previous slide",
            next: "Next slide",
            showSlide: "Show slide",
            slides: [
                {
                    eyebrow: "The summer cake edit",
                    title: "Made to be the center of attention.",
                    copy: "Sculptural cakes, delicate flavors, and the loveliest finishing touch for every celebration.",
                },
                {
                    eyebrow: "Fresh berries, soft cream",
                    title: "Little joys in every layer.",
                    copy: "Meet our seasonal collection, baked in small batches with ripe berries and real vanilla.",
                },
                {
                    eyebrow: "Celebrate beautifully",
                    title: "Cakes worth gathering around.",
                    copy: "From quiet milestones to big celebrations, every cake is thoughtfully made just for you.",
                },
                {
                    eyebrow: "Delicate and French",
                    title: "Macarons that melt in your mouth.",
                    copy: "Rose, pistachio, and vanilla bean, baked fresh every morning and boxed with love.",
                },
                {
                    eyebrow: "In full bloom",
                    title: "Edible flowers, unforgettable flavor.",
                    copy: "Hand-finished floral designs that look beautiful and taste even better.",
                },
                {
                    eyebrow: "For the chocolate lover",
                    title: "Rich, dark, and totally irresistible.",
                    copy: "Deep cocoa layers with silky ganache, made for anyone who believes in dessert first.",
                },
                {
                    eyebrow: "Little treats, big smiles",
                    title: "Cupcakes for every sweet moment.",
                    copy: "Mix and match your favorite flavors and make someone’s day, yours included.",
                },
            ],
        },

        navbar: {
            brandLabel: "CrispyKWT home",
            searchPlaceholder: "Search cakes, flavors, occasions...",
            searchLabel: "Search cakes",
            searchButton: "Search",
            chooseLanguage: "Choose language",
            loading: "Loading",
            account: "Your account",
            dashboard: "Dashboard",
            orders: "Orders",
            logout: "Logout",
            login: "Login",
            cartLabel: "Shopping bag with {count} items",
        },
    },

    ar: {
        banner: {
            primaryCta: "اكتشف المجموعة",
            secondaryCta: "تسوّق حسب المناسبة",
            chooseSlide: "اختر الشريحة",
            prev: "الشريحة السابقة",
            next: "الشريحة التالية",
            showSlide: "عرض الشريحة",
            slides: [
                {
                    eyebrow: "معرض كعكات الصيف",
                    title: "صُنعت لتكون محور الاهتمام.",
                    copy: "كعكات فنية بنكهات رقيقة ولمسة أخيرة رائعة لكل احتفال.",
                },
                {
                    eyebrow: "توت طازج وكريمة ناعمة",
                    title: "سعادة صغيرة في كل طبقة.",
                    copy: "تعرّف على مجموعتنا الموسمية، تُخبز بكميات صغيرة بالتوت الناضج والفانيليا الطبيعية.",
                },
                {
                    eyebrow: "احتفل بأجمل طريقة",
                    title: "كعكات تستحق أن نجتمع حولها.",
                    copy: "من المناسبات الهادئة إلى الاحتفالات الكبيرة، كل كعكة مصنوعة بعناية من أجلك.",
                },
                {
                    eyebrow: "رقيقة وفرنسية",
                    title: "ماكرون يذوب في الفم.",
                    copy: "ورد وفستق وفانيليا، تُخبز طازجة كل صباح وتُغلَّف بحب.",
                },
                {
                    eyebrow: "في أوج التفتح",
                    title: "زهور صالحة للأكل، ونكهة لا تُنسى.",
                    copy: "تصاميم زهرية مزيّنة يدوياً، جميلة المظهر وألذ في المذاق.",
                },
                {
                    eyebrow: "لعشاق الشوكولاتة",
                    title: "غنية وداكنة ولا تُقاوَم.",
                    copy: "طبقات كاكاو عميقة مع غاناش ناعم، لكل من يؤمن بأن الحلوى أولاً.",
                },
                {
                    eyebrow: "حلوى صغيرة، وابتسامات كبيرة",
                    title: "كب كيك لكل لحظة حلوة.",
                    copy: "اختر نكهاتك المفضلة وأسعد شخصاً ما، وكن أنت منهم.",
                },
            ],
        },

        navbar: {
            brandLabel: "الصفحة الرئيسية لكريسبي كويت",
            searchPlaceholder: "ابحث عن الكعك والنكهات والمناسبات...",
            searchLabel: "ابحث عن الكعك",
            searchButton: "بحث",
            chooseLanguage: "اختر اللغة",
            loading: "جارٍ التحميل",
            account: "حسابك",
            dashboard: "لوحة التحكم",
            orders: "الطلبات",
            logout: "تسجيل الخروج",
            login: "تسجيل الدخول",
            cartLabel: "حقيبة التسوق، {count} منتجات",
        },
    },
};
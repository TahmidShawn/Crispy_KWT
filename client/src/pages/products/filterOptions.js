export const priceRanges = [
    {
        value: "0-10",
        label: { en: "0 – 10 KWD", ar: "٠ – ١٠ د.ك" },
    },
    {
        value: "10-20",
        label: { en: "10 – 20 KWD", ar: "١٠ – ٢٠ د.ك" },
    },
    {
        value: "20-50",
        label: { en: "20 – 50 KWD", ar: "٢٠ – ٥٠ د.ك" },
    },
    {
        // backend "min-max" ফরম্যাট নেয়, তাই 50+ এর জন্য বড় একটা max
        value: "50-100000",
        label: { en: "50+ KWD", ar: "+٥٠ د.ك" },
    },
];

export const sizes = [
    {
        value: "small",
        label: { en: "Small", ar: "صغير" },
        hint: { en: "Serves 3–4", ar: "٣–٤ أشخاص" },
    },
    {
        value: "medium",
        label: { en: "Medium", ar: "متوسط" },
        hint: { en: "Serves 8–12", ar: "٨–١٢ شخصًا" },
    },
];
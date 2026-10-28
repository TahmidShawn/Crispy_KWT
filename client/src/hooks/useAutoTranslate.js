import { useEffect, useRef, useState, useCallback } from "react";

import { translateText } from "@/utils/translation";

export default function useAutoTranslate({
    value,
    sourceLanguage = "en",
    targetLanguage = "ar",
    delay = 700,
    enabled = true,
}) {
    const [translatedValue, setTranslatedValue] = useState("");
    const [isTranslating, setIsTranslating] = useState(false);
    const [error, setError] = useState(null);

    const requestIdRef = useRef(0);

    const translate = useCallback(async () => {
        if (!value || !value.trim()) {
            setTranslatedValue("");
            return;
        }

        const requestId = ++requestIdRef.current;

        try {
            setIsTranslating(true);
            setError(null);

            const translation = await translateText(
                value,
                sourceLanguage,
                targetLanguage,
            );

            if (requestId !== requestIdRef.current) {
                return;
            }

            setTranslatedValue(translation);
        } catch (err) {
            if (requestId !== requestIdRef.current) {
                return;
            }

            setError(err);
        } finally {
            if (requestId === requestIdRef.current) {
                setIsTranslating(false);
            }
        }
    }, [value, sourceLanguage, targetLanguage]);

    useEffect(() => {
        if (!enabled || !value.trim()) {
            setTranslatedValue("");
            setIsTranslating(false);
            setError(null);

            return;
        }

        const timer = setTimeout(() => {
            translate();
        }, delay);

        return () => clearTimeout(timer);
    }, [value, sourceLanguage, targetLanguage, delay, enabled, translate]);

    return {
        translatedValue,
        isTranslating,
        error,
        translate,
    };
}

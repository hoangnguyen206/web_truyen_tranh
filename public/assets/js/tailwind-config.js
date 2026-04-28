// public/assets/js/tailwind-config.js
tailwind.config = {
    darkMode: "class",
    theme: {
        extend: {
            "colors": {
                // Light mode semantic colors
                "surface-container-highest": "#dae2fd",
                "surface-container-low": "#f2f3ff",
                "on-error": "#ffffff",
                "on-secondary-container": "#586377",
                "on-background": "#131b2e",
                "tertiary-fixed": "#ffdadb",
                "surface": "#faf8ff",
                "on-tertiary-container": "#fffaf9",
                "secondary-fixed-dim": "#bcc7de",
                "on-secondary-fixed": "#111c2d",
                "surface-container": "#eaedff",
                "surface-container-high": "#e2e7ff",
                "on-secondary": "#ffffff",
                "tertiary": "#b70438",
                "surface-container-lowest": "#ffffff",
                "error-container": "#ffdad6",
                "on-primary-fixed": "#40000c",
                "tertiary-fixed-dim": "#ffb2b7",
                "on-secondary-fixed-variant": "#3c475a",
                "on-tertiary-fixed-variant": "#92002a",
                "on-surface-variant": "#5c3f40",
                "surface-dim": "#d2d9f4",
                "primary-fixed": "#ffdada",
                "surface-tint": "#be0037",
                "primary": "#b80035",
                "surface-bright": "#faf8ff",
                "secondary": "#545f73",
                "outline": "#906f70",
                "inverse-on-surface": "#eef0ff",
                "background": "#faf8ff",
                "secondary-container": "#d5e0f8",
                "surface-variant": "#dae2fd",
                "primary-container": "#e11d48",
                "on-primary-container": "#fffaf9",
                "on-primary": "#ffffff",
                "on-tertiary-fixed": "#40000d",
                "on-error-container": "#93000a",
                "error": "#ba1a1a",
                "inverse-surface": "#283044",
                "on-primary-fixed-variant": "#920028",
                "primary-fixed-dim": "#ffb3b6",
                "tertiary-container": "#db2b4e",
                "on-tertiary": "#ffffff",
                "secondary-fixed": "#d8e3fb",
                "outline-variant": "#e5bdbe",
                "on-surface": "#131b2e",
                "inverse-primary": "#ffb3b6"
            },
            "borderRadius": {
                "DEFAULT": "0.25rem",
                "lg": "0.5rem",
                "xl": "0.75rem",
                "full": "9999px"
            },
            "spacing": {
                "gutter": "24px",
                "xl": "80px",
                "lg": "48px",
                "sm": "12px",
                "container-max": "1280px",
                "base": "8px",
                "xs": "4px",
                "md": "24px"
            },
            "fontFamily": {
                "headline-lg": ["Epilogue"],
                "label-md": ["Be Vietnam Pro"],
                "display-lg": ["Epilogue"],
                "body-lg": ["Be Vietnam Pro"],
                "label-sm": ["Be Vietnam Pro"],
                "body-md": ["Be Vietnam Pro"],
                "headline-md": ["Epilogue"]
            },
            "fontSize": {
                "headline-lg": ["32px", { "lineHeight": "1.2", "fontWeight": "700" }],
                "label-md": ["14px", { "lineHeight": "1", "fontWeight": "600" }],
                "display-lg": ["48px", { "lineHeight": "1.1", "letterSpacing": "-0.02em", "fontWeight": "800" }],
                "body-lg": ["18px", { "lineHeight": "1.6", "fontWeight": "400" }],
                "label-sm": ["12px", { "lineHeight": "1", "fontWeight": "500" }],
                "body-md": ["16px", { "lineHeight": "1.5", "fontWeight": "400" }],
                "headline-md": ["24px", { "lineHeight": "1.2", "fontWeight": "700" }]
            }
        }
    }
}

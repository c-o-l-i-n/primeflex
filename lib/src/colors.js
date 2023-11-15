const { styleClass } = require('./utils');
const { Rule } = require('postcss');

function generateSurfaceClasses(surfaceShades, rgbaShades, prefix) {
    const surfaces = {};

    for (let s of surfaceShades) {
        surfaces[`surface-${s}`] = `var(--${prefix}surface-${s});`;

        for (let rgba of rgbaShades) {
            const opacity = rgba / 100;

            surfaces[`surface-${s}\\/${rgba}`] = `color-mix(in srgb, var(--${prefix}surface-${s}), ${opacity}%, transparent)`;
        }
    }

    return surfaces;
}

function generateTextClasses(textColors, rgbaShades, prefix) {
    const texts = {};

    for (let color of textColors) {
        texts[`text-${color}`] = `var(--${prefix}surface-${color});`;

        for (let rgba of rgbaShades) {
            const opacity = rgba / 100;

            texts[`text-${color}\\/${rgba}`] = `color-mix(in srgb, var(--${prefix}surface-${color}), ${opacity}%, transparent)`;
        }
    }

    return texts;
}

function generateBorderClasses(borderShades, rgbaShades, prefix) {
    const borders = {};

    for (let shade of borderShades) {
        borders[`border-${shade}`] = `var(--${prefix}surface-${shade});`;

        for (let rgba of rgbaShades) {
            const opacity = rgba / 100;

            borders[`border-${shade}\\/${rgba}`] = `color-mix(in srgb, var(--${prefix}surface-${shade}), ${opacity}%, transparent)`;
        }
    }

    return borders;
}

module.exports = (root, opts) => {
    const surfaceShades = [0, 50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const colorShades = [50, 100, 200, 300, 400, 500, 600, 700, 800, 900];
    const rgbaShades = [10, 20, 30, 40, 50, 60, 70, 80, 90];
    const texts = {};
    const surfaces = {};
    const borders = {};
    const p = opts.prefix.cssVariable;
    const colored = {
        text: {},
        background: {},
        border: {}
    };
    const rgbaWhite = {
        text: {},
        background: {},
        border: {}
    };
    const rgbaBlack = {
        text: {},
        background: {},
        border: {}
    };
    const misc = {
        text: {
            'text-primary': `var(--${p}primary-color)`,
            'text-white': '#ffffff',
            'text-color': `var(--${p}text-color)`,
            'text-color-secondary': `var(--${p}text-color-secondary)`,
            'bg-primary': `var(--${p}primary-color-text)`,
            'bg-primary-reverse': `var(--${p}primary-color)`
        },
        background: {
            'bg-white': '#ffffff',
            'bg-primary': `var(--${p}primary-color)`,
            'bg-primary-reverse': `var(--${p}primary-color-text)`,
            'surface-ground': `var(--${p}surface-ground)`,
            'surface-section': `var(--s${p}urface-section)`,
            'surface-card': `var(--${p}surface-card)`,
            'surface-overlay': `var(--${p}surface-overlay)`,
            'surface-hover': `var(--${p}surface-hover)`
        },
        border: {
            'border-primary': `var(--${p}primary-color)`,
            'border-white': '#ffffff',
            'surface-border': `var(--${p}surface-border)`
        }
    };

    for (let s of surfaceShades) {
        texts['text-' + s] = `var(--${p}surface-${s})`;
        surfaces['surface-' + s] = `var(--${p}surface-${s})`;
        borders['border-' + s] = `var(--${p}surface-${s})`;
    }

    for (let themeName in opts.themes) {
        if (opts.themes.hasOwnProperty(themeName)) {
            let colorNames = Object.keys(opts.themes[themeName].colors);

            for (let color of colorNames) {
                for (let cs of colorShades) {
                    colored.text['text-' + color + '-' + cs] = `var(--${p}${color}-${cs})`;
                    colored.background['bg-' + color + '-' + cs] = `var(--${p}${color}-${cs})`;
                    colored.border['border-' + color + '-' + cs] = `var(--${p}${color}-${cs})`;
                }
            }
        }
    }

    const specialSurfaceClasses = generateSurfaceClasses(surfaceShades, rgbaShades, p);
    const specialTextClasses = generateTextClasses(surfaceShades, rgbaShades, p);
    const specialBorderClasses = generateBorderClasses(surfaceShades, rgbaShades, p);

    Object.assign(surfaces, specialSurfaceClasses);
    Object.assign(texts, specialTextClasses);
    Object.assign(borders, specialBorderClasses);

    function generateWhiteAndBlackRgbaShades(rgbaShades, rgbaWhite, rgbaBlack) {
        for (let rgbaShade of rgbaShades) {
            const classNameSuffix = `\\/${rgbaShade}`;
            const alphaSuffix = `-alpha-${rgbaShade}`;
            const whiteValue = `rgba(255,255,255,${rgbaShade / 100})`;
            const blackValue = `rgba(0,0,0,${rgbaShade / 100})`;

            rgbaWhite.text[`text-white${classNameSuffix}`] = whiteValue;
            rgbaWhite.background[`bg-white${classNameSuffix}`] = whiteValue;
            rgbaWhite.border[`border-white${classNameSuffix}`] = whiteValue;
            rgbaBlack.text[`text-black${classNameSuffix}`] = blackValue;
            rgbaBlack.background[`bg-black${classNameSuffix}`] = blackValue;
            rgbaBlack.border[`border-black${classNameSuffix}`] = blackValue;
            rgbaWhite.text[`text-white${alphaSuffix}`] = whiteValue;
            rgbaWhite.background[`bg-white${alphaSuffix}`] = whiteValue;
            rgbaWhite.border[`border-white${alphaSuffix}`] = whiteValue;
            rgbaBlack.text[`text-black${alphaSuffix}`] = blackValue;
            rgbaBlack.background[`bg-black${alphaSuffix}`] = blackValue;
            rgbaBlack.border[`border-black${alphaSuffix}`] = blackValue;
        }
    }

    for (let themeName in opts.themes) {
        if (opts.themes.hasOwnProperty(themeName)) {
            let colorNames = Object.keys(opts.themes[themeName].colors);

            for (let color of colorNames) {
                for (let cs of colorShades) {
                    for (let rgbaShade of rgbaShades) {
                        colored.text[`text-${color}-${cs}\\/${rgbaShade}`] = `color-mix(in srgb, var(--${p}${color}-${cs}) ${rgbaShade}%, transparent)`;
                        colored.background[`bg-${color}-${cs}\\/${rgbaShade}`] = `color-mix(in srgb, var(--${p}${color}-${cs}) ${rgbaShade}%, transparent)`;
                        colored.border[`border-${color}-${cs}\\/${rgbaShade}`] = `color-mix(in srgb, var(--${p}${color}-${cs}) ${rgbaShade}%, transparent)`;
                    }
                }
            }
        }
    }

    generateWhiteAndBlackRgbaShades(rgbaShades, rgbaWhite, rgbaBlack);

    function generateGradientClasses(type, colorShades, rgbaShades, opts) {
        const gradientColors = {};

        for (let rgbaShade of rgbaShades) {
            const whiteRgbaValue = `rgba(255, 255, 255, ${rgbaShade / 100})`;
            const blackRgbaValue = `rgba(0, 0, 0, ${rgbaShade / 100})`;

            gradientColors[`.${type}-white\\/${rgbaShade}`] = `--gradient-${type}: ${whiteRgbaValue};`;
            gradientColors[`.${type}-black\\/${rgbaShade}`] = `--gradient-${type}: ${blackRgbaValue};`;

            gradientColors[`.${type}-white-alpha-${rgbaShade}`] = `--gradient-${type}: ${whiteRgbaValue};`;
            gradientColors[`.${type}-black-alpha-${rgbaShade}`] = `--gradient-${type}: ${blackRgbaValue};`;
        }

        for (let themeName in opts.themes) {
            if (opts.themes.hasOwnProperty(themeName)) {
                let colorNames = Object.keys(opts.themes[themeName].colors);

                for (let color of colorNames) {
                    for (let cs of colorShades) {
                        gradientColors[`.${type}-${color}-${cs}`] = `--gradient-${type}: var(--${p}${color}-${cs});`;

                        for (let rgbaShade of rgbaShades) {
                            const rgbaValue = `color-mix(in srgb, var(--${p}${color}-${cs}) ${rgbaShade}%, transparent)`;

                            gradientColors[`.${type}-${color}-${cs}\\/${rgbaShade}`] = `--gradient-${type}: ${rgbaValue};`;
                        }
                    }
                }
            }
        }

        gradientColors[`.${type}-from-to`] = `--gradient-from: var(--${type}-from-color); --gradient-to: var(--${type}-to-color, var(--${type}-from-color)00);`;

        return gradientColors;
    }

    const bgImage = {
        'bg-none': 'none'
    };

    const gradientDirections = {
        'bg-gradient-to-t': 'to top',
        'bg-gradient-to-tr': 'to top right',
        'bg-gradient-to-r': 'to right',
        'bg-gradient-to-br': 'to bottom right',
        'bg-gradient-to-b': 'to bottom',
        'bg-gradient-to-bl': 'to bottom left',
        'bg-gradient-to-l': 'to left',
        'bg-gradient-to-tl': 'to top left'
    };

    const radialGradientDirections = {
        'bg-radial-gradient-to-t': 'at top',
        'bg-radial-gradient-to-tr': 'at top right',
        'bg-radial-gradient-to-r': 'at right',
        'bg-radial-gradient-to-br': 'at bottom right',
        'bg-radial-gradient-to-b': 'at bottom',
        'bg-radial-gradient-to-bl': 'at bottom left',
        'bg-radial-gradient-to-l': 'at left',
        'bg-radial-gradient-to-tl': 'at top left'
    };

    const gradients = {};

    for (let direction in gradientDirections) {
        gradients[
            direction
        ] = `linear-gradient(${gradientDirections[direction]}, var(--gradient-from) var(--gradient-from-percentage, 0%),var(--gradient-via, var(--gradient-from)) var(--gradient-via-percentage, 50%), var(--gradient-to, var(--gradient-from),transparent) var(--gradient-to-percentage, 100%))`;
    }

    for (let direction in radialGradientDirections) {
        gradients[
            direction
        ] = `radial-gradient(${radialGradientDirections[direction]}, var(--gradient-from) var(--gradient-from-percentage, 0%), var(--gradient-to,var(--gradient-via, var(--gradient-from)) var(--gradient-via-percentage, 50%), var(--gradient-from),transparent) var(--gradient-to-percentage, 100%))`;
    }

    const gradientFromColors = generateGradientClasses('from', colorShades, rgbaShades, opts);

    const gradientViaColors = generateGradientClasses('via', colorShades, rgbaShades, opts);
    const gradientToColors = generateGradientClasses('to', colorShades, rgbaShades, opts);

    function appendGradientRules(gradientColors, root) {
        for (const className in gradientColors) {
            let rule = new Rule({ selector: className });
            const properties = gradientColors[className].split(';');

            properties.forEach((prop) => {
                const [key, value] = prop.split(':');

                if (key && value) {
                    rule.append({ prop: key.trim(), value: value.trim() });
                }
            });
            root.before(rule);
        }
    }

    appendGradientRules(gradientFromColors, root);
    appendGradientRules(gradientToColors, root);
    appendGradientRules(gradientViaColors, root);

    const percentageClasses = {};

    for (let i = 0; i <= 100; i += 10) {
        percentageClasses[`.from-${i}\\%`] = `--gradient-from-percentage: ${i}%;`;
        percentageClasses[`.via-${i}\\%`] = `--gradient-via-percentage: ${i}%;`;
        percentageClasses[`.to-${i}\\%`] = `--gradient-to-percentage: ${i}%;`;
    }

    for (const className in percentageClasses) {
        let rule = new Rule({ selector: className });
        const properties = percentageClasses[className].split(';');

        properties.forEach((prop) => {
            const [key, value] = prop.split(':');

            if (key && value) {
                rule.append({ prop: key.trim(), value: value.trim() });
            }
        });
        root.before(rule);
    }

    styleClass('background-image', gradients, root, opts, true, true);
    styleClass('background-image', bgImage, root, opts, true, true);
    //surfaces
    styleClass('color', texts, root, opts, true, true);
    styleClass('background-color', surfaces, root, opts, true, true);
    styleClass('border-color', borders, root, opts, true, true);

    //transparent
    styleClass('background-color', { 'bg-transparent': 'transparent' }, root, opts, true, true);
    styleClass('border-color', { 'border-transparent': 'transparent' }, root, opts, true, true);

    //palette
    styleClass('color', colored.text, root, opts, true, true);
    styleClass('background-color', colored.background, root, opts, true, true);
    styleClass('border-color', colored.border, root, opts, true, true);

    //rgba
    styleClass('color', rgbaWhite.text, root, opts, true, true);
    styleClass('background-color', rgbaWhite.background, root, opts, true, true);
    styleClass('border-color', rgbaWhite.border, root, opts, true, true);
    styleClass('color', rgbaBlack.text, root, opts, true, true);
    styleClass('background-color', rgbaBlack.background, root, opts, true, true);
    styleClass('border-color', rgbaBlack.border, root, opts, true, true);

    //misc
    styleClass('color', misc.text, root, opts, true, true);
    styleClass('background-color', misc.background, root, opts, true, true);
    styleClass('border-color', misc.border, root, opts, true, true);
};
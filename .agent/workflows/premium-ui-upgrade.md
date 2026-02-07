---
description: Upgrade UI to "Liquid Aesthetic" (Red/Blue/White)
---

# "Liquid Aesthetic" UI Upgrade Workflow

This workflow transforms the application into an "Aesthetic" modern interface. It favors **atmosphere (glows, glass, depth)** over standard flat layouts.

## 1. 🎨 Design Commitment
**Style:** Liquid Aesthetic / Modern Minimalist
**Palette:**
- **Void Blue:** `#020617` (Backgrounds)
- **Electric Blue:** `#3b82f6` (Glows/Links)
- **Rose Red:** `#f43f5e` (Highlights/CTA - slightly softer/modern than standard red)
- **Mist White:** `#f8fafc` (Text usually at 90% opacity)

## 2. 🛠️ Tailwind Configuration Update
// turbo
Update `tailwind.config.js`:
- Add `animation-float`: `float 6s ease-in-out infinite`
- Add `box-shadow-glow`: Colored shadows that simulate light emission
- Add `backdrop-blur` utilities if missing

## 3. 💅 Global CSS Refinement
// turbo
Update `globals.css`:
- **Glassmorphism:**
    ```css
    .glass-panel {
        background: rgba(255, 255, 255, 0.03);
        backdrop-filter: blur(20px);
        border: 1px solid rgba(255, 255, 255, 0.05);
    }
    ```
- **Typography:**
    - Use `tracking-tight` on large headers.
    - Use `text-balance` for all titles.
- **Backgrounds:**
    - Add a fixed "Orb" gradient in the body background (Blue top-left, Red bottom-right) to create constant ambient lighting.

## 4. 🎭 Component Styling
- **Hero:** Minimal text, centered or asymmetric. Background is "Void Blue" with two large blurred orbs (Red/Blue) fighting for dominance.
- **Cards:** Fully glass. No solid backgrounds. Content floats.
- **Buttons:**
    - Primary: White text, Glass background, White border, Blue Glow hover.
    - Danger: Red text, Red glow hover.

## 5. 🔍 Aesthetic Check
- [ ] Is it dark enough? (Should feel exclusive).
- [ ] Is the "Red" aggressive or elegant? (Aim for Elegant/Neon).
- [ ] Is everything "Glass"? (Yes, but ensure readability).

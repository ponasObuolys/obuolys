# 🚀 Share Button - Quick Start Guide

## ⚡ 1 minutės integracija

### 1. Importuokite komponentą

```tsx
import { ShareButton } from '@/components/ui/share-button';
```

### 2. Pridėkite į jūsų puslapį

```tsx
<ShareButton
  title="Puslapio pavadinimas"
  description="Puslapio aprašymas"
  url="https://ponasobuolys.lt/jūsų-puslapis"
  imageUrl="https://example.com/image.jpg"  // optional
/>
```

### 3. Viskas! ✅

Sharing dabar veikia:
- 📱 **Mobile**: Native share dialog (WhatsApp, Messenger, etc.)
- 🖥️ **Desktop**: Dropdown su Facebook, Reddit, Email, Copy link

---

## 🎨 Variantai

### Standard button
```tsx
<ShareButton {...shareProps} />
```

### Outline style
```tsx
<ShareButton {...shareProps} variant="outline" />
```

### Icon only
```tsx
import { ShareIconButton } from '@/components/ui/share-button';

<ShareIconButton {...shareProps} />
```

### Horizontal group
```tsx
import { ShareButtonsGroup } from '@/components/ui/share-button';

<ShareButtonsGroup {...shareProps} />
```

---

## 📍 Kur jau integruota?

✅ **CourseDetail.tsx** - Kursų detalės
✅ **ToolDetailPage.tsx** - Įrankių detalės
✅ **PublicationDetail.tsx** - Publikacijų detalės

---

## 🧪 Testuokite

### Local
```bash
npm run dev
# Eikite į: http://localhost:5173/kursai/vibe-coding-masterclass
```

### Production
```
https://ponasobuolys.lt/kursai/vibe-coding-masterclass
```

Spauskite "Dalintis" mygtuką! 🎉

---

## 📚 Daugiau info

- [SHARE_BUTTON_README.md](src/components/ui/SHARE_BUTTON_README.md) - Pilna dokumentacija
- [SHARING_IMPLEMENTATION.md](SHARING_IMPLEMENTATION.md) - Implementacijos detalės
- [src/hooks/useShare.ts](src/hooks/useShare.ts) - Hook kodas

---

## ❓ Problemos?

**Web Share neveikia?**
→ Reikia HTTPS (arba localhost development)

**Copy neveikia?**
→ Patikrinkite browser permissions

**Dropdown neatsidaro?**
→ Patikrinkite console errors

---

**Viskas veikia ir paruošta production!** ✅

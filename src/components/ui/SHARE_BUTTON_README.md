# ShareButton - Social Sharing Komponentas

## Apžvalga

ShareButton komponentas leidžia vartotojams dalintis turiniu per Facebook, Reddit, Email ir nukopijuoti nuorodą. Automatiškai palaiko Web Share API mobile įrenginiuose ir custom dropdown desktop įrenginiuose.

## Funkcionalumas

### 🔥 Pagrindinės funkcijos

- ✅ **Web Share API** - Native mobile share (iOS/Android)
- ✅ **Facebook sharing** - Dalinamasi per Facebook
- ✅ **Reddit sharing** - Dalinamasi per Reddit
- ✅ **Email sharing** - Siųsti el. paštu
- ✅ **Copy link** - Nukopijuoti nuorodą į clipboard
- ✅ **Open Graph meta tags** - SEO optimizuotas
- ✅ **Responsive** - Veikia mobile ir desktop
- ✅ **Toast notifications** - Vartotojo feedback

## Naudojimas

### Bazinis pavyzdys

```tsx
import { ShareButton } from "@/components/ui/share-button";

<ShareButton
  title="Kurso pavadinimas"
  description="Kurso aprašymas"
  url="https://ponasobuolys.lt/kursai/vibe-coding"
  imageUrl="https://example.com/image.jpg"
/>;
```

### Su custom stiliais

```tsx
<ShareButton
  title="AI Įrankis"
  description="Puikus AI įrankis"
  url="https://ponasobuolys.lt/irankiai/chatgpt"
  variant="outline" // default | outline | ghost | icon
  size="lg" // default | sm | lg | icon
  className="custom-class"
/>
```

### Icon-only mygtukas

```tsx
import { ShareIconButton } from "@/components/ui/share-button";

<ShareIconButton
  title="Publikacija"
  description="Įdomi publikacija"
  url="https://ponasobuolys.lt/publikacijos/ai-naujienos"
/>;
```

### Share mygtukų grupė

```tsx
import { ShareButtonsGroup } from "@/components/ui/share-button";

<ShareButtonsGroup
  title="Straipsnis"
  description="Straipsnio aprašymas"
  url="https://ponasobuolys.lt/publikacijos/ai-guide"
  iconSize={20}
/>;
```

## Props

### ShareButton Props

| Prop          | Tipas                                         | Default     | Aprašymas                           |
| ------------- | --------------------------------------------- | ----------- | ----------------------------------- |
| `title`       | `string`                                      | -           | **Privalomas**. Sharing pavadinimas |
| `description` | `string`                                      | -           | **Privalomas**. Sharing aprašymas   |
| `url`         | `string`                                      | -           | **Privalomas**. Sharing URL         |
| `imageUrl`    | `string`                                      | `undefined` | Sharing paveiksliuko URL            |
| `variant`     | `'default' \| 'outline' \| 'ghost' \| 'icon'` | `'outline'` | Mygtuko stilius                     |
| `size`        | `'default' \| 'sm' \| 'lg' \| 'icon'`         | `'default'` | Mygtuko dydis                       |
| `showLabel`   | `boolean`                                     | `true`      | Rodyti "Dalintis" tekstą            |
| `className`   | `string`                                      | `undefined` | Custom CSS klasės                   |

## Integracijos pavyzdžiai

### CourseDetail.tsx

```tsx
import { ShareButton } from "@/components/ui/share-button";

<ShareButton
  title={course.title}
  description={course.description}
  url={`https://ponasobuolys.lt/kursai/${slug}`}
  imageUrl={course.image_url || undefined}
/>;
```

### ToolDetailPage.tsx

```tsx
import { ShareButton } from "@/components/ui/share-button";

<ShareButton
  title={tool.name}
  description={tool.description}
  url={`https://ponasobuolys.lt/irankiai/${slug}`}
  imageUrl={tool.image_url}
/>;
```

### PublicationDetail.tsx

```tsx
import { ShareButton } from "@/components/ui/share-button";

<ShareButton
  title={publication.title}
  description={publication.description || publication.content?.substring(0, 200) || ""}
  url={`https://ponasobuolys.lt/publikacijos/${slug}`}
  imageUrl={publication.image_url || undefined}
/>;
```

## useShare Hook

Galite naudoti `useShare` hook tiesiogiai, jei reikia custom implementacijos:

```tsx
import { useShare } from "@/hooks/useShare";

const MyComponent = () => {
  const { share, shareToPlatform, canUseWebShare } = useShare();

  const handleShare = () => {
    share({
      title: "Pavadinimas",
      description: "Aprašymas",
      url: "https://example.com",
    });
  };

  const handleFacebookShare = () => {
    shareToPlatform("facebook", {
      title: "Pavadinimas",
      description: "Aprašymas",
      url: "https://example.com",
    });
  };

  return (
    <>
      {canUseWebShare ? (
        <button onClick={handleShare}>Native Share</button>
      ) : (
        <button onClick={handleFacebookShare}>Share to Facebook</button>
      )}
    </>
  );
};
```

## Share Utils

Helper funkcijos iš `@/utils/share-utils.ts`:

```tsx
import {
  getFacebookShareUrl,
  getRedditShareUrl,
  getEmailShareUrl,
  copyToClipboard,
  canUseWebShare,
  prepareShareData,
} from "@/utils/share-utils";

// Facebook share URL
const fbUrl = getFacebookShareUrl({
  url: "https://example.com",
  title: "Title",
});

// Copy to clipboard
await copyToClipboard("https://example.com");

// Check Web Share support
if (canUseWebShare()) {
  // Use native share
}

// Prepare share data with defaults
const shareData = prepareShareData({
  url: "https://example.com",
  title: "Custom title",
});
```

## SEO - Open Graph Meta Tags

Open Graph meta tags jau integruoti per `OpenGraphTags.tsx` komponentą. Sharing automatiškai naudos šiuos tags:

```html
<meta property="og:title" content="..." />
<meta property="og:description" content="..." />
<meta property="og:image" content="..." />
<meta property="og:url" content="..." />
<meta property="og:type" content="article" />
```

## Testavimas

### Desktop testavimas

1. Atidarykite kurso/įrankio/publikacijos detail puslapį
2. Spauskite "Dalintis" mygtuką
3. Turėtų atsidaryti dropdown su 4 opcijomis:
   - Facebook
   - Reddit
   - El. paštas
   - Kopijuoti nuorodą

### Mobile testavimas

1. Atidarykite puslapį mobile įrenginyje (iOS/Android)
2. Spauskite "Dalintis" mygtuką
3. Turėtų atsidaryti native OS share dialog
4. Pasirinkite platformą (WhatsApp, Messenger, etc.)

### Manual testing URLs

- Kursai: `http://localhost:5173/kursai/vibe-coding-masterclass`
- Įrankiai: `http://localhost:5173/irankiai/{slug}`
- Publikacijos: `http://localhost:5173/publikacijos/{slug}`

## Troubleshooting

### Web Share API neveikia

**Problema**: Web Share API veikia tik HTTPS aplinkoje (išskyrus localhost)

**Sprendimas**:

- Development: Naudokite `http://localhost`
- Production: Įsitikinkite, kad naudojate HTTPS

### Share URL neatsidarinė

**Problema**: Popup blocker užblokavo share URL

**Sprendimas**:

- Įjunkite popup leidimu naršyklėje
- Arba naudokite `window.location.href` vietoj `window.open`

### Copy to clipboard neveikia

**Problema**: Clipboard API reikalauja HTTPS arba localhost

**Sprendimas**:

- Development: Naudokite localhost
- Production: HTTPS privalomas

## Browser palaikymas

| Feature       | Chrome    | Firefox   | Safari    | Edge      |
| ------------- | --------- | --------- | --------- | --------- |
| Web Share API | ✅ Mobile | ✅ Mobile | ✅ Mobile | ✅ Mobile |
| Clipboard API | ✅        | ✅        | ✅        | ✅        |
| URL Schemes   | ✅        | ✅        | ✅        | ✅        |

## Pavyzdžiai

### Horizontalus layout su share mygtukais

```tsx
<div className="flex items-center justify-between">
  <h1>{title}</h1>
  <ShareButton {...shareProps} />
</div>
```

### Share po content

```tsx
<article>
  <h1>{title}</h1>
  <p>{content}</p>

  <div className="mt-8 flex justify-center">
    <ShareButtonsGroup {...shareProps} />
  </div>
</article>
```

### Custom styling

```tsx
<ShareButton {...shareProps} className="rounded-full shadow-lg" variant="default" size="lg" />
```

## Atnaujinimai ir plėtros galimybės

### Galimi papildymai

- [ ] Twitter/X sharing (pridėti `getTwitterShareUrl`)
- [ ] LinkedIn sharing (pridėti `getLinkedInShareUrl`)
- [ ] WhatsApp sharing (pridėti `getWhatsAppShareUrl`)
- [ ] Telegram sharing
- [ ] Pinterest sharing
- [ ] Share analytics (track share events)
- [ ] QR code generation

### Kaip pridėti naują platformą

1. Pridėkite URL builder į `share-utils.ts`
2. Pridėkite platform type į `SharePlatform` union
3. Atnaujinkite `shareToPlatform` funkciją `useShare.ts`
4. Pridėkite naują option į `ShareButton` dropdown

## Support

Jei kyla klausimų ar problemų, sukurkite issue arba kontaktuokite:

- Email: support@ponasobuolys.lt
- GitHub: github.com/ponasobuolys/issues

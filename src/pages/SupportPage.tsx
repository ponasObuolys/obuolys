import type { FC } from 'react';
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart } from 'lucide-react';

import { Helmet } from 'react-helmet-async';

const SupportPage: FC = () => {
  return (
    <>
      <Helmet>
        <title>Parama | Ponas Obuolys</title>
        <meta name="description" content="Paremkite Ponas Obuolys projektą ir prisidėkite prie kokybiško AI turinio kūrimo lietuvių kalba." />
        <meta property="og:title" content="Parama | Ponas Obuolys" />
        <meta property="og:description" content="Paremkite Ponas Obuolys projektą ir prisidėkite prie kokybiško AI turinio kūrimo lietuvių kalba." />
        <meta property="og:type" content="website" />
        <meta property="og:url" content="https://ponasobuolys.lt/parama" />
        <meta property="og:image" content="https://ponasobuolys.lt/og-cover.jpg" />
      </Helmet>
      <div className="container mx-auto px-4 py-16 max-w-3xl text-center">
        <Heart className="mx-auto h-16 w-16 text-red-500 mb-6" />
      <h1 className="text-4xl font-bold mb-4">Paremk "Ponas Obuolys" Projektą</h1>
      <p className="text-lg text-gray-700 mb-8">
        Jūsų parama padeda man kurti kokybišką turinį lietuvių kalba apie dirbtinį intelektą – straipsnius, įrankius, kursus ir video. 
        Kiekvienas jūsų indėlis yra labai svarbus ir vertinamas!
      </p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 mb-12">
        {/* Patreon Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 flex flex-col items-center">
          <img src="/patreon-logo.png" alt="Patreon Logo" className="h-12 mb-4" /> 
          {/* Replace with actual Patreon logo if available */}
          <h2 className="text-2xl font-semibold mb-3">Tapk Patronu</h2>
          <p className="text-gray-600 mb-6 text-center">
            Gaukite išskirtinį turinį, ankstyvą prieigą prie naujienų ir kitų privalumų prisijungdami per Patreon.
          </p>
          <a href="https://patreon.com/ponasObuolys" target="_blank" rel="noopener noreferrer" className="mt-auto">
            <Button className="button-primary w-full">Rodyti Patreon</Button>
          </a>
        </div>

        {/* YouTube Membership Card */}
        <div className="bg-white rounded-lg shadow-lg p-6 border border-gray-200 flex flex-col items-center">
           <img src="/youtube-logo.png" alt="YouTube Logo" className="h-10 mb-4" /> 
           {/* Replace with actual YouTube logo if available */}
          <h2 className="text-2xl font-semibold mb-3">Tapk Nariu YouTube</h2>
          <p className="text-gray-600 mb-6 text-center">
            Paremkite kanalą tiesiogiai per YouTube ir gaukite specialius ženkliukus bei kitus narystės privalumus.
          </p>
          <a href="https://www.youtube.com/@ponasObuolys/join" target="_blank" rel="noopener noreferrer" className="mt-auto">
            <Button className="bg-red-600 hover:bg-red-700 text-white w-full">Prisijungti YouTube</Button>
          </a>
        </div>
      </div>

      <p className="text-gray-600 mb-8">
        Jei turite klausimų ar pasiūlymų, susisiekite <Link to="/kontaktai" className="text-primary hover:underline">čia</Link>.
      </p>

      <Link to="/">
        <Button variant="outline">Grįžti į pagrindinį puslapį</Button>
      </Link>
    </div>
    </>
  );
};

export default SupportPage; 
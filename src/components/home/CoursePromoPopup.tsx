import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { X } from 'lucide-react';
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import LazyImage from '@/components/ui/lazy-image';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface CourseData {
  id: string;
  title: string;
  description: string;
  image_url: string | null;
  slug: string;
}

interface CoursePromoPopupProps {
  courseId?: string;
  storageKey?: string;
  delaySeconds?: number;
}

/**
 * Reklaminis popup komponentas kursams
 *
 * Jei courseId nepateiktas, automatiškai gauna kursą su promote_in_popup = true
 *
 * @param courseId - (Optional) Specifinis kurso ID. Jei nepateiktas, naudojamas promoted kursas
 * @param storageKey - localStorage raktas (default: `course-promo-${courseId}`)
 * @param delaySeconds - Kiek sekundžių prieš rodant X mygtuką (default: 5)
 */
export function CoursePromoPopup({
  courseId,
  storageKey,
  delaySeconds = 5,
}: CoursePromoPopupProps) {
  const navigate = useNavigate();
  const [isOpen, setIsOpen] = useState(false);
  const [canClose, setCanClose] = useState(false);
  const [courseData, setCourseData] = useState<CourseData | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  const finalStorageKey = storageKey || `course-promo-${courseId || courseData?.id || 'default'}`;

  // Gauti kurso duomenis
  useEffect(() => {
    async function fetchCourse() {
      try {
        let query = supabase
          .from('courses')
          .select('id, title, description, image_url, slug')
          .eq('published', true);

        // Jei courseId pateiktas, gauti tą konkretų kursą
        // Jei ne - gauti kursą su promote_in_popup = true
        if (courseId) {
          query = query.eq('id', courseId);
        } else {
          query = query.eq('promote_in_popup', true);
        }

        const { data, error } = await query.single();

        if (error) throw error;

        setCourseData(data);
      } catch (error) {
        const fallbackMessage =
          error instanceof Error ? error.message : 'Nežinoma klaida';
        const toastMessage = import.meta.env.DEV
          ? `Nepavyko gauti kurso informacijos: ${fallbackMessage}`
          : 'Nepavyko gauti kurso informacijos';

        toast.error(toastMessage);
      } finally {
        setIsLoading(false);
      }
    }

    fetchCourse();
  }, [courseId]);

  // Tikrinti ar vartotojas jau matė popup'ą
  useEffect(() => {
    if (!courseData || isLoading) return;

    const hasSeenPopup = localStorage.getItem(finalStorageKey);
    if (!hasSeenPopup) {
      setIsOpen(true);
    }
  }, [courseData, isLoading, finalStorageKey]);

  // Delay X mygtuko rodymas
  useEffect(() => {
    if (!isOpen) return;

    const timer = setTimeout(() => {
      setCanClose(true);
    }, delaySeconds * 1000);

    return () => clearTimeout(timer);
  }, [isOpen, delaySeconds]);

  // Uždaryti popup ir išsaugoti į localStorage
  const handleClose = () => {
    if (!canClose) return;

    setIsOpen(false);
    localStorage.setItem(finalStorageKey, 'true');
  };

  // Atidaryti kurso puslapį
  const handleViewCourse = () => {
    if (courseData?.slug) {
      navigate(`/kursai/${courseData.slug}`);
      setIsOpen(false);
      localStorage.setItem(finalStorageKey, 'true');
    }
  };

  // Nerodyti jei nėra duomenų
  if (!courseData || isLoading) return null;

  return (
    <Dialog open={isOpen} onOpenChange={(open) => {
      if (!open && canClose) {
        handleClose();
      }
    }}>
      <DialogContent
        className="max-w-md sm:max-w-lg md:max-w-xl p-0 overflow-hidden gap-0"
        // Išjungti default close button
        onPointerDownOutside={(e) => {
          if (!canClose) {
            e.preventDefault();
          }
        }}
        onEscapeKeyDown={(e) => {
          if (!canClose) {
            e.preventDefault();
          }
        }}
      >
        {/* Custom X mygtukas su delayed visibility */}
        {canClose && (
          <button
            onClick={handleClose}
            className="absolute right-4 top-4 z-10 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2 bg-white/90 p-1.5 shadow-md"
            aria-label="Uždaryti"
          >
            <X className="h-4 w-4 text-gray-900" />
          </button>
        )}

        {/* Kurso thumbnail */}
        {courseData.image_url && (
          <div className="relative w-full h-48 sm:h-64 bg-gradient-to-br from-primary/10 to-primary/5">
            <LazyImage
              src={courseData.image_url}
              alt={courseData.title}
              className="w-full h-full object-cover"
            />
            {/* Overlay su gradienu */}
            <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-black/20 to-transparent" />

            {/* "Naujas kursas" badge */}
            <div className="absolute top-4 left-4 bg-primary text-primary-foreground px-3 py-1.5 rounded-full text-sm font-semibold shadow-lg">
              🎓 Naujas kursas!
            </div>
          </div>
        )}

        {/* Turinys */}
        <div className="p-6 space-y-4">
          <DialogHeader className="space-y-3">
            <DialogTitle className="text-2xl sm:text-3xl font-bold leading-tight">
              {courseData.title}
            </DialogTitle>
            <DialogDescription className="text-base text-foreground/80">
              {courseData.description}
            </DialogDescription>
          </DialogHeader>

          {/* CTA mygtukai */}
          <div className="flex flex-col sm:flex-row gap-3 pt-2">
            <Button
              onClick={handleViewCourse}
              size="lg"
              className="flex-1 text-base font-semibold"
            >
              Peržiūrėti kursą
            </Button>
            <Button
              onClick={handleClose}
              variant="outline"
              size="lg"
              className="flex-1 text-base"
              disabled={!canClose}
            >
              {canClose ? 'Galbūt vėliau' : `Palaukite ${delaySeconds}s...`}
            </Button>
          </div>

          {/* Timer indikatorius */}
          {!canClose && (
            <p className="text-xs text-center text-muted-foreground animate-pulse">
              Galėsite uždaryti po {delaySeconds} sekundžių
            </p>
          )}
        </div>
      </DialogContent>
    </Dialog>
  );
}

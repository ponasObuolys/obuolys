import { Mail, Youtube, MessageSquare, Facebook } from 'lucide-react';

export const SocialLinks = ({ className }: { className?: string }) => {
  return (
    <div className={`flex space-x-4 ${className}`}>
      <a
        href="mailto:labas@ponasobuolys.lt"
        className="text-gray-500 hover:text-primary transition-colors duration-300"
        aria-label="Siųsti el. laišką"
      >
        <Mail className="h-6 w-6" />
      </a>
      <a
        href="https://www.youtube.com/@ponasobuolys"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-primary transition-colors duration-300"
        aria-label="Apsilankyti YouTube"
      >
        <Youtube className="h-6 w-6" />
      </a>
      <a
        href="https://www.facebook.com/ponasObuolys.youtube"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-primary transition-colors duration-300"
        aria-label="Apsilankyti Facebook"
      >
        <Facebook className="h-6 w-6" />
      </a>
      <a
        href="https://chat.whatsapp.com/BnFnb6yznVH6vMYlEQx8cy"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-primary transition-colors duration-300"
        aria-label="Prisijungti prie WhatsApp grupės"
      >
        <MessageSquare className="h-6 w-6" />
      </a>
    </div>
  );
};
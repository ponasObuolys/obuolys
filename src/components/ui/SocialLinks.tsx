import { Mail, Youtube, MessageSquare, Facebook } from 'lucide-react';

export const SocialLinks = ({ className }: { className?: string }) => {
  return (
    <div className={`flex space-x-4 ${className}`}>
      <a
        href="mailto:labas@ponasobuolys.lt"
        className="text-gray-500 hover:text-primary transition-colors duration-300"
        aria-label="Email"
      >
        <Mail className="h-6 w-6" />
      </a>
      <a
        href="https://www.youtube.com/@ponasobuolys"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-primary transition-colors duration-300"
        aria-label="YouTube"
      >
        <Youtube className="h-6 w-6" />
      </a>
      <a
        href="https://www.facebook.com/ponasObuolys.youtube"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-primary transition-colors duration-300"
        aria-label="Facebook"
      >
        <Facebook className="h-6 w-6" />
      </a>
      <a
        href="https://wa.me/message/RSBW27G7DYBVP1"
        target="_blank"
        rel="noopener noreferrer"
        className="text-gray-500 hover:text-primary transition-colors duration-300"
        aria-label="WhatsApp"
      >
        <MessageSquare className="h-6 w-6" />
      </a>
    </div>
  );
}; 
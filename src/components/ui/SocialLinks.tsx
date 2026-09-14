import React from 'react';
import { MessageCircle, Instagram, Facebook, Video, Youtube, Twitter } from 'lucide-react';
import { BUSINESS_CONFIG } from '../../config/business';

interface SocialLinksProps {
  className?: string;
  itemClassName?: string;
  showLabels?: boolean;
}

export const SocialLinks: React.FC<SocialLinksProps> = ({
  className = '',
  itemClassName = '',
  showLabels = false,
}) => {
  const { socials } = BUSINESS_CONFIG;

  const platforms = [
    {
      key: 'whatsapp',
      name: 'WhatsApp',
      url: socials.whatsapp,
      icon: <MessageCircle className="w-4 h-4" />,
    },
    {
      key: 'instagram',
      name: 'Instagram',
      url: socials.instagram,
      icon: <Instagram className="w-4 h-4" />,
    },
    {
      key: 'facebook',
      name: 'Facebook',
      url: socials.facebook,
      icon: <Facebook className="w-4 h-4" />,
    },
    {
      key: 'tiktok',
      name: 'TikTok',
      url: socials.tiktok,
      icon: <Video className="w-4 h-4" />,
    },
    {
      key: 'youtube',
      name: 'YouTube',
      url: socials.youtube,
      icon: <Youtube className="w-4 h-4" />,
    },
    {
      key: 'x',
      name: 'X',
      url: socials.x,
      icon: <Twitter className="w-4 h-4" />,
    },
  ];

  // Filter out any social networks that do not have a configured URL
  const activeSocials = platforms.filter((item) => Boolean(item.url && item.url.trim() !== ''));

  if (activeSocials.length === 0) {
    return null;
  }

  return (
    <div className={`flex items-center flex-wrap gap-3 ${className}`}>
      {activeSocials.map((platform) => (
        <a
          key={platform.key}
          href={platform.url}
          target="_blank"
          rel="noopener noreferrer"
          aria-label={`Visit ${BUSINESS_CONFIG.name} on ${platform.name}`}
          className={`flex items-center gap-2 p-2 rounded-full border border-neutral-200 text-neutral-600 hover:text-[#DE1B76] hover:border-[#DE1B76] hover:bg-[#FDF2F7] transition-all duration-200 ${itemClassName}`}
        >
          {platform.icon}
          {showLabels && <span className="text-xs font-medium">{platform.name}</span>}
        </a>
      ))}
    </div>
  );
};

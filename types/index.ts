export type UserType = 'free' | 'premium';

export type UserProfile = {
  firstName: string;
  lastName: string;
  fullName: string;
  avatar: string;
  city: string;
  profession: string;
  email: string;
  genre: string;
  site: string;
  type: UserType;
  title: string;
  description: string;
  backgroundImage: string;
  address: string;
  facebookLink: string;
  instagramLink: string;
  youtubeLink: string;
  keywords: string[];
  hyperlinks: string[];
};

export type Nullable<T> = T | null;

export type HeaderType = 'text-only' | 'color-background' | 'full-background';

export type Theme = {
  header: {
    type: HeaderType;
    color?: string;
    backgroundImage?: string;
    title?: string;
    body?: string;
  };
};

export type Portal = {
  profile: UserProfile;
  username: string;
  cards: ContentItem[];
  theme: Theme;
};

export type ContentItemType = 'Video' | 'Image';

export type ContentItem = {
  id: string;
  title: string;
  description: string;
  date: string;
  type: ContentItemType;
  link: string;
  firstName: string;
  lastName: string;
  avatar: string;
  site: string;
  channel: ContentChannel;
  metadata: ContentMetaData;
};

export type ContentMetaData = {
  application: {
    name: string;
  };
  attachments: {
    data: ContentAttachment[];
  };
  images: any;
  videos: any;
};

export type ContentAttachment = {
  type: string;
};

export type ContentChannel = 'Any' | 'YouTube' | 'Facebook' | 'Instagram' | 'Twitter';

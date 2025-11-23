// Kurso tipai su naujais kainų laukais

export interface CourseValueItem {
  title: string;
  value: string;
}

export interface Course {
  id: string;
  title: string;
  slug: string;
  description: string;
  content: string;
  price: string;
  duration: string;
  level: string;
  highlights: string[];
  created_at: string;
  updated_at: string;
  published: boolean;
  image_url?: string | null;
  promote_in_popup: boolean;

  // Nauji kainų laukai
  regular_price?: string | null;
  discount_price?: string | null;
  next_price?: string | null;
  next_price_date?: string | null;
  value_items?: CourseValueItem[] | null;
  total_value?: string | null;
  stripe_product_id?: string | null;
  stripe_price_id?: string | null;
  countdown_enabled?: boolean | null;
  countdown_end_date?: string | null;
  countdown_text?: string | null;
}

export interface CoursePricingConfig {
  regularPrice?: string;
  discountPrice?: string;
  nextPrice?: string;
  nextPriceDate?: Date;
  valueItems?: CourseValueItem[];
  totalValue?: string;
  countdownEnabled?: boolean;
  countdownEndDate?: Date;
  countdownText?: string;
}
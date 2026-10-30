export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];

export interface Database {
  public: {
    Tables: {
      admin_roles: {
        Row: {
          id: string;
          user_id: string;
          role: string;
          created_at: string;
        };
        Insert: {
          id?: string;
          user_id: string;
          role: string;
          created_at?: string;
        };
        Update: {
          id?: string;
          user_id?: string;
          role?: string;
          created_at?: string;
        };
      };
      artworks: {
        Row: {
          id: string;
          slug: string;
          title: string;
          tagline: string | null;
          description: string | null;
          price: number;
          price_from: boolean;
          category: string;
          dimensions: string | null;
          medium: string | null;
          materials: Json | null;
          availability: string;
          max_quantity: number;
          featured: boolean;
          is_new: boolean;
          edition_size: number | null;
          created_at: string;
          updated_at: string;
          story: string | null;
          accent: string | null;
        };
        Insert: {
          id?: string;
          slug: string;
          title: string;
          tagline?: string | null;
          description?: string | null;
          price: number;
          price_from?: boolean;
          category: string;
          dimensions?: string | null;
          medium?: string | null;
          materials?: Json | null;
          availability?: string;
          max_quantity?: number;
          featured?: boolean;
          is_new?: boolean;
          edition_size?: number | null;
          created_at?: string;
          updated_at?: string;
          story?: string | null;
          accent?: string | null;
        };
        Update: {
          id?: string;
          slug?: string;
          title?: string;
          tagline?: string | null;
          description?: string | null;
          price?: number;
          price_from?: boolean;
          category?: string;
          dimensions?: string | null;
          medium?: string | null;
          materials?: Json | null;
          availability?: string;
          max_quantity?: number;
          featured?: boolean;
          is_new?: boolean;
          edition_size?: number | null;
          created_at?: string;
          updated_at?: string;
          story?: string | null;
          accent?: string | null;
        };
      };
      artwork_images: {
        Row: {
          id: string;
          artwork_id: string;
          image_url: string;
          position: number;
          is_cover: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          artwork_id: string;
          image_url: string;
          position?: number;
          is_cover?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          artwork_id?: string;
          image_url?: string;
          position?: number;
          is_cover?: boolean;
          created_at?: string;
        };
      };
      categories: {
        Row: {
          id: string;
          slug: string;
          name: string;
          description: string | null;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          slug: string;
          name: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          slug?: string;
          name?: string;
          description?: string | null;
          image_url?: string | null;
          created_at?: string;
        };
      };
      site_settings: {
        Row: {
          id: string;
          key: string;
          value: Json;
          updated_at: string;
        };
        Insert: {
          id?: string;
          key: string;
          value: Json;
          updated_at?: string;
        };
        Update: {
          id?: string;
          key?: string;
          value?: Json;
          updated_at?: string;
        };
      };
      homepage_sections: {
        Row: {
          id: string;
          section_key: string;
          content: Json;
          updated_at: string;
          hero_image_url: string | null;
          hero_floating_image_url: string | null;
          artist_intro_image_url: string | null;
        };
        Insert: {
          id?: string;
          section_key: string;
          content: Json;
          updated_at?: string;
          hero_image_url?: string | null;
          hero_floating_image_url?: string | null;
          artist_intro_image_url?: string | null;
        };
        Update: {
          id?: string;
          section_key?: string;
          content?: Json;
          updated_at?: string;
          hero_image_url?: string | null;
          hero_floating_image_url?: string | null;
          artist_intro_image_url?: string | null;
        };
      };
      about_content: {
        Row: {
          id: string;
          content: Json;
          updated_at: string;
          heroImageUrl: string | null;
          portraitImageUrl: string | null;
          studioImage1Url: string | null;
          studioImage2Url: string | null;
          studioImage3Url: string | null;
        };
        Insert: {
          id?: string;
          content: Json;
          updated_at?: string;
          heroImageUrl?: string | null;
          portraitImageUrl?: string | null;
          studioImage1Url?: string | null;
          studioImage2Url?: string | null;
          studioImage3Url?: string | null;
        };
        Update: {
          id?: string;
          content?: Json;
          updated_at?: string;
          heroImageUrl?: string | null;
          portraitImageUrl?: string | null;
          studioImage1Url?: string | null;
          studioImage2Url?: string | null;
          studioImage3Url?: string | null;
        };
      };
      gallery_items: {
        Row: {
          id: string;
          title: string | null;
          description: string | null;
          image_url: string;
          artwork_id: string | null;
          position: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          title?: string | null;
          description?: string | null;
          image_url: string;
          artwork_id?: string | null;
          position?: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          title?: string | null;
          description?: string | null;
          image_url?: string;
          artwork_id?: string | null;
          position?: number;
          created_at?: string;
        };
      };
      commission_types: {
        Row: {
          id: string;
          name: string;
          description: string | null;
          starting_price: number | null;
          available: boolean;
          image_url: string | null;
          created_at: string;
        };
        Insert: {
          id?: string;
          name: string;
          description?: string | null;
          starting_price?: number | null;
          available?: boolean;
          image_url?: string | null;
          created_at?: string;
        };
        Update: {
          id?: string;
          name?: string;
          description?: string | null;
          starting_price?: number | null;
          available?: boolean;
          image_url?: string | null;
          created_at?: string;
        };
      };
      testimonials: {
        Row: {
          id: string;
          customer_name: string;
          review: string;
          visible: boolean;
          created_at: string;
        };
        Insert: {
          id?: string;
          customer_name: string;
          review: string;
          visible?: boolean;
          created_at?: string;
        };
        Update: {
          id?: string;
          customer_name?: string;
          review?: string;
          visible?: boolean;
          created_at?: string;
        };
      };
      orders: {
        Row: {
          id: string;
          order_id: string;
          customer_name: string;
          email: string;
          phone: string;
          total_amount: number;
          shipping_address: Json;
          order_notes: string | null;
          status: string;
          created_at: string;
          updated_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          customer_name: string;
          email: string;
          phone: string;
          total_amount: number;
          shipping_address: Json;
          order_notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          customer_name?: string;
          email?: string;
          phone?: string;
          total_amount?: number;
          shipping_address?: Json;
          order_notes?: string | null;
          status?: string;
          created_at?: string;
          updated_at?: string;
        };
      };
      order_items: {
        Row: {
          id: string;
          order_id: string;
          artwork_id: string | null;
          artwork_title: string;
          price: number;
          quantity: number;
          created_at: string;
        };
        Insert: {
          id?: string;
          order_id: string;
          artwork_id?: string | null;
          artwork_title: string;
          price: number;
          quantity: number;
          created_at?: string;
        };
        Update: {
          id?: string;
          order_id?: string;
          artwork_id?: string | null;
          artwork_title?: string;
          price?: number;
          quantity?: number;
          created_at?: string;
        };
      };
    };
    Views: Record<string, never>;
    Functions: Record<string, never>;
    Enums: Record<string, never>;
  };
}
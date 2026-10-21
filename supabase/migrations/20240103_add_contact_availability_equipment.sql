-- Migration: Add contact details, availability status, and machinery & equipment to profiles table

ALTER TABLE public.profiles 
ADD COLUMN IF NOT EXISTS phone_number text,
ADD COLUMN IF NOT EXISTS phone_visible boolean default false,
ADD COLUMN IF NOT EXISTS availability_status text default 'unavailable' check (availability_status in ('available', 'busy', 'unavailable')),
ADD COLUMN IF NOT EXISTS equipment text[] default '{}';

COMMENT ON COLUMN public.profiles.phone_number IS 'Contact phone number for artisan';
COMMENT ON COLUMN public.profiles.phone_visible IS 'Whether phone number is displayed publicly for Call and WhatsApp';
COMMENT ON COLUMN public.profiles.availability_status IS 'Availability status: available (green), busy (orange), unavailable (gray)';
COMMENT ON COLUMN public.profiles.equipment IS 'List of atelier machinery and equipment';

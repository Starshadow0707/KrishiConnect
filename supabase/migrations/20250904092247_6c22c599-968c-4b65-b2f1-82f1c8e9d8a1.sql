-- Create enum for app roles
CREATE TYPE public.app_role AS ENUM ('admin', 'farmer', 'expert');

-- Create enum for supported languages
CREATE TYPE public.supported_language AS ENUM ('en', 'ml', 'ta', 'te', 'kn', 'hi');

-- Create enum for crop types
CREATE TYPE public.crop_type AS ENUM ('rice', 'wheat', 'cotton', 'sugarcane', 'coconut', 'spices', 'vegetables', 'fruits', 'other');

-- Create enum for soil types
CREATE TYPE public.soil_type AS ENUM ('alluvial', 'black', 'red', 'laterite', 'desert', 'mountain', 'other');

-- Create farmers profiles table
CREATE TABLE public.farmers (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL UNIQUE REFERENCES auth.users(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  phone TEXT,
  district TEXT NOT NULL,
  block TEXT,
  panchayat TEXT,
  farm_size_acres DECIMAL(10,2),
  primary_crops crop_type[] DEFAULT '{}',
  soil_type soil_type DEFAULT 'other',
  irrigation_type TEXT,
  preferred_language supported_language DEFAULT 'en',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create user roles table
CREATE TABLE public.user_roles (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  role app_role NOT NULL DEFAULT 'farmer',
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  UNIQUE(user_id, role)
);

-- Create chat queries table
CREATE TABLE public.chat_queries (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  question TEXT NOT NULL,
  response TEXT,
  language supported_language DEFAULT 'en',
  has_image BOOLEAN DEFAULT FALSE,
  image_url TEXT,
  voice_note_url TEXT,
  feedback INTEGER CHECK (feedback IN (-1, 0, 1)), -- -1: negative, 0: neutral, 1: positive
  response_time_ms INTEGER,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create weather data cache table
CREATE TABLE public.weather_data (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  district TEXT NOT NULL,
  weather_data JSONB NOT NULL,
  agricultural_indices JSONB,
  forecast_data JSONB,
  cached_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  expires_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT (now() + INTERVAL '3 hours'),
  UNIQUE(district)
);

-- Create market prices table
CREATE TABLE public.market_prices (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  crop_name TEXT NOT NULL,
  variety TEXT,
  market_name TEXT NOT NULL,
  district TEXT NOT NULL,
  price_per_quintal DECIMAL(10,2) NOT NULL,
  price_date DATE NOT NULL,
  min_price DECIMAL(10,2),
  max_price DECIMAL(10,2),
  modal_price DECIMAL(10,2),
  cached_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create government schemes table
CREATE TABLE public.government_schemes (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  title TEXT NOT NULL,
  description TEXT NOT NULL,
  eligibility_criteria TEXT,
  application_process TEXT,
  required_documents TEXT[],
  benefits TEXT,
  contact_info JSONB,
  apply_link TEXT,
  is_active BOOLEAN DEFAULT TRUE,
  valid_from DATE,
  valid_until DATE,
  target_crops crop_type[],
  target_districts TEXT[],
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create FAQ table for multilingual support
CREATE TABLE public.faq (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  question TEXT NOT NULL,
  answer TEXT NOT NULL,
  category TEXT NOT NULL,
  language supported_language NOT NULL,
  priority INTEGER DEFAULT 1,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now(),
  updated_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Create crop disease detection table
CREATE TABLE public.crop_diseases (
  id UUID NOT NULL DEFAULT gen_random_uuid() PRIMARY KEY,
  farmer_id UUID NOT NULL REFERENCES public.farmers(id) ON DELETE CASCADE,
  crop_name TEXT NOT NULL,
  image_url TEXT NOT NULL,
  detected_disease TEXT,
  confidence_score DECIMAL(3,2),
  treatment_recommendations TEXT,
  ai_analysis JSONB,
  expert_verified BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP WITH TIME ZONE NOT NULL DEFAULT now()
);

-- Enable Row Level Security on all tables
ALTER TABLE public.farmers ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.user_roles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.chat_queries ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.weather_data ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.market_prices ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.government_schemes ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.faq ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.crop_diseases ENABLE ROW LEVEL SECURITY;

-- Create security definer function to check user roles
CREATE OR REPLACE FUNCTION public.has_role(_user_id UUID, _role app_role)
RETURNS BOOLEAN
LANGUAGE SQL
STABLE
SECURITY DEFINER
SET search_path = public
AS $$
  SELECT EXISTS (
    SELECT 1
    FROM public.user_roles
    WHERE user_id = _user_id AND role = _role
  )
$$;

-- Create RLS policies for farmers table
CREATE POLICY "Users can view their own farmer profile"
  ON public.farmers FOR SELECT
  USING (auth.uid() = user_id);

CREATE POLICY "Users can update their own farmer profile"
  ON public.farmers FOR UPDATE
  USING (auth.uid() = user_id);

CREATE POLICY "Users can insert their own farmer profile"
  ON public.farmers FOR INSERT
  WITH CHECK (auth.uid() = user_id);

-- Create RLS policies for user_roles table
CREATE POLICY "Users can view their own roles"
  ON public.user_roles FOR SELECT
  USING (auth.uid() = user_id);

-- Create RLS policies for chat_queries table
CREATE POLICY "Farmers can view their own queries"
  ON public.chat_queries FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farmers 
      WHERE farmers.id = chat_queries.farmer_id 
      AND farmers.user_id = auth.uid()
    )
  );

CREATE POLICY "Farmers can insert their own queries"
  ON public.chat_queries FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farmers 
      WHERE farmers.id = farmer_id 
      AND farmers.user_id = auth.uid()
    )
  );

CREATE POLICY "Farmers can update their own queries"
  ON public.chat_queries FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM public.farmers 
      WHERE farmers.id = chat_queries.farmer_id 
      AND farmers.user_id = auth.uid()
    )
  );

-- Create RLS policies for weather data (public read access)
CREATE POLICY "Weather data is publicly readable"
  ON public.weather_data FOR SELECT
  USING (true);

-- Create RLS policies for market prices (public read access)
CREATE POLICY "Market prices are publicly readable"
  ON public.market_prices FOR SELECT
  USING (true);

-- Create RLS policies for government schemes (public read access)
CREATE POLICY "Government schemes are publicly readable"
  ON public.government_schemes FOR SELECT
  USING (is_active = true);

-- Create RLS policies for FAQ (public read access)
CREATE POLICY "FAQ is publicly readable"
  ON public.faq FOR SELECT
  USING (is_active = true);

-- Create RLS policies for crop diseases
CREATE POLICY "Farmers can view their own crop disease records"
  ON public.crop_diseases FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM public.farmers 
      WHERE farmers.id = crop_diseases.farmer_id 
      AND farmers.user_id = auth.uid()
    )
  );

CREATE POLICY "Farmers can insert their own crop disease records"
  ON public.crop_diseases FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM public.farmers 
      WHERE farmers.id = farmer_id 
      AND farmers.user_id = auth.uid()
    )
  );

-- Create function to update timestamps
CREATE OR REPLACE FUNCTION public.update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = now();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

-- Create triggers for automatic timestamp updates
CREATE TRIGGER update_farmers_updated_at
  BEFORE UPDATE ON public.farmers
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_government_schemes_updated_at
  BEFORE UPDATE ON public.government_schemes
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

CREATE TRIGGER update_faq_updated_at
  BEFORE UPDATE ON public.faq
  FOR EACH ROW
  EXECUTE FUNCTION public.update_updated_at_column();

-- Create function to handle new user registration
CREATE OR REPLACE FUNCTION public.handle_new_user()
RETURNS TRIGGER
LANGUAGE plpgsql
SECURITY DEFINER SET search_path = public
AS $$
BEGIN
  -- Insert default farmer role
  INSERT INTO public.user_roles (user_id, role)
  VALUES (new.id, 'farmer');
  
  RETURN new;
END;
$$;

-- Create trigger for new user registration
CREATE TRIGGER on_auth_user_created
  AFTER INSERT ON auth.users
  FOR EACH ROW EXECUTE FUNCTION public.handle_new_user();

-- Create indexes for better performance
CREATE INDEX idx_farmers_user_id ON public.farmers(user_id);
CREATE INDEX idx_farmers_district ON public.farmers(district);
CREATE INDEX idx_chat_queries_farmer_id ON public.chat_queries(farmer_id);
CREATE INDEX idx_chat_queries_created_at ON public.chat_queries(created_at DESC);
CREATE INDEX idx_weather_data_district ON public.weather_data(district);
CREATE INDEX idx_weather_data_expires_at ON public.weather_data(expires_at);
CREATE INDEX idx_market_prices_crop_district ON public.market_prices(crop_name, district);
CREATE INDEX idx_market_prices_date ON public.market_prices(price_date DESC);
CREATE INDEX idx_government_schemes_active ON public.government_schemes(is_active);
CREATE INDEX idx_faq_language_category ON public.faq(language, category);
CREATE INDEX idx_crop_diseases_farmer_id ON public.crop_diseases(farmer_id);

-- Insert some initial FAQ data
INSERT INTO public.faq (question, answer, category, language, priority) VALUES
('How do I register as a farmer?', 'To register, click on "Sign Up" and fill in your farming details including your district, crops, and farm size.', 'registration', 'en', 1),
('What crops does KrishiConnect support?', 'We support all major crops including rice, wheat, cotton, coconut, spices, vegetables, and fruits.', 'crops', 'en', 1),
('How accurate is the weather forecast?', 'Our weather forecasts are updated every 3 hours and include agricultural-specific indices for better farming decisions.', 'weather', 'en', 1),
('കാർഷിക വിദഗ്ധരുമായി എങ്ങനെ ബന്ധപ്പെടാം?', 'AI ചാറ്റ്ബോട്ട് വഴിയോ അല്ലെങ്കിൽ കൃഷി വിദഗ്ധരുടെ ഹെൽപ്ലൈനിൽ വിളിച്ചോ ബന്ധപ്പെടാവുന്നതാണ്.', 'support', 'ml', 1);

-- Insert some sample government schemes
INSERT INTO public.government_schemes (title, description, eligibility_criteria, benefits, target_crops, target_districts, is_active) VALUES
('Pradhan Mantri Fasal Bima Yojana', 'Crop insurance scheme providing financial support to farmers in case of crop loss', 'All farmers growing notified crops', 'Up to 2 lakh coverage per farmer per season', ARRAY['rice', 'wheat', 'cotton']::crop_type[], ARRAY['Thiruvananthapuram', 'Kollam', 'Kottayam'], true),
('Kisan Credit Card Scheme', 'Provides adequate and timely credit support for agricultural activities', 'Farmers with land ownership documents', 'Credit up to 3 lakh at subsidized interest rates', ARRAY['rice', 'coconut', 'spices']::crop_type[], ARRAY['Thrissur', 'Palakkad', 'Malappuram'], true);
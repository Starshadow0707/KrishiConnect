import { serve } from "https://deno.land/std@0.168.0/http/server.ts";
import { createClient } from 'https://esm.sh/@supabase/supabase-js@2'

const corsHeaders = {
  'Access-Control-Allow-Origin': '*',
  'Access-Control-Allow-Headers': 'authorization, x-client-info, apikey, content-type',
};

const supabaseUrl = Deno.env.get('SUPABASE_URL')!;
const supabaseAnonKey = Deno.env.get('SUPABASE_ANON_KEY')!;

// Kerala major markets and their API endpoints
const keralaMarkets = [
  { name: 'Thiruvananthapuram', code: 'TVM' },
  { name: 'Kochi', code: 'KOC' },
  { name: 'Kozhikode', code: 'KZK' },
  { name: 'Thrissur', code: 'TSR' },
  { name: 'Palakkad', code: 'PKD' }
];

// Common crops traded in Kerala markets
const keralaCrops = [
  'Rice', 'Coconut', 'Pepper', 'Cardamom', 'Ginger', 'Turmeric', 
  'Banana', 'Pineapple', 'Mango', 'Cashew', 'Coffee', 'Tea',
  'Rubber', 'Tapioca', 'Sweet Potato', 'Yam', 'Onion', 'Tomato',
  'Brinjal', 'Okra', 'Beans', 'Cabbage', 'Cauliflower'
];

serve(async (req) => {
  if (req.method === 'OPTIONS') {
    return new Response(null, { headers: corsHeaders });
  }

  try {
    const { crop, district, limit = 50 } = await req.json();
    
    const supabase = createClient(supabaseUrl, supabaseAnonKey);

    console.log('Fetching market data for crop:', crop, 'district:', district);

    // Check if we have recent cached data (within 24 hours)
    const twentyFourHoursAgo = new Date();
    twentyFourHoursAgo.setHours(twentyFourHoursAgo.getHours() - 24);

    let query = supabase
      .from('market_prices')
      .select('*')
      .gte('cached_at', twentyFourHoursAgo.toISOString())
      .order('price_date', { ascending: false })
      .limit(limit);

    if (crop) {
      query = query.ilike('crop_name', `%${crop}%`);
    }

    if (district) {
      query = query.ilike('district', `%${district}%`);
    }

    const { data: cachedData, error: cacheError } = await query;

    if (cacheError) {
      console.error('Error fetching cached data:', cacheError);
    }

    // If we have recent data, return it
    if (cachedData && cachedData.length > 0) {
      console.log('Returning cached market data, records found:', cachedData.length);
      
      // Group by crop for better analysis
      const groupedData = groupMarketDataByCrop(cachedData);
      const analysis = analyzeMarketTrends(cachedData);
      
      return new Response(
        JSON.stringify({
          prices: cachedData,
          summary: groupedData,
          analysis: analysis,
          cached: true,
          lastUpdated: cachedData[0]?.cached_at
        }),
        { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
      );
    }

    // Fetch fresh data from government API (simulated as the real API requires authentication)
    console.log('Fetching fresh market data from government sources');
    
    const freshMarketData = await fetchFreshMarketData(crop, district);
    
    // Cache the fresh data
    if (freshMarketData.length > 0) {
      const { error: insertError } = await supabase
        .from('market_prices')
        .insert(freshMarketData);

      if (insertError) {
        console.error('Error caching market data:', insertError);
      } else {
        console.log('Market data cached successfully, records:', freshMarketData.length);
      }
    }

    const groupedData = groupMarketDataByCrop(freshMarketData);
    const analysis = analyzeMarketTrends(freshMarketData);

    return new Response(
      JSON.stringify({
        prices: freshMarketData,
        summary: groupedData,
        analysis: analysis,
        cached: false,
        lastUpdated: new Date().toISOString()
      }),
      { headers: { ...corsHeaders, 'Content-Type': 'application/json' } }
    );

  } catch (error) {
    console.error('Error in market-data function:', error);
    return new Response(
      JSON.stringify({ 
        error: error.message || 'Failed to fetch market data',
        details: 'Please check your parameters and try again.'
      }),
      { 
        headers: { ...corsHeaders, 'Content-Type': 'application/json' },
        status: 500 
      }
    );
  }
});

async function fetchFreshMarketData(crop?: string, district?: string) {
  // Simulate government market data API
  // In production, this would fetch from data.gov.in or state agriculture department APIs
  const mockData: any[] = [];
  
  const today = new Date();
  const cropList = crop ? [crop] : keralaCrops.slice(0, 10); // Get first 10 crops if no specific crop
  const marketList = district ? 
    keralaMarkets.filter(m => m.name.toLowerCase().includes(district.toLowerCase())) : 
    keralaMarkets.slice(0, 3); // Get first 3 markets

  // Generate realistic market data for the last 7 days
  for (let i = 0; i < 7; i++) {
    const priceDate = new Date(today);
    priceDate.setDate(priceDate.getDate() - i);
    
    cropList.forEach(cropName => {
      marketList.forEach(market => {
        // Generate realistic price data based on crop type
        const basePrice = getCropBasePrice(cropName);
        const variation = (Math.random() - 0.5) * 0.2; // ±10% variation
        const modalPrice = basePrice * (1 + variation);
        
        mockData.push({
          crop_name: cropName,
          variety: getDefaultVariety(cropName),
          market_name: market.name,
          district: market.name,
          price_per_quintal: Math.round(modalPrice * 100) / 100,
          price_date: priceDate.toISOString().split('T')[0],
          min_price: Math.round(modalPrice * 0.9 * 100) / 100,
          max_price: Math.round(modalPrice * 1.1 * 100) / 100,
          modal_price: Math.round(modalPrice * 100) / 100,
          cached_at: new Date().toISOString()
        });
      });
    });
  }

  return mockData;
}

function getCropBasePrice(crop: string): number {
  const prices: { [key: string]: number } = {
    'Rice': 2500,
    'Coconut': 12000,
    'Pepper': 45000,
    'Cardamom': 120000,
    'Ginger': 8000,
    'Turmeric': 7500,
    'Banana': 1500,
    'Pineapple': 2000,
    'Mango': 3000,
    'Cashew': 15000,
    'Coffee': 6000,
    'Tea': 180,
    'Rubber': 15000,
    'Tapioca': 1200,
    'Sweet Potato': 2500,
    'Yam': 4000,
    'Onion': 2200,
    'Tomato': 2800,
    'Brinjal': 1800,
    'Okra': 3500,
    'Beans': 4000,
    'Cabbage': 1000,
    'Cauliflower': 1500
  };
  
  return prices[crop] || 2000;
}

function getDefaultVariety(crop: string): string {
  const varieties: { [key: string]: string } = {
    'Rice': 'Basmati',
    'Coconut': 'Hybrid',
    'Pepper': 'Malabar',
    'Cardamom': 'Small',
    'Ginger': 'Dry',
    'Turmeric': 'Finger',
    'Banana': 'Robusta',
    'Coffee': 'Arabica',
    'Tea': 'CTC'
  };
  
  return varieties[crop] || 'Common';
}

function groupMarketDataByCrop(data: any[]) {
  const grouped: { [key: string]: any } = {};
  
  data.forEach(item => {
    const crop = item.crop_name;
    if (!grouped[crop]) {
      grouped[crop] = {
        crop: crop,
        markets: [],
        avgPrice: 0,
        minPrice: Infinity,
        maxPrice: 0,
        priceCount: 0
      };
    }
    
    grouped[crop].markets.push({
      market: item.market_name,
      district: item.district,
      price: item.modal_price,
      date: item.price_date
    });
    
    grouped[crop].avgPrice += item.modal_price;
    grouped[crop].minPrice = Math.min(grouped[crop].minPrice, item.modal_price);
    grouped[crop].maxPrice = Math.max(grouped[crop].maxPrice, item.modal_price);
    grouped[crop].priceCount++;
  });
  
  // Calculate averages
  Object.keys(grouped).forEach(crop => {
    grouped[crop].avgPrice = Math.round((grouped[crop].avgPrice / grouped[crop].priceCount) * 100) / 100;
  });
  
  return Object.values(grouped);
}

function analyzeMarketTrends(data: any[]) {
  const trends: { [key: string]: any } = {};
  
  // Group by crop and calculate week-over-week trends
  data.forEach(item => {
    const crop = item.crop_name;
    if (!trends[crop]) {
      trends[crop] = {
        crop: crop,
        prices: [],
        trend: 'stable',
        recommendation: 'Monitor prices'
      };
    }
    
    trends[crop].prices.push({
      price: item.modal_price,
      date: item.price_date
    });
  });
  
  // Calculate trends for each crop
  Object.keys(trends).forEach(crop => {
    const prices = trends[crop].prices.sort((a: any, b: any) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );
    
    if (prices.length >= 2) {
      const oldPrice = prices[0].price;
      const newPrice = prices[prices.length - 1].price;
      const change = ((newPrice - oldPrice) / oldPrice) * 100;
      
      if (change > 5) {
        trends[crop].trend = 'rising';
        trends[crop].recommendation = 'Good time to sell if you have stock';
      } else if (change < -5) {
        trends[crop].trend = 'falling';
        trends[crop].recommendation = 'Consider holding stock or wait for better prices';
      } else {
        trends[crop].trend = 'stable';
        trends[crop].recommendation = 'Prices are stable, normal trading recommended';
      }
      
      trends[crop].changePercent = Math.round(change * 100) / 100;
    }
  });
  
  return Object.values(trends);
}
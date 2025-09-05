import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  Camera, 
  Upload, 
  X, 
  Loader2, 
  AlertCircle, 
  CheckCircle, 
  Copy,
  ExternalLink,
  Leaf,
  Droplets,
  Calendar,
  MapPin
} from 'lucide-react';
import Header from '@/components/Header';
import Footer from '@/components/Footer';
import { geminiService } from '@/services/gemini_service';

interface DetectionResult {
  diseaseName: string;
  accuracy: string;
  cure: {
    chemical: string[];
    organic: string[];
    nutrient: string[];
  };
  precautions: string[];
  suggestions: {
    name: string;
    link: string;
  }[];
}

const DiseaseDetection = () => {
  const [selectedImage, setSelectedImage] = useState<File | null>(null);
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [soilType, setSoilType] = useState('');
  const [fertilizerType, setFertilizerType] = useState('');
  const [timeframe, setTimeframe] = useState('');
  const [location, setLocation] = useState('');
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<DetectionResult | null>(null);
  const [error, setError] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const soilTypes = [
    'Clay Soil',
    'Sandy Soil',
    'Loamy Soil',
    'Silt Soil',
    'Peaty Soil',
    'Chalky Soil',
    'Red Soil',
    'Black Soil',
    'Alluvial Soil'
  ];

  const fertilizerTypes = [
    'Organic Compost',
    'NPK (Nitrogen-Phosphorus-Potassium)',
    'Urea',
    'DAP (Diammonium Phosphate)',
    'Potash',
    'Vermicompost',
    'Bone Meal',
    'Fish Emulsion',
    'Liquid Fertilizer',
    'Slow Release Fertilizer'
  ];

  const timeframes = [
    'Last 1 week',
    'Last 2 weeks',
    'Last 1 month',
    '1-3 months ago',
    '3-6 months ago',
    'More than 6 months ago',
    'Never used fertilizer'
  ];

  const handleImageSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size should be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDrop = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
    const file = event.dataTransfer.files[0];
    if (file) {
      if (file.size > 10 * 1024 * 1024) { // 10MB limit
        setError('Image size should be less than 10MB');
        return;
      }
      
      if (!file.type.startsWith('image/')) {
        setError('Please select a valid image file');
        return;
      }

      setSelectedImage(file);
      setError(null);
      
      const reader = new FileReader();
      reader.onload = (e) => {
        setImagePreview(e.target?.result as string);
      };
      reader.readAsDataURL(file);
    }
  };

  const handleDragOver = (event: React.DragEvent<HTMLDivElement>) => {
    event.preventDefault();
  };

  const removeImage = () => {
    setSelectedImage(null);
    setImagePreview(null);
    setResult(null);
    setError(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  // Improved markdown cleaning that preserves more content
  const cleanMarkdown = (text: string): string => {
    let cleaned = text;
    
    // Remove only excessive markdown formatting while preserving structure
    // Keep bullet points but clean them up
    cleaned = cleaned.replace(/^\s*[\*\-\+]\s+/gm, '• ');
    
    // Remove bold formatting (**text** and __text__) but keep the text
    cleaned = cleaned.replace(/\*\*([^*]+)\*\*/g, '$1');
    cleaned = cleaned.replace(/__([^_]+)__/g, '$1');
    
    // Remove italic formatting (*text* and _text_) but keep the text
    cleaned = cleaned.replace(/(?<!\*)\*([^*]+)\*(?!\*)/g, '$1');
    cleaned = cleaned.replace(/(?<!_)_([^_]+)_(?!_)/g, '$1');
    
    // Remove inline code (`code`) but keep the content
    cleaned = cleaned.replace(/`([^`]+)`/g, '$1');
    
    // Remove code blocks (```code```) but keep the content
    cleaned = cleaned.replace(/```[\s\S]*?```/g, (match) => {
      return match.replace(/```\w*\n?/g, '').replace(/```/g, '');
    });
    
    // Clean headers but keep the text
    cleaned = cleaned.replace(/^#{1,6}\s+/gm, '');
    
    // Remove links [text](url) - keep only the text
    cleaned = cleaned.replace(/\[([^\]]+)\]\([^)]+\)/g, '$1');
    
    // Remove strikethrough (~~text~~) but keep the text
    cleaned = cleaned.replace(/~~([^~]+)~~/g, '$1');
    
    // Clean blockquotes but keep content
    cleaned = cleaned.replace(/^>\s+/gm, '');
    
    // Remove horizontal rules
    cleaned = cleaned.replace(/^[-*_]{3,}$/gm, '');
    
    // Clean up excessive whitespace but preserve paragraph breaks
    cleaned = cleaned.replace(/\n{4,}/g, '\n\n\n');
    cleaned = cleaned.replace(/[ \t]+/g, ' ');
    cleaned = cleaned.trim();
    
    return cleaned;
  };

  const analyzeDisease = async () => {
    if (!selectedImage || !soilType || !fertilizerType || !timeframe) {
      setError('Please fill all required fields and select an image');
      return;
    }

    setIsAnalyzing(true);
    setError(null);

    try {
      // Convert image to base64
      const base64Image = await new Promise<string>((resolve) => {
        const reader = new FileReader();
        reader.onload = () => resolve(reader.result as string);
        reader.readAsDataURL(selectedImage);
      });

      const prompt = `You are an expert agricultural pathologist. Analyze this plant/crop image for diseases and provide a detailed response in the following format:

**Image Analysis Context:**
- Soil Type: ${soilType}
- Fertilizer Used: ${fertilizerType}
- Fertilizer Application: ${timeframe}
- Location: ${location || 'Not specified'}

**Required Response Format:**

Crop Disease Name: [Disease Name] (Accuracy: [XX]%)

Cure (Detailed Treatment Plan):
Chemical Treatment (Fungicides):
• [Specific chemical name] ([concentration]) – [Application instructions]
• [Another chemical] ([concentration]) – [Application instructions]

Organic/Bio-Control Options:
• [Organic treatment] ([concentration/amount]) – [Application instructions]
• [Bio-control agent] ([amount]) – [Application instructions]

Nutrient Support:
• [Specific nutrient/fertilizer] ([amount per plant]) – [Application schedule]
• [Foliar spray details] – [Application frequency]

Precaution (Future Prevention Measures):
• [Specific prevention measure 1]
• [Specific prevention measure 2]
• [Crop rotation details]
• [Spacing and irrigation recommendations]

Suggestions (Curated Purchase Links):
• [Product name]: https://www.amazon.in/s?k=[search-term]
• [Product name]: https://www.amazon.in/s?k=[search-term]

Please provide accurate, actionable advice based on the visible symptoms, soil type, and fertilizer history.`;

      const response = await geminiService.analyzeImageWithText(base64Image, prompt);
      
      // Apply gentle markdown cleaning that preserves more content
      const cleanedResponse = cleanMarkdown(response);
      
      // Parse the response to extract structured data
      const parsedResult = parseGeminiResponse(cleanedResponse);
      setResult(parsedResult);
      
    } catch (error) {
      console.error('Disease analysis error:', error);
      setError('Failed to analyze the image. Please try again.');
    } finally {
      setIsAnalyzing(false);
    }
  };

  const parseGeminiResponse = (response: string): DetectionResult => {
    // Enhanced parser with better content preservation
    const lines = response.split('\n');
    
    let diseaseName = 'Disease Detected';
    let accuracy = '85%';
    const cure = { chemical: [], organic: [], nutrient: [] };
    const precautions: string[] = [];
    const suggestions: { name: string; link: string }[] = [];

    try {
      // Extract disease name and accuracy with multiple patterns
      const diseasePatterns = [
        /Crop Disease Name:\s*(.+?)\s*\(Accuracy:\s*(\d+%)\)/i,
        /Disease:\s*(.+?)\s*\((\d+%)\)/i,
        /Identified:\s*(.+?)\s*-\s*(\d+%)/i,
        /Disease Name:\s*(.+?)\s*\((\d+%)\)/i
      ];
      
      for (const pattern of diseasePatterns) {
        const match = response.match(pattern);
        if (match) {
          diseaseName = match[1].trim();
          accuracy = match[2];
          break;
        }
      }

      // Extract sections with improved content preservation
      const sections = {
        chemical: extractSection(response, ['Chemical Treatment', 'Fungicides']),
        organic: extractSection(response, ['Organic', 'Bio-Control']),
        nutrient: extractSection(response, ['Nutrient Support', 'Nutrient']),
        precaution: extractSection(response, ['Precaution', 'Prevention']),
        suggestions: extractSection(response, ['Suggestions', 'Purchase', 'Products'])
      };

      // Process each section
      if (sections.chemical) {
        cure.chemical = extractBulletPoints(sections.chemical);
      }

      if (sections.organic) {
        cure.organic = extractBulletPoints(sections.organic);
      }

      if (sections.nutrient) {
        cure.nutrient = extractBulletPoints(sections.nutrient);
      }

      if (sections.precaution) {
        precautions.push(...extractBulletPoints(sections.precaution));
      }

      if (sections.suggestions) {
        const suggestionItems = sections.suggestions.match(/•\s*(.+?):\s*(https?:\/\/[^\s\n]+)/g);
        if (suggestionItems) {
          suggestionItems.forEach(item => {
            const match = item.match(/•\s*(.+?):\s*(https?:\/\/[^\s\n]+)/);
            if (match) {
              suggestions.push({ name: match[1].trim(), link: match[2].trim() });
            }
          });
        }
      }

      // Fallback: extract any treatment information if structured parsing fails
      if (cure.chemical.length === 0 && cure.organic.length === 0 && cure.nutrient.length === 0) {
        const allBulletPoints = response.match(/•\s*[^•\n]+/g) || [];
        const treatmentPoints = allBulletPoints.filter(point => 
          /spray|apply|use|treatment|fungicide|neem|copper|fertilizer/i.test(point)
        );
        
        if (treatmentPoints.length > 0) {
          cure.organic = treatmentPoints.slice(0, Math.min(5, treatmentPoints.length))
            .map(point => point.replace(/•\s*/, '').trim());
        }
        
        const preventionPoints = allBulletPoints.filter(point => 
          /prevent|avoid|ensure|maintain|rotate|spacing|drainage/i.test(point)
        );
        
        if (preventionPoints.length > 0) {
          precautions.push(...preventionPoints.slice(0, Math.min(3, preventionPoints.length))
            .map(point => point.replace(/•\s*/, '').trim()));
        }
      }

    } catch (error) {
      console.error('Error parsing Gemini response:', error);
      // Provide fallback data
      cure.organic = ['Apply neem oil spray (3%) every 7 days for 1 month', 'Use copper-based fungicide as preventive measure'];
      precautions.push('Ensure proper plant spacing for air circulation', 'Avoid overhead watering to reduce leaf wetness');
    }

    return {
      diseaseName,
      accuracy,
      cure,
      precautions,
      suggestions: suggestions.length > 0 ? suggestions : [
        { name: 'Neem Oil Organic Pesticide', link: 'https://www.amazon.in/s?k=neem+oil+pesticide' },
        { name: 'Copper Fungicide', link: 'https://www.amazon.in/s?k=copper+fungicide' }
      ]
    };
  };

  // Helper function to extract sections
  const extractSection = (text: string, keywords: string[]): string | null => {
    for (const keyword of keywords) {
      const regex = new RegExp(`${keyword}[\\s\\S]*?(?=\\n\\n[A-Z]|\\n[A-Z][a-z]+:|$)`, 'i');
      const match = text.match(regex);
      if (match) {
        return match[0];
      }
    }
    return null;
  };

  // Helper function to extract bullet points
  const extractBulletPoints = (section: string): string[] => {
    const bullets = section.match(/•\s*[^•\n]+/g) || [];
    return bullets.map(bullet => bullet.replace(/•\s*/, '').trim()).filter(item => item.length > 10);
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      
      <main className="container mx-auto px-4 py-8">
        <div className="max-w-6xl mx-auto">
          {/* Header Section */}
          <div className="text-center mb-8">
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="p-3 bg-green-100 dark:bg-green-900/20 rounded-full">
                <Camera className="h-8 w-8 text-green-600" />
              </div>
              <h1 className="text-3xl font-bold text-foreground">Crop Disease Detection</h1>
            </div>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Upload an image of your crop, plant, or leaves to get AI-powered disease detection and treatment recommendations
            </p>
          </div>

          <div className="grid lg:grid-cols-2 gap-8">
            {/* Input Section */}
            <div className="space-y-6">
              {/* Image Upload */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Upload className="h-5 w-5" />
                    Upload Plant Image
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {!imagePreview ? (
                    <div
                      className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary/50 transition-colors cursor-pointer"
                      onDrop={handleDrop}
                      onDragOver={handleDragOver}
                      onClick={() => fileInputRef.current?.click()}
                    >
                      <Camera className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                      <p className="text-lg font-medium mb-2">Drop your image here or click to browse</p>
                      <p className="text-sm text-muted-foreground">
                        Supports JPG, PNG, WebP (Max 10MB)
                      </p>
                      <input
                        ref={fileInputRef}
                        type="file"
                        accept="image/*"
                        onChange={handleImageSelect}
                        className="hidden"
                      />
                    </div>
                  ) : (
                    <div className="relative">
                      <img
                        src={imagePreview}
                        alt="Selected crop"
                        className="w-full h-64 object-cover rounded-lg"
                      />
                      <Button
                        variant="destructive"
                        size="icon"
                        className="absolute top-2 right-2"
                        onClick={removeImage}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Additional Information */}
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Leaf className="h-5 w-5" />
                    Growing Conditions
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  {/* Soil Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2">
                      Soil Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={soilType}
                      onChange={(e) => setSoilType(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select soil type</option>
                      {soilTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Fertilizer Type */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Droplets className="h-4 w-4" />
                      Fertilizer Type <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={fertilizerType}
                      onChange={(e) => setFertilizerType(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select fertilizer type</option>
                      {fertilizerTypes.map(type => (
                        <option key={type} value={type}>{type}</option>
                      ))}
                    </select>
                  </div>

                  {/* Timeframe */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <Calendar className="h-4 w-4" />
                      When was fertilizer last applied? <span className="text-red-500">*</span>
                    </label>
                    <select
                      value={timeframe}
                      onChange={(e) => setTimeframe(e.target.value)}
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    >
                      <option value="">Select timeframe</option>
                      {timeframes.map(time => (
                        <option key={time} value={time}>{time}</option>
                      ))}
                    </select>
                  </div>

                  {/* Location (Optional) */}
                  <div>
                    <label className="block text-sm font-medium mb-2 flex items-center gap-2">
                      <MapPin className="h-4 w-4" />
                      Location (Optional)
                    </label>
                    <input
                      type="text"
                      value={location}
                      onChange={(e) => setLocation(e.target.value)}
                      placeholder="e.g., Kerala, India"
                      className="w-full px-3 py-2 border border-border rounded-lg bg-background focus:outline-none focus:ring-2 focus:ring-primary/20"
                    />
                  </div>
                </CardContent>
              </Card>

              {/* Analyze Button */}
              <Button
                onClick={analyzeDisease}
                disabled={!selectedImage || !soilType || !fertilizerType || !timeframe || isAnalyzing}
                className="w-full py-3 text-lg"
                size="lg"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="h-5 w-5 mr-2 animate-spin" />
                    Analyzing Disease...
                  </>
                ) : (
                  <>
                    <Camera className="h-5 w-5 mr-2" />
                    Analyze Disease
                  </>
                )}
              </Button>

              {error && (
                <div className="flex items-center gap-2 p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-lg">
                  <AlertCircle className="h-5 w-5 text-red-600" />
                  <p className="text-red-700 dark:text-red-300">{error}</p>
                </div>
              )}
            </div>

            {/* Results Section */}
            <div className="space-y-6">
              {result ? (
                <>
                  {/* Disease Identification */}
                  <Card>
                    <CardHeader>
                      <CardTitle className="flex items-center gap-2">
                        <CheckCircle className="h-5 w-5 text-green-600" />
                        Disease Identified
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center p-6 bg-gradient-to-r from-green-50 to-blue-50 dark:from-green-900/20 dark:to-blue-900/20 rounded-lg">
                        <h3 className="text-2xl font-bold text-foreground mb-2">
                          {result.diseaseName}
                        </h3>
                        <div className="flex items-center justify-center gap-2 mb-3">
                          <div className="inline-flex items-center px-3 py-1 bg-green-100 dark:bg-green-900/30 text-green-800 dark:text-green-300 rounded-full text-sm font-medium">
                            Accuracy: {result.accuracy}
                          </div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => copyToClipboard(`Disease: ${result.diseaseName} (${result.accuracy} accuracy)`)}
                            className="h-7"
                          >
                            <Copy className="h-3 w-3" />
                          </Button>
                        </div>
                        <p className="text-sm text-muted-foreground">
                          Analysis based on: {soilType}, {fertilizerType}, {timeframe}
                        </p>
                      </div>
                    </CardContent>
                  </Card>

                  {/* Treatment Plan */}
                  <Card>
                    <CardHeader>
                      <CardTitle>Detailed Treatment Plan</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-6">
                      {/* Chemical Treatment */}
                      {result.cure.chemical.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-red-600 mb-3 flex items-center gap-2">
                            🧪 Chemical Treatment (Fungicides)
                          </h4>
                          <ul className="space-y-2">
                            {result.cure.chemical.map((treatment, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-red-500 mt-1">•</span>
                                <span className="text-sm">{treatment}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Organic Treatment */}
                      {result.cure.organic.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-green-600 mb-3 flex items-center gap-2">
                            🌿 Organic/Bio-Control Options
                          </h4>
                          <ul className="space-y-2">
                            {result.cure.organic.map((treatment, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-green-500 mt-1">•</span>
                                <span className="text-sm">{treatment}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}

                      {/* Nutrient Support */}
                      {result.cure.nutrient.length > 0 && (
                        <div>
                          <h4 className="font-semibold text-blue-600 mb-3 flex items-center gap-2">
                            💊 Nutrient Support
                          </h4>
                          <ul className="space-y-2">
                            {result.cure.nutrient.map((nutrient, index) => (
                              <li key={index} className="flex items-start gap-2">
                                <span className="text-blue-500 mt-1">•</span>
                                <span className="text-sm">{nutrient}</span>
                              </li>
                            ))}
                          </ul>
                        </div>
                      )}
                    </CardContent>
                  </Card>

                  {/* Prevention Measures */}
                  {result.precautions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <AlertCircle className="h-5 w-5 text-orange-600" />
                          Prevention Measures
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <ul className="space-y-2">
                          {result.precautions.map((precaution, index) => (
                            <li key={index} className="flex items-start gap-2">
                              <span className="text-orange-500 mt-1">•</span>
                              <span className="text-sm">{precaution}</span>
                            </li>
                          ))}
                        </ul>
                      </CardContent>
                    </Card>
                  )}

                  {/* Purchase Suggestions */}
                  {result.suggestions.length > 0 && (
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center gap-2">
                          <ExternalLink className="h-5 w-5 text-purple-600" />
                          Recommended Products
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          {result.suggestions.map((suggestion, index) => (
                            <div key={index} className="flex items-center justify-between p-3 bg-muted rounded-lg">
                              <span className="text-sm font-medium">{suggestion.name}</span>
                              <div className="flex gap-2">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => copyToClipboard(suggestion.link)}
                                >
                                  <Copy className="h-4 w-4" />
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => window.open(suggestion.link, '_blank')}
                                >
                                  <ExternalLink className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          ))}
                        </div>
                      </CardContent>
                    </Card>
                  )}
                </>
              ) : (
                <Card>
                  <CardContent className="text-center py-12">
                    <Camera className="h-16 w-16 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-lg font-medium text-muted-foreground mb-2">
                      No Analysis Yet
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      Upload an image and fill in the details to get started with disease detection
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
};

export default DiseaseDetection;
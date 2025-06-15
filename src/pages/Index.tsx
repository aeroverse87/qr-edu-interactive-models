import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";
import { Eye, Share2, Smartphone, QrCode, Globe, Users, BookOpen, Zap } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface Model {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  qrCodeUrl: string;
  image: string;
  gradient: string;
}

const models: Model[] = [
  {
    id: "earth-layers",
    title: "Earth Layers",
    description: "Explore the internal structure of Earth including crust, mantle, outer core, and inner core with detailed cross-sectional views.",
    category: "Geography",
    difficulty: "Beginner",
    qrCodeUrl: "",
    image: "🌍",
    gradient: "from-blue-500 to-green-500"
  },
  {
    id: "prokaryotes-eukaryotes",
    title: "Prokaryotes & Eukaryotes Cell",
    description: "Compare and contrast the cellular structures of prokaryotic and eukaryotic cells with interactive 3D models.",
    category: "Biology",
    difficulty: "Intermediate",
    qrCodeUrl: "",
    image: "🦠",
    gradient: "from-purple-500 to-pink-500"
  },
  {
    id: "root-structure",
    title: "Root Structure",
    description: "Discover the anatomy of plant root systems including primary and secondary growth structures.",
    category: "Botany",
    difficulty: "Intermediate",
    qrCodeUrl: "",
    image: "🌱",
    gradient: "from-green-500 to-emerald-500"
  },
  {
    id: "blood-components",
    title: "Components of Blood",
    description: "Learn about red blood cells, white blood cells, platelets, and plasma through detailed 3D visualization.",
    category: "Biology",
    difficulty: "Beginner",
    qrCodeUrl: "",
    image: "🩸",
    gradient: "from-red-500 to-rose-500"
  },
  {
    id: "harappa-stamp",
    title: "Harappa Stamp",
    description: "Examine ancient Indus Valley civilization seals and stamps with intricate designs and undeciphered scripts.",
    category: "Archaeology",
    difficulty: "Advanced",
    qrCodeUrl: "",
    image: "🏺",
    gradient: "from-amber-500 to-orange-500"
  },
  {
    id: "priest-king",
    title: "Priest King Mohenjodaro",
    description: "Study the famous Priest-King sculpture from Mohenjo-daro, showcasing Indus Valley artistic excellence.",
    category: "Archaeology",
    difficulty: "Advanced",
    qrCodeUrl: "",
    image: "👑",
    gradient: "from-yellow-500 to-amber-500"
  },
  {
    id: "varaha",
    title: "Varaha",
    description: "Explore the Hindu deity Varaha avatar sculpture with detailed religious and cultural significance.",
    category: "Culture",
    difficulty: "Intermediate",
    qrCodeUrl: "",
    image: "🕉️",
    gradient: "from-indigo-500 to-purple-500"
  }
];

const Index = () => {
  const [modelsWithQR, setModelsWithQR] = useState<Model[]>(models);
  const navigate = useNavigate();
  const { toast } = useToast();

  useEffect(() => {
    const generateQRCodes = async () => {
      const baseUrl = window.location.origin;
      const updatedModels = await Promise.all(
        models.map(async (model) => {
          const modelUrl = `${baseUrl}/model/${model.id}`;
          const qrCodeDataUrl = await QRCode.toDataURL(modelUrl, {
            width: 120,
            margin: 1,
            color: {
              dark: '#1e40af',
              light: '#ffffff'
            }
          });
          return { ...model, qrCodeUrl: qrCodeDataUrl };
        })
      );
      setModelsWithQR(updatedModels);
    };

    generateQRCodes();
  }, []);

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case "Beginner": return "bg-green-100 text-green-800 hover:bg-green-200";
      case "Intermediate": return "bg-yellow-100 text-yellow-800 hover:bg-yellow-200";
      case "Advanced": return "bg-red-100 text-red-800 hover:bg-red-200";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case "Biology": return "bg-blue-100 text-blue-800 border-blue-200";
      case "Geography": return "bg-purple-100 text-purple-800 border-purple-200";
      case "Botany": return "bg-green-100 text-green-800 border-green-200";
      case "Archaeology": return "bg-amber-100 text-amber-800 border-amber-200";
      case "Culture": return "bg-pink-100 text-pink-800 border-pink-200";
      default: return "bg-gray-100 text-gray-800 border-gray-200";
    }
  };

  const handleShareLink = async (modelId: string, modelTitle: string) => {
    const url = `${window.location.origin}/model/${modelId}`;
    
    try {
      if (navigator.share) {
        await navigator.share({
          title: modelTitle,
          text: `Check out this 3D model: ${modelTitle}`,
          url: url,
        });
      } else {
        await navigator.clipboard.writeText(url);
        toast({
          title: "Link copied!",
          description: "The model link has been copied to your clipboard.",
        });
      }
    } catch (error) {
      console.error('Error sharing:', error);
      toast({
        title: "Copy failed",
        description: "Unable to copy link. Please try again.",
        variant: "destructive",
      });
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-indigo-50 via-white to-cyan-50">
      {/* Hero Section */}
      <header className="relative bg-gradient-to-r from-indigo-600 via-purple-600 to-blue-600 text-white">
        <div className="absolute inset-0 bg-black opacity-10"></div>
        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-20">
          <div className="text-center">
            <h1 className="text-5xl md:text-6xl font-bold mb-6 animate-fade-in">
              Interactive Multimedia Education
            </h1>
            <p className="text-xl md:text-2xl mb-8 max-w-4xl mx-auto opacity-90 leading-relaxed">
              Explore educational 3D models through interactive QR code-based learning experiences
            </p>
            <Button 
              size="lg" 
              className="bg-white text-indigo-600 hover:bg-gray-100 text-lg px-8 py-4 rounded-full font-semibold shadow-lg transform hover:scale-105 transition-all duration-200"
              onClick={() => document.getElementById('models')?.scrollIntoView({ behavior: 'smooth' })}
            >
              Explore Models
            </Button>
          </div>
        </div>
      </header>

      {/* Features Section */}
      <div className="py-16 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Enhanced Learning Through Technology</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Experience the future of education with our interactive 3D models and QR code technology
            </p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-blue-50 to-indigo-50 border border-blue-100">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <QrCode className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Access</h3>
              <p className="text-gray-600 text-sm">Scan QR codes to instantly access 3D models on any device</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 border border-green-100">
              <div className="w-16 h-16 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Globe className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive 3D</h3>
              <p className="text-gray-600 text-sm">Explore 3D models that bring learning to life</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 border border-purple-100">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <BookOpen className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Educational Content</h3>
              <p className="text-gray-600 text-sm">Access curated educational information and detailed explanations</p>
            </div>
            <div className="text-center p-6 rounded-xl bg-gradient-to-br from-orange-50 to-red-50 border border-orange-100">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center mb-4 mx-auto">
                <Users className="w-8 h-8 text-white" />
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Multi-disciplinary</h3>
              <p className="text-gray-600 text-sm">From biology to archaeology, explore diverse subjects</p>
            </div>
          </div>
        </div>
      </div>

      {/* Models Grid */}
      <div id="models" className="py-16 bg-gradient-to-br from-gray-50 to-blue-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">Educational Models</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore our collection of interactive 3D models across various subjects. Scan the QR code to view the model directly on your device.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {modelsWithQR.map((model, index) => (
              <Card key={model.id} className="group hover:shadow-2xl transition-all duration-300 border-0 shadow-lg bg-white overflow-hidden transform hover:-translate-y-2">
                {/* Model Header with Gradient and Icon */}
                <div className={`h-32 bg-gradient-to-r ${model.gradient} relative overflow-hidden`}>
                  <div className="absolute inset-0 bg-black opacity-10"></div>
                  <div className="relative h-full flex items-center justify-center">
                    <div className="text-6xl">{model.image}</div>
                  </div>
                  <div className="absolute top-4 left-4">
                    <Badge className={`${getCategoryColor(model.category)} border font-medium`}>
                      {model.category}
                    </Badge>
                  </div>
                  <div className="absolute top-4 right-4">
                    <Badge variant="outline" className={`${getDifficultyColor(model.difficulty)} border-white text-xs`}>
                      {model.difficulty}
                    </Badge>
                  </div>
                </div>

                <CardHeader className="pb-3">
                  <CardTitle className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {model.title}
                  </CardTitle>
                  <CardDescription className="text-gray-600 leading-relaxed text-sm">
                    {model.description}
                  </CardDescription>
                </CardHeader>

                <CardContent className="pt-0">
                  <div className="flex items-center justify-between">
                    {/* QR Code */}
                    <div className="flex flex-col items-center">
                      <div className="bg-white p-2 rounded-lg border border-gray-200 shadow-sm">
                        {model.qrCodeUrl ? (
                          <img 
                            src={model.qrCodeUrl} 
                            alt={`QR Code for ${model.title}`}
                            className="w-16 h-16"
                          />
                        ) : (
                          <div className="w-16 h-16 bg-gray-100 animate-pulse rounded"></div>
                        )}
                      </div>
                      <p className="text-xs text-gray-500 text-center mt-1">Scan QR Code</p>
                    </div>

                    {/* Action Buttons */}
                    <div className="flex flex-col space-y-2">
                      <Button 
                        onClick={() => navigate(`/model/${model.id}`)}
                        className="bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 text-white text-sm px-4 py-2"
                      >
                        <Eye className="w-4 h-4 mr-2" />
                        Explore Model
                      </Button>
                      <Button 
                        variant="outline"
                        size="sm"
                        onClick={() => handleShareLink(model.id, model.title)}
                        className="text-xs"
                      >
                        <Share2 className="w-3 h-3 mr-1" />
                        Share Link
                      </Button>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </div>

      {/* How It Works Section */}
      <div className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-4xl font-bold text-gray-900 mb-4">How It Works</h2>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Get started with our interactive 3D models in just three simple steps
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {/* Step 1 */}
            <div className="text-center relative">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-blue-500 to-indigo-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <QrCode className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-blue-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  1
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Scan QR Code</h3>
              <p className="text-gray-600 leading-relaxed">
                Use your device's camera to scan any model's QR code. Works on smartphones, tablets, and computers with cameras.
              </p>
            </div>

            {/* Step 2 */}
            <div className="text-center relative">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-green-500 to-emerald-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Globe className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-green-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  2
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Access Model</h3>
              <p className="text-gray-600 leading-relaxed">
                The model opens instantly in your browser. No app downloads required. Compatible with all modern devices and browsers.
              </p>
            </div>

            {/* Step 3 */}
            <div className="text-center relative">
              <div className="mb-8">
                <div className="w-24 h-24 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-lg">
                  <Zap className="w-12 h-12 text-white" />
                </div>
                <div className="absolute -top-2 -right-2 w-10 h-10 bg-purple-600 text-white rounded-full flex items-center justify-center font-bold text-lg">
                  3
                </div>
              </div>
              <h3 className="text-2xl font-bold text-gray-900 mb-4">Interact & Learn</h3>
              <p className="text-gray-600 leading-relaxed">
                Rotate, zoom, and explore the 3D model. Access detailed information, share with others, and enhance your learning experience.
              </p>
            </div>
          </div>

          {/* Additional Features */}
          <div className="mt-16 grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-8 rounded-2xl border border-blue-100">
              <div className="flex items-center mb-4">
                <Smartphone className="w-8 h-8 text-blue-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Mobile Optimized</h3>
              </div>
              <p className="text-gray-600">
                All models are optimized for mobile devices with touch controls, pinch-to-zoom, and responsive design for the best learning experience on any screen size.
              </p>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-emerald-50 p-8 rounded-2xl border border-green-100">
              <div className="flex items-center mb-4">
                <Share2 className="w-8 h-8 text-green-600 mr-3" />
                <h3 className="text-xl font-semibold text-gray-900">Easy Sharing</h3>
              </div>
              <p className="text-gray-600">
                Share models instantly with classmates, students, or colleagues. Generate QR codes for any model and distribute learning materials effortlessly.
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-gradient-to-r from-gray-900 to-blue-900 text-white">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="text-center">
            <h3 className="text-2xl font-bold mb-4">Interactive MM Education</h3>
            <p className="text-gray-300 mb-6 max-w-2xl mx-auto">
              Enhancing learning through technology. Experience the future of education with our interactive 3D models and QR code-based learning platform.
            </p>
            <p className="text-gray-400">© 2024 Interactive MM Education. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

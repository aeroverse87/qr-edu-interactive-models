
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import QRCode from "qrcode";

interface Model {
  id: string;
  title: string;
  description: string;
  category: string;
  difficulty: "Beginner" | "Intermediate" | "Advanced";
  qrCodeUrl: string;
}

const models: Model[] = [
  {
    id: "earth-layers",
    title: "Earth Layers",
    description: "Explore the internal structure of Earth including crust, mantle, outer core, and inner core with detailed cross-sectional views.",
    category: "Geography",
    difficulty: "Beginner",
    qrCodeUrl: ""
  },
  {
    id: "prokaryotes-eukaryotes",
    title: "Prokaryotes & Eukaryotes Cell",
    description: "Compare and contrast the cellular structures of prokaryotic and eukaryotic cells with interactive 3D models.",
    category: "Biology",
    difficulty: "Intermediate",
    qrCodeUrl: ""
  },
  {
    id: "root-structure",
    title: "Root Structure",
    description: "Discover the anatomy of plant root systems including primary and secondary growth structures.",
    category: "Botany",
    difficulty: "Intermediate",
    qrCodeUrl: ""
  },
  {
    id: "blood-components",
    title: "Components of Blood",
    description: "Learn about red blood cells, white blood cells, platelets, and plasma through detailed 3D visualization.",
    category: "Biology",
    difficulty: "Beginner",
    qrCodeUrl: ""
  },
  {
    id: "harappa-stamp",
    title: "Harappa Stamp",
    description: "Examine ancient Indus Valley civilization seals and stamps with intricate designs and undeciphered scripts.",
    category: "Archaeology",
    difficulty: "Advanced",
    qrCodeUrl: ""
  },
  {
    id: "priest-king",
    title: "Priest King Mohenjodaro",
    description: "Study the famous Priest-King sculpture from Mohenjo-daro, showcasing Indus Valley artistic excellence.",
    category: "Archaeology",
    difficulty: "Advanced",
    qrCodeUrl: ""
  },
  {
    id: "varaha",
    title: "Varaha",
    description: "Explore the Hindu deity Varaha avatar sculpture with detailed religious and cultural significance.",
    category: "Culture",
    difficulty: "Intermediate",
    qrCodeUrl: ""
  }
];

const Index = () => {
  const [modelsWithQR, setModelsWithQR] = useState<Model[]>(models);
  const navigate = useNavigate();

  useEffect(() => {
    const generateQRCodes = async () => {
      const baseUrl = window.location.origin;
      const updatedModels = await Promise.all(
        models.map(async (model) => {
          const modelUrl = `${baseUrl}/model/${model.id}`;
          const qrCodeDataUrl = await QRCode.toDataURL(modelUrl, {
            width: 150,
            margin: 2,
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
      case "Biology": return "bg-blue-100 text-blue-800";
      case "Geography": return "bg-purple-100 text-purple-800";
      case "Botany": return "bg-green-100 text-green-800";
      case "Archaeology": return "bg-amber-100 text-amber-800";
      case "Culture": return "bg-pink-100 text-pink-800";
      default: return "bg-gray-100 text-gray-800";
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-green-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center">
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Interactive MM Education
            </h1>
            <p className="text-lg text-gray-600 max-w-3xl mx-auto">
              Explore educational content through immersive 3D models. Scan QR codes with your mobile device 
              to access interactive multimedia learning experiences.
            </p>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Features Section */}
        <div className="mb-12 text-center">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-blue-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.746 0 3.332.477 4.5 1.253v13C19.832 18.477 18.246 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Interactive Learning</h3>
              <p className="text-gray-600 text-sm">Engage with 3D models for deeper understanding</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-green-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">QR Code Access</h3>
              <p className="text-gray-600 text-sm">Instant mobile access via QR code scanning</p>
            </div>
            <div className="flex flex-col items-center p-6 bg-white rounded-lg shadow-sm">
              <div className="w-12 h-12 bg-purple-100 rounded-full flex items-center justify-center mb-4">
                <svg className="w-6 h-6 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Educational Content</h3>
              <p className="text-gray-600 text-sm">Curated models across multiple disciplines</p>
            </div>
          </div>
        </div>

        {/* Models Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {modelsWithQR.map((model, index) => (
            <Card key={model.id} className="group hover:shadow-lg transition-all duration-300 border-0 shadow-md bg-white">
              <CardHeader className="pb-3">
                <div className="flex justify-between items-start mb-2">
                  <Badge className={getCategoryColor(model.category)}>
                    {model.category}
                  </Badge>
                  <Badge variant="outline" className={getDifficultyColor(model.difficulty)}>
                    {model.difficulty}
                  </Badge>
                </div>
                <CardTitle className="text-xl font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                  {model.title}
                </CardTitle>
                <CardDescription className="text-gray-600 leading-relaxed">
                  {model.description}
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-0">
                <div className="flex flex-col items-center space-y-4">
                  {/* QR Code */}
                  <div className="bg-white p-3 rounded-lg border-2 border-gray-100">
                    {model.qrCodeUrl ? (
                      <img 
                        src={model.qrCodeUrl} 
                        alt={`QR Code for ${model.title}`}
                        className="w-24 h-24"
                      />
                    ) : (
                      <div className="w-24 h-24 bg-gray-100 animate-pulse rounded"></div>
                    )}
                  </div>
                  <p className="text-xs text-gray-500 text-center">
                    Scan to access on mobile
                  </p>
                  
                  {/* Action Buttons */}
                  <div className="flex space-x-2 w-full">
                    <Button 
                      onClick={() => navigate(`/model/${model.id}`)}
                      className="flex-1 bg-blue-600 hover:bg-blue-700 text-white"
                    >
                      View Model
                    </Button>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        {/* Instructions */}
        <div className="mt-16 bg-blue-50 rounded-xl p-8">
          <h2 className="text-2xl font-bold text-gray-900 mb-4 text-center">How to Use</h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">1</div>
              <h3 className="font-semibold text-gray-900 mb-2">Choose a Model</h3>
              <p className="text-gray-600 text-sm">Select any educational model from the collection above</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">2</div>
              <h3 className="font-semibold text-gray-900 mb-2">Scan QR Code</h3>
              <p className="text-gray-600 text-sm">Use your mobile device to scan the QR code for instant access</p>
            </div>
            <div>
              <div className="text-3xl font-bold text-blue-600 mb-2">3</div>
              <h3 className="font-semibold text-gray-900 mb-2">Explore & Learn</h3>
              <p className="text-gray-600 text-sm">Interact with the 3D model and discover educational content</p>
            </div>
          </div>
        </div>
      </main>

      {/* Footer */}
      <footer className="bg-gray-50 border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="text-center">
            <p className="text-gray-600">© 2024 Interactive MM Education. Enhancing learning through technology.</p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Index;

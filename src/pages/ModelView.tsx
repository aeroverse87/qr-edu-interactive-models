
import { useParams } from "react-router-dom";
import ModelViewer from "@/components/ModelViewer";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Share, QrCode } from "lucide-react";
import { useNavigate } from "react-router-dom";
import { useState, useEffect } from "react";
import QRCodeLib from "qrcode";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";

const models = [
  {
    id: "earth-layers",
    title: "Earth Layers",
    description: "Explore the internal structure of Earth including crust, mantle, outer core, and inner core with detailed cross-sectional views.",
    category: "Geography",
    difficulty: "Beginner"
  },
  {
    id: "prokaryotes-eukaryotes",
    title: "Prokaryotes & Eukaryotes Cell",
    description: "Compare and contrast the cellular structures of prokaryotic and eukaryotic cells with interactive 3D models.",
    category: "Biology",
    difficulty: "Intermediate"
  },
  {
    id: "root-structure",
    title: "Root Structure",
    description: "Discover the anatomy of plant root systems including primary and secondary growth structures.",
    category: "Botany",
    difficulty: "Intermediate"
  },
  {
    id: "blood-components",
    title: "Components of Blood",
    description: "Learn about red blood cells, white blood cells, platelets, and plasma through detailed 3D visualization.",
    category: "Biology",
    difficulty: "Beginner"
  },
  {
    id: "harappa-stamp",
    title: "Harappa Stamp",
    description: "Examine ancient Indus Valley civilization seals and stamps with intricate designs and undeciphered scripts.",
    category: "Archaeology",
    difficulty: "Advanced"
  },
  {
    id: "priest-king",
    title: "Priest King Mohenjodaro",
    description: "Study the famous Priest-King sculpture from Mohenjo-daro, showcasing Indus Valley artistic excellence.",
    category: "Archaeology",
    difficulty: "Advanced"
  },
  {
    id: "varaha",
    title: "Varaha",
    description: "Explore the Hindu deity Varaha avatar sculpture with detailed religious and cultural significance.",
    category: "Culture",
    difficulty: "Intermediate"
  }
];

const ModelView = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const [qrCodeUrl, setQrCodeUrl] = useState<string>("");
  
  const model = models.find(m => m.id === id);
  
  // Get related models (same category, excluding current model)
  const relatedModels = models.filter(m => 
    m.category === model?.category && m.id !== id
  ).slice(0, 3);
  
  useEffect(() => {
    const generateQRCode = async () => {
      if (model) {
        const modelUrl = `${window.location.origin}/model/${model.id}`;
        const qrCodeDataUrl = await QRCodeLib.toDataURL(modelUrl, {
          width: 200,
          margin: 2,
          color: {
            dark: '#3b4cc0',
            light: '#ffffff'
          }
        });
        setQrCodeUrl(qrCodeDataUrl);
      }
    };
    generateQRCode();
  }, [model]);

  // Add protection against right-click and key combinations
  useEffect(() => {
    const handleContextMenu = (e: MouseEvent) => {
      e.preventDefault();
    };

    const handleKeyDown = (e: KeyboardEvent) => {
      // Disable F12, Ctrl+Shift+I, Ctrl+U, Ctrl+S
      if (
        e.key === 'F12' ||
        (e.ctrlKey && e.shiftKey && e.key === 'I') ||
        (e.ctrlKey && e.key === 'u') ||
        (e.ctrlKey && e.key === 's')
      ) {
        e.preventDefault();
      }
    };

    document.addEventListener('contextmenu', handleContextMenu);
    document.addEventListener('keydown', handleKeyDown);

    return () => {
      document.removeEventListener('contextmenu', handleContextMenu);
      document.removeEventListener('keydown', handleKeyDown);
    };
  }, []);
  
  if (!model) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Model Not Found</h1>
          <p className="text-gray-600 mb-8">The requested 3D model could not be found.</p>
          <Button onClick={() => navigate('/')} className="flex items-center space-x-2">
            <ArrowLeft className="w-4 h-4" />
            <span>Back to Home</span>
          </Button>
        </div>
      </div>
    );
  }

  const modelPath = `/models/${model.id}.glb`;

  const handleShare = async () => {
    const url = window.location.href;
    if (navigator.share) {
      try {
        await navigator.share({
          title: model.title,
          text: model.description,
          url: url,
        });
      } catch (error) {
        console.log('Error sharing:', error);
        // Fallback to copying to clipboard
        navigator.clipboard.writeText(url);
      }
    } else {
      // Fallback for browsers that don't support Web Share API
      navigator.clipboard.writeText(url);
    }
  };

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <header className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <Button 
            variant="ghost" 
            onClick={() => navigate('/')}
            className="flex items-center space-x-2 text-blue-600 hover:text-blue-700"
          >
            <ArrowLeft className="w-4 h-4" />
            <span>Back to all models</span>
          </Button>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          {/* Left Side - 3D Model Viewer */}
          <div className="lg:col-span-3">
            <h1 className="text-3xl font-bold text-gray-900 mb-6">{model.title}</h1>
            <div className="bg-white">
              <ModelViewer modelPath={modelPath} title={model.title} />
            </div>

            {/* About This Model - Moved under viewer */}
            <div className="mt-8">
              <h2 className="text-2xl font-semibold text-blue-600 mb-4">About this Model</h2>
              <p className="text-gray-700 leading-relaxed mb-6">
                {model.description}
              </p>
              
              <div className="flex space-x-4 mb-8">
                <Button onClick={handleShare} className="flex items-center space-x-2 bg-blue-600 hover:bg-blue-700">
                  <Share className="w-4 h-4" />
                  <span>Share Model</span>
                </Button>
              </div>

              {/* Interactive Features */}
              <div className="mt-8">
                <h3 className="text-xl font-semibold text-blue-600 mb-4">Interactive Features</h3>
                <div className="space-y-3">
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Rotate the model by dragging with your mouse or swiping on touch devices</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Zoom in or out using the scroll wheel or pinch gestures</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Click on labeled parts to view detailed information</span>
                  </div>
                  <div className="flex items-center space-x-3">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span className="text-gray-700">Use the controls panel to toggle visibility of different components</span>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Right Side - Interactive 3D Model pill and QR Code and Related Models */}
          <div className="lg:col-span-1 space-y-6">
            {/* Interactive 3D Model pill - moved here */}
            <div className="bg-white bg-opacity-90 backdrop-blur-sm rounded-lg px-3 py-2 text-sm border shadow-sm">
              <div className="font-medium text-gray-900">{model.title}</div>
              <div className="text-gray-600 text-xs">Interactive 3D Model</div>
            </div>

            {/* QR Code Section */}
            <div className="bg-white border rounded-lg p-6">
              <div className="flex items-center space-x-2 mb-4">
                <QrCode className="w-5 h-5 text-blue-600" />
                <h3 className="text-lg font-semibold text-blue-600">Model QR Code</h3>
              </div>
              <div className="text-center">
                {qrCodeUrl && (
                  <img 
                    src={qrCodeUrl} 
                    alt={`QR Code for ${model.title}`}
                    className="mx-auto mb-4 border rounded-lg"
                  />
                )}
                <p className="text-sm text-gray-600">
                  Scan this QR code to access this 3D model directly on another device
                </p>
              </div>
            </div>

            {/* Related Models */}
            <div className="bg-white border rounded-lg p-6">
              <h3 className="text-lg font-semibold text-blue-600 mb-4">Related Models</h3>
              <div className="space-y-4">
                {relatedModels.map((relatedModel) => (
                  <div 
                    key={relatedModel.id}
                    onClick={() => navigate(`/model/${relatedModel.id}`)}
                    className="cursor-pointer hover:bg-gray-50 p-3 rounded-lg transition-colors"
                  >
                    <h4 className="font-medium text-blue-600 hover:text-blue-700 mb-1">
                      {relatedModel.title}
                    </h4>
                    <p className="text-sm text-gray-600 line-clamp-2">
                      {relatedModel.description}
                    </p>
                  </div>
                ))}
                {relatedModels.length === 0 && (
                  <p className="text-sm text-gray-500">No related models found</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default ModelView;
